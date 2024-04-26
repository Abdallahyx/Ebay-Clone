from cart.utils import CartMixin, CartOperationTypes
from payment.services import paypal_create_order
from .models import OrderItems, Order
from accounts.models import UserShippingInfo
from products.models import ProductVariation, AvailabilityStatuses
from rest_framework.response import Response
from django.db.models import Sum
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from .services import draw_pdf_invoice
from rest_framework import status
from django.core.exceptions import ValidationError


class OrderMixin(CartMixin):
    """
    Mixin which creates orders with items from user's cart.
    Creates orders, verifies user authentication, checks product variation availability,
    and ensures valid shipping information. Also has methods for sending invoices.
    """

    items_serializer = None
    operation_type = CartOperationTypes.cart_clear
    __request = None

    @property
    def request(self):
        return self.__request

    @request.setter
    def request(self, request):
        self.__request = request

    @staticmethod
    def get_not_available_cart_products(cart_data: dict) -> list:
        """
        Returns a list with product variations from user's cart
        that are not available at the moment.
        """
        cart_variations_ids = [
            item["product_variation_details"]["variation_id"]
            for item in cart_data["items"]
        ]
        not_available_cart_variations = ProductVariation.objects.filter(
            id__in=cart_variations_ids,
            availability_status=AvailabilityStatuses.out_of_stock[0],
        ).values_list("id", flat=True)
        return list(not_available_cart_variations)

    @staticmethod
    def get_order_total_values(order: Order) -> dict:
        """
        Returns a dict with order total amount and total bonuses amount.
        """
        total_values_order = order.items.aggregate(
            total_amount=Sum("total_price"),
        )
        return total_values_order

    def process_order_payment_with_balance(self, order: Order):
        """
        Processes the payment for the given order using user balance
        and updates the payment status and order total amount accordingly.
        """
        order_total_values = self.get_order_total_values(order)
        order_total_amount = order_total_values["total_amount"]

        if order.user and order.user.balance.balance:
            user_balance = order.user.balance.balance

            if user_balance >= order_total_amount:
                order.user.balance.balance -= order_total_amount
                order.user.balance.save()

                payment_info = order.payment_info
                payment_info.is_paid = True
                payment_info.save()

                payment_info.payment_amount = order_total_amount
                payment_info.save()
            else:
                raise ValidationError("Insufficient balance")

        order.total_amount = order_total_amount
        order.save()

    def create_order(self, response) -> Response:
        """
        Creates an order from user's cart.
        Only authenticated users with valid shipping information are allowed.
        Checks for product variation availability and creates order items accordingly.
        """
        if not self.request.user.is_authenticated:
            return Response(
                {"error": "Only authenticated users can create orders."},
                status=status.HTTP_403_FORBIDDEN,
            )

        cart_data = self.get_cart_data(self.request)
        not_available_cart_variations = self.get_not_available_cart_products(cart_data)

        if not_available_cart_variations:
            return Response(
                {"error": "Some product variations in your cart are not available."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not cart_data["items"]:
            return Response(
                {"error": "Your cart is empty."},
                status=400,
            )

        shipping_info_data = response.data.get("shipping_info", {})
        shipping_info = self.get_user_shipping_info(shipping_info_data)

        if not shipping_info:
            return Response(
                {"error": "Valid shipping information is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order_id = response.data["id"]

        try:
            order = (
                Order.objects.select_related("user")
                .prefetch_related("items")
                .get(id=order_id)
            )
        except Order.DoesNotExist:
            return Response(
                {"error": "Order does not exist."},
                status=404,
            )

        for item in cart_data["items"]:
            variation = ProductVariation.objects.get(
                id=item["product_variation_details"]["variation_id"]
            )
            store = variation.product.store
            OrderItems.objects.create(
                order=order,
                product=variation.product,
                product_variation=variation,
                quantity=item["quantity"],
                total_price=item["total_price"],
                store=store,
            )

        order_items = order.items.all().select_related("order", "product_variation")

        total_amount = order_items.aggregate(total_amount=Sum("total_price"))[
            "total_amount"
        ]
        order.total_amount = total_amount  # Assign total_amount back to the order
        order.save()
        if response.data["payment_method"] == Order.PAYMENT_METHODS[2][0]:
            # If the payment method is by card, add a PayPal payment link
            response.data["payment_link"] = paypal_create_order(total_amount, order_id)
        else:
            self.process_order_payment_with_balance(order)

        response.data["total_amount"] = total_amount
        response.data["order_items"] = self.items_serializer(
            instance=order_items, many=True
        ).data
        self.clear_exist_cart(self.request)
        return response

    def get_user_shipping_info(self, shipping_info_data: dict) -> UserShippingInfo:
        """
        This method gets or creates the user's shipping info and returns it.
        Only for authenticated users, it retrieves or creates the user's shipping info.
        """
        if not self.request.user.is_authenticated:
            return None

        user = self.request.user
        shipping_info, created = UserShippingInfo.objects.get_or_create(
            user=user, defaults=shipping_info_data
        )

        # Update shipping info with given data
        for key, value in shipping_info_data.items():
            setattr(shipping_info, key, value)

        shipping_info.save()

        return shipping_info

from cart.utils import CartMixin, CartOperationTypes
from payment.services import paypal_create_order
from .models import OrderItems, Order
from accounts.models import UserShippingInfo
from products.models import Product, AvailabilityStatuses
from rest_framework.response import Response
from django.db.models import Sum
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from .services import draw_pdf_invoice


class OrderMixin(CartMixin):
    """
    Mixin which creates order with items
    from user's cart. Creates order and
    returns response with order data or
    with error message. Also, mixin have method
    which gets or creates user's shipping
    info and returns it. And to all this, there is
    a method for sending an invoice to the mail.
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
        Returns list with products from user's cart
        which are not available at the moment.

        Args:
            cart_data(dict): data with cart information.

        Returns:
            not_available_cart_products(list): list with not available
                                                 products from the cart.
        """
        cart_products_ids = []
        for item in cart_data["items"]:
            cart_products_ids.append(item["product"])
        not_available_cart_products = Product.objects.filter(
            id__in=cart_products_ids,
            availability_status=AvailabilityStatuses.out_of_stock[0],
        ).values_list("id")
        return not_available_cart_products

    @staticmethod
    def get_order_total_values(order: Order) -> dict:
        """
        This method returns dict with order
        total amount and total bonuses amount.
        """
        total_values_order = order.items.aggregate(
            total_amount=Sum("total_price"),
            total_bonuses_amount=Sum("product__bonuses"),
        )
        return total_values_order

    def process_order_payment_with_bonuses(self, order: Order):
        """
        Processes the payment for the given order
        using user balance and updates the
        payment status and order total amount accordingly.
        """
        order_total_values = self.get_order_total_values(order)

        order_total_amount = order_total_values["total_amount"]

        if order.user and order.user.balance.balance:
            # balance will be withdrawn from the user's balance
            # only if he has selected this option
            user_balance = order.user.balance.balance

            if user_balance >= order_total_amount:
                # if the user's balance is greater than the
                # total amount of the order, the total amount
                # of order will be deducted from user's balance
                # and order will be marked as paid.
                order.user.balance.balance = user_balance - order_total_amount
                order.user.balance.save()

                payment_info = order.payment_info
                payment_info.is_paid = True
                payment_info.save()

                payment_info.payment_amount = order_total_amount
                payment_info.save()

            elif order_total_amount > user_balance > 0:
                order.user.balance.balance = 0
                order.user.balance.save()
                order_total_amount -= user_balance

        order.total_amount = order_total_amount
        order.save()

    def create_order(self, response) -> Response:
        """
        Creates order and returns response with order data
        or with problems creating an order.

        Args:
            response: response from create method of ListCreateAPIView.

        Returns:
            Response: response with order data or with its problems.
        """
        cart_data = self.get_cart_data(self.request)

        if self.request.user.is_authenticated:
            # we need it in this case because in this
            # way we avoid unnecessary access to the cart table.
            self.clear_exist_cart(self.request)
        else:
            self.cart_operation(self.request)

        not_available_cart_products = self.get_not_available_cart_products(cart_data)

        if not len(not_available_cart_products) > 0:
            # order will be created, if in user's cart
            # don't have products that are not available.

            if len(cart_data["items"]) > 0:
                # if user's cart is not empty
                order_id = response.data["id"]

                try:
                    order = (
                        Order.objects.select_related("user")
                        .prefetch_related("items")
                        .get(id=order_id)
                    )
                except Order.DoesNotExist:
                    return Response({"error": "Order does not exist!"})

                for item in cart_data["items"]:
                    # items['product'] - id of product
                    OrderItems.objects.create(
                        order=order,
                        product_id=item["product"],
                        quantity=item["quantity"],
                        total_price=item["total_price"],
                    )

                order_items = order.items.all().select_related("order", "product")

                if order.coupon and self.order_total_amount_with_coupon(order):
                    # here order total amount with discount from coupon
                    response.data["total_amount"] = order.total_amount
                else:
                    response.data["total_amount"] = order_items.aggregate(
                        total_amount=Sum("total_price")
                    )["total_amount"]

                if (
                    response.data["payment_method"] == Order.PAYMENT_METHODS[1][0]
                    and not order.payment_info.is_paid
                ):
                    # if payment method is by card, to the response
                    # will be added PayPal payment link
                    value = response.data["total_amount"]
                    response.data["payment_link"] = paypal_create_order(value, order_id)
                else:
                    self.process_order_payment_with_bonuses(order)
                    # we are  processing order payment with bonuses here only if
                    # payment method is by cash, to avoid withdrawal
                    # of bonuses without payment(in case if payment method is by card).
                    self.send_email_with_invoice(order)

                response.data["order_items"] = self.items_serializer(
                    instance=order_items, many=True
                ).data
                return response
            else:
                return Response({"cart": "You dont have items in your cart!"})
        else:
            return Response(
                {"not available": "Some items in your cart are not available"}
            )

    def get_user_shipping_info(
        self, shipping_info_data: dict, session_id: str
    ) -> UserShippingInfo:
        """
        This method gets or creates user's
        shipping info and returns it.

        Args:
            shipping_info_data(dict): dictionary with order shipping info data.
            session_id(str): session id of user.

        Returns:
            shipping_info(UserShippingInfo): returns user's shipping info.
        """
        if self.request.user.is_authenticated:
            shipping_info, _ = UserShippingInfo.objects.get_or_create(
                user=self.request.user, defaults=shipping_info_data
            )
            if not shipping_info.session_id:
                shipping_info.session_id = session_id
                shipping_info.save()
        else:
            shipping_info, _ = UserShippingInfo.objects.get_or_create(
                session_id=session_id, defaults=shipping_info_data
            )
        shipping_info.city = shipping_info_data["city"]
        shipping_info.save()
        return shipping_info

from rest_framework.generics import ListCreateAPIView
from rest_framework.viewsets import GenericViewSet
from rest_framework import mixins
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, TokenAuthentication

from CustomAuth.auth import CustomTokenAuthentication
from accounts.permissions import IsCustomer, IsStore
from .serializers import OrderSerializer, OrderItemsSerializer
from .models import Order
from rest_framework.permissions import AllowAny, IsAdminUser
from payment.services import paypal_complete_payment
from .utils import OrderMixin
from coupons.models import UserCoupons
from coupons.services import get_coupon
from coupons.utils import find_coupons
from rest_framework.permissions import IsAuthenticated


class OrderAPIView(OrderMixin, ListCreateAPIView):
    """
    API view for listing and creating orders.
    Only authenticated customers can create orders,
    and they must have items in their cart.
    """

    serializer_class = OrderSerializer  # Serializer for creating and listing orders
    items_serializer = OrderItemsSerializer  # Serializer for order items
    queryset = Order.objects.all()  # Queryset for orders
    permission_classes = [
        IsAuthenticated,
        IsCustomer,
    ]  # Only authenticated users with `IsCustomer` permission
    authentication_classes = [
        SessionAuthentication,
        CustomTokenAuthentication,
    ]  # Auth classes

    def list(self, request, *args, **kwargs):
        """
        Override the default list method to return the user's cart data if it has items.
        """
        cart_data = self.get_cart_data(request)
        if len(cart_data["items"]) > 0:
            return Response(data=cart_data)
        else:
            return Response({"Cart": "You don't have items in your cart!"})

    def create(self, request, *args, **kwargs):
        """
        Override the default create method to validate the user's cart and shipping info.
        """
        if not request.user.is_authenticated:
            return Response(
                {"error": "You must be authenticated to create an order."}, status=403
            )

        # Check if user has a shipping address
        if not request.user.shipping_info:
            return Response(
                {"error": "Please add a shipping address before creating an order."},
                status=400,
            )

        # Call the super class to create the order
        response = super().create(request, *args, **kwargs)
        self.request = request  # Set the request in the mixin

        return self.create_order(
            response
        )  # Process the order creation with additional checks


class OrderPaypalPaymentComplete(OrderMixin, APIView):
    permission_classes = [IsCustomer]
    permission_classes = [
        IsAuthenticated,
        IsCustomer,
    ]  # Only authenticated users with `IsCustomer` permission
    authentication_classes = [
        SessionAuthentication,
        CustomTokenAuthentication,
    ]  # Auth classes

    def get(self, *args, **kwargs):
        mixin = OrderMixin()
        order_id = kwargs["order_id"]
        payment_id = self.request.query_params.get("paymentId")
        payer_id = self.request.query_params.get("PayerID")
        if paypal_complete_payment(payment_id, payer_id):
            try:
                order = Order.objects.get(id=order_id)
            except (Exception,):
                return Response({"error": "Order error."})
            order.payment_info.is_paid = True
            order.payment_info.save()

            if self.request.user.is_authenticated:
                coupons = []  # Initialize coupons as an empty list
                for item in order.items.all():
                    item_coupons = find_coupons(item)
                    if item_coupons.coupons:
                        coupons = item_coupons.coupons
                for (
                    coupon
                ) in (
                    coupons
                ):  # This will not raise an error if coupons is an empty list
                    if get_coupon(coupon):
                        UserCoupons.objects.create(
                            coupon=coupon, user=self.request.user
                        )
                self.process_order_payment_with_balance(order)
        return Response({"success": "You successfully paid for order!"})


# class OrdersViewSet(
#     mixins.ListModelMixin,
#     mixins.RetrieveModelMixin,
#     mixins.DestroyModelMixin,
#     mixins.UpdateModelMixin,
#     GenericViewSet,
# ):
#     serializer_class = OrdersForStoreSerializer
#     permission_classes = [IsStore]
#     authentication_classes = [CustomTokenAuthentication, SessionAuthentication]

#     def get_queryset(self):
#         if self.request.user.is_authenticated:
#             store = self.request.user.store_info
#             return Order.objects.filter(store=store)
#         else:
#             return Order.objects.none()

#     def retrieve(self, request, *args, **kwargs):
#         response = super().retrieve(request, *args, **kwargs)
#         order = self.get_object()
#         items = order.items.all()
#         items_serializer = OrderItemsSerializer(instance=items, many=True)
#         response.data["items"] = items_serializer.data
#         return response

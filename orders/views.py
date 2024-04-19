from rest_framework.generics import ListCreateAPIView
from rest_framework.viewsets import GenericViewSet
from rest_framework import mixins
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, TokenAuthentication

from CustomAuth.auth import CustomTokenAuthentication
from accounts.permissions import IsCustomer, IsStore
from .serializers import OrderSerializer, OrderItemsSerializer, OrdersForStoreSerializer
from .models import Order
from rest_framework.permissions import AllowAny, IsAdminUser
from payment.services import paypal_complete_payment
from .utils import OrderMixin
from coupons.models import UserCoupons
from coupons.services import get_coupon
from coupons.utils import find_coupons


class OrderAPIView(OrderMixin, ListCreateAPIView):
    serializer_class = OrderSerializer
    items_serializer = OrderItemsSerializer
    queryset = Order.objects.all()
    permission_classes = [IsCustomer]
    authentication_classes = [SessionAuthentication, CustomTokenAuthentication]

    def list(self, request, *args, **kwargs):
        data = self.get_cart_data(request)
        if len(data["items"]) > 0:
            return Response(data=data)
        else:
            return Response({"cart": "You dont have items in your basket!"})

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        self.request = request
        return self.create_order(response)


class OrderPaypalPaymentComplete(OrderMixin, APIView):
    permission_classes = [IsCustomer]

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
                coupons = None
                for item in order.items.all():
                    item_coupons = find_coupons(item)
                    if item_coupons.coupons:
                        coupons = item_coupons.coupons
                for coupon in coupons:
                    if get_coupon(coupon):
                        UserCoupons.objects.create(
                            coupon=coupon, user=self.request.user
                        )
                self.process_order_payment_with_bonuses(order)
        return Response({"success": "You successfully paid for order!"})


class OrdersViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    GenericViewSet,
):
    serializer_class = OrdersForStoreSerializer
    permission_classes = [IsStore]
    authentication_classes = [CustomTokenAuthentication, SessionAuthentication]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            store = self.request.user.store_info
            return Order.objects.filter(store=store)
        else:
            return Order.objects.none()

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        order = self.get_object()
        items = order.items.all()
        items_serializer = OrderItemsSerializer(instance=items, many=True)
        response.data["items"] = items_serializer.data
        return response

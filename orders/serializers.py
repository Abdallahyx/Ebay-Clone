from rest_framework import serializers
from .models import Order, OrderItems
from payment.services import create_payment_info
from products.serializers import ProductsSerializer
from accounts.serializers import UserShippingInfoSerializer
from .utils import OrderMixin
from payment.serializers import PaymentInfoSerializer


class OrderItemsSerializer(serializers.ModelSerializer):
    order_id = serializers.SerializerMethodField()
    product = ProductsSerializer()

    class Meta:
        model = OrderItems
        fields = ("order_id", "product", "quantity", "total_price")

    def get_order_id(self, obj):
        return obj.order.id


class OrderSerializer(OrderMixin, serializers.ModelSerializer):
    shipping_info = UserShippingInfoSerializer()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if "request" in self.context:
            if self.context["view"].request.user.is_authenticated:
                self.fields["coupon"].queryset = self.fields["coupon"].queryset.filter(
                    user=self.context["view"].request.user, is_active=True
                )

    class Meta:
        model = Order
        fields = (
            "id",
            "shipping_info",
            "payment_method",
            "delivery_method",
            "coupon",
            "activate_bonuses",
            "comment",
            "create_account",
            "total_amount",
        )
        read_only_fields = ["total_amount"]

    def create(self, validated_data):
        shipping_info_data = validated_data.pop("shipping_info")
        request = self.context.get("request")
        session_id = request.session.session_key
        self.request = request

        shipping_info = self.get_user_shipping_info(shipping_info_data, session_id)
        order = Order.objects.prefetch_related("items").create(
            shipping_info=shipping_info, **validated_data
        )

        if request.user.is_authenticated:
            order.user = request.user
            order.save()
        else:
            order.session_id = session_id
            order.save()
        create_payment_info(order)
        return order


class OrdersForStoreSerializer(OrderSerializer):
    payment_info = PaymentInfoSerializer()

    class Meta:
        model = Order
        fields = (
            "id",
            "shipping_info",
            "delivery_method",
            "coupon",
            "activate_bonuses",
            "comment",
            "create_account",
            "total_amount",
            "payment_info",
        )
        read_only_fields = [
            "total_amount",
            "coupon",
            "activate_bonuses",
            "create_account",
        ]

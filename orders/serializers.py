from rest_framework import serializers

from accounts.models import UserShippingInfo
from coupons.models import UserCoupons
from .models import Order, OrderItems
from payment.services import create_payment_info
from products.serializers import ProductBaseSerializer
from accounts.serializers import UserShippingInfoSerializer
from .utils import OrderMixin
from payment.serializers import PaymentInfoSerializer

from rest_framework.exceptions import PermissionDenied
from rest_framework import serializers


from rest_framework import serializers
from .models import OrderItems, ProductVariation
from .serializers import (
    ProductBaseSerializer,
)  # Adjust the import based on your structure


class OrderItemsSerializer(serializers.ModelSerializer):
    order_id = (
        serializers.SerializerMethodField()
    )  # Get the Order ID from the `Order` relationship
    product = ProductBaseSerializer()  # Serializer for the `Product` relationship
    size = serializers.SerializerMethodField()  # Field to get the `ProductVariation`
    store_name = serializers.SerializerMethodField()  # Field to get the `Store` name

    class Meta:
        model = OrderItems
        fields = (
            "order_id",
            "product",
            "quantity",
            "total_price",
            "size",
            "store_name",
        )

    def get_order_id(self, obj):
        return obj.order.id  # Get the order ID from the related `Order`

    def get_size(self, obj):
        # Assuming `ProductVariation` has a `size` field or any other unique identifier
        return (
            obj.product_variation.size
        )  # Adjust based on your `ProductVariation` model

    def get_store_name(self, obj):
        # Assuming `Store` has a `store_name` field
        return (
            obj.store.store_name
        )  # Get the store name from the `Store` related to `OrderItems`

    def validate(self, data):
        # Ensure the ordered quantity does not exceed available stock
        product_variation = data.get("product_variation")
        quantity = data.get("quantity")

        if product_variation.stock < quantity:
            raise serializers.ValidationError(
                f"Insufficient stock for {product_variation}. Available stock: {product_variation.stock}, requested: {quantity}"
            )

        return data


class OrderSerializer(OrderMixin, serializers.ModelSerializer):
    shipping_info = UserShippingInfoSerializer()
    coupon = serializers.PrimaryKeyRelatedField(
        queryset=UserCoupons.objects.all(), allow_null=True, required=False
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request", None)

        # Ensure the user is authenticated
        if not request or not request.user.is_authenticated:
            raise PermissionDenied("Only authenticated users can create orders.")

        # Filter coupons for the authenticated user
        self.fields["coupon"].queryset = self.fields["coupon"].queryset.filter(
            user=request.user, is_active=True
        )

    class Meta:
        model = Order
        fields = (
            "id",
            "shipping_info",
            "payment_method",
            "coupon",
            "comment",
            "total_amount",
        )
        read_only_fields = ["total_amount"]

    def validate(self, data):
        request = self.context.get("request", None)

        # Ensure the user is authenticated
        if not request or not request.user.is_authenticated:
            raise PermissionDenied("Only authenticated users can create orders.")

        # Check if the user has shipping info
        if not UserShippingInfo.objects.filter(user=request.user).exists():
            raise serializers.ValidationError("Shipping information is required.")

        return data

    def create(self, validated_data):
        request = self.context.get("request", None)

        shipping_info = UserShippingInfo.objects.filter(user=request.user).first()
        if not shipping_info:
            raise serializers.ValidationError("Shipping information is required.")

        # Remove 'shipping_info' from validated_data if it exists
        validated_data.pop("shipping_info", None)

        order = Order.objects.create(
            shipping_info=shipping_info, user=request.user, **validated_data
        )

        create_payment_info(order)
        return order


# class OrdersForStoreSerializer(OrderSerializer):
#     payment_info = PaymentInfoSerializer()
#     store_name = serializers.CharField(source="store.store_name", read_only=True)

#     class Meta:
#         model = Order
#         fields = (
#             "id",
#             "store_name",
#             "shipping_info",
#             "coupon",
#             "comment",
#             "total_amount",
#             "payment_info",
#         )
#         read_only_fields = [
#             "total_amount",
#             "coupon",
#             "comment",
#         ]

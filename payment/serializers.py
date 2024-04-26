from rest_framework import serializers

from accounts.serializers import UserShippingInfoSerializer
from .models import PaymentInfo


class PaymentInfoSerializer(serializers.ModelSerializer):
    user_info = UserShippingInfoSerializer(read_only=True)
    payment_method = serializers.SerializerMethodField()

    class Meta:
        model = PaymentInfo
        fields = (
            "id",
            "user_info",
            "payment_method",
            "payment_amount",
            "payment_date",
            "is_paid",
        )
        read_only_fields = ("user_info", "payment_amount", "payment_date")

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["user_info"] = UserShippingInfoSerializer(
            instance.shipping_info
        ).data
        return representation

    def get_payment_method(self, obj):
        return obj.get_payment_method()


class PayPalAddBalanceSerializer(serializers.Serializer):
    value = serializers.DecimalField(max_digits=10, decimal_places=2)

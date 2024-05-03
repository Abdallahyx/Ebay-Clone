from rest_framework import serializers

from orders.serializers import OrderItemsSerializer
from .models import CustomerTransaction, StoreTransaction


class CustomerTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerTransaction
        fields = "__all__"


class StoreTransactionSerializer(serializers.ModelSerializer):
    order_item = OrderItemsSerializer()

    class Meta:
        model = StoreTransaction
        fields = "__all__"

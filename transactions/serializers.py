from rest_framework import serializers
from .models import CustomerTransaction, StoreTransaction


class CustomerTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerTransaction
        fields = "__all__"


class StoreTransactionSerializer(serializers.ModelSerializer):
    product_title = serializers.SerializerMethodField()
    product_size = serializers.SerializerMethodField()

    class Meta:
        model = StoreTransaction
        fields = "__all__"

    def get_product_title(self, obj):
        return obj.product_variation.product.title

    def get_product_size(self, obj):
        return obj.product_variation.size

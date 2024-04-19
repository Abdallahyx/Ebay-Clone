from rest_framework import serializers
from .models import StockItems, Store
from django.urls import reverse


class StockItemsSerializer(serializers.ModelSerializer):
    product_name = serializers.SerializerMethodField(read_only=True)
    product_price = serializers.CharField(source="product.price", read_only=True)
    product_category_name = serializers.SerializerMethodField(read_only=True)
    product_link = serializers.SerializerMethodField(read_only=True)
    store_name = serializers.CharField(source="store.store_name", read_only=True)

    class Meta:
        model = StockItems
        fields = [
            "id",
            "product",
            "product_name",
            "product_link",
            "product_category_name",
            "product_price",
            "quantity_in_stock",
            "quantity_sold",
            "stock_date",
            "last_sales_date",
            "store",
            "store_name",
        ]

    def get_product_name(self, obj):
        return obj.product.title

    def get_product_link(self, obj):
        return reverse("store:product_detail", args=[obj.product.slug])

    def get_product_category_name(self, obj):
        return obj.product.category.name

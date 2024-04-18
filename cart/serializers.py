from rest_framework import serializers
from .models import Cart, CartItems
from products.serializers import ProductSerializer
from accounts.serializers import ProfileSerializer


class CartSerializer(serializers.ModelSerializer):
    owner_username = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ("user", "owner_username")

    def get_owner_username(self, obj):
        user = obj.user
        user_serializer = ProfileSerializer(instance=user)
        return user_serializer.data["username"]


class CartItemsSerializer(serializers.ModelSerializer):
    product_name = serializers.SerializerMethodField()

    class Meta:
        model = CartItems
        fields = ("product", "product_name", "quantity", "total_price")

    def get_product_name(self, obj):
        product = obj.product
        serializer_product = ProductSerializer(instance=product)
        return serializer_product.data["title"]


class SessionCartSerializer(serializers.Serializer):

    def to_representation(self, instance):
        items = []
        for item in instance:
            item_data = item.copy()
            item_data["product_name"] = item_data.get("product").name
            item_data["product"] = item_data.pop("product").id
            items.append(item_data)
        return {"items": items}

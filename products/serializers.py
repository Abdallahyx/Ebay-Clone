from rest_framework import serializers

from .models import Category, Product, ProductImage


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["image", "alt_text"]


class ProductSerializer(serializers.ModelSerializer):
    product_image = ImageSerializer(many=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "category",
            "title",
            "description",
            "slug",
            "regular_price",
            "product_image",
        ]

    def create(self, validated_data):
        images_data = validated_data.pop("product_image", None)
        product = Product.objects.create(**validated_data)
        if images_data:
            for image_data in images_data:
                ProductImage.objects.create(product=product, **image_data)
        return product

    def update(self, instance, validated_data):
        images_data = validated_data.pop("product_image", None)
        instance.category = validated_data.get("category", instance.category)
        instance.title = validated_data.get("title", instance.title)
        instance.description = validated_data.get("description", instance.description)
        instance.slug = validated_data.get("slug", instance.slug)
        instance.regular_price = validated_data.get(
            "regular_price", instance.regular_price
        )
        instance.save()

        # Handle the images
        if images_data:
            for image_data in images_data:
                ProductImage.objects.update_or_create(product=instance, **image_data)

        return instance


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["name", "slug"]

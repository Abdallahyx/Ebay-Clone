from rest_framework import serializers

from .models import (
    AvailabilityStatuses,
    Category,
    Product,
    ProductImage,
    ProductVariations,
)


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = [
            "image",
        ]


class ProductSerializer(serializers.ModelSerializer):
    price_with_discount = serializers.ReadOnlyField()  # this is model property
    rating = serializers.DecimalField(read_only=True, decimal_places=1, max_digits=2)
    availability_status = serializers.SerializerMethodField()
    product_images = ImageSerializer(many=True)

    class Meta:
        model = Product
        fields = (
            "id",
            "title",
            "category",
            "slug",
            "price",
            "price_with_discount",
            "description",
            "photo",
            "discount",
            "rating",
            "availability_status",
            "product_images",
        )

    def get_availability_status(self, obj):
        status = ""
        if obj.availability_status == AvailabilityStatuses.in_stock[0]:
            status = AvailabilityStatuses.in_stock[1]
        elif obj.availability_status == AvailabilityStatuses.low_in_stock[0]:
            status = AvailabilityStatuses.low_in_stock[1]
        elif obj.availability_status == AvailabilityStatuses.awaiting_arrival[0]:
            status = AvailabilityStatuses.awaiting_arrival[1]
        else:
            obj.availability_status = AvailabilityStatuses.out_of_stock[1]
        return status

    def create(self, validated_data):
        images_data = validated_data.pop("product_images")
        product = Product.objects.create(**validated_data)
        for image_data in images_data:
            ProductImage.objects.create(product=product, **image_data)
        return product

    def update(self, instance, validated_data):
        images_data = validated_data.pop("product_images", [])
        instance.title = validated_data.get("title", instance.title)
        instance.category = validated_data.get("category", instance.category)
        instance.slug = validated_data.get("slug", instance.slug)
        instance.price = validated_data.get("price", instance.price)
        instance.price_with_discount = validated_data.get(
            "price_with_discount", instance.price_with_discount
        )
        instance.description = validated_data.get("description", instance.description)
        instance.photo = validated_data.get("photo", instance.photo)
        instance.discount = validated_data.get("discount", instance.discount)
        instance.rating = validated_data.get("rating", instance.rating)
        instance.availability_status = validated_data.get(
            "availability_status", instance.availability_status
        )
        instance.save()

        # Handle the images
        for image_data in images_data:
            ProductImage.objects.update_or_create(product=instance, **image_data)

        return instance


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["name", "slug"]


class ProductVariationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariations
        fields = ("id", "variation_category_name", "product_name", "product_link")

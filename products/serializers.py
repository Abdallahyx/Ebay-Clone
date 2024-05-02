from rest_framework import serializers
from django.http import QueryDict
import json

from .models import (
    AvailabilityStatuses,
    Category,
    Product,
    ProductImage,
    ProductVariation,
)
from django.shortcuts import get_object_or_404


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = [
            "id",
            "image",
        ]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class ProductBaseSerializer(serializers.ModelSerializer):
    price_with_discount = serializers.ReadOnlyField()  # this is model property
    category = serializers.CharField(source="category.name")  # category name

    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "category",
            "price",
            "price_with_discount",
            "photo",
            "discount",
        ]


class ProductVariationSerializer(serializers.ModelSerializer):
    availability_status = serializers.SerializerMethodField()

    class Meta:
        model = ProductVariation
        fields = [
            "id",
            "size",
            "quantity_in_stock",
            "quantity_sold",
            "availability_status",
        ]
        read_only_fields = [
            "quantity_sold",
        ]

    def get_availability_status(self, obj):
        status = ""
        if obj.availability_status == AvailabilityStatuses.in_stock[0]:
            status = AvailabilityStatuses.in_stock[1]
        elif obj.availability_status == AvailabilityStatuses.low_in_stock[0]:
            status = AvailabilityStatuses.low_in_stock[1]
        elif obj.availability_status == AvailabilityStatuses.awaiting_arrival[0]:
            status = AvailabilityStatuses.awaiting_arrival[1]
        else:
            status = AvailabilityStatuses.out_of_stock[1]
        return status


class ProductSerializer(serializers.ModelSerializer):
    price_with_discount = serializers.ReadOnlyField()  # this is model property
    rating = serializers.DecimalField(read_only=True, decimal_places=1, max_digits=2)
    product_images = ImageSerializer(many=True, required=False)
    variations = ProductVariationSerializer(many=True, required=False)

    class Meta:
        model = Product
        fields = [
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
            "product_images",
            "variations",
        ]

    def to_internal_value(self, data):
        # If the input is a QueryDict (as it will be for multipart form data),
        # handle it directly without converting to a standard dictionary
        if isinstance(data, QueryDict):
            # If variations is a list of strings (as it will be if each object was stringified),
            # parse each string into a dictionary
            if "variations" in data:
                data = {
                    **data.dict(),
                    "variations": [
                        json.loads(variation)
                        for variation in data.getlist("variations")
                    ],
                }
            else:
                data = data.dict()

        return super().to_internal_value(data)

    def create(self, validated_data):
        images_data = validated_data.pop("product_images", [])
        variations_data = validated_data.pop("variations", [])

        product = Product.objects.create(**validated_data)

        # Create product images
        for image_data in images_data:
            ProductImage.objects.create(product=product, **image_data)

        # Create product variations
        for variation_data in variations_data:
            ProductVariation.objects.create(product=product, **variation_data)

        return product

    def update(self, instance, validated_data):
        # Update product fields
        instance.title = validated_data.get("title", instance.title)
        instance.category = validated_data.get("category", instance.category)
        instance.slug = validated_data.get("slug", instance.slug)
        instance.price = validated_data.get("price", instance.price)
        instance.description = validated_data.get("description", instance.description)
        instance.photo = validated_data.get("photo", instance.photo)
        instance.discount = validated_data.get("discount", instance.discount)

        # Update or create product images
        images_data = validated_data.pop("product_images", [])
        for image_data in images_data:
            image_im = image_data.get("image", None)
            image = ProductVariation.objects.filter(
                product=instance, image=image_im
            ).exists()
            if image:
                image_instance = ProductImage.objects.get(
                    product=instance, image=image_im
                )
                image_instance.image = image_data.get("image", image_instance.image)
                image_instance.is_featured = image_data.get(
                    "is_featured", image_instance.is_featured
                )
                image_instance.save()
            else:
                ProductImage.objects.create(product=instance, **image_data)

        # Update or create product variations
        variations_data = validated_data.pop("variations", [])
        for variation_data in variations_data:
            size = variation_data.get("size", None)
            variation = ProductVariation.objects.filter(
                product=instance, size=size
            ).exists()
            if variation:
                variation_instance = ProductVariation.objects.get(
                    product=instance, size=size
                )
                variation_instance.size = variation_data.get(
                    "size", variation_instance.size
                )
                variation_instance.quantity_in_stock = variation_data.get(
                    "quantity_in_stock", variation_instance.quantity_in_stock
                )
                variation_instance.save()
            else:
                ProductVariation.objects.create(product=instance, **variation_data)
        instance.save()

        return instance

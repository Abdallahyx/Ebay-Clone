from rest_framework import serializers

from .models import (
    AvailabilityStatuses,
    Category,
    ParentOfVariationCategory,
    Product,
    ProductImage,
    ProductVariations,
    VariationCategory,
)
from django.shortcuts import get_object_or_404


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = [
            "image",
        ]


class VariationCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = VariationCategory
        fields = ["parent", "name", "value", "slug"]


class ParentOfVariationCategorySerializer(serializers.ModelSerializer):
    variation_categories = VariationCategorySerializer(many=True, read_only=True)

    class Meta:
        model = ParentOfVariationCategory
        fields = ["id", "name", "slug", "variation_categories"]

    def create(self, validated_data):
        variation_categories_data = validated_data.pop("variation_categories", [])
        parent_of_variation_category = ParentOfVariationCategory.objects.create(
            **validated_data
        )
        for variation_category_data in variation_categories_data:
            VariationCategory.objects.create(
                parent_of_variation_category=parent_of_variation_category,
                **variation_category_data
            )
        return parent_of_variation_category


class ProductSerializer(serializers.ModelSerializer):
    price_with_discount = serializers.ReadOnlyField()  # this is model property
    rating = serializers.DecimalField(read_only=True, decimal_places=1, max_digits=2)
    availability_status = serializers.SerializerMethodField()
    product_images = ImageSerializer(
        many=True, required=False
    )  # this is not supported in development mode

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
            status = AvailabilityStatuses.out_of_stock[1]
        return status

    def create(self, validated_data):
        images_data = validated_data.pop("product_images", [])
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


class GetProductVariationsSerializer(serializers.ModelSerializer):
    # Get the specific fields you want from variation_category
    parent_name = serializers.CharField(
        source="variation_category.parent.name", read_only=True
    )
    value = serializers.CharField(source="variation_category.value", read_only=True)

    class Meta:
        model = ProductVariations
        fields = (
            "parent_name",  # Parent name from variation category
            "value",  # Value from variation category
            "product_name",  # Product name
            "product_link",  # Link to the product
        )


class ProductVariationsSerializer(serializers.ModelSerializer):
    variation_category_name = serializers.CharField(source="variation_category.name")
    parent_name = serializers.CharField(source="variation_category.parent.name")

    class Meta:
        model = ProductVariations
        fields = ["parent_name", "variation_category_name"]


class AssignMultipleProductVariationsSerializer(serializers.Serializer):
    variations = serializers.ListField(
        child=serializers.DictField(child=serializers.CharField())
    )

    def create(self, validated_data):
        product_slug = self.context["view"].kwargs["product_slug"]
        product = Product.objects.get(slug=product_slug)
        variations_data = validated_data.get("variations")

        product_variations = []
        for variation_data in variations_data:
            parent_name = variation_data["parent_name"]
            variation_category_name = variation_data["variation_category_name"]
            parent = get_object_or_404(ParentOfVariationCategory, name=parent_name)
            variation_category = get_object_or_404(
                VariationCategory, name=variation_category_name, parent=parent
            )

            product_variation, created = ProductVariations.objects.get_or_create(
                product=product, variation_category=variation_category
            )

            if created:
                product_variations.append(product_variation)

        return product_variations

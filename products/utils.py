from django.core.exceptions import ValidationError
from django.utils.text import slugify
from .models import Product, ProductVariations, VariationCategory


class ProductVariationsMixin:
    def __init__(self):
        self._related_variations = []

    def reset_related_variations(self):
        self._related_variations = []

    def get_product_by_slug(self, product_slug):
        # Fetch the Product instance by its slug
        try:
            return Product.objects.get(slug=product_slug)
        except Product.DoesNotExist:
            raise ValidationError(f"No product found with slug '{product_slug}'")

    def get_related_variations(self, product_slug):
        # Ensure a valid product slug is provided
        if not product_slug or not isinstance(product_slug, str):
            raise ValueError("Invalid or empty product slug")

        # Clear the existing variations
        self.reset_related_variations()

        # Retrieve the product using the slug
        product = self.get_product_by_slug(product_slug)

        # Fetch all variations related to this product
        self._related_variations = list(product.variations.all())

        return self._related_variations

    def related_variations(self):
        # Return the cached list of related variations
        return self._related_variations

    def add_variation(self, product_slug, variation_category_slug):
        # Add a new variation to the product
        product = self.get_product_by_slug(product_slug)

        try:
            variation_category = VariationCategory.objects.get(
                slug=variation_category_slug
            )
        except VariationCategory.DoesNotExist:
            raise ValidationError(
                f"No variation category found with slug '{variation_category_slug}'"
            )

        # Create a new ProductVariations instance
        ProductVariations.objects.create(
            product=product, variation_category=variation_category
        )

        # Refresh the related variations
        self.get_related_variations(product_slug)

    def remove_variation(self, product_slug, variation_category_slug):
        # Remove a specific variation from the product
        product = self.get_product_by_slug(product_slug)

        # Find the ProductVariations instance to remove
        try:
            variation = ProductVariations.objects.get(
                product=product, variation_category__slug=variation_category_slug
            )
            variation.delete()  # Delete the variation
        except ProductVariations.DoesNotExist:
            raise ValidationError(
                f"No variation found for '{product_slug}' and '{variation_category_slug}'"
            )

        # Refresh the related variations
        self.get_related_variations(product_slug)

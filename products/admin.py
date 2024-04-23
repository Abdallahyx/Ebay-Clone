from django.contrib import admin
from .models import (
    ProductVariations,
    VariationCategory,
    Product,
    ParentOfVariationCategory,
)


class ProductVariationsAdmin(admin.ModelAdmin):
    list_display = ["id", "variation_category", "product"]
    list_display_links = ["id", "variation_category", "product"]
    search_fields = ["variation_category__name", "product__title"]


admin.site.register(ProductVariations, ProductVariationsAdmin)


class ProductAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "price", "category"]
    list_display_links = ["id", "title"]
    search_fields = ["title", "category__name"]


admin.site.register(Product, ProductAdmin)


class VariationCategoryAdmin(admin.ModelAdmin):
    list_display = ["id", "name"]
    list_display_links = ["id", "name"]
    search_fields = ["name"]


admin.site.register(VariationCategory, VariationCategoryAdmin)


class ParentOfVariationCategoryAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "slug"]
    list_display_links = ["id", "name"]
    search_fields = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}


admin.site.register(ParentOfVariationCategory, ParentOfVariationCategoryAdmin)

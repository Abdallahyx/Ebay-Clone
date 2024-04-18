from .models import Product, ProductVariations
from django.db.models import QuerySet, Q, Prefetch


class ProductVariationsMixin:
    _related_variations = []

    def reset_related_variations(self):
        """
        This method helps to avoid bug with related variations.
        If you don't reset variations before getting them,
        your list with related variations won't be updated.
        It means that every time when you will try to get variations of some
        product, and after you will try to get variations of another,
        you will get mixed variations of these products.
        """
        self._related_variations = []

    @staticmethod
    def get_related_variations(product_slug: str) -> QuerySet[ProductVariations]:
        """
        This method returns variations which related with product.
        For example if product have related variation with
        category 'Memory: 128GB' and 'Color: Space Black',
        this method will return variations with category
        'Memory 128GB' but with different color categories.
        This is only example for easiest understanding of
        this method, your variations and variation
        categories may be different.
        TODO: Optimize queries
        """
        product = Product.objects.select_related("category").get(slug=product_slug)
        related_variations = (
            ProductVariations.objects.filter(
                Q(
                    variation_category__in=product.variations.values_list(
                        "variation_category"
                    )
                )
                & Q(product__category=product.category)
            )
            .exclude(product=product)
            .distinct("product")
            .select_related("product", "variation_category")
            .values_list("variation_category_slug", "product_slug")
        )
        variation_category_slugs, product_slugs = zip(*related_variations)
        variations = (
            ProductVariations.objects.filter(product_id__in=product_slugs)
            .exclude(variation_category__in=variation_category_slugs)
            .select_related("product", "variation_category")
        )
        return variations

    def get_related_variations_by_parent(
        self, product_slug: int, parent_slug: int
    ) -> QuerySet[ProductVariations]:
        """
        This method is similar to 'get_related_variations' method,
        but returns filtered variations by provided parent_slug.
        'parent_slug' - slug of ParentOfVariationCategory model instance.
        """
        variations = self.get_related_variations(product_slug)
        variations_by_parent = variations.filter(
            variation_category__parent_id=parent_slug
        ).select_related("product", "product__category")
        return variations_by_parent

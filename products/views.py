from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.serializers import ValidationError
from CustomAuth.auth import CustomTokenAuthentication
from accounts.permissions import IsStore
from products.utils import ProductVariationsMixin

from . import models
from .models import (
    Category,
    ParentOfVariationCategory,
    Product,
    ProductVariations,
    VariationCategory,
)
from .serializers import (
    CategorySerializer,
    GetProductVariationsSerializer,
    ParentOfVariationCategorySerializer,
    ProductSerializer,
    VariationCategorySerializer,
)
from rest_framework.pagination import PageNumberPagination
from django.http import Http404
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from rest_framework.views import APIView
from .serializers import AssignMultipleProductVariationsSerializer
from rest_framework import status


from django.shortcuts import get_object_or_404
from .models import Product


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = PageNumberPagination


class ProductDetailView(generics.RetrieveAPIView):
    lookup_field = "slug"
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = PageNumberPagination


class ProductCreateView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomTokenAuthentication]

    def perform_create(self, serializer):  # multiple stores cant have same product
        product_slug = serializer.validated_data.get("slug")
        if not Product.objects.filter(slug=product_slug).exists():
            serializer.save(store=self.request.user.store_info)
        else:
            raise ValidationError("Product with this name already exists.")


class ProductUpdateView(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomTokenAuthentication]
    lookup_field = "slug"

    def perform_update(self, serializer):
        serializer.save(store=self.request.user.store_info)


class ProductDeleteView(generics.DestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomTokenAuthentication]
    lookup_field = "slug"

    def perform_destroy(self, instance):
        # Delete the images associated with the product
        instance.product_image.all().delete()
        instance.delete()


class CategoryItemView(generics.ListAPIView):
    serializer_class = ProductSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        return models.Product.objects.filter(
            category__in=Category.objects.get(slug=self.kwargs["slug"]).get_descendants(
                include_self=True
            )
        )


class CategoryCreateView(generics.CreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductVariationsAPIView(ProductVariationsMixin, generics.ListAPIView):
    serializer_class = GetProductVariationsSerializer

    def get_queryset(self):
        product_slug = self.kwargs.get("product_slug")

        if not product_slug:
            raise NotFound("Product slug is required")

        # Reset the cached variations before retrieving
        self.reset_related_variations()

        try:
            # Retrieve related variations using the mixin
            return self.get_related_variations(product_slug)
        except Product.DoesNotExist:
            raise Http404("Product does not exist")


class ProductVariationsByParentAPIView(ProductVariationsAPIView):
    """
    Endpoint for returning variations of product,
    but filtered by a parent slug.
    'parent_slug' - slug of ParentOfVariationCategory model instance
    """

    def get_related_variations_by_parent(self, product_slug, parent_slug):
        # Ensure both product_slug and parent_slug are provided
        if not product_slug or not parent_slug:
            raise ValueError("Product slug and parent slug are required")

        product = self.get_product_by_slug(product_slug)

        # Filter variations by product and parent slug
        queryset = ProductVariations.objects.filter(
            product=product,
            variation_category__parent__slug=parent_slug,
        )

        return queryset

    def get_queryset(self):
        product_slug = self.kwargs.get("product_slug")
        parent_slug = self.kwargs.get("parent_slug")

        if not product_slug:
            raise NotFound("Product slug is required")
        if not parent_slug:
            raise NotFound("Parent slug is required")

        try:
            # Retrieve variations filtered by parent slug
            return self.get_related_variations_by_parent(product_slug, parent_slug)
        except Product.DoesNotExist:
            raise Http404("Product does not exist")


class ParentOfVariationCategoryListCreateView(generics.ListCreateAPIView):
    queryset = ParentOfVariationCategory.objects.all()
    serializer_class = ParentOfVariationCategorySerializer


class VariationCategoryListCreateView(generics.ListCreateAPIView):
    queryset = VariationCategory.objects.all()
    serializer_class = VariationCategorySerializer


class AssignMultipleProductVariationsView(generics.CreateAPIView):
    queryset = ProductVariations.objects.all()
    serializer_class = AssignMultipleProductVariationsSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomTokenAuthentication]

    def get(self, request, *args, **kwargs):
        variations = VariationCategory.objects.all()
        serializer = VariationCategorySerializer(variations, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        product_slug = self.kwargs.get("product_slug")
        product = get_object_or_404(Product, slug=product_slug)
        variations_data = serializer.validated_data.get("variations")

        for variation_data in variations_data:
            parent_name = variation_data.get("parent_name")
            variation_category_name = variation_data.get("variation_category_name")

            if not parent_name or not variation_category_name:
                raise ValidationError(
                    "Each variation must include a 'parent_name' and a 'variation_category_name'."
                )

            parent = get_object_or_404(ParentOfVariationCategory, name=parent_name)
            variation_category = get_object_or_404(
                VariationCategory, name=variation_category_name, parent=parent
            )

            if not ProductVariations.objects.filter(
                product=product, variation_category=variation_category
            ).exists():
                ProductVariations.objects.create(
                    product=product, variation_category=variation_category
                )
            else:
                raise ValidationError("This variation for this product already exists.")

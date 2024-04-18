from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from CustomAuth.auth import CustomTokenAuthentication
from accounts.permissions import IsStore
from products.utils import ProductVariationsMixin

from . import models
from .models import Category, Product, ProductVariations
from .serializers import (
    CategorySerializer,
    ProductSerializer,
    ProductVariationsSerializer,
)
from rest_framework.pagination import PageNumberPagination
from django.http import Http404


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

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)


class ProductUpdateView(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomTokenAuthentication]
    lookup_field = "slug"

    def perform_update(self, serializer):
        serializer.save(seller=self.request.user)


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
    queryset = ProductVariations.objects.all()
    serializer_class = ProductVariationsSerializer

    def get_queryset(self):
        self.reset_related_variations()
        try:
            return self.get_related_variations(product_slug=self.kwargs["product_slug"])
        except Product.DoesNotExist:
            raise Http404("Product does not exist")


class ProductVariationsByParentAPIView(ProductVariationsAPIView):
    """
    Endpoint for returning variations of product,
    but filtered by parent_slug.
    'parent_slug' - slug of ParentOfVariationCategory model instance
    """

    def get_queryset(self):
        try:
            return self.get_related_variations_by_parent(
                product_slug=self.kwargs["product_slug"],
                parent_slug=self.kwargs["parent_slug"],
            )
        except Product.DoesNotExist:
            raise Http404("Product does not exist")

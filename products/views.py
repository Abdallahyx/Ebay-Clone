from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.serializers import ValidationError
from CustomAuth.auth import CustomTokenAuthentication
from accounts.permissions import (
    IsCustomer,
    IsNotAuthenticated,
    IsNotAuthenticatedOrIsCustomer,
    IsStore,
)

from . import models
from .models import (
    Category,
    Product,
)
from .serializers import (
    CategorySerializer,
    ProductSerializer,
)
from rest_framework.pagination import PageNumberPagination
from django.http import Http404
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny

from django.shortcuts import get_object_or_404
from .models import Product
from rest_framework.permissions import OR
from django_filters.rest_framework import DjangoFilterBackend
from .filter import ProductFilter

# Customers Views


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = PageNumberPagination
    permission_classes = [IsNotAuthenticatedOrIsCustomer]
    authentication_classes = [CustomTokenAuthentication]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProductFilter


class ProductDetailView(generics.RetrieveAPIView):
    lookup_field = "slug"
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsNotAuthenticatedOrIsCustomer]
    authentication_classes = [CustomTokenAuthentication]


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = PageNumberPagination
    permission_classes = [IsNotAuthenticatedOrIsCustomer]
    authentication_classes = [CustomTokenAuthentication]


class CategoryItemView(generics.ListAPIView):
    serializer_class = ProductSerializer
    pagination_class = PageNumberPagination
    permission_classes = [IsNotAuthenticatedOrIsCustomer]
    authentication_classes = [CustomTokenAuthentication]

    def get_queryset(self):
        return models.Product.objects.filter(
            category__in=Category.objects.get(slug=self.kwargs["slug"]).get_descendants(
                include_self=True
            )
        )


# Store Views


class StoreProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsStore]
    authentication_classes = [CustomTokenAuthentication]
    pagination_class = PageNumberPagination

    def get_queryset(self):
        return models.Product.objects.filter(store=self.request.user.store_info)


class CategoryCreateView(generics.CreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, IsStore]
    authentication_classes = [CustomTokenAuthentication]


class ProductCreateView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsStore]
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
    permission_classes = [IsAuthenticated, IsStore]
    authentication_classes = [CustomTokenAuthentication]
    lookup_field = "slug"

    def perform_update(self, serializer):
        serializer.save(store=self.request.user.store_info)


class ProductDeleteView(generics.DestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsStore]
    authentication_classes = [CustomTokenAuthentication]
    lookup_field = "slug"

    def perform_destroy(self, instance):
        # Delete the images associated with the product
        instance.product_image.all().delete()
        instance.delete()

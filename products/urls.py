from django.urls import path

from .views import *

app_name = "products"

urlpatterns = [
    path("products/", ProductListView.as_view(), name="product-list"),
    path("products/<slug:slug>/", ProductDetailView.as_view(), name="product-detail"),
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("products/store/add/", ProductCreateView.as_view(), name="product-create"),
    path(
        "categories/<slug:slug>/items/",
        CategoryItemView.as_view(),
        name="category-items",
    ),
    path(
        "products/store/update/<slug:slug>/",
        ProductUpdateView.as_view(),
        name="product-update",
    ),
    path(
        "products/store/delete/<slug:slug>/",
        ProductDeleteView.as_view(),
        name="product-delete",
    ),
    path("categories/create/", CategoryCreateView.as_view(), name="category-create"),
]

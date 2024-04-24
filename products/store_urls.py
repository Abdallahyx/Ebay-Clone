from django.urls import path

from .views import *

urlpatterns = [
    path("inventory/", StoreProductListView.as_view(), name="store-inventory"),
    path("create/", ProductCreateView.as_view(), name="product-create"),
    path(
        "update/<slug:slug>/",
        ProductUpdateView.as_view(),
        name="product-update",
    ),
    path(
        "delete/<slug:slug>/",
        ProductDeleteView.as_view(),
        name="product-delete",
    ),
    path("create_category/", CategoryCreateView.as_view(), name="category-create"),
]

from django.urls import path

from .views import *

urlpatterns = [
    path("", ProductListView.as_view(), name="product-list"),
    path("<slug:slug>/", ProductDetailView.as_view(), name="product-detail"),
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path(
        "categories/<slug:slug>/items/",
        CategoryItemView.as_view(),
        name="category-items",
    ),
]

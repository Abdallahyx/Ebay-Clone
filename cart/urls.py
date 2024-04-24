from django.urls import path
from .views import (
    CartAPIView,
    AddToCartAPIView,
    CartItemAddQuantityAPIView,
    CartItemMinusQuantityAPIView,
    CartClearAPIView,
)

urlpatterns = [
    path("", CartAPIView.as_view(), name="cart_detail"),
    path("add/<slug:slug>/<str:size>/", AddToCartAPIView.as_view(), name="add_to_cart"),
    path(
        "add_quantity/<slug:slug>/<str:size>/",
        CartItemAddQuantityAPIView.as_view(),
        name="item_add_quantity",
    ),
    path(
        "minus_quantity/<slug:slug>/<str:size>/",
        CartItemMinusQuantityAPIView.as_view(),
        name="item_minus_quantity",
    ),
    path("clear/", CartClearAPIView.as_view(), name="cart_clear"),
]

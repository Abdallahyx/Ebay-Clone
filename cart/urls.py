from django.urls import path
from .views import *

urlpatterns = [
    path("cart/", CartAPIView.as_view(), name="cart_detail"),
    path("cart/add/<slug:slug>/", AddToCartAPIView.as_view()),
    path(
        "cart/add_quantity/<slug:slug>/",
        CartItemAddQuantityAPIView.as_view(),
        name="item_add_quantity",
    ),
    path(
        "cart/minus_quantity/<slug:slug>/",
        CartItemMinusQuantityAPIView.as_view(),
        name="item_minus_quantity",
    ),
    path("cart/clear/", CartClearAPIView.as_view(), name="cart_clear"),
]

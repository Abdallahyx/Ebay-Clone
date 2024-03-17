from django.urls import path

from .views import CartListView, CartAddProducts, CartRemoveProducts

urlpatterns = [
    path("cart/view/", CartListView.as_view()),
    path("cart/add/<str:slug>/", CartAddProducts.as_view()),
    path("cart/remove/<str:slug>/", CartRemoveProducts.as_view()),
]

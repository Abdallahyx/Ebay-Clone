from django.urls import path

from .views import *


urlpatterns = [
    path("home/", ProductListView.as_view(), name="home"),
    path("category/", CategoryListView.as_view(), name="categories"),
    path("<slug:slug>/", Product.as_view(), name="product"),
    path(
        "category/<slug:slug>/",
        CategoryItemView.as_view(),
        name="category_item",
    ),
]

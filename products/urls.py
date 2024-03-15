from django.urls import path

from . import views


urlpatterns = [
    path("home/", views.ProductListView.as_view(), name="home"),
    path("category/", views.CategoryListView.as_view(), name="categories"),
    path("<slug:slug>/", views.Product.as_view(), name="product"),
    path(
        "category/<slug:slug>/",
        views.CategoryItemView.as_view(),
        name="category_item",
    ),
]

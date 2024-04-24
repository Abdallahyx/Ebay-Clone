from django.urls import path, include

app_name = "products"
urlpatterns = [
    path("products/", include("products.customers_urls")),
    path("store/", include("products.store_urls")),
]

from django.urls import path
from .views import (
    CustomerTransactionListCreateView,
    StoreTransactionListCreateView,
)

urlpatterns = [
    path(
        "customer/",
        CustomerTransactionListCreateView.as_view(),
        name="customer-transactions",
    ),
    path("store/", StoreTransactionListCreateView.as_view(), name="store-transactions"),
]

from django.urls import path
from .views import AddBalancePaypalComplete, PayPalAddBalanceAPIView, UserPaymentsView

urlpatterns = [
    path("user/", UserPaymentsView.as_view(), name="user_payments"),
    path(
        "user/add-balance/",
        PayPalAddBalanceAPIView.as_view(),
        name="paypal_add_balance",
    ),
    path(
        "user/add-balance/complete/",
        AddBalancePaypalComplete.as_view(),
        name="paypal_add_balance_complete",
    ),
]

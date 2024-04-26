from django.urls import path
from .views import UserPaymentsView

urlpatterns = [
    path("user/", UserPaymentsView.as_view(), name="user_payments"),
]

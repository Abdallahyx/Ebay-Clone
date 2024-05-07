from django.urls import path
from .views import *


urlpatterns = [
    path(
        "registration/customer",
        CustomerRegistrationAPIView.as_view(),
        name="customer register",
    ),
    path(
        "registration/store",
        StoreRegistrationAPIView.as_view(),
        name="store register",
    ),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("logout/", LogoutAPIView.as_view(), name="logout"),
    path("profile/", UserProfileAPIView.as_view(), name="profile"),
    path(
        "balance/",
        UserBalanceAPIView.as_view(),
        name="bonuses_balance",
    ),
]

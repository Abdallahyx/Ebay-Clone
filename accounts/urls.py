from django.urls import path
from .views import *


urlpatterns = [
    path(
        "api/registration/buyer",
        CustomerRegistrationAPIView.as_view(),
        name="buyer register",
    ),
    path(
        "api/registration/store",
        StoreRegistrationAPIView.as_view(),
        name="seller register",
    ),
    path("api/login/", LoginAPIView.as_view(), name="login"),
    path("api/logout/", LogoutAPIView.as_view(), name="logout"),
    path("api/profile/", UserProfileAPIView.as_view(), name="profile"),
    path(
        "api/balance/",
        UserBalanceAPIView.as_view(),
        name="bonuses_balance",
    ),
    # path("", include(router.urls)),
]

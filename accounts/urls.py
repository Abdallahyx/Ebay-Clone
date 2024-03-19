from django.urls import path
from .views import *

urlpatterns = [
    path(
        "api/registration/buyer",
        BuyerRegistrationAPIView.as_view(),
        name="buyer register",
    ),
    path(
        "api/registration/seller",
        SellerRegistrationAPIView.as_view(),
        name="seller register",
    ),
    # path(
    #     "confirm_email/<token>/<email>/",
    #     ConfirmEmailAPIView.as_view(),
    #     name="confirm-email",
    # ),
    path("api/login/", LoginAPIView.as_view(), name="login"),
    path("api/logout/", LogoutAPIView.as_view(), name="logout"),
    # path("change_email/", ChangeEmailAPIView.as_view(), name="change_email_send"),
    # path(
    #     "change_email_confirm/<token>/<email>/",
    #     ChangeEmailConfirmAPIView.as_view(),
    #     name="change_email_confirm",
    # ),
    # path(
    #     "password_reset/",
    #     SendPasswordResetAPIView.as_view(),
    #     name="send_password_reset",
    # ),
    # path(
    #     "password_reset/<token>/<email>/",
    #     PasswordResetAPIView.as_view(),
    #     name="password_reset",
    # ),
    path("api/profile/", UserProfileAPIView.as_view(), name="profile"),
    path(
        "api/balance/",
        UserBalanceAPIView.as_view(),
        name="bonuses_balance",
    ),
    # path("", include(router.urls)),
]

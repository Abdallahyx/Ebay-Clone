from django.urls import path
from djoser.views import UserViewSet
from rest_framework_simplejwt.views import TokenObtainPairView


urlpatterns = [
    path("register/", UserViewSet.as_view({"post": "create"}), name="register"),
    path("login/", TokenObtainPairView.as_view(), name="login"),
]

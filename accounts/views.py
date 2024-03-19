from django.contrib.auth import authenticate
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import generics, status
from .serializers import (
    BuyerRegistrationSerializer,
    LoginSerializer,
    ProfileSerializer,
    UserBalanceSerializer,
)
from .permissions import IsNotAuthenticated
from rest_framework.views import APIView
from .models import User, UserToken, UserBalance
from .token import TokenTypes, AuthTokenMixin, get_token_data
from django.contrib.auth import logout
from rest_framework.authentication import TokenAuthentication
from rest_framework import viewsets
from rest_framework import mixins


class UserRegistrationAPIView(AuthTokenMixin, generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = BuyerRegistrationSerializer
    permission_classes = [IsNotAuthenticated]
    token_type = TokenTypes.SIGNUP

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)

        return Response(
            {"status": 200, "message": "registered", "data": response.data},
            status=status.HTTP_200_OK,
        )


class LoginAPIView(APIView):
    serializer_class = LoginSerializer
    permission_classes = [IsNotAuthenticated]

    def get(self, *args, **kwargs):
        data = {"user": str(self.request.user), "auth": str(self.request.auth)}
        return Response(data=data, status=status.HTTP_200_OK)

    def post(self, *args, **kwargs):
        serializer = LoginSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        email = self.request.data["email"]
        password = self.request.data["password"]
        user = authenticate(self.request, email=email, password=password)

        if user is not None:
            data = {
                "message": "Successful authentication",
                "token": user.auth_token.key,
                # we can call user.auth_token because in Token model
                # have related_name="auth_token" to user instance.
                # you can check it here 'rest_framework.authtoken.models'.
            }
            # get_or_create_basket(self.request, user)
            return Response(data=data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "Provided email or password is wrong!"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, *args, **kwargs):
        user = self.request.user
        user.auth_token.delete()
        user_tokens = UserToken.objects.filter(token_owner=user.email, expired=False)
        for token in user_tokens:
            token.delete()
        try:
            logout(self.request)
        except User.DoesNotExist:
            return Response(
                {"error": "Logout error"}, status=status.HTTP_400_BAD_REQUEST
            )
        return Response(
            {"success": "You successfully logged out!"}, status=status.HTTP_200_OK
        )


class UserProfileAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    queryset = User.objects.all()

    def get_object(self):
        user = self.queryset.get(id=self.request.user.id)
        return user


class UserBonusesBalanceAPIView(generics.ListAPIView):
    serializer_class = UserBalanceSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    queryset = UserBalance.objects.all()

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


class UpdateUserBonusesBalanceViewSet(
    mixins.UpdateModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet
):
    serializer_class = UserBalanceSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [TokenAuthentication]
    queryset = UserBalance.objects.all()

    def get_object(self):
        user = get_object_or_404(UserBalance, pk=self.kwargs["pk"])
        return user

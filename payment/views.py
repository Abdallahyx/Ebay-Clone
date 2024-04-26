from rest_framework import generics

from CustomAuth.auth import CustomTokenAuthentication
from accounts.models import User, UserBalance
from accounts.permissions import IsCustomer
from transactions.models import CustomerTransaction, TransactionStatus
from .services import paypal_add_balance, paypal_complete_payment
from .models import PaymentInfo
from .serializers import PayPalAddBalanceSerializer, PaymentInfoSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from decimal import Decimal


class UserPaymentsView(generics.ListAPIView):
    serializer_class = PaymentInfoSerializer
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsCustomer]
    pagination_class = PageNumberPagination

    def get_queryset(self):
        user = self.request.user
        return PaymentInfo.objects.filter(shipping_info__user=user)


class PayPalAddBalanceAPIView(APIView):
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsCustomer]
    serializer_class = PayPalAddBalanceSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            value = serializer.validated_data.get("value")
            payment_url = paypal_add_balance(value)
            if payment_url:
                return Response(
                    {"payment_url": payment_url}, status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    {"error": "Failed to create PayPal payment"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddBalancePaypalComplete(APIView):
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsCustomer]

    def get(self, request, *args, **kwargs):
        value = request.query_params.get("value")
        payment_id = request.query_params.get("paymentId")
        payer_id = request.query_params.get("PayerID")

        if paypal_complete_payment(payment_id, payer_id):

            if request.user.is_authenticated:
                balance, _ = UserBalance.objects.get_or_create(user=request.user)
                # Update user's balance
                balance.balance += Decimal(value)
                balance.save()
                # Create a CustomerTransaction
                CustomerTransaction.objects.create(
                    user=request.user,
                    amount=Decimal(value),
                    description="Added balance via PayPal",
                    status=TransactionStatus.SUCCESS,
                )
                return Response({"success": "Balance added successfully!"})
            else:
                return Response(
                    {"error": "User is not authenticated."},
                    status=status.HTTP_403_FORBIDDEN,
                )

        else:
            return Response(
                {"error": "Failed to add balance."}, status=status.HTTP_400_BAD_REQUEST
            )

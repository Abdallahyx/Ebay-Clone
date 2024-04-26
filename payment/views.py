from rest_framework import generics

from CustomAuth.auth import CustomTokenAuthentication
from accounts.permissions import IsCustomer
from .models import PaymentInfo
from .serializers import PaymentInfoSerializer
from rest_framework.pagination import PageNumberPagination


class UserPaymentsView(generics.ListAPIView):
    serializer_class = PaymentInfoSerializer
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsCustomer]
    pagination_class = PageNumberPagination

    def get_queryset(self):
        user = self.request.user
        return PaymentInfo.objects.filter(shipping_info__user=user)

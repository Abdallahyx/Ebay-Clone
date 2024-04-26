from rest_framework import generics

from CustomAuth.auth import CustomTokenAuthentication
from accounts.permissions import IsCustomer, IsStore
from .models import CustomerTransaction, StoreTransaction
from .serializers import CustomerTransactionSerializer, StoreTransactionSerializer
from rest_framework.pagination import PageNumberPagination


class CustomerTransactionListCreateView(generics.ListAPIView):
    serializer_class = CustomerTransactionSerializer
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsCustomer]
    pagination_class = PageNumberPagination

    def get_queryset(self):
        user = self.request.user
        return CustomerTransaction.objects.filter(user=user).order_by("created_at")


class StoreTransactionListCreateView(generics.ListAPIView):
    serializer_class = StoreTransactionSerializer
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsStore]
    pagination_class = PageNumberPagination

    def get_queryset(self):
        store = self.request.user.store_info
        return StoreTransaction.objects.filter(store=store).order_by("created_at")

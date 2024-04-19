from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from CustomAuth.auth import CustomTokenAuthentication
from accounts.permissions import IsStore
from .models import StockItems, Product
from .serializers import StockItemsSerializer
from rest_framework import generics, status


class StockItemsViewSet(ModelViewSet):
    serializer_class = StockItemsSerializer
    permission_classes = [IsAuthenticated, IsStore]
    authentication_classes = [CustomTokenAuthentication]

    def get_queryset(self):
        # Check if the user is authenticated
        if self.request.user.is_authenticated:
            # Get the store associated with the currently authenticated user
            store = self.request.user.store_info
            # Filter the stock items based on the store
            return StockItems.objects.filter(store=store)
        else:
            # Raise a not authenticated error if the user is not authenticated
            return Response(
                {"error": "Not authenticated"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=True, url_path="product_stock/(?P<slug>[-\w]+)", methods=["get"])
    def product_stock(self, request, slug=None):
        product = Product.objects.get(slug=slug)
        store = request.user.store_info
        stock_items = StockItems.objects.filter(store=store, product=product)
        serializer = self.get_serializer(stock_items, many=True)
        return Response(serializer.data)

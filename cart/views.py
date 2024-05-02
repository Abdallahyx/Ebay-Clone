from accounts.permissions import IsCustomer, IsNotAuthenticatedOrIsCustomer
from .cart import SessionCart
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from products.models import Product, ProductVariation, AvailabilityStatuses
from django.shortcuts import get_object_or_404
from .utils import CartMixin, CartOperationTypes
from .models import Cart, CartItems
from rest_framework import status
from django.conf import settings
from CustomAuth.auth import CustomTokenAuthentication


def get_or_create_cart(request, user):
    """
    This function retrieves the session cart and creates a database cart.

    Args:
        request (Request): The user's request.
        user (User): User instance.
    """
    cart = SessionCart(request)
    user_cart, _ = Cart.objects.get_or_create(user=user)
    for item in cart:
        product_variation = get_object_or_404(
            ProductVariation, product=item["product"], size=item["size"]
        )
        CartItems.objects.get_or_create(
            cart=user_cart,
            product=product_variation,
            quantity=item["quantity"],
            total_price=item["total_price"],
        )
    cart.clear()


class CartAPIView(CartMixin, APIView):
    authentication_classes = [SessionAuthentication, CustomTokenAuthentication]

    def get(self, *args, **kwargs):
        data = self.get_cart_data(self.request)
        return Response(data=data, status=status.HTTP_200_OK)


class OperationCartAPIView(CartMixin, APIView):
    """
    A base class for Cart Operations API endpoints, not used in URLs.
    It defines `operation_type` to specify the cart operation.
    """

    def post(self, *args, **kwargs):
        product_slug = kwargs.get("slug")
        product_size = kwargs.get("size")

        product = get_object_or_404(Product, slug=product_slug)
        product_variation = get_object_or_404(
            ProductVariation, product=product, size=product_size
        )

        if (
            product_variation.availability_status
            != AvailabilityStatuses.out_of_stock[0]
        ):
            data = self.cart_operation(self.request, product, product_size)
            return Response(data=data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"not available": "This product is not in stock now"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class AddToCartAPIView(OperationCartAPIView):
    operation_type = CartOperationTypes.cart_add
    authentication_classes = [SessionAuthentication, CustomTokenAuthentication]
    permission_classes = [IsNotAuthenticatedOrIsCustomer]

    def post(self, *args, **kwargs):
        product_slug = kwargs.get("slug")
        product_size = kwargs.get("size")

        product = get_object_or_404(Product, slug=product_slug)
        product_variation = get_object_or_404(
            ProductVariation, product=product, size=product_size
        )

        if (
            product_variation.availability_status
            != AvailabilityStatuses.out_of_stock[0]
        ):
            data = self.cart_operation(self.request, product, product_size)
            return Response(data=data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"not available": "This product is not in stock now"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class CartItemAddQuantityAPIView(OperationCartAPIView):
    operation_type = CartOperationTypes.item_add_quantity
    authentication_classes = [SessionAuthentication, CustomTokenAuthentication]
    permission_classes = [IsNotAuthenticatedOrIsCustomer]

    def post(self, *args, **kwargs):
        product_slug = kwargs.get("slug")
        product_size = kwargs.get("size")

        product = get_object_or_404(Product, slug=product_slug)
        product_variation = get_object_or_404(
            ProductVariation, product=product, size=product_size
        )

        if (
            product_variation.availability_status
            != AvailabilityStatuses.out_of_stock[0]
        ):
            data = self.cart_operation(self.request, product, product_size)
            return Response(data=data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"not available": "This product is not in stock now"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class CartItemMinusQuantityAPIView(OperationCartAPIView):
    operation_type = CartOperationTypes.item_minus_quantity
    authentication_classes = [SessionAuthentication, CustomTokenAuthentication]
    permission_classes = [IsNotAuthenticatedOrIsCustomer]

    def post(self, *args, **kwargs):
        product_slug = kwargs.get("slug")
        product_size = kwargs.get("size")

        product = get_object_or_404(Product, slug=product_slug)
        data = self.cart_operation(self.request, product, product_size)

        return Response(data=data, status=status.HTTP_200_OK)


class CartClearAPIView(OperationCartAPIView):
    operation_type = CartOperationTypes.cart_clear
    authentication_classes = [SessionAuthentication, CustomTokenAuthentication]
    permission_classes = [IsNotAuthenticatedOrIsCustomer]

    def post(self, *args, **kwargs):
        data = self.cart_operation(self.request)
        return Response(data=data, status=status.HTTP_200_OK)

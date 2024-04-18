from accounts.permissions import IsCustomer
from .cart import SessionCart
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from products.models import Product, AvailabilityStatuses
from django.shortcuts import get_object_or_404
from .utils import CartMixin, CartOperationTypes
from .models import Cart, CartItems
from rest_framework import status
from django.conf import settings
from CustomAuth.auth import CustomTokenAuthentication


def get_or_create_cart(request, user):
    """
    This function is used to get the cart from
    the session and create it in the database.

    Args:
        request (Request): The user's request.
        user (User): User instance.
    """
    cart = SessionCart(request)
    user_cart, _ = Cart.objects.get_or_create(user=user)
    for item in cart:
        CartItems.objects.get_or_create(
            cart=user_cart,
            product=item["product"],
            quantity=item["quantity"],
            total_price=item["total_price"],
        )
    cart.clear()


class CartAPIView(CartMixin, APIView):
    # permission_classes = [IsCustomer]
    authentication_classes = [SessionAuthentication, CustomTokenAuthentication]

    def get(self, *args, **kwargs):
        print(settings.BASE_DIR)
        data = self.get_cart_data(self.request)

        return Response(data=data, status=status.HTTP_200_OK)


class OperationCartAPIView(CartMixin, APIView):
    """
    This method is a parent class for other Cart
    Operations API endpoints and is not used in URLs,
    therefore it has no associated link. It defines the
    operation_type attribute which is used to specify the type
    of cart operation to perform. The get method calls
    the cart_operation method of the CartMixin class with
    the request and product arguments to perform the specified
    cart operation and returns the resulting data as a response.
    """

    def post(self, *args, **kwargs):
        product = get_object_or_404(Product, slug=kwargs[""])
        if product.availability_status != AvailabilityStatuses.out_of_stock[0]:
            data = self.cart_operation(self.request, product)
            return Response(data=data)
        else:
            return Response({"not available": "This product now is not in stock now"})


class AddToCartAPIView(OperationCartAPIView):
    operation_type = CartOperationTypes.cart_add


class CartItemAddQuantityAPIView(OperationCartAPIView):
    operation_type = CartOperationTypes.item_add_quantity


class CartItemMinusQuantityAPIView(OperationCartAPIView):
    operation_type = CartOperationTypes.item_minus_quantity


class CartClearAPIView(OperationCartAPIView):
    operation_type = CartOperationTypes.cart_clear

    def get(self, *args, **kwargs):
        data = self.get_cart_data(self.request)
        return Response(data=data)

    def post(self, *args, **kwargs):
        data = self.cart_operation(self.request)
        return Response(data=data)

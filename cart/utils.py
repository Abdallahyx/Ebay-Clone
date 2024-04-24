from typing import Optional, Union

from products.models import Product, ProductVariation
from .cart import SessionCart
from .models import Cart

from .serializers import (
    CartItemsSerializer,
    SessionCartSerializer,
    CartSerializer,
)
from .cart import (
    cart_add_item,
    cart_item_add_quantity,
    cart_item_minus_quantity,
    cart_remove_item,
    clear_cart,
)


class CartOperationTypes:
    cart_add = "add"
    item_add_quantity = "add_quantity"
    item_minus_quantity = "minus_quantity"
    cart_clear = "clear"


def get_product_variation(product: Product, size: str) -> ProductVariation:
    """
    Get the product variation based on product ID and size.
    """
    return ProductVariation.objects.get(product=product, size=size)


class CartMixin:
    """
    Mixin to operate with session or DB cart.
    """

    operation_type: Optional[str] = None
    __cart: Union[SessionCart, Cart, None] = None

    def _cart_add_item(self, request, product, size):
        self.reset_cart_option()  # Ensures a new cart session is initialized
        product_variation = get_product_variation(
            product, size
        )  # Fetch the correct variation

        if not request.user.is_authenticated:  # Guest user
            self.__cart = SessionCart(request)
            self.__cart.add(product, size)  # Pass the size parameter
        else:  # Authenticated user
            self.__cart, _ = Cart.objects.get_or_create(user=request.user)
            cart_add_item(self.__cart, product, size)  # Pass the size parameter

    def _cart_add_item_quantity(self, request, product, size):
        self.reset_cart_option()
        product_variation = get_product_variation(product, size)

        if not request.user.is_authenticated:
            self.__cart = SessionCart(request)
            self.__cart.add_quantity(product, size)  # Pass the size parameter
        else:
            self.__cart, _ = Cart.objects.get_or_create(user=request.user)
            cart_item_add_quantity(
                self.__cart, product, size
            )  # Pass the size parameter

    def _cart_minus_item_quantity(self, request, product, size):
        self.reset_cart_option()
        product_variation = get_product_variation(product, size)

        if not request.user.is_authenticated:
            self.__cart = SessionCart(request)
            self.__cart.minus_quantity(product, size)  # Pass the size parameter
        else:
            self.__cart, _ = Cart.objects.get_or_create(user=request.user)
            cart_item_minus_quantity(
                self.__cart, product, size
            )  # Pass the size parameter

    def _cart_remove_item(self, request, product, size):
        self.reset_cart_option()
        product_variation = get_product_variation(product, size)

        if not request.user.is_authenticated:
            self.__cart = SessionCart(request)
            self.__cart.remove(product, size)  # Pass the size parameter
        else:
            self.__cart, _ = Cart.objects.get_or_create(user=request.user)
            cart_remove_item(self.__cart, product, size)  # Pass the size parameter

    def _cart_clear(self, request):
        self.reset_cart_option()
        if not request.user.is_authenticated:
            self.__cart = SessionCart(request)
            self.__cart.clear()
        else:
            self.__cart, _ = (
                Cart.objects.prefetch_related("items")
                .select_related("user")
                .get_or_create(user=request.user)
            )
            clear_cart(self.__cart)

    def clear_exist_cart(self, request):
        """
        Clears existing cart for authenticated users.
        """
        if request.user.is_authenticated:
            clear_cart(self.__cart)

    @staticmethod
    def get_cart_len(cart):
        return len(cart)

    def get_cart_data(self, request):
        """
        Retrieves cart data based on authentication status.
        """
        self.reset_cart_option()
        if not request.user.is_authenticated:
            self.__cart = SessionCart(request)
            serializer = SessionCartSerializer(self.__cart)
            cart_data = serializer.data
            data = {
                "total_amount": self.__cart.total_amount,
                "total_quantity_of_products": len(self.__cart),
            }
            data.update(cart_data)
        else:
            self.__cart, _ = (
                Cart.objects.prefetch_related("items")
                .select_related("user")
                .get_or_create(user=request.user)
            )
            items = self.__cart.items.all().select_related("product").distinct()
            items_serializer = CartItemsSerializer(instance=items, many=True)
            cart_data = items_serializer.data
            cart_serializer = CartSerializer(instance=self.__cart)
            data = {
                "cart": cart_serializer.data,
                "items": cart_data,
                "total_amount": self.__cart.total_amount,
                "total_quantity_of_products": len(self.__cart),
            }
        return data

    def cart_operation(self, request, product=None, size=None):
        """
        Calls other methods for cart operations based on `operation_type`.
        """
        self.reset_cart_option()

        if self.operation_type == CartOperationTypes.cart_add:
            self._cart_add_item(request, product, size)
        elif self.operation_type == CartOperationTypes.item_add_quantity:
            self._cart_add_item_quantity(request, product, size)
        elif self.operation_type == CartOperationTypes.item_minus_quantity:
            self._cart_minus_item_quantity(request, product, size)
        elif self.operation_type == CartOperationTypes.cart_clear:
            self._cart_clear(request)

        return self.get_cart_data(request)

    def cart_items(self, request):
        """
        Yields cart items based on the type of cart used.
        """
        if not request.user.is_authenticated:
            self.__cart = SessionCart(request)
        else:
            self.__cart, _ = Cart.objects.get_or_create(user=request.user)

        for item in self.__cart:
            yield item

    def reset_cart_option(self):
        self.__cart = None

from typing import Optional, Union
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
    item_minus_quantity = "minus quantity"
    cart_clear = "clear"


class CartMixin:
    """
    Mixin which do some operations with
    session cart or with cart from db and
    returns data with information about cart.

    Mixin works with two types of cart:
    Session cart and DB cart.

    If user is not authenticated, this mixin will be
    working with Session cart, in other case with DB Cart.
    """

    operation_type: Optional[str] = None
    __cart: Union[SessionCart, Cart, None] = None

    def _cart_add_item(self, request, product):
        self.reset_cart_option()
        if not request.user.is_authenticated:
            self.__cart = SessionCart(request)
            self.__cart.add(product)

        else:
            self.__cart, _ = (
                Cart.objects.prefetch_related("items")
                .select_related("user")
                .get_or_create(user=request.user)
            )
            cart_add_item(self.__cart, product)

    def _cart_add_item_quantity(self, request, product):
        self.reset_cart_option()
        if not request.user.is_authenticated:
            self.__cart = SessionCart(request)
            self.__cart.add_quantity(product)
        else:
            self.__cart, _ = (
                Cart.objects.prefetch_related("items")
                .select_related("user")
                .get_or_create(user=request.user)
            )
            cart_item_add_quantity(self.__cart, product)

    def _cart_minus_item_quantity(self, request, product):
        self.reset_cart_option()
        if not request.user.is_authenticated:
            self.__cart = SessionCart(request)
            self.__cart.minus_quantity(product)
        else:
            self.__cart, _ = (
                Cart.objects.prefetch_related("items")
                .select_related("user")
                .get_or_create(user=request.user)
            )
            cart_item_minus_quantity(self.__cart, product)

    def _cart_remove_item(self, request, product):
        self.reset_cart_option()
        if not request.user.is_authenticated:
            self.__cart = SessionCart(request)
            self.__cart.remove(product)
        else:
            self.__cart, _ = (
                Cart.objects.prefetch_related("items")
                .select_related("user")
                .get_or_create(user=request.user)
            )
            cart_remove_item(self.__cart, product)

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
        We are using this method only if user
        is authenticated and use of this method
        is only expected when self.__cart is not
        None and this is Cart model instance.
        For example, we are setting self.__cart
        in method get_cart_data as Cart model
        instance if user is authenticated.

        The main use of this method is to avoid
        needlessly accessing the cart table when
        we are clearing it.
        """
        if request.user.is_authenticated:
            clear_cart(self.__cart)

    @staticmethod
    def get_cart_len(cart):
        return len(cart)

    def get_cart_data(self, request):
        """
        This method checks whether the user is
        authenticated or not, and based on that,
        returns either Session Cart or DB Cart data.

        Args:
            request (Request): The user's request.

        Returns:
            data (dict): dictionary with information about cart.
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

    def cart_operation(self, request, product=None):
        """
        This method calls other methods for cart operations
        depending on the specified operation_type.

        Args:
            request (Request): The user's request.
            product (Products): The product on which the operation will be performed.
        """
        self.reset_cart_option()
        if self.operation_type == CartOperationTypes.cart_add:
            self._cart_add_item(request, product)
        elif self.operation_type == CartOperationTypes.item_add_quantity:
            self._cart_add_item_quantity(request, product)
        elif self.operation_type == CartOperationTypes.item_minus_quantity:
            self._cart_minus_item_quantity(request, product)
        elif self.operation_type == CartOperationTypes.cart_clear:
            self._cart_clear(request)

        return self.get_cart_data(request)

    def cart_items(self, request):
        if not request.user.is_authenticated:
            self.__cart = SessionCart(request)
        else:
            self.__cart, _ = Cart.objects.get_or_create(user=request.user)
        for item in self.__cart:
            yield item

    def reset_cart_option(self):
        self.__cart = None

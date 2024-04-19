import copy
from django.conf import settings
from products.models import Product
from .models import CartItems, Cart
from typing import NamedTuple, Optional


class SessionCart:

    def __init__(self, request):
        self.session = request.session
        cart = self.session.get(settings.CART_SESSION)

        if not cart:
            cart = self.session[settings.CART_SESSION] = {}
        self.cart = cart

    def save(self):
        self.session[settings.CART_SESSION] = self.cart
        self.session.modified = True

    def add(self, product):
        product_slug = str(product.slug)
        if product_slug not in self.cart:
            self.cart[product_slug] = {
                "quantity": 1,
                "price": product.price,
                "price_with_discount": product.price_with_discount,
            }
        else:
            self.cart[product_slug]["quantity"] += 1
        self.save()

    def remove(self, product):
        product_slug = str(product.slug)
        if product_slug in self.cart:
            del self.cart[product_slug]
        self.save()

    def add_quantity(self, product):
        product_slug = str(product.slug)

        if product_slug in self.cart:
            self.cart[product_slug]["quantity"] += 1
        self.save()

    def minus_quantity(self, product):
        product_slug = str(product.slug)

        if product_slug in self.cart:
            if self.cart[product_slug]["quantity"] > 1:
                self.cart[product_slug]["quantity"] -= 1
            else:
                self.remove(product)
        self.save()

    def __iter__(self):
        cart_product_slugs = self.cart.keys()
        products = Product.objects.filter(slug__in=cart_product_slugs)
        cart = copy.deepcopy(self.cart)

        for product in products:
            cart[str(product.slug)]["product"] = product
        for item in cart.values():
            if item["product"].discount:
                item["total_price"] = item["price_with_discount"] * item["quantity"]
            else:
                item["total_price"] = item["price"] * item["quantity"]
            yield item

    def __len__(self):
        """Counting all products in the cart"""
        return sum(item["quantity"] for item in self.cart.values())

    @property
    def total_amount(self):
        """
        Getting overall total price of all
        products in the cart
        """
        return sum(item["price"] for item in self.cart.values())

    def clear(self):
        del self.session[settings.CART_SESSION]
        self.session.modified = True


class CartItemData(NamedTuple):
    item: Optional[CartItems] = None
    exist: Optional[bool] = None


def check_cart_item(cart, product):
    if CartItems.objects.filter(cart=cart, product=product).exists():
        item = CartItems.objects.get(cart=cart, product=product)
        return CartItemData(item=item, exist=True)
    return CartItemData(exist=False)


def get_or_create_cart_item(cart, product: Product) -> CartItemData:
    item_data = check_cart_item(cart, product)
    if item_data.item and item_data.exist:
        item = CartItems.objects.get(cart=cart, product=product)
    else:
        item = CartItems.objects.create(
            cart=cart, product=product, quantity=1, total_price=product.price
        )
        return CartItemData(item=item, exist=True)
    return CartItemData(item, exist=False)


def cart_add_item(cart, product):
    cart_item_data = get_or_create_cart_item(cart, product)
    if cart_item_data.exist:
        cart_item_data.item.quantity = 1
        cart_item_data.item.save()
    else:
        cart_item_data.item.quantity += 1
        cart_item_data.item.save()


def cart_remove_item(cart, product):
    try:
        item = CartItems.objects.get(cart=cart, product=product)
        item.delete()
    except CartItems.DoesNotExist:
        return False
    return True


def cart_item_add_quantity(cart, product):
    cart_item_data = check_cart_item(cart, product)
    if cart_item_data.item and cart_item_data.exist:
        cart_item_data.item.quantity += 1
    cart_item_data.item.save()


def cart_item_minus_quantity(cart, product):
    cart_item_data = check_cart_item(cart, product)
    if cart_item_data.item and cart_item_data.exist:
        if cart_item_data.item.quantity > 1:
            cart_item_data.item.quantity -= 1
            cart_item_data.item.save()
        else:
            cart_remove_item(cart, product)


def clear_cart(cart):
    try:
        items = CartItems.objects.filter(cart=cart)
        for item in items:
            item.delete()
        return True
    except Cart.DoesNotExist:
        return False

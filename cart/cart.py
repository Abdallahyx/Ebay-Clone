from django.conf import settings
from products.models import Product, ProductVariation
from .models import CartItems, Cart
from typing import NamedTuple, Optional
import copy


class SessionCart:
    def __init__(self, request):
        self.session = request.session
        cart = self.session.get(settings.CART_SESSION, {})
        self.cart = cart

    def save(self):
        self.session[settings.CART_SESSION] = self.cart
        self.session.modified = True

    def get_product_variation(self, product):
        product_variation_id = self.cart[str(product.id)]["product_variation_id"]
        return ProductVariation.objects.get(id=product_variation_id)

    def add(self, product, size):
        product_variation = ProductVariation.objects.get(product=product, size=size)
        product_variation_key = f"{product.slug}-{size}"

        if product_variation_key not in self.cart:
            self.cart[product_variation_key] = {
                "product_id": product.id,
                "variation_id": product_variation.id,
                "quantity": 1,
                "price": product.price,
                "price_with_discount": product.price_with_discount,
            }
        else:
            self.cart[product_variation_key]["quantity"] += 1

        self.save()

    def remove(self, product, size):
        product_variation_key = f"{product.slug}-{size}"

        if product_variation_key in self.cart:
            del self.cart[product_variation_key]

        self.save()

    def add_quantity(self, product, size):
        product_variation_key = f"{product.slug}-{size}"

        if product_variation_key in self.cart:
            self.cart[product_variation_key]["quantity"] += 1

        self.save()

    def minus_quantity(self, product, size):
        product_variation_key = f"{product.slug}-{size}"

        if product_variation_key in self.cart:
            if self.cart[product_variation_key]["quantity"] > 1:
                self.cart[product_variation_key]["quantity"] -= 1
            else:
                self.remove(product, size)

        self.save()

    def __iter__(self):
        cart_variation_keys = list(self.cart.keys())
        products = Product.objects.filter(
            slug__in=[k.split("-")[0] for k in cart_variation_keys]
        )

        cart = copy.deepcopy(self.cart)

        for product in products:
            variations = ProductVariation.objects.filter(product=product)
            for variation in variations:
                key = f"{product.slug}-{variation.size}"
                if key in cart:
                    cart[key]["product"] = product
                    cart[key]["variation"] = variation

        for item in cart.values():
            if item["product"].discount:
                item["total_price"] = item["price_with_discount"] * item["quantity"]
            else:
                item["total_price"] = item["price"] * item["quantity"]
            yield item

    def __len__(self):
        return sum(item["quantity"] for item in self.cart.values())

    @property
    def total_amount(self):
        return sum(item["price"] * item["quantity"] for item in self.cart.values())

    def clear(self):
        del self.session[settings.CART_SESSION]
        self.session.modified = True


class CartItemData(NamedTuple):
    item: Optional[CartItems] = None
    exist: Optional[bool] = None


def check_cart_item(cart, product, size):
    product_variation = ProductVariation.objects.get(product=product, size=size)
    item = CartItems.objects.filter(
        cart=cart, product=product, product_variation=product_variation
    ).first()

    if item:
        return CartItemData(item=item, exist=True)
    return CartItemData(exist=False)


def get_or_create_cart_item(cart, product, size):
    item_data = check_cart_item(cart, product, size)
    if item_data.item and item_data.exist:
        return CartItemData(item=item_data.item, exist=True)
    else:
        product_variation = ProductVariation.objects.get(product=product, size=size)
        item = CartItems.objects.create(
            cart=cart,
            product=product,
            product_variation=product_variation,
            quantity=1,
            total_price=product.price,
        )
        return CartItemData(item=item, exist=False)


def cart_add_item(cart, product, size):
    cart_item_data = get_or_create_cart_item(cart, product, size)

    if cart_item_data.exist:
        cart_item_data.item.quantity += 1
        cart_item_data.item.save()
    else:
        cart_item_data.item.quantity = 1
        cart_item_data.item.save()


def cart_remove_item(cart, product, size):
    try:
        product_variation = ProductVariation.objects.get(product=product, size=size)
        item = CartItems.objects.get(
            cart=cart, product=product, product_variation=product_variation
        )
        item.delete()
    except CartItems.DoesNotExist:
        return False
    return True


def cart_item_add_quantity(cart, product, size):
    cart_item_data = check_cart_item(cart, product, size)
    if cart_item_data.exist:
        cart_item_data.item.quantity += 1
        cart_item_data.item.save()


def cart_item_minus_quantity(cart, product, size):
    cart_item_data = check_cart_item(cart, product, size)
    if cart_item_data.exist:
        if cart_item_data.item.quantity > 1:
            cart_item_data.item.quantity -= 1
            cart_item_data.item.save()
        else:
            cart_remove_item(cart, product, size)


def clear_cart(cart):
    try:
        items = CartItems.objects.filter(cart=cart)
        for item in items:
            item.delete()
        return True
    except Cart.DoesNotExist:
        return False

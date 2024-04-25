from django.db import models
from coupons.models import UserCoupons
from products.models import Product, ProductVariation
from accounts.models import Store, UserShippingInfo, User


class Order(models.Model):
    ORDER_STATUSES = (
        (1, "New"),
        (2, "Processing"),
        (3, "Ready to ship"),
        (4, "Shipped"),
        (5, "Delivered"),
        (6, "Canceled"),
    )
    PAYMENT_METHODS = (
        (1, "By cash"),
        (2, "By card"),
        (3, "By balance"),
        (4, "By Paypal"),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name="User",
        related_name="orders",
        blank=True,
        null=True,
    )
    session_id = models.CharField(max_length=32, blank=True, null=True)
    order_id = models.CharField(max_length=7, blank=True, null=True)
    order_status = models.IntegerField(
        verbose_name="Order status", choices=ORDER_STATUSES, default=1
    )

    total_amount = models.IntegerField(default=0, verbose_name="Total amount of order")
    coupon = models.ForeignKey(
        UserCoupons,
        on_delete=models.SET_NULL,
        verbose_name="Coupon",
        blank=True,
        null=True,
    )
    shipping_info = models.ForeignKey(
        UserShippingInfo,
        on_delete=models.SET_NULL,
        verbose_name="User shipping info",
        blank=True,
        null=True,
    )
    payment_method = models.IntegerField(
        default=1, choices=PAYMENT_METHODS, verbose_name="Payment method"
    )
    activate_balance = models.BooleanField(
        default=False, verbose_name="Activate Balance"
    )
    comment = models.TextField(
        max_length=1000, verbose_name="Comment", blank=True, null=True
    )

    class Meta:
        verbose_name = "Order"
        verbose_name_plural = "Orders"
        ordering = ["total_amount"]

    def __str__(self):
        return f"Order #: {self.id}, order_id: {self.id}"


class OrderItems(models.Model):
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, verbose_name="Order", related_name="items"
    )
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, verbose_name="Product"
    )
    quantity = models.IntegerField(default=0, verbose_name="Quantity")
    total_price = models.IntegerField(default=0, verbose_name="Total price")
    store = models.ForeignKey(
        Store,
        on_delete=models.CASCADE,
        verbose_name="Store",
        related_name="orders",
    )
    product_variation = models.ForeignKey(
        ProductVariation, on_delete=models.CASCADE, verbose_name="Product Variation"
    )

    class Meta:
        verbose_name = "item"
        verbose_name_plural = "Items in order"
        ordering = ["total_price"]

    def __str__(self):
        return f"Item: {self.product.title} Size: {self.product_variation.size}, Order: {self.order}"

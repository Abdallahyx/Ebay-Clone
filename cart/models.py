from django.utils import timezone
from django.db import models
from products.models import Product, ProductVariation
from accounts.models import User


class Cart(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        verbose_name="User",
        blank=True,
        null=True,
        related_name="Cart",
    )
    created_at = models.DateTimeField(verbose_name="Created at", default=timezone.now)

    class Meta:
        verbose_name = "Cart"
        verbose_name_plural = "Carts"

    def __str__(self):
        return f"Cart of {self.user.username}"

    def __len__(self):
        return sum(item.quantity for item in self.items.all())

    @property
    def total_amount(self):
        return sum(item.total_price for item in self.items.all())


class CartItems(models.Model):
    cart = models.ForeignKey(
        Cart, on_delete=models.CASCADE, verbose_name="Cart", related_name="items"
    )
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, verbose_name="Product"
    )
    quantity = models.IntegerField(default=0, verbose_name="Item quantity")
    total_price = models.IntegerField(default=0, verbose_name="Total price of item")
    product_variation = models.ForeignKey(
        ProductVariation, on_delete=models.CASCADE, verbose_name="Product Variation"
    )

    class Meta:
        verbose_name = "item"
        verbose_name_plural = "Cart items"

    def __str__(self):
        return f"Cart item {self.product.title}"

    def save(self, *args, **kwargs):
        if self.product.discount:
            self.total_price = self.product.price_with_discount * self.quantity
        else:
            self.total_price = self.product.price * self.quantity
        super().save(*args, **kwargs)

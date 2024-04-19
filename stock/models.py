from django.db import models
from accounts.models import Store
from products.models import Product, Category


class StockItems(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        verbose_name="Product",
        related_name="stock_info",
    )
    product_category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        verbose_name="Product category",
        blank=True,
        null=True,
    )
    store = models.ForeignKey(
        Store,
        on_delete=models.CASCADE,
        verbose_name="Store",
        related_name="stock_items",
    )

    price_per_item = models.IntegerField(default=0, verbose_name="Price per item")
    quantity_in_stock = models.PositiveIntegerField(
        default=0, verbose_name="Quantity in stock"
    )
    quantity_sold = models.PositiveIntegerField(default=0, verbose_name="Quantity sold")
    stock_date = models.DateTimeField(verbose_name="Stock date", blank=True, null=True)
    last_sales_date = models.DateTimeField(
        verbose_name="Last sales date", blank=True, null=True
    )

    class Meta:
        verbose_name = "stock item"
        verbose_name_plural = "Stock items"

    @property
    def product_price_with_discount(self):
        return self.product.price_with_discount

    def save(self, *args, **kwargs):
        self.product_article = self.product.article
        self.product_category = self.product.category
        self.price_per_item = self.product.price
        super().save(*args, **kwargs)

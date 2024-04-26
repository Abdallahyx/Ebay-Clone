from django.db import models
from django.utils import timezone
from accounts.models import Store, User
from products.models import ProductVariation
from orders.models import OrderItems


class TransactionStatus(models.TextChoices):
    SUCCESS = "SUCCESS", "Success"
    PENDING = "PENDING", "Pending"
    FAILED = "FAILED", "Failed"


class CustomerTransaction(models.Model):
    # The user who made the transaction
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="customer_transactions"
    )
    # The amount of the transaction
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    # The time when the transaction was made
    timestamp = models.DateTimeField(auto_now_add=True)
    # A description of the transaction
    description = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20,
        choices=TransactionStatus.choices,
        default=TransactionStatus.PENDING,
    )

    def __str__(self):
        return f"{self.user.username} - {self.amount} on {self.timestamp}"


class StoreTransaction(models.Model):
    store = models.ForeignKey(
        Store, on_delete=models.CASCADE, related_name="store_transactions"
    )
    # The product variation that was sold
    product_variation = models.ForeignKey(
        ProductVariation, on_delete=models.CASCADE, related_name="store_transactions"
    )
    # The order item associated with the transaction
    order_item = models.ForeignKey(
        OrderItems, on_delete=models.CASCADE, related_name="store_transactions"
    )
    # The quantity of the product variation that was sold
    quantity = models.PositiveIntegerField()
    # The time when the transaction was made
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=TransactionStatus.choices,
        default=TransactionStatus.PENDING,
    )

    def __str__(self):
        return f"{self.product_variation.product.title} - {self.quantity} on {self.timestamp}"

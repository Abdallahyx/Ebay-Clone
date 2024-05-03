from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils import timezone
from accounts.models import UserBalance
from orders.models import Order, OrderItems
from products.utils import check_quantity_and_set_status
from transactions.models import StoreTransaction, TransactionStatus
from .models import PaymentInfo
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models import F
from decimal import Decimal
from .models import PaymentInfo


@receiver(post_save, sender=PaymentInfo)
def update_user_balance(sender, instance: PaymentInfo, **kwargs):

    if instance.is_paid:
        for item in OrderItems.objects.filter(order=instance.order):
            user_balance, _ = UserBalance.objects.get_or_create(user=item.store.user)
            user_balance.balance = F("balance") + Decimal(item.total_price)
            user_balance.save(update_fields=["balance"])


@receiver(post_save, sender=PaymentInfo)
def update_stock_on_payment(sender, instance, created, **kwargs):
    """
    Signal to update stock when a payment is successfully made.
    Reduces the stock of the product variation based on the order items.
    """
    if instance.is_paid:
        # Get the order associated with the payment
        order = instance.order

        # Get the order items associated with the order
        order_items = OrderItems.objects.filter(order=order)

        for item in order_items:
            # Get the product variation associated with the order item
            product_variation = item.product_variation

            # Reduce the stock by the quantity ordered
            product_variation.quantity_in_stock -= item.quantity
            product_variation.quantity_sold += item.quantity
            product_variation.last_sales_date = timezone.now()

            # Ensure stock does not go negative
            if product_variation.quantity_in_stock < 0:
                product_variation.quantity_in_stock = 0
            # Update availability_status based on the current stock
            product_variation.availability_status = check_quantity_and_set_status(
                product_variation
            )

            product_variation.save()  # Save the updated stock value
            StoreTransaction.objects.create(
                store=product_variation.product.store,
                order_item=item,
                quantity=item.quantity,
                status=TransactionStatus.SUCCESS,
            )

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order, OrderItems, ProductVariation
from django.utils import timezone


@receiver(post_save, sender=OrderItems)
def update_stock_on_order_creation(sender, instance, created, **kwargs):
    """
    Signal to update stock when an order item is successfully created.
    Reduces the stock of the product variation based on the order item.
    """
    if created:
        # Get the product variation associated with the order item
        product_variation = instance.product_variation

        # Reduce the stock by the quantity ordered
        product_variation.quantity_in_stock -= instance.quantity
        product_variation.quantity_sold += instance.quantity
        product_variation.last_sales_date = timezone.now()

        # Ensure stock does not go negative
        if product_variation.quantity_in_stock < 0:
            product_variation.quantity_in_stock = 0

        product_variation.save()  # Save the updated stock value

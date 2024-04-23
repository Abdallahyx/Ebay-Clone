from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from products.models import AvailabilityStatuses
from .models import StockItems
from .utils import check_quantity_and_set_status
from django.core.exceptions import ObjectDoesNotExist


@receiver(post_save, sender=StockItems)
def update_product_availability_status_post_save(sender, instance, created, **kwargs):
    if created:
        check_quantity_and_set_status(instance)


@receiver(pre_save, sender=StockItems)
def update_product_availability_status_pre_save(sender, instance, **kwargs):
    try:
        old_instance = StockItems.objects.get(product=instance.product)
        if old_instance.quantity_in_stock != instance.quantity_in_stock:
            # Update product status based on quantity in stock
            check_quantity_and_set_status(instance)
    except ObjectDoesNotExist:
        # If StockItems instance is not found, set product status to "out of stock"
        instance.product.availability_status = AvailabilityStatuses.out_of_stock[0]
        instance.product.save()

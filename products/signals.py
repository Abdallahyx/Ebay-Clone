from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from products.models import AvailabilityStatuses
from .models import ProductVariation
from .utils import check_quantity_and_set_status
from django.core.exceptions import ObjectDoesNotExist


@receiver(post_save, sender=ProductVariation)
def update_product_availability_status_post_save(sender, instance, created, **kwargs):
    if created:
        instance.availability_status = check_quantity_and_set_status(instance)
        instance.save()


@receiver(pre_save, sender=ProductVariation)
def update_product_availability_status_pre_save(sender, instance, **kwargs):
    try:
        old_instance = ProductVariation.objects.get(id=instance.id)
        if old_instance.quantity_in_stock != instance.quantity_in_stock:
            instance.availability_status = check_quantity_and_set_status(instance)
    except ObjectDoesNotExist:
        instance.availability_status = AvailabilityStatuses.out_of_stock[0]

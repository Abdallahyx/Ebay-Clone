from django.db.models.signals import pre_save
from django.dispatch import receiver

from accounts.models import UserBalance
from .models import PaymentInfo


@receiver(pre_save, sender=PaymentInfo)
def accrue_to_user_balance(sender, instance, **kwargs):
    if instance.order.user and instance.order.activate_balance:
        if instance.order.total_amount and instance.is_paid:
            user_balance = UserBalance.objects.get(user=instance.order.user)
            if user_balance.balance >= instance.order.total_amount:
                user_balance.balance -= instance.order.total_amount
                user_balance.save()
                instance.save()

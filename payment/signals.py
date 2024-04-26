from django.db.models.signals import pre_save
from django.dispatch import receiver

from accounts.models import UserBalance
from orders.models import OrderItems
from .models import PaymentInfo
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models import F
from decimal import Decimal
from .models import PaymentInfo


@receiver(post_save, sender=PaymentInfo)
def update_user_balance(sender, instance: PaymentInfo, **kwargs):
    print(f"Updating user balance for payment info {instance.id}")  # Add this line

    if instance.is_paid:
        for item in OrderItems.objects.filter(order=instance.order):
            user_balance, _ = UserBalance.objects.get_or_create(user=item.store.user)
            print(f"Updating balance for user {user_balance.user.id}")  # Add this line
            user_balance.balance = F("balance") + Decimal(item.total_price)
            user_balance.save(update_fields=["balance"])
            print(f"New balance: {user_balance.balance}")  # Add this line


@receiver(pre_save, sender=PaymentInfo)
def accrue_to_user_balance(sender, instance, **kwargs):
    if instance.order.user and instance.order.activate_balance:
        if instance.order.total_amount and instance.is_paid:
            user_balance = UserBalance.objects.get(user=instance.order.user)
            if user_balance.balance >= instance.order.total_amount:
                user_balance.balance -= instance.order.total_amount
                user_balance.save()
                instance.save()

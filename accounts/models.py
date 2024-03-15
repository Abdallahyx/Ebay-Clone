from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
)


class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")

        email = self.normalize_email(email)
        superuser = self.model(email=email, **extra_fields)

        superuser.set_password(password)
        superuser.is_superuser = True
        superuser.is_staff = True
        superuser.save()
        return superuser


class UserAccount(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    role = models.CharField(
        max_length=20, choices=[("buyer", "Buyer"), ("seller", "Seller")]
    )
    gender = models.CharField(
        max_length=10, choices=[("male", "Male"), ("female", "Female")]
    )

    objects = UserAccountManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = [
        "first_name",
        "last_name",
        "address",
        "phone_number",
        "role",
        "gender",
    ]

    def get_full_name(self):
        return self.first_name + " " + self.last_name

    def get_short_name(self):
        return self.first_name

    def __str__(self):
        return self.email

    def has_seller_permissions(self):
        return self.role == "seller"

import binascii
import os
from django.db import models
from .managers import UserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from rest_framework.authtoken.models import Token


class User(PermissionsMixin, AbstractBaseUser):

    username = models.CharField(
        max_length=250, verbose_name="Username", unique=True, blank=True, null=True
    )
    email = models.EmailField(unique=True, verbose_name="E-mail", null=False)
    first_name = models.CharField(
        max_length=125, verbose_name="First name", blank=True, null=True
    )
    surname = models.CharField(
        max_length=125, verbose_name="Surname", blank=True, null=True
    )
    phone_number = models.CharField(
        max_length=15, verbose_name="Phone number", blank=True, null=True
    )
    is_staff = models.BooleanField(verbose_name="Staff status", default=False)
    is_superuser = models.BooleanField(verbose_name="Superuser status", default=False)
    is_active = models.BooleanField(verbose_name="User activated", default=True)
    is_admin = models.BooleanField(default=False)
    last_login = models.DateTimeField(verbose_name="Last login", null=True, blank=True)
    date_joined = models.DateTimeField(verbose_name="Date joined", auto_now_add=True)

    gender = models.CharField(
        max_length=10,
        choices=[("male", "Male"), ("female", "Female")],
        default="male",
    )
    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = ["username", "first_name", "surname", "phone_number", "gender"]

    objects = UserManager()

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "Users"

    def __str__(self):
        balance = UserBalance.objects.filter(user=self).first().balance
        return f"{self.username}: {self.first_name} {self.surname}, Balance: {balance}$"

    def save(self, *args, **kwargs):
        if self._state.adding and (
            not self.username or User.objects.filter(username=self.username).exists()
        ):
            email = self.email
            self.username = User.objects.generate_username(email)
        if "@" not in self.username:
            self.username = "@" + self.username
        is_new = not self.pk  # Check if this is a new instance
        super().save(*args, **kwargs)
        if is_new:
            UserBalance.objects.create(user=self)

    @property
    def full_name(self):
        return f"{self.first_name} {self.surname}"


class Seller(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name="User")
    company_name = models.CharField(
        max_length=200, verbose_name="Company name", blank=True, null=True
    )
    company_address = models.CharField(
        max_length=200, verbose_name="Company address", blank=True, null=True
    )
    company_city = models.CharField(
        max_length=100, verbose_name="Company city", blank=True, null=True
    )
    company_country = models.CharField(
        max_length=100, verbose_name="Company country", blank=True, null=True
    )
    company_phone_number = models.CharField(
        max_length=15, verbose_name="Company phone number", blank=True, null=True
    )

    class Meta:
        verbose_name = "seller"
        verbose_name_plural = "Sellers"

    def __str__(self):
        return f"{self.company_name} {self.company_address}, {self.company_city}, {self.company_country}"


class UserToken(models.Model):
    TOKEN_TYPES = (
        ("su", "SignUp token"),
        ("ce", "Change email token"),
        ("pr", "Password reset token"),
    )
    token = models.CharField(
        unique=True, max_length=32, verbose_name="Token", blank=True, null=True
    )
    token_type = models.CharField(
        max_length=2,
        choices=TOKEN_TYPES,
        verbose_name="Token type",
        blank=True,
        null=True,
    )
    token_owner = models.EmailField(
        verbose_name="Token owner email", blank=True, null=True
    )
    created = models.DateTimeField(
        auto_now_add=True, verbose_name="Token creation date"
    )
    expired = models.BooleanField(default=False, verbose_name="Token expired")

    class Meta:
        verbose_name = "token"
        verbose_name_plural = "Tokens"

    def __str__(self):
        return f"{self.token}, {self.token_type}"

    def generate_token(self):
        return binascii.hexlify(os.urandom(16)).decode()

    def save(self, *args, **kwargs):
        if self._state.adding and (
            not self.token or UserToken.objects.filter(token=self.token).exists()
        ):
            self.token = self.generate_token()
        super().save(*args, **kwargs)

    @classmethod
    def get_token_from_str(cls, token_value: str, token_owner: str):
        return cls.objects.get(token=token_value, token_owner=token_owner)


class UserBalance(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        verbose_name="User",
        related_name="balance",
    )
    balance = models.DecimalField(
        default=0.0, max_digits=10, decimal_places=2, verbose_name="User balance"
    )

    def __str__(self):
        return f"{self.balance}$"


class UserShippingInfo(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        verbose_name="User",
        related_name="shipping_info",
        blank=True,
        null=True,
    )
    address = models.CharField(
        max_length=200, verbose_name="Address", blank=True, null=True
    )
    city = models.CharField(max_length=100, verbose_name="City", blank=True, null=True)
    country = models.CharField(
        max_length=100, verbose_name="Country", blank=True, null=True
    )

    class Meta:
        verbose_name = "shipping info"
        verbose_name_plural = "Shipping Infos"

    def __str__(self):
        return f"Shipping info of: {self.name} {self.surname} \n {self.address}, {self.city}, {self.country}"

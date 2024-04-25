from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from mptt.models import MPTTModel, TreeForeignKey
from django.utils.text import slugify
from accounts.models import Store
from products.services import get_discount


class Category(MPTTModel):
    """
    Category Table implimented with MPTT.
    """

    name = models.CharField(
        verbose_name=_("Category Name"),
        help_text=_("Required and unique"),
        max_length=255,
        unique=True,
    )
    slug = models.SlugField(
        verbose_name=_("Category safe URL"), max_length=255, unique=True
    )
    parent = TreeForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="children"
    )
    is_active = models.BooleanField(default=True)
    photo = models.ImageField(
        upload_to="images/categories/", verbose_name="Photo", blank=True, null=True
    )

    class MPTTMeta:
        order_insertion_by = ["name"]

    class Meta:
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")

    @property
    def get_absolute_url(self):
        return reverse("products:category-list", args=[self.slug])

    def __str__(self):
        return self.name


class AvailabilityStatuses:
    in_stock = (1, "in stock")
    awaiting_arrival = (2, "awaiting arrival")
    low_in_stock = (3, "low in stock")
    out_of_stock = (4, "out of stock")


class Product(models.Model):
    """
    The Product table contining all product items.
    """

    store = models.ForeignKey(
        Store,
        on_delete=models.CASCADE,
        related_name="store_info",
    )
    category = models.ForeignKey(Category, on_delete=models.RESTRICT)
    title = models.CharField(
        verbose_name=_("title"),
        help_text=_("Required"),
        max_length=255,
    )

    slug = models.SlugField(max_length=255)
    price = models.IntegerField(default=0, verbose_name="Price")
    description = models.TextField(blank=True, null=True, verbose_name="Description")
    photo = models.ImageField(
        upload_to="images/products/", verbose_name="Photo", blank=True, null=True
    )
    discount = models.IntegerField(default=0, verbose_name="Discount(Optional)")
    is_active = models.BooleanField(
        verbose_name=_("Product visibility"),
        help_text=_("Change product visibility"),
        default=True,
    )
    created_at = models.DateTimeField(
        _("Created at"), auto_now_add=True, editable=False
    )
    updated_at = models.DateTimeField(_("Updated at"), auto_now=True)
    rating = models.DecimalField(
        max_digits=2, decimal_places=1, verbose_name="Rating", default=0
    )

    class Meta:
        ordering = ("-created_at",)
        verbose_name = _("Product")
        verbose_name_plural = _("Products")

    @property
    def product_link(self):
        return reverse("products:product-detail", args=[self.slug])

    @property
    def price_with_discount(self):
        """
        Returns calculated price with discount.
        """
        price_with_discount = get_discount(self.price, self.discount)
        return price_with_discount

    @price_with_discount.setter
    def price_with_discount(self, value):
        self.price = value / (1 - self.discount / 100)

    def __str__(self):
        return self.title


def upload_to(instance, filename):
    return "images/products/{filename}".format(filename=filename)


class ProductImage(models.Model):
    """
    The Product Image table.
    """

    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="product_images"
    )
    image = models.ImageField(
        verbose_name=_("image"),
        help_text=_("Upload a product image"),
        upload_to=upload_to,
        default="images/default.png",
    )
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Product Image")
        verbose_name_plural = _("Product Images")

    def __str__(self):
        return self.image.url


class ProductVariation(models.Model):
    AVAILABILITY_STATUSES = (
        AvailabilityStatuses.in_stock,
        AvailabilityStatuses.awaiting_arrival,
        AvailabilityStatuses.low_in_stock,
        AvailabilityStatuses.out_of_stock,
    )
    product = models.ForeignKey(
        Product, related_name="variations", on_delete=models.CASCADE
    )
    size = models.CharField(null=True, max_length=20, blank=True)
    quantity_in_stock = models.PositiveIntegerField(
        default=0, verbose_name="Quantity in stock"
    )
    quantity_sold = models.PositiveIntegerField(default=0, verbose_name="Quantity sold")
    stock_date = models.DateTimeField(verbose_name="Stock date", blank=True, null=True)
    last_sales_date = models.DateTimeField(
        verbose_name="Last sales date", blank=True, null=True
    )
    availability_status = models.IntegerField(default=4, choices=AVAILABILITY_STATUSES)

    class Meta:
        unique_together = ["product", "size"]

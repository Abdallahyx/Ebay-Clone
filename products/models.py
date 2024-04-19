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

    class MPTTMeta:
        order_insertion_by = ["name"]

    class Meta:
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")

    @property
    def get_absolute_url(self):
        return reverse("store:category_list", args=[self.slug])

    def __str__(self):
        return self.name


class ProductDescriptionCategory(models.Model):
    name = models.CharField(
        max_length=150, verbose_name="Description category name", unique=True
    )

    class Meta:
        verbose_name = "category"
        verbose_name_plural = "Products descriptions categories"

    def __str__(self):
        return f"Description category: {self.name}"


class ProductDescription(models.Model):
    description_category = models.ForeignKey(
        ProductDescriptionCategory,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        verbose_name="Description category",
    )
    description = models.TextField(blank=True, null=True, verbose_name="Description")

    class Meta:
        verbose_name = "description"
        verbose_name_plural = "Descriptions"

    def __str__(self):
        return f"Description of: {self.products.name}"


class ProductCharacteristicsCategory(models.Model):
    name = models.CharField(max_length=200, verbose_name="Name", unique=True)

    class Meta:
        verbose_name = "category"
        verbose_name_plural = "Characteristics category"

    def __str__(self):
        return f"Characteristics category: {self.name}"


class ProductCharacteristics(models.Model):
    """
    Model of characteristics of any product.
    For example: 'Model: MacBook Air 13 2020' - this is one characteristic.
    """

    characteristics_category = models.ForeignKey(
        ProductCharacteristicsCategory,
        on_delete=models.CASCADE,
        verbose_name="Category",
        blank=True,
        null=True,
        related_name="characteristics",
    )
    product = models.ForeignKey(
        "Product",
        on_delete=models.CASCADE,
        verbose_name="Product",
        related_name="characteristics",
        null=False,
    )
    name = models.CharField(
        max_length=150, blank=True, null=True, verbose_name="characteristics name"
    )
    value = models.CharField(max_length=200, verbose_name="Value")

    class Meta:
        verbose_name = "description"
        verbose_name_plural = "Descriptions"

    def __str__(self):
        return f"Description of: {self.product.name}"


class AvailabilityStatuses:
    in_stock = (1, "in stock")
    awaiting_arrival = (2, "awaiting arrival")
    low_in_stock = (3, "low in stock")
    out_of_stock = (4, "out of stock")


class Product(models.Model):
    """
    The Product table contining all product items.
    """

    AVAILABILITY_STATUSES = (
        AvailabilityStatuses.in_stock,
        AvailabilityStatuses.awaiting_arrival,
        AvailabilityStatuses.low_in_stock,
        AvailabilityStatuses.out_of_stock,
    )
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.RESTRICT)
    title = models.CharField(
        verbose_name=_("title"),
        help_text=_("Required"),
        max_length=255,
    )

    slug = models.SlugField(max_length=255)
    price = models.IntegerField(default=0, verbose_name="Price")
    description = models.ForeignKey(
        ProductDescription,
        on_delete=models.CASCADE,
        verbose_name="Description",
        related_name="products",
        blank=True,
        null=True,
    )
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
    availability_status = models.IntegerField(default=1, choices=AVAILABILITY_STATUSES)
    rating = models.DecimalField(
        max_digits=2, decimal_places=1, verbose_name="Rating", default=0
    )

    class Meta:
        ordering = ("-created_at",)
        verbose_name = _("Product")
        verbose_name_plural = _("Products")

    @property
    def product_link(self):
        return reverse("store:product_detail", args=[self.slug])

    @property
    def price_with_discount(self):
        """
        Returns calculated price with discount.
        """
        price_with_discount = get_discount(self.price, self.discount)
        return price_with_discount

    def __str__(self):
        return self.title


def upload_to(instance, filename):
    return "images/{filename}".format(filename=filename)


class ProductImage(models.Model):
    """
    The Product Image table.
    """

    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="product_image"
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
        return self.alt_text if self.alt_text else self.image.url


class ParentOfVariationCategory(models.Model):
    """
    This model if for filtering product
    variations. For example, if product
    have memory and color variations, you
    can filter and show only memory variations.
    """

    name = models.CharField(max_length=255, verbose_name="Name")
    slug = models.SlugField(unique=True, blank=True, null=True)

    class Meta:
        verbose_name = "variation parent category"
        verbose_name_plural = "Parents of variations categories"

    def __str__(self):
        return f"{self.name} - Parent category"

    def save(self, *args, **kwargs):
        if self._state.adding and not self.slug:
            self.slug = slugify(self.name.replace("category", ""))
        super().save(*args, **kwargs)


class VariationCategory(models.Model):
    """
    This is model of variations categories.
    For example: 'Memory 128GB'.
    """

    parent = models.ForeignKey(
        ParentOfVariationCategory,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        verbose_name="Parent",
        related_name="child_variation_categories",
    )
    name = models.CharField(
        max_length=250, verbose_name="Variation category name", unique=True
    )
    value = models.CharField(max_length=200, verbose_name="Value")
    slug = models.SlugField(unique=True, blank=True, null=True)

    class Meta:
        verbose_name = "category"
        verbose_name_plural = "Variations categories"

    def __str__(self):
        return f"Variation category: {self.name}"

    def save(self, *args, **kwargs):
        if self.slug is None or self.slug != slugify(self.name):
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class ProductVariations(models.Model):
    variation_category = models.ForeignKey(
        VariationCategory, on_delete=models.CASCADE, verbose_name="Variation category"
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        verbose_name="Product",
        blank=True,
        null=True,
        related_name="variations",
    )

    class Meta:
        verbose_name = "variation"
        verbose_name_plural = "Product variations"
        unique_together = ("product", "variation_category")

    def __str__(self):
        return f"Variation category: {self.variation_category.name}, Product: {self.product.name}"

    @property
    def variation_category_name(self):
        return self.variation_category.name

    @property
    def product_name(self):
        return self.product.name

    @property
    def product_link(self):
        return reverse("store:product_detail", args=[self.product.slug])

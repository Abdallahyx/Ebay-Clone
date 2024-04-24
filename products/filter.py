import django_filters
from .models import Product


class ProductFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(lookup_expr="icontains")
    price_gt = django_filters.NumberFilter(field_name="price", lookup_expr="gt")
    price_lt = django_filters.NumberFilter(field_name="price", lookup_expr="lt")
    store_name = django_filters.CharFilter(
        field_name="store__store_name", lookup_expr="icontains"
    )
    category_name = django_filters.CharFilter(
        field_name="category__name", lookup_expr="icontains"
    )
    discount = django_filters.BooleanFilter(method="filter_by_discount")

    class Meta:
        model = Product
        fields = [
            "title",
            "price_gt",
            "price_lt",
            "store_name",
            "category_name",
            "discount",
        ]

    def filter_by_discount(self, queryset, name, value):
        if value:
            return queryset.filter(discount__gt=0)
        return queryset.filter(discount=0)

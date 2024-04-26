from products.models import AvailabilityStatuses


def check_quantity_and_set_status(instance):
    if instance.quantity_in_stock > 25:
        return AvailabilityStatuses.in_stock[0]
    elif 25 >= instance.quantity_in_stock > 0:
        return AvailabilityStatuses.low_in_stock[0]
    elif instance.quantity_in_stock == 0:
        return AvailabilityStatuses.out_of_stock[0]

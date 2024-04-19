from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import StockItemsViewSet

router = DefaultRouter()
router.register(r"stockitems", StockItemsViewSet, basename="stockitems")

urlpatterns = [
    path("", include(router.urls)),
]

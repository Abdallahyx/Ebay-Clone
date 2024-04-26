# Generated by Django 5.0.3 on 2024-04-25 10:34

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0001_initial'),
        ('products', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderitems',
            name='product_variation',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='products.productvariation', verbose_name='Product Variation'),
            preserve_default=False,
        ),
    ]
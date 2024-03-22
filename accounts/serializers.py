from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import Seller, User, UserBalance, UserShippingInfo
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate


class ShippingInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserShippingInfo
        fields = ["address", "city", "country"]


class BuyerRegistrationSerializer(serializers.Serializer):

    username = serializers.CharField(
        required=False, validators=[UniqueValidator(queryset=User.objects.all())]
    )  # new field
    email = serializers.EmailField(
        required=True, validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={"input_type": "password"},
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={"input_type": "password"},
    )
    first_name = serializers.CharField(required=True)  # new field
    surname = serializers.CharField(required=True)  # new field
    gender = serializers.ChoiceField(
        choices=[("male", "Male"), ("female", "Female")],
        required=True,
        allow_blank=False,
        allow_null=False,
    )
    phone_number = serializers.CharField(required=True)  # new field
    shipping_info = ShippingInfoSerializer()

    def validate(self, attrs):
        if attrs["confirm_password"] != attrs["password"]:
            raise serializers.ValidationError("Password mismatch.")
        if User.objects.filter(email=attrs["email"]).exists():
            raise serializers.ValidationError("User with this email already exists!")
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        shipping_info_data = validated_data.pop("shipping_info")
        username = validated_data.pop("username", None)

        if not username:
            username = User.objects.generate_username(validated_data["email"])

        user = User.objects.create(
            username=username,
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            surname=validated_data["surname"],
            phone_number=validated_data["phone_number"],
            is_active=True,
            gender=validated_data["gender"],
        )
        user.set_password(password)
        user.save()
        UserShippingInfo.objects.create(user=user, **shipping_info_data)
        Token.objects.create(user=user)  # creating authentication token
        return user


class CompanyInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller
        fields = (
            "company_name",
            "company_address",
            "company_city",
            "company_country",
            "company_phone_number",
        )


class SellerRegistrationSerializer(serializers.Serializer):

    username = serializers.CharField(
        required=False, validators=[UniqueValidator(queryset=User.objects.all())]
    )  # new field
    email = serializers.EmailField(
        required=True, validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={"input_type": "password"},
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={"input_type": "password"},
    )
    first_name = serializers.CharField(required=True)  # new field
    surname = serializers.CharField(required=True)  # new field
    gender = serializers.ChoiceField(
        choices=[("male", "Male"), ("female", "Female")],
        required=True,
        allow_blank=False,
        allow_null=False,
    )
    phone_number = serializers.CharField(required=True)  # new field
    company_info = CompanyInfoSerializer()

    def validate(self, attrs):
        if attrs["confirm_password"] != attrs["password"]:
            raise serializers.ValidationError("Password mismatch.")
        if User.objects.filter(email=attrs["email"]).exists():
            raise serializers.ValidationError("User with this email already exists!")
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        company_info_data = validated_data.pop("company_info")
        username = validated_data.pop("username", None)

        if not username:
            username = User.objects.generate_username(validated_data["email"])

        user = User.objects.create(
            username=username,
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            surname=validated_data["surname"],
            phone_number=validated_data["phone_number"],
            is_active=True,
            gender=validated_data["gender"],
        )
        user.set_password(password)
        user.save()
        Seller.objects.create(user=user, **company_info_data)
        Token.objects.create(user=user)  # creating authentication token
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True, required=True)
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={"input_type": "password"},
    )

    def validate(self, attrs):
        user = authenticate(username=attrs["email"], password=attrs["password"])
        if user is None:
            raise serializers.ValidationError("Invalid email or password.")
        elif not user.is_active:
            raise serializers.ValidationError("This account is inactive.")
        Token.objects.update_or_create(
            user=user
        )  # creating or updating authentication token
        return attrs


class UserBalanceSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = UserBalance
        fields = ("user", "balance")


class ProfileSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        required=False, validators=[UniqueValidator(queryset=User.objects.all())]
    )
    email = serializers.EmailField(required=False, read_only=True)
    first_name = serializers.CharField(required=False)  # new field
    surname = serializers.CharField(required=False)  # new field
    gender = serializers.ChoiceField(
        choices=[("male", "Male"), ("female", "Female")],
        required=False,
    )
    phone_number = serializers.CharField(required=False)  # new field
    balance = serializers.FloatField(source="balance.balance", read_only=True)

    class Meta:
        model = User
        fields = (
            "username",
            "first_name",
            "surname",
            "email",
            "gender",
            "phone_number",
            "balance",
        )


class UserShippingInfoSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="user.full_name", read_only=True)

    class Meta:
        model = UserShippingInfo
        fields = (
            "full_name",
            "user_email",
            "user_phone_number",
            "address",
            "city",
            "country",
        )

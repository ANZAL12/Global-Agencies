from rest_framework import serializers
from .models import User

class CreatePromoterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    shop_name = serializers.CharField(max_length=255, required=False, allow_blank=True)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email already exists.")
        return value

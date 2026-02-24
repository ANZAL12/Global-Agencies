from rest_framework import serializers
from .models import SaleEntry

class SaleEntrySerializer(serializers.ModelSerializer):
    promoter_email = serializers.EmailField(source='promoter.email', read_only=True)

    class Meta:
        model = SaleEntry
        fields = [
            'id', 'promoter', 'promoter_email', 'product_name', 'bill_amount', 
            'bill_image', 'status', 'incentive_amount', 'payment_status', 'created_at'
        ]
        read_only_fields = ['id', 'promoter', 'status', 'incentive_amount', 'payment_status', 'created_at']

class SaleEntryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleEntry
        fields = ['id', 'product_name', 'bill_amount', 'bill_image']
        read_only_fields = ['id']

class SaleStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleEntry
        fields = ['status', 'incentive_amount']

    def validate(self, data):
        status = data.get('status', self.instance.status if self.instance else None)
        incentive_amount = data.get('incentive_amount', self.instance.incentive_amount if self.instance else None)

        if status == 'approved' and incentive_amount is None:
            raise serializers.ValidationError({"incentive_amount": "Incentive amount is required when approving a sale."})

        return data

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from core.permissions import IsAdminUserRole, IsPromoter
from .models import SaleEntry
from .serializers import SaleEntrySerializer, SaleEntryCreateSerializer, SaleStatusUpdateSerializer
from django.utils import timezone

class SaleCreateView(generics.CreateAPIView):
    serializer_class = SaleEntryCreateSerializer
    permission_classes = [IsPromoter]

    def perform_create(self, serializer):
        serializer.save(promoter=self.request.user)

class PromoterSaleListView(generics.ListAPIView):
    serializer_class = SaleEntrySerializer
    permission_classes = [IsPromoter]

    def get_queryset(self):
        return SaleEntry.objects.filter(promoter=self.request.user).order_by('-created_at')

class AdminSaleListView(generics.ListAPIView):
    serializer_class = SaleEntrySerializer
    permission_classes = [IsAdminUserRole]
    queryset = SaleEntry.objects.all().order_by('-created_at')

class AdminSaleApproveView(generics.UpdateAPIView):
    queryset = SaleEntry.objects.all()
    serializer_class = SaleStatusUpdateSerializer
    permission_classes = [IsAdminUserRole]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.status != 'pending':
            return Response({"detail": "Only pending sales can be approved."}, status=status.HTTP_400_BAD_REQUEST)
        
        request.data['status'] = 'approved'
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # Return full representation
        return Response(SaleEntrySerializer(instance).data)

class AdminSaleRejectView(generics.UpdateAPIView):
    queryset = SaleEntry.objects.all()
    permission_classes = [IsAdminUserRole]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.status != 'pending':
            return Response({"detail": "Only pending sales can be rejected."}, status=status.HTTP_400_BAD_REQUEST)
        
        instance.status = 'rejected'
        instance.save()
        return Response(SaleEntrySerializer(instance).data)

class AdminSaleMarkPaidView(generics.UpdateAPIView):
    queryset = SaleEntry.objects.all()
    permission_classes = [IsAdminUserRole]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.status != 'approved':
            return Response({"detail": "Only approved sales can be marked as paid."}, status=status.HTTP_400_BAD_REQUEST)
        if instance.payment_status == 'paid':
            return Response({"detail": "Sale is already marked as paid."}, status=status.HTTP_400_BAD_REQUEST)
            
        instance.payment_status = 'paid'
        instance.save()
        return Response(SaleEntrySerializer(instance).data)

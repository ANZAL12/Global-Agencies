from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class SaleEntry(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    
    PAYMENT_STATUS_CHOICES = (
        ('unpaid', 'Unpaid'),
        ('paid', 'Paid'),
    )

    promoter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sales')
    product_name = models.CharField(max_length=255)
    bill_amount = models.DecimalField(max_digits=10, decimal_places=2)
    bill_image = models.ImageField(upload_to='bills/')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    incentive_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='unpaid')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product_name} - {self.promoter.email}"

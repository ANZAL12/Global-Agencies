from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from core.permissions import IsAdminUserRole
from .models import Announcement
from .serializers import AnnouncementSerializer

class AnnouncementCreateView(generics.CreateAPIView):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAdminUserRole]

class AnnouncementListView(generics.ListAPIView):
    queryset = Announcement.objects.all().order_by('-created_at')
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAuthenticated]

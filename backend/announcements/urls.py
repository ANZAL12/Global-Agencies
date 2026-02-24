from django.urls import path
from .views import AnnouncementCreateView, AnnouncementListView

urlpatterns = [
    path('create/', AnnouncementCreateView.as_view(), name='announcement-create'),
    path('', AnnouncementListView.as_view(), name='announcement-list'),
]

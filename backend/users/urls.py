from django.urls import path
from .views import GoogleLoginView, TestProtectedView, CreatePromoterView

urlpatterns = [
    path('google-login/', GoogleLoginView.as_view(), name='google-login'),
    path('test-protected/', TestProtectedView.as_view()),
    path('admin/create-promoter/', CreatePromoterView.as_view(), name='create-promoter'),
]
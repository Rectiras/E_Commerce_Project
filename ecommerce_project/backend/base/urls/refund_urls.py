from django.urls import path
from base.views import refund_views as views 



urlpatterns = [
    path('', views.getRefunds, name="refunds"),
    path('<str:pk>/approve/', views.approveRefund, name='approve'),
]

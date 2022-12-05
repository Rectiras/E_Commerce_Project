from django.urls import path
from base.views import review_views as views 



urlpatterns = [
    path('', views.getReviews, name="reviews"),
    path('<str:pk>/approve/', views.approveReview, name='approve'),
]

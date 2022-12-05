from django.urls import path
from base.views import cart_views as views 

urlpatterns = [
    path('', views.getCartItems, name='cart'),
    path('add/', views.addCartItem, name='cart-add'),
    path('delete/', views.deleteCartItem, name='cart-delete'),
    #path('myorders/', views.getMyOrders, name='myorders'),

    
    #path('<str:pk>/deliver/', views.updateOrderToDelivered, name='order-delivered'),

    #path('<str:pk>/', views.getOrderById, name='user-order'),
    #path('<str:pk>/pay/', views.updateOrderToPaid, name='pay'),
]
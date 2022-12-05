from django.contrib import admin
from .models import Product, Review, Order, OrderItem, ShippingAddress, CartItem, Refund 

def make_refund_accepted(modeladmin, request, queryset):
    queryset.update(refund_requested=False, refund_granted=True)

make_refund_accepted.short_description = 'Update orders to refund granted'

class OrderAdmin(admin.ModelAdmin):
    list_display = ['user',
                    'paymentMethod',
                    'isDelivered',
                    
                    'refund_requested',
                    'refund_granted',
            ]
    list_display_links = [
        'user',
        
        'paymentMethod',
        
    ]
    list_filter = ['ordered',
                   'isDelivered',
                   
                   'refund_requested',
                   'refund_granted']
    search_fields = [
        'user__username',
        'ref_code'
    ]
    actions = [make_refund_accepted]

# Register your models here.

admin.site.register(Product)
admin.site.register(Review)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)
admin.site.register(CartItem)
admin.site.register(Refund)

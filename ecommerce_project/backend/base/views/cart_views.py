from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response


from base.models import Product, Order, CartItem
from base.serializers import CartSerializer

from rest_framework import status
from datetime import datetime
from django.db.models import Q

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCartItems(request): 
    user = request.user
    cartItems = CartItem.objects.filter(user_id = user.id)
    serializer = CartSerializer(cartItems, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addCartItem(request):
    user = request.user
    data = request.data
     
    product_id  = data['id']
    product_qty = data['qty']

    #print("Product id: ",product_id)
    #print("Product qty: ",product_qty)


    product = Product.objects.get(_id=product_id)

    #itemFromCart = CartItem.objects.get(product=product_id)
    item, created = CartItem.objects.update_or_create(
        product=product,
        user=user,
        defaults={
        'name':product.name,
        'qty':product_qty,
        'price':product.price,
        'discount':product.discount,
        'image':product.image.url}
        )


    serializer = CartSerializer(item, many=False)

    return Response(serializer.data)


@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def deleteCartItem(request):
    user = request.user
    data = request.data
    print(user)
    product_id  = data['id']
    #return Response(serializer.data)

    print(CartItem.objects.filter(user_id=user,product_id=product_id).delete())

    return Response('Item is deleted')


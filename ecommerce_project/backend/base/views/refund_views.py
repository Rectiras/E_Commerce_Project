from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from base.models import Product, Refund , Order
from base.serializers import ProductSerializer, RefundSerializer , OrderSerializer

from rest_framework import status
from datetime import datetime


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getRefunds(request):
    orders = Refund.objects.all()
    serializer = RefundSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
#@permission_classes([IsAdminUser])
def approveRefund(request, pk):
    review = Refund.objects.get(_id=pk)

    review.refund_granted = True
    review.save()

    return Response('Refund was approved')
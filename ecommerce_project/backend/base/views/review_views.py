from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from base.models import Product, Review
from base.serializers import ProductSerializer, ReviewSerializer

from rest_framework import status
from datetime import datetime


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getReviews(request):
    orders = Review.objects.all()
    serializer = ReviewSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
#@permission_classes([IsAdminUser])
def approveReview(request, pk):
    review = Review.objects.get(_id=pk)

    review.approved = True
    review.save()

    return Response('Review was approved')
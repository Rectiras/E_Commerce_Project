from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from base.models import CartItem
from rest_framework.response import Response

from django.contrib.auth.models import User

from base.serializers import ProductSerializer, UserSerializer, UserSerializerWithToken, CartSerializer

# Create your views here.
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth.hashers import make_password 
from rest_framework import status

import json


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        returnThis = []
        data = super().validate(attrs)
    
        serializer = UserSerializerWithToken(self.user).data

        for k, v in serializer.items():
            data[k] = v

        cartItems = CartItem.objects.filter(user_id=data['_id'])
        serializer2 = CartSerializer(cartItems, many=True)
        
        #print(type(data))
        #print("***")
        #print(serializer2.data)
        cartItems = json.dumps(serializer2.data )
        #print("xxx")
        #print(cartItems)
        data['cartItems'] = cartItems
        """for item in cartItems:
            print(item)
        print("xxxx")
        print(data)"""
        """for i in serializer2.data.size():
            data.append(serializer2.data[i])"""
        print(data)
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def registerUser(request):
    data = request.data

    if 'email' not in data or 'name' not in data or 'password' not in data:
        return Response(status= status.HTTP_400_BAD_REQUEST)

    if not data['email'] or not data['name'] or not data['password']:
        return Response(status= status.HTTP_400_BAD_REQUEST)

    try: 
        user = User.objects.create(
            first_name = data['name'],
            username = data['email'],
            email = data['email'],
            password = make_password(data['password'])
        )

        serializer = UserSerializerWithToken(user, many = False)
        return Response(serializer.data)
    except:
        message = {'detail: User with this email already exists'}
        return Response(message, status = status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)

    data = request.data
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']

    if data['password'] != '':
        user.password = make_password(data['password'])

    user.save()

    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request, pk):
    user = User.objects.get(id=pk)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUser(request, pk):
    user = User.objects.get(id=pk)

    data = request.data

    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    user.is_staff = data['isAdmin']

    user.save()

    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)
    
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    userForDeletion = User.objects.get(id=pk)
    userForDeletion.delete()
    return Response('User was deleted')

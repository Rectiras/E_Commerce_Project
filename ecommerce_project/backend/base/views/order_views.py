from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response


from base.models import Product, Order, OrderItem, ShippingAddress, CartItem
from base.serializers import ProductSerializer, OrderSerializer

from rest_framework import status
from datetime import datetime

from xhtml2pdf import pisa 
from bottle import template
import random
import string

def create_ref_code():
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=20))


def html_to_pdf(output, info,cartItems):
    """
    Generate a pdf using a string content

    Parameters
    ----------
    content : str
        content to write in the pdf file
    output  : str
        name of the file to create
    """
    # Open file to write
    result_file = open('static/images/invoices/'+output, "w+b") # w+b to write in binary mode.

    # convert HTML to PDF
    #template = open("invoices/template.html")
    #info={'name': 'Yigit'}
    html_template = '<!DOCTYPE html><html><head><meta charset="utf-8" /><title>Invoice {{id}}</title><style>.invoice-box{max-width:800px;margin:auto;padding:30px;border:1px solid #eee;box-shadow:0 0 10px rgba(0, 0, 0, 0.15);font-size:16px;line-height:24px;font-family:Helvetica,Arial,sans-serif;color:#555}.invoice-box table{width:100%;line-height:inherit;text-align:left}.invoice-box table td{padding:5px;vertical-align:top}.invoice-box table tr td:nth-child(2){text-align:right}.invoice-box table tr.top table td{padding-bottom:20px}.invoice-box table tr.top table td.title{font-size:45px;line-height:45px;color:#333}.invoice-box table tr.information table td{padding-bottom:40px}.invoice-box table tr.details td{padding-bottom:20px}.invoice-box table tr.total td:nth-child(2){border-top:2px solid #eee;font-weight:bold}.invoice-box.rtl{direction:rtl;font-family:Tahoma,Helvetica,Arial,sans-serif}.invoice-box.rtl table{text-align:right}.invoice-box.rtl table tr td:nth-child(2){text-align:left}</style></head><body><div class="invoice-box"><table cellpadding="0" cellspacing="0"><tr class="top"><td colspan="4"><table><tr><td class="title"> <img src="http://127.0.0.1:3000/static/media/sumed.5957b6fa.jpeg" style="width: 100%; max-width: 300px" /></td><td> <br/><br/><br/>Invoice #: {{id}}<br /> Date: {{date}}</tr></table></td></tr><tr class="information"><td colspan="4"><table><tr><td> Sabanci Üniversitesi Kampüsü UC 1093<br /> Orta Mah. Üniversite Cad. No.27 Orhanli <br /> Tuzla, Istanbul</td><td> {{name}}<br /> {{adress}}<br /> {{city}}</td></tr></table></td></tr>'
    html_template += '<tr class="item"><td colspan="4"><table><tr><td><strong>Product Name:</strong></td><td><strong>Quantity: </strong></td><td> <strong>Unit Price: </strong></td><td><strong>Total: </strong></td></tr></table></td></tr>'
    for cartItem in cartItems:
        html_template += '<tr class="item"><td colspan="4"><table><tr><td>'+ cartItem['productName'] +'</td><td>'+ cartItem['productQty'] +'</td><td>'+ cartItem['productPrice'] +'TL</td><td>'+ cartItem['productTotalPrice'] +'TL</td></tr></table></td></tr>'
    html_template += '<tr class="item"><td colspan="4"><table><tr><td>&nbsp;</td><td>&nbsp;</td><td></td><td>Discount: -{{discount}}TL</td></tr></table></td></tr>'
    html_template += '<tr class="total"><td colspan="4"><table><tr>&nbsp;<td></td><td>&nbsp;</td><td>&nbsp;</td><td>Total: {{total}}TL</td></tr></table></td></tr></table></div></body></html>'
    render_temp = template(html_template, info)
    pisa_status = pisa.CreatePDF(
            #content,                   # the HTML to convert
            render_temp,
            dest=result_file           # file handle to recieve result
    )           

    # close output file
    result_file.close()

    result = pisa_status.err

    if not result:
        print("Successfully created PDF")
    else:
        print("Error: unable to create the PDF")    

    # return False on success and True on errors
    return result

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    #Checks
    if "shippingAddress" not in data:
        return Response({'detail':'No Shipping Adress'}, status=status.HTTP_400_BAD_REQUEST)
    if "paymentMethod" not in data:
        return Response({'detail':'No Payment Method'}, status=status.HTTP_400_BAD_REQUEST)
    if "discountPrice" not in data:
        return Response({'detail':'No Discount Price'}, status=status.HTTP_400_BAD_REQUEST)
    if "totalPrice" not in data:
        return Response({'detail':'No Total Price'}, status=status.HTTP_400_BAD_REQUEST)
    if "orderItems" not in data:
        return Response({'detail':'No Items to Order'}, status=status.HTTP_400_BAD_REQUEST)
    orderItems = data['orderItems']

    if orderItems and len(orderItems) == 0:
        return Response({'detail':'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        # Create order

        # create pdf
        order = Order.objects.create(
            user=user,
            paymentMethod=data['paymentMethod'],
            discountPrice=data['discountPrice'],
            totalPrice=data['totalPrice'],
            #pdfURl=pdfUrl,
            createdAt = datetime.now()
        )

        # Cheks for Shipping Adress
        if "name" not in data['shippingAddress']:
            return Response({'detail':'No Name in Shipping Adress'}, status=status.HTTP_400_BAD_REQUEST)
        if "surname" not in data['shippingAddress']:
            return Response({'detail':'No Surame in Shipping Adress'}, status=status.HTTP_400_BAD_REQUEST)
        if "phoneNumber" not in data['shippingAddress']:
            return Response({'detail':'No Phone Number in Shipping Adress'}, status=status.HTTP_400_BAD_REQUEST)
        if "address" not in data['shippingAddress']:
            return Response({'detail':'No Adress in Shipping Adress'}, status=status.HTTP_400_BAD_REQUEST)
        if "city" not in data['shippingAddress']:
            return Response({'detail':'No City in Shipping Adress'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Create Shipping Adress
        shipping = ShippingAddress.objects.create(
            order=order,
            name=data['shippingAddress']['name'],
            surname=data['shippingAddress']['surname'],
            phoneNumber=data['shippingAddress']['phoneNumber'],
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
        )

        # Create order items and set order to orderItem relationship
        
        cartItems = []
        
        for i in orderItems:
            try:
                product = Product.objects.get(_id=i['product'])

                item = OrderItem.objects.create(
                    product=product,
                    order=order,
                    name=product.name,
                    qty=i['qty'],
                    price=i['price'],
                    image=product.image.url,
                )

                
                cartItems.append({
                    'productName': product.name,
                    'productQty': str(i['qty']),
                    'productPrice': str(i['price']),
                    'productTotalPrice': str(float(i['price']) * int(i['qty']))
                })

                # Update stock

                product.countInStock -= item.qty
                product.save()
            except:
                message = {'detail: Product cannot found'}
                return Response(message, status = status.HTTP_400_BAD_REQUEST)
        print(CartItem.objects.filter(user_id=user).delete())
        serializer = OrderSerializer(order, many=False)

        OUTPUT_FILENAME = "invoice"+ str(order._id) +".pdf"
        info = {
            'id'    : str(order._id),
            'date'  : datetime.today(),
            'name'  : data['shippingAddress']['name'] + " " + data['shippingAddress']['surname'],
            'adress': data['shippingAddress']['address'],
            'city'  : data['shippingAddress']['city'],
            'total' : data['totalPrice'],
            'discount':data['discountPrice']
        }
        html_to_pdf(OUTPUT_FILENAME, info, cartItems)
        
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request): 
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many = True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user

    try:
        order = Order.objects.get(_id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            Response({'detail': 'Not authorized to view this order'},
                     status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(_id=pk)

    order.isPaid = True
    order.paidAt = datetime.now()
   
    order.save()

    return Response('Order was paid')


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    order = Order.objects.get(_id=pk)

    order.isDelivered = True
    order.deliveredAt = datetime.now()
    order.save()

    return Response('Order was delivered')





@api_view(['GET'])
@permission_classes([IsAuthenticated])
def requestRefund(request, pk):
    order = Order.objects.get(_id=pk)
    order.ref_code = create_ref_code(),          
    order.save()
    return Response('Order was REFUND')
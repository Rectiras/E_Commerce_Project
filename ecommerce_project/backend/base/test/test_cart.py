from rest_framework.test import APITestCase
from django.urls import reverse
from base.models import Product
import json

class TestSetUp(APITestCase):
    def setUp(self):
        self.register_url   = reverse('register')
        self.login_url      = reverse('token_obtain_pair')
        self.orders_add_url = reverse('orders-add')
        self.cart_view_url = reverse('cart')

        self.user_data={
            'name': "ali",
            'email': "ali@gmail.com",
            'username': "ali@gmail.com",
            'password': "123456",
        }

        self.order_data ={"orderItems":[{"product":1,"name":"Mustard Sweatshirt","image":"/images/sweat_yellow.jpeg","price":"90.00","countInStock":992,"qty":1},{"product":2,"name":"Green Sweatshirt","image":"/images/sweat_green.jpeg","price":"99.00","countInStock":85,"qty":1}],"shippingAddress":{"idNumber":"1","name":"1","surname":"1","phoneNumber":"1","city":"1","address":"1"},"paymentMethod":"PayPal","itemsPrice":"189.00","discountPrice":0,"totalPrice":189}

        product = Product.objects.create(
            name="Mustard Sweatshirt",
            description="Unisex Cotton Sweatshirt",
            category="Clothing",
            slug="mustard_sweat",
            price=90.00,
            countInStock=991,
            image="sweat_yellow.jpeg",
        )
        product2 = Product.objects.create(
            name="Green Sweatshirt",
            description="Unisex Cotton",
            category="Clothing",
            slug="green_sweat",
            price=99.00,
            countInStock=991,
            image="sweat_green.jpeg",
        )

        product.save()
        product2.save()
        #res=self.client.post(self.orders_add_url,  self.order_data, format="json", HTTP_AUTHORIZATION='JWT {}'.format(token))
        #res = self.client.post(self.orders_add_url, {}, Authorization='JWT ' + token)
        #res = self.client.post(self.orders_add_url, {}, HTTP_AUTHORIZATION='JWT {}'.format(token))
        
        self.order_data ={"orderItems":[{"product":product._id,"price":"99.00","qty":1},{"product":product2._id,"price":"99.00","qty":1}],"shippingAddress":{"idNumber":"1","name":"1","surname":"1","phoneNumber":"1","city":"1","address":"1"},"paymentMethod":"PayPal","itemsPrice":"189.00","discountPrice":0,"totalPrice":189}

        return super().setUp()

   
    def test_user_can_view_cart(self):
        self.client.post(self.register_url, self.user_data, format="json")

        login1= self.client.post(self.login_url, self.user_data, format="json")

        response_content = json.loads(login1.content.decode('utf-8'))
        token = response_content["token"]


        self.client.post(self.orders_add_url, self.order_data, format="json", HTTP_AUTHORIZATION='Bearer {0}'.format(token))
        res = self.client.get(self.cart_view_url, HTTP_AUTHORIZATION='Bearer {0}'.format(token))

        self.assertEqual(res.status_code, 200)


    def tearDown(self):
        return super().tearDown()
"""from rest_framework.test import APITestCase
from django.urls import reverse
import json

class TestSetUp(APITestCase):
    def setUp(self):
        self.register_url   = reverse('register')
        self.login_url      = reverse('token_obtain_pair')
        self.product_create_url = reverse('product-create')

        self.user_data={
            'name': "ali",
            'email': "ali@gmail.com",
            'username': "ali@gmail.com",
            'password': "123456",
        }

        return super().setUp()


    def test_user_cannot_add_order_when_product_doesnt_exits(self):
        self.client.post(self.register_url, self.user_data, format="json")

        login1= self.client.post(self.login_url, self.user_data, format="json")

        response_content = json.loads(login1.content.decode('utf-8'))
        token = response_content["token"]

        res = self.client.post(self.product_create_url, self.order_data, format="json", HTTP_AUTHORIZATION='Bearer {0}'.format(token))

        ""import pdb
        pdb.set_trace()""

        self.assertEqual(res.status_code, 400)


    def tearDown(self):
        return super().tearDown()"""
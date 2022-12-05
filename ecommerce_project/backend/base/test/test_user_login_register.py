from rest_framework.test import APITestCase
from django.urls import reverse

class TestSetUp(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.login_url = reverse('token_obtain_pair')

        self.user_data={
            'name': "ali",
            'email': "ali@gmail.com",
            'username': "ali@gmail.com",
            'password': "123456",
        }

        return super().setUp()

    def test_user_cannot_register_without_any_data(self):
        res=self.client.post(self.register_url)

        self.assertEqual(res.status_code, 400)

    def test_user_cannot_register_without_email(self):
        res=self.client.post(self.register_url, {'name': self.user_data['name'], 'password':self.user_data['password'],}, format="json")

        self.assertEqual(res.status_code, 400)

    def test_user_cannot_register_without_password(self):
        res=self.client.post(self.register_url, {'name': self.user_data['name'], 'email':self.user_data['email'],}, format="json")

        self.assertEqual(res.status_code, 400)

    def test_user_cannot_register_without_name(self):
        res=self.client.post(self.register_url, {'email': self.user_data['email'], 'password':self.user_data['password'],}, format="json")

        self.assertEqual(res.status_code, 400)

    def test_user_cannot_register_with_empty_email(self):
        res=self.client.post(self.register_url, {'name': self.user_data['name'], 'email':"", 'password':self.user_data['password'],}, format="json")

        self.assertEqual(res.status_code, 400)

    def test_user_cannot_register_with_empty_password(self):
        res=self.client.post(self.register_url, {'name': self.user_data['name'], 'email':self.user_data['email'],'password':"",}, format="json")

        self.assertEqual(res.status_code, 400)

    def test_user_cannot_register_with_empty_name(self):
        res=self.client.post(self.register_url, {'name':"",'email': self.user_data['email'], 'password':self.user_data['password'],}, format="json")

        self.assertEqual(res.status_code, 400)

    def test_user_can_register(self):
        res=self.client.post(self.register_url, self.user_data, format="json")

        self.assertEqual(res.status_code, 200)

    def test_user_cannot_login_without_password(self):
        self.client.post(self.register_url, self.user_data, format="json")

        res=self.client.post(self.login_url, {'username':self.user_data['username'],}, format="json")
        self.assertEqual(res.status_code, 400)

    def test_user_cannot_login_without_username(self):
        self.client.post(self.register_url, self.user_data, format="json")

        res=self.client.post(self.login_url, {'password':self.user_data['password'],}, format="json")
        self.assertEqual(res.status_code, 400)

    def test_user_cannot_login_with_wrong_username(self):
        self.client.post(self.register_url, self.user_data, format="json")

        res=self.client.post(self.login_url, {'username':"000",'password':self.user_data['password'],}, format="json")
        self.assertEqual(res.status_code, 401)

    def test_user_cannot_login_with_wrong_password(self):
        self.client.post(self.register_url, self.user_data, format="json")

        res=self.client.post(self.login_url, {'username':self.user_data['username'],'password':"000",}, format="json")
        self.assertEqual(res.status_code, 401)

    def test_user_can_login(self):
        self.client.post(self.register_url, self.user_data, format="json")

        res=self.client.post(self.login_url, self.user_data, format="json")
        
        self.assertEqual(res.status_code, 200)

    def tearDown(self):
        return super().tearDown()
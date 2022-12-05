import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../App';
import RegisterScreen from './registerScreen';
import {styles} from './styles';
import {Container, Header, Form, Item, Input, Button} from 'native-base';
import {routes} from './routes';

function LogInScreen({navigation}) {
  const {logIn, newUser} = React.useContext(AuthContext);
  const [loginStat, setLoginStat] = useState(false);

  //for email
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [message, setMessage] = useState('');

  //const[cartItems, setCartItems] = useState(JSON.stringify(''));

  useEffect(() => {
    getLoginStat('isLoggedIn');
  }, []);

  function getLoginStat(item) {
    AsyncStorage.getItem(item)
      .then(stat => {
        setLoginStat(JSON.parse(stat));

        console.log('Get login stat ', JSON.parse(stat));
        //console.log(typeof JSON.parse(stat));
      })
      .catch(e => {
        console.log('ERR', e);
      });
  }

  const login = async () => {
    if (email !== '' && password !== '') {
      //alert('Thank you for logging in');
      await fetch(routes.api + '/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Vary: 'Accept',
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      })
        .then(response => {
          const statusCode = response.status;
          const data = response.json();

          return Promise.all([statusCode, data]);
        })
        .then(data => {
          //console.log('statusCode: ', data[0]);
          //console.log('data: ', data[1]);
          //console.log(JSON.stringify(data));

          const jsonValue = JSON.stringify(true);
          const userToken = data[1].token;
          console.log(JSON.stringify(data[1].cartItems));
          const cartItems = data[1].cartItems;

          console.log(cartItems);

          if (data[0] == 200) {
            AsyncStorage.setItem('userToken', userToken).then(() => {
              console.log('Login token :', userToken);
            });
            AsyncStorage.setItem('userCart', cartItems).then(() => {
              console.log('User Cart :', cartItems);
            });
            AsyncStorage.setItem('isLoggedIn', jsonValue).then(() => {
              logIn();
              navigation.navigate('ProductsScreen');
            });
          } else {
            setMessage('Wrong username or password.');
          }
        })
        .catch(error => {
          console.error(error);
        });
    }

    if (email !== '') {
      //alert(email);
      setEmailError('');
    } else {
      setEmailError('Your username should not be empty!');
    }

    if (password !== '') {
      //alert(password);
      setPasswordError('');
    } else {
      setPasswordError('Your password should not be empty!');
    }
  };

  function renderEmailTextInput() {
    return (
      <Item style={{marginTop: 10}}>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={email => setEmail(email)}
          onChange={() => setEmailError('')}
        />
      </Item>
    );
  }

  function renderPasswordTextInput() {
    return (
      <Item style={{marginTop: 20}}>
        <Input
          placeholder="Password"
          value={password}
          onChangeText={password => setPassword(password)}
          onChange={() => setPasswordError('')}
          secureTextEntry={true}
        />
      </Item>
    );
  }

  function onRegisterPressed() {
    const jsonValue = JSON.stringify(true);
    AsyncStorage.setItem('isRegistered', jsonValue).then(() => {
      navigation.navigate('RegisterScreen');
    });
  }

  function renderLogInButton() {
    return (
      <Button block style={styles.loginButtonStyle} onPress={login}>
        <Text style={{textAlign: 'center', fontSize: 20, color: '#FFFF'}}>
          LOGIN
        </Text>
      </Button>
    );
  }

  function renderRegisterButton() {
    return (
      <Button block style={styles.loginButtonStyle} onPress={onRegisterPressed}>
        <Text style={{textAlign: 'center', fontSize: 20, color: '#FFFF'}}>
          REGISTER
        </Text>
      </Button>
    );
  }

  const onContinuePressed = () => {
    const jsonValue = JSON.stringify(false);
    AsyncStorage.setItem('isLoggedIn', jsonValue).then(() => {
      newUser();
      navigation.navigate('ProductsScreen');
    });
  };

  return (
    <Container style={{backgroundColor: 'white'}}>
      <ScrollView>
        <Header style={{backgroundColor: '#343a40'}}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 25,
              color: '#FFFF',
              paddingTop: 8,
            }}>
            SU GIFTSHOP
          </Text>
        </Header>

        <Form style={{alignItems: 'center', justifyContent: 'center'}}>
          <View style={{alignItems: 'center', margin: 30}}>
            <Image
              source={require('./images/sumed_logo.jpg')}
              style={{width: 370, height: 150, marginTop: 20}}
            />
            <Text style={{marginTop: 15, fontSize: 15, color: 'red'}}>
              {message}
            </Text>
          </View>

          <View>
            {renderEmailTextInput()}
            <Text style={{color: 'red', marginLeft: 20}}>{emailError}</Text>
            {renderPasswordTextInput()}
            <Text style={{color: 'red', marginLeft: 20, marginBottom: 10}}>
              {passwordError}
            </Text>
            {renderLogInButton()}
            {renderRegisterButton()}

            <Text
              style={{
                marginTop: 8,
                color: '#757575',
                fontSize: 20,
                textAlign: 'center',
                textDecorationLine: 'underline',
              }}
              onPress={onContinuePressed}>
              Continue as a Guest
            </Text>
          </View>
        </Form>
      </ScrollView>
    </Container>
  );
}

export default LogInScreen;

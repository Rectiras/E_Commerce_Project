import {ScrollView, View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../App';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {styles} from './styles';
import {Container, Header, Form, Item, Input, Button} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import ShippingAddressScreen from './ShippingAddressScreen';
import {routes} from './routes';

function AccountEdit({navigation}) {
  const {register} = React.useContext(AuthContext);
  const {logIn} = React.useContext(AuthContext);

  //for name
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  //for email
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  //for password
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  //for password confirm
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [message, setMessage] = useState('');

  const onBackPressed = () => {
    navigation.navigate('ProfileScreen');
  };

  function Update() {
    if (email !== '' && password !== '' && password === confirmPassword) {
      AsyncStorage.getItem('userToken').then(token => {
        let tkn = JSON.stringify(token);

        tkn = tkn.replace(/"/g, '');
        tkn = 'Bearer ' + tkn;

        //console.log('token: ', tkn);
        fetch(routes.api + '/users/profile/update/', {
          method: 'POST',
          headers: {
            //'Accept': 'application/json',
            'Content-Type': 'application/json',
            Vary: 'Accept',
            Authorization: tkn,
          },
          body: JSON.stringify({
            name: name,
            email: email,
            password: password,
          }),
        })
          .then(res => res.json())
          .then(resData => {
            //alert(resData.message);
            setMessage(resData.code);
            console.log(resData);
            register();
            navigation.navigate('LogInScreen');
          })
          .catch(error => {
            console.error(error);
          });
      });
    }
  }

  function onUpdatePressed() {
    navigation.navigate('');
  }

  function onProceedToCheckoutPressed() {
    return undefined;
  }

  function renderProceedToCheckoutButton() {
    return (
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() => onProceedToCheckoutPressed()}>
        <Text style={styles.buttonTextStyle}>Proceed To Checkout</Text>
      </TouchableOpacity>
    );
  }

  function renderNameTextInput() {
    return (
      <Item style={{marginTop: 20}}>
        <Input
          placeholder="Name"
          value={name}
          onChangeText={name => setName(name)}
          onChange={() => setNameError('')}
        />
      </Item>
    );
  }

  function renderEmailTextInput() {
    return (
      <Item style={{marginTop: 20}}>
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

  function renderConfirmPasswordTextInput() {
    return (
      <Item style={{marginTop: 20}}>
        <Input
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={confirmPassword => setConfirmPassword(confirmPassword)}
          onChange={() => setConfirmPasswordError('')}
          secureTextEntry={true}
        />
      </Item>
    );
  }

  function renderUpdateButton() {
    return (
      <Button
        block
        style={[styles.loginButtonStyle, {marginTop: 20}]}
        onPress={Update}>
        <Text style={{textAlign: 'center', fontSize: 20, color: '#FFFF'}}>
          UPDATE
        </Text>
      </Button>
    );
  }

  return (
    <Container style={{backgroundColor: 'white'}}>
      <Header
        style={{
          flexDirection: 'row',
          backgroundColor: '#343a40',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Icon.Button
          name="chevron-left"
          backgroundColor="#343a40"
          onPress={() => onBackPressed()}
        />

        <Text
          style={{textAlign: 'center', fontSize: 25, color: '#FFFF'}}
          onPress={onBackPressed}>
          PROFILE
        </Text>

        <Text> </Text>
      </Header>

      <ScrollView>
        <Form style={{alignItems: 'center', justifyContent: 'center'}}>
          <View style={{alignItems: 'center', margin: 20}} />

          <View>
            {renderNameTextInput()}
            <Text style={{color: 'red', marginLeft: 20}}>{emailError}</Text>
            {renderEmailTextInput()}
            <Text style={{color: 'red', marginLeft: 20}}>{emailError}</Text>
            {renderPasswordTextInput()}
            <Text style={{color: 'red', marginLeft: 20}}>{passwordError}</Text>
            {renderConfirmPasswordTextInput()}
            <Text style={{color: 'red', marginLeft: 20}}>
              {confirmPasswordError}
            </Text>
            {renderUpdateButton()}
          </View>
        </Form>
      </ScrollView>
    </Container>
  );
}

export default AccountEdit;

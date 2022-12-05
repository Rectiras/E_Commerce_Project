import React, {useState} from 'react';
import {View, Text, ScrollView, Image} from 'react-native';
import {AuthContext} from '../App';
import {styles} from './styles';
import {Container, Header, Form, Item, Input, Button} from 'native-base';
import {routes} from './routes';

function registerScreen({navigation}) {
  const {register} = React.useContext(AuthContext);
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

  const Register = async () => {
    if (email !== '' && password !== '' && password === confirmPassword) {
      //alert('Thank you for logging in');
      await fetch(routes.api + '/users/register/', {
        method: 'POST',
        headers: {
          //'Accept': 'application/json',
          'Content-Type': 'application/json',
          Vary: 'Accept',
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
    }

    if (name !== '') {
      //alert(email);
      setNameError('');
    } else {
      setNameError('Email should not be empty');
    }

    if (email !== '') {
      //alert(email);
      setEmailError('');
    } else {
      setEmailError('Email should not be empty');
    }

    if (password !== '') {
      //alert(password);
      alert('Successfully registered, please login to continue.');
      setPasswordError('');
    } else {
      setPasswordError('Your password should not be empty!');
    }

    if (password === confirmPassword) {
      setConfirmPasswordError('');
    } else {
      alert('Passwords do not match!');
      setConfirmPasswordError('Passwords do not match!');
    }
  };

  const haveAccount = () => {
    navigation.navigate('LogInScreen');
  };

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

  function renderRegisterButton() {
    return (
      <Button
        block
        style={[styles.loginButtonStyle, {marginTop: 20}]}
        onPress={Register}>
        <Text style={{textAlign: 'center', fontSize: 20, color: '#FFFF'}}>
          REGISTER
        </Text>
      </Button>
    );
  }

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
            REGISTER
          </Text>
        </Header>

        <View style={{alignItems: 'center', marginTop: 30}}>
          <Image
            source={require('./images/sumed_logo.jpg')}
            style={{width: 270, height: 100}}
          />
        </View>

        <Form style={{alignItems: 'center', justifyContent: 'center'}}>
          <View style={{alignItems: 'center', margin: 20}} />

          <View>
            {renderNameTextInput()}
            <Text style={{color: 'red', marginLeft: 20}}>{nameError}</Text>
            {renderEmailTextInput()}
            <Text style={{color: 'red', marginLeft: 20}}>{emailError}</Text>
            {renderPasswordTextInput()}
            <Text style={{color: 'red', marginLeft: 20}}>{passwordError}</Text>
            {renderConfirmPasswordTextInput()}
            <Text style={{color: 'red', marginLeft: 20}}>
              {confirmPasswordError}
            </Text>
            {renderRegisterButton()}
            <Text
              style={{
                marginTop: 8,
                color: '#757575',
                fontSize: 20,
                textAlign: 'center',
                textDecorationLine: 'underline',
              }}
              onPress={haveAccount}>
              Have an Account? Login
            </Text>
          </View>
        </Form>
      </ScrollView>
    </Container>
  );
}

export default registerScreen;

import {ScrollView, View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../App';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {styles} from './styles';
import {
  Container,
  Header,
  Content,
  Title,
  Form,
  Item,
  Input,
  Button,
  Picker,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Payment from './Payment';
import {useFocusEffect} from '@react-navigation/native';

function ShippingAddressScreen({navigation, route}) {
  const {itemsPrice} = route.params;
  const {discountPrice} = route.params;
  const {totalPrice} = route.params;

  const [idNumber, setIdNumber] = useState('');
  const [idNumberError, setIdNumberError] = useState('');

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  const [surname, setSurname] = useState('');
  const [surnameError, setSurnameError] = useState('');

  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');

  const [city, setCity] = useState('');
  const [cityError, setCityError] = useState('');

  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');

  const [shippingInfo, setShippingInfo] = useState('');

  const onBackPressed = () => {
    navigation.navigate('Cart');
  };

  function onContinuePressed() {
    if (
      idNumber !== '' &&
      name !== '' &&
      surname !== '' &&
      phoneNumber !== '' &&
      city !== '' &&
      address !== ''
    ) {
      console.log(idNumber);
      let data = [idNumber, name, surname, phoneNumber, city, address];
      var keys = [
        'idNumber',
        'name',
        'surname',
        'phoneNumber',
        'city',
        'address',
      ];
      let arrayToString = JSON.stringify(Object.assign({}, data));
      let stringToJsonObject = JSON.parse(arrayToString);
      console.log(stringToJsonObject);
      setShippingInfo(stringToJsonObject);

      //console.log(shippingInfo);
      navigation.navigate('Payment', {
        shippingInfo: stringToJsonObject,
        itemsPrice: itemsPrice,
        discountPrice: discountPrice,
        totalPrice: totalPrice,
      });
    }

    if (idNumber !== '') {
      setIdNumberError('');
    } else {
      setIdNumberError('Your TC NO. should not be empty!');
    }
    if (name !== '') {
      setNameError('');
    } else {
      setNameError('Your name should not be empty!');
    }
    if (surname !== '') {
      setSurnameError('');
    } else {
      setSurnameError('Your username should not be empty!');
    }
    if (phoneNumber !== '') {
      setPhoneNumberError('');
    } else {
      setPhoneNumberError('Your username should not be empty!');
    }
    if (city !== '') {
      setCityError('');
    } else {
      setCityError('Your username should not be empty!');
    }
    if (address !== '') {
      setAddressError('');
    } else {
      setAddressError('Your username should not be empty!');
    }
  }

  function renderContinueButton() {
    return (
      <Button
        block
        style={styles.loginButtonStyle}
        onPress={() => onContinuePressed()}>
        <Text style={{textAlign: 'center', fontSize: 20, color: '#FFFF'}}>
          Continue
        </Text>
      </Button>
    );
  }

  function renderTCTextInput() {
    return (
      <Item style={{marginTop: 20}}>
        <Input
          placeholder="Enter Your TC Identity Number"
          value={idNumber}
          onChangeText={idNumber => setIdNumber(idNumber)}
          onChange={() => setIdNumberError('')}
        />
      </Item>
    );
  }

  function renderNameTextInput() {
    return (
      <Item style={{marginTop: 20}}>
        <Input
          placeholder="Enter Your Name"
          value={name}
          onChangeText={name => setName(name)}
          onChange={() => setNameError('')}
        />
      </Item>
    );
  }

  function renderSurnameTextInput() {
    return (
      <Item style={{marginTop: 20}}>
        <Input
          placeholder="Enter Your Surname"
          value={surname}
          onChangeText={surname => setSurname(surname)}
          onChange={() => setSurnameError('')}
        />
      </Item>
    );
  }

  function renderPhoneNumberTextInput() {
    return (
      <Item style={{marginTop: 20}}>
        <Input
          placeholder="(5XX) XXX XX XX"
          value={phoneNumber}
          onChangeText={phoneNumber => setPhoneNumber(phoneNumber)}
          onChange={() => setPhoneNumberError('')}
        />
      </Item>
    );
  }

  function renderCityTextInput() {
    return (
      <Item style={{marginTop: 20}}>
        <Input
          placeholder="Enter City"
          value={city}
          onChangeText={city => setCity(city)}
          onChange={() => setCityError('')}
        />
      </Item>
    );
  }

  function renderAddressTextInput() {
    return (
      <Item style={{marginTop: 20}}>
        <Input
          placeholder="Enter Address"
          value={address}
          onChangeText={address => setAddress(address)}
          onChange={() => setAddressError('')}
        />
      </Item>
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
          SHIPPING INFO
        </Text>

        <Text> </Text>
      </Header>
      <ScrollView>
        <Form style={{alignItems: 'center', justifyContent: 'center'}}>
          <View style={{alignItems: 'center', margin: 20}} />

          <View>
            {renderTCTextInput()}
            <Text style={{color: 'red', marginLeft: 20}}>{idNumberError}</Text>
            {renderNameTextInput()}
            <Text style={{color: 'red', marginLeft: 20}}>{nameError}</Text>
            {renderSurnameTextInput()}
            <Text style={{color: 'red', marginLeft: 20}}>{surnameError}</Text>
            {renderPhoneNumberTextInput()}
            <Text style={{color: 'red', marginLeft: 20}}>
              {phoneNumberError}
            </Text>
            {renderCityTextInput()}
            <Text style={{color: 'red', marginLeft: 20}}>{cityError}</Text>
            {renderAddressTextInput()}
            <Text style={{color: 'red', marginLeft: 20}}>{addressError}</Text>
            {renderContinueButton()}
          </View>
        </Form>
      </ScrollView>
    </Container>
  );
}

export default ShippingAddressScreen;

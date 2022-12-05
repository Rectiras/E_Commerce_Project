import {ScrollView, View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../App';
import {styles} from './styles';
import {Container, Header, Button} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {CheckBox} from 'react-native-elements';
import PlaceOrderScreen from './PlaceOrderScreen';
import {useFocusEffect} from '@react-navigation/native';

function Payment({navigation, route}) {
  const {shippingInfo} = route.params;
  const {itemsPrice} = route.params;
  const {discountPrice} = route.params;
  const {totalPrice} = route.params;

  useFocusEffect(
    React.useCallback(() => {
      console.log(shippingInfo);
    }, []),
  );

  const onBackPressed = () => {
    navigation.navigate('ShippingAddressScreen');
  };

  function onContinuePressed() {
    navigation.navigate('PlaceOrderScreen', {
      shippingInfo: JSON.stringify(shippingInfo),
      itemsPrice: itemsPrice,
      discountPrice: discountPrice,
      totalPrice: totalPrice,
    });
  }

  function renderContinueButton() {
    return (
      <Button block style={styles.buttonStyle} onPress={onContinuePressed}>
        <Text style={{textAlign: 'center', fontSize: 20, color: '#FFFF'}}>
          Continue
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
          PAYMENT INFO
        </Text>

        <Text> </Text>
      </Header>

      <ScrollView>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              margin: 20,
              textAlign: 'left',
              fontSize: 25,
              color: '#343a40',
            }}>
            Select Method
          </Text>
          <CheckBox
            containerStyle={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }}
            center
            title="Paypal or Credit Card"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checkedColor="#343a40"
            value="isSelected"
            onValueChanged="setSelection"
            checked
          />

          {renderContinueButton()}
        </View>
      </ScrollView>
    </Container>
  );
}

export default Payment;

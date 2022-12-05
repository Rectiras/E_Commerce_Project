import React from 'react';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  messageStyle: {
    fontSize: 20,
    backgroundColor: '#b2ddeb',
    paddingHorizontal: 100,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
  },

  defaultTextInputStyle: {
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
    marginLeft: 16,
    marginRight: 16,
    fontSize: 16,
    paddingLeft: 12,
  },

  buttonStyle: {
    height: 48,
    borderWidth: 1,
    borderRadius: 16,
    margin: 16,
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: '#343a40',
    borderColor: '#343a40',
  },

  loginButtonStyle: {
    width: 380,
    height: 48,
    borderWidth: 1,
    borderRadius: 16,
    margin: 8,
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#343a40',
    borderColor: '#343a40',
  },

  buttonTextStyle: {
    textAlign: 'center',
    fontSize: 20,
    color: '#FFFF',
  },

  orderTextStyle: {
    textAlign: 'left',
    fontSize: 15,
    color: '#343a40',
    marginBottom: 8,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },

  ordersTextStyle2: {
    textAlign: 'left',
    fontSize: 15,
    color: '#343a40',
    marginBottom: 8,
  },

  smallBlackButtonStyle: {
    alignSelf: 'center',
    height: 35,
    width: 100,
    borderWidth: 1,
    borderRadius: 5,
    margin: 8,
    marginBottom: 25,
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: 'black',
    borderColor: '#343a40',
  },

  orderSummaryStyle: {
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'column',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#343a40',
    padding: 8,
  },

  shippingInfoTextStyle: {textAlign: 'left', fontSize: 25, color: '#343a40'},

  detailsTextStyle: {
    textAlign: 'left',
    fontSize: 15,
    marginBottom: 8,
  },

  productInfoImageStyle: {
    margin: 8,
    height: 350,
    width: 350,
    resizeMode: 'contain',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'transparent',
  },
});

export {styles};

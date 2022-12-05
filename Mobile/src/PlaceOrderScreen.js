import {ScrollView, View, Text, FlatList, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../App';
import {styles} from './styles';
import {Container, Header, Item, Button} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useFocusEffect} from '@react-navigation/native';
import {routes} from './routes';

const OrderItem = ({item}) => (
  <Item
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      margin: 6,
      marginBottom: 2,
    }}>
    <Image
      style={{
        height: 60,
        width: 60,
        resizeMode: 'contain',
        borderWidth: 1,
        borderRadius: 16,
        borderColor: 'transparent',
        marginTop: 8,
        marginBottom: 2,
        marginHorizontal: 30,
      }}
      source={{
        uri: routes.home + item.image,
      }}
    />
    <Item
      style={{
        borderColor: 'white',
        flexDirection: 'column',
        marginHorizontal: 30,
      }}>
      <Text>{item.name}</Text>
      {item.discount !== 0 ? (
        <View style={{alignItems: 'flex-end'}}>
          <Text>
            {item.qty} x{' '}
            {((item.price * (100 - item.discount)) / 100).toFixed(2)} ={' '}
            {(item.qty * ((item.price * (100 - item.discount)) / 100)).toFixed(
              2,
            ) + ' ₺ '}
          </Text>
          <Text
            style={{
              textDecorationLine: 'line-through',
              color: 'grey',
            }}>
            {item.qty} x {item.price} ={' '}
            {(item.qty * item.price).toFixed(2) + ' ₺ '}
          </Text>
        </View>
      ) : (
        <Item style={{borderColor: 'white'}}>
          <Text>
            {item.qty} x {item.price} = {(item.qty * item.price).toFixed(2)} ₺
          </Text>
        </Item>
      )}
    </Item>
  </Item>
);

function PlaceOrderScreen({navigation, route}) {
  const {shippingInfo} = route.params;

  const {itemsPrice} = route.params;
  const {discountPrice} = route.params;
  const {totalPrice} = route.params;

  const [productList, setProductList] = useState([]);
  const [listLength, setListLength] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('paypal');

  const shipping = shippingAddressSerializer(JSON.parse(shippingInfo));

  useFocusEffect(
    React.useCallback(() => {
      getCartItems();
    }, [productList]),
  );

  function shippingAddressSerializer(address) {
    let data = {
      idNumber: address[0],
      name: address[1],
      surname: address[2],
      phoneNumber: address[3],
      city: address[4],
      address: address[5],
    };
    //console.log(data);
    return data;
  }

  const onBackPressed = () => {
    navigation.navigate('Payment');
  };

  function getCartItems() {
    AsyncStorage.getItem('userToken')
      .then(token => {
        let tkn = JSON.stringify(token);

        tkn = tkn.replace(/"/g, '');
        tkn = 'Bearer ' + tkn;

        //console.log('token: ', tkn);
        fetch(routes.api + '/cart/', {
          method: 'GET',
          headers: {
            Authorization: tkn,
          },
        })
          .then(response => response.json())
          .then(json => {
            setProductList(json);
            setListLength(json.length);
            console.log('CartItems:', json);
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(e => {
        console.log('ERR', e);
      });
  }

    function placeOrder() {
        AsyncStorage.getItem('userToken')
            .then(token => {
                let tkn = JSON.stringify(token);

                tkn = tkn.replace(/"/g, '');
                tkn = 'Bearer ' + tkn;

                console.log('prodList:', productList);
                //console.log('shipping:', shipping);
                console.log('token: ', tkn);

                fetch(routes.api + '/orders/add/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: tkn,
                    },
                    body: JSON.stringify({
                        shippingAddress: shipping,
                        orderItems: productList,
                        paymentMethod: paymentMethod,
                        itemsPrice: itemsPrice,
                        discountPrice: discountPrice,
                        totalPrice: totalPrice,
                    }),
                })
                    .then(response => {
                        const json = response.json();
                        const statusCode = response.status;
                        console.log(statusCode);
                        return json;
                    })
                    .then(json => {
                        console.log(json);
                        navigation.navigate('OrderScreen', {itemId: json._id});
                    })
                    .catch(error => {
                        console.error(error);
                    });
            })
            .catch(e => {
                console.log('ERR', e);
            });
    }

  function onContinuePressed() {
    placeOrder();
    //navigation.navigate('OrderScreen');
  }
  function renderContinueButton() {
    return (
      <Button block style={styles.buttonStyle} onPress={onContinuePressed}>
        <Text style={{textAlign: 'center', fontSize: 20, color: '#FFFF'}}>
          PLACE ORDER
        </Text>
      </Button>
    );
  }

  const renderOrderItem = ({item}) => <OrderItem item={item} />;

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
          CHECKOUT
        </Text>

        <Text> </Text>
      </Header>

      <ScrollView>
        <Item style={{margin: 12, flexDirection: 'column'}}>
          <Text style={{textAlign: 'left', fontSize: 25, color: '#343a40'}}>
            SHIPPING
          </Text>
          <Text
            style={{
              textAlign: 'left',
              fontSize: 15,
              color: '#343a40',
              marginBottom: 8,
            }}>
            Shipping Information: {shipping.name + ' ' + shipping.surname}
          </Text>
          <Text
            style={{
              textAlign: 'left',
              fontSize: 15,
              color: '#343a40',
              marginBottom: 8,
            }}>
            {' '}
            {shipping.city + ', ' + shipping.address}{' '}
          </Text>
        </Item>
        <Item style={{margin: 12, flexDirection: 'column'}}>
          <Text style={{textAlign: 'left', fontSize: 25, color: '#343a40'}}>
            PAYMENT METHOD
          </Text>
          <Text
            style={{
              textAlign: 'left',
              fontSize: 15,
              color: '#343a40',
              marginBottom: 8,
            }}>
            Method: {paymentMethod}
          </Text>
        </Item>
        <Item style={{margin: 12, flexDirection: 'column'}}>
          <Text
            style={{
              textAlign: 'left',
              fontSize: 25,
              color: '#343a40',
              marginBottom: 8,
            }}>
            ORDER ITEMS
          </Text>
          <FlatList
            data={productList}
            renderItem={renderOrderItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            style={{height: 81 * listLength, flexGrow: 0}}
          />
        </Item>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 25,
            color: '#343a40',
            marginTop: 8,
          }}>
          ORDER SUMMARY
        </Text>
        <View
          style={{
            marginHorizontal: 16,
            marginVertical: 8,
            flexDirection: 'column',
            borderWidth: 1,
            borderRadius: 5,
            borderColor: '#343a40',
            padding: 8,
          }}>
          <Text
            style={{
              textAlign: 'left',
              fontSize: 15,
              color: '#343a40',
              marginBottom: 8,
            }}>
            Items: {itemsPrice} ₺
          </Text>
          <Text
            style={{
              textAlign: 'left',
              fontSize: 15,
              color: '#343a40',
              marginBottom: 8,
            }}>
            Discount: {discountPrice} ₺
          </Text>
          <Text
            style={{
              textAlign: 'left',
              fontSize: 15,
              color: '#343a40',
              marginBottom: 8,
            }}>
            Shipping: FREE
          </Text>
          <Text style={{textAlign: 'left', fontSize: 15, color: '#343a40'}}>
            Total: {totalPrice} ₺
          </Text>
        </View>

        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          {renderContinueButton()}
        </View>
      </ScrollView>
    </Container>
  );
}

export default PlaceOrderScreen;

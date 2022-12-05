import {ScrollView, View, Text, FlatList, Image} from 'react-native';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {styles} from './styles';
import {Container, Header, Item, Button} from 'native-base';
import {useFocusEffect} from '@react-navigation/native';
import {routes} from './routes';
import SplashScreen from './SplashScreen';

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
      <Text>
        {item.qty} X {item.price} ₺ = {item.qty * item.price} ₺
      </Text>
    </Item>
  </Item>
);

function OrderScreen({navigation, route}) {
  const {itemId} = route.params;
  const [order, setOrder] = useState('');
  const [usrToken, setUsrToken] = useState('');
  const [listLength, setListLength] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      getUserToken();
    }, []),
  );

  function getUserToken() {
    AsyncStorage.getItem('userToken')
      .then(token => {
        let tkn = token;

        tkn = tkn.replace(/"/g, '');
        tkn = 'Bearer ' + tkn;

        setUsrToken(tkn);
        console.log('token: ', usrToken);
        getUser(tkn);
      })
      .catch(e => {
        console.log('ERR', e);
      });
  }

  const getUser = token => {
    return fetch(routes.api + '/orders/' + itemId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Vary: 'Accept',
        Authorization: token,
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setOrder(data);
        setListLength(data.orderItems.length);

        console.log('Order: ', order);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const onBackPressed = () => {
    navigation.navigate('ProductsScreen');
  };

  function onContinuePressed() {
    navigation.navigate('ProductsScreen');
  }

  function renderContinueButton() {
    return (
      <Button block style={styles.buttonStyle} onPress={onContinuePressed}>
        <Text style={{textAlign: 'center', fontSize: 20, color: '#FFFF'}}>
          CONTINUE SHOPPING
        </Text>
      </Button>
    );
  }

  const renderOrderItem = ({item}) => <OrderItem item={item} />;

  if (order) {
    return (
      <Container style={{backgroundColor: 'white'}}>
        <Header style={{backgroundColor: '#343a40', alignItems: 'center'}}>
          <Text
            style={{textAlign: 'center', fontSize: 25, color: '#FFFF'}}
            onPress={onBackPressed}>
            ORDER NO: {itemId}
          </Text>
        </Header>

        <ScrollView>
          <View
            style={{
              flexDirection: 'column',
              margin: 8,
              borderColor: '#343a40',
              borderRadius: 13,
              alignItems: 'center',
            }}>
            <Item
              style={{
                margin: 12,
                flexDirection: 'column',
                marginTop: 20,
                borderColor: 'white',
                borderRadius: 13,
              }}>
              <Text style={styles.shippingInfoTextStyle}>SHIPPING INFO</Text>
              <Text style={styles.detailsTextStyle}>
                Name: {order.user.name}
              </Text>
              <Text style={styles.detailsTextStyle}>
                Email: {order.user.email}{' '}
              </Text>
              <Text style={styles.detailsTextStyle}>
                Shipping Information: {order.shippingAddress.name}{' '}
                {order.shippingAddress.surname}{' '}
              </Text>
              <Text style={styles.detailsTextStyle}>
                {order.shippingAddress.address}, {order.shippingAddress.city}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  backgroundColor: '#ffff99',
                  paddingHorizontal: 80,
                  paddingVertical: 10,
                  borderRadius: 8,
                  marginBottom: 20,
                }}>
                {' '}
                {order.isDelivered ? 'Delivered' : 'On the Way'}
              </Text>
            </Item>
            <Item
              style={{
                margin: 12,
                flexDirection: 'column',
                borderColor: 'white',
                borderRadius: 13,
              }}>
              <Text style={styles.shippingInfoTextStyle}>PAYMENT METHOD </Text>
              <Text style={styles.detailsTextStyle}>
                Method: {order.paymentMethod}{' '}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  backgroundColor: '#ffff99',
                  paddingHorizontal: 80,
                  paddingVertical: 10,
                  borderRadius: 8,
                  marginBottom: 20,
                }}>
                {' '}
                {order.isPaid ? 'Paid' : 'Not Paid'}
              </Text>

              <Text
                style={[
                  styles.detailsTextStyle,
                  {textDecorationLine: 'underline', marginTop: 5},
                ]}
                onPress={() => {
                  navigation.navigate('invoice');
                }}>
                Click for PDF Invoice
              </Text>
            </Item>
            <Item
              style={{
                margin: 12,
                flexDirection: 'column',
                borderColor: 'white',
                borderRadius: 13,
              }}>
              <Text style={styles.shippingInfoTextStyle}>ORDER ITEMS</Text>

              <FlatList
                data={order.orderItems}
                renderItem={renderOrderItem}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                style={{height: 80 * listLength, flexGrow: 0}}
              />
            </Item>
            <View>
              <Text style={styles.shippingInfoTextStyle}>ORDER SUMMARY</Text>
            </View>

            <View style={styles.orderSummaryStyle}>
              <Text style={styles.ordersTextStyle2}>
                Items:{' '}
                {(
                  parseFloat(order.totalPrice) + parseFloat(order.discountPrice)
                ).toFixed(2)}{' '}
                ₺{' '}
              </Text>
              <Text style={styles.ordersTextStyle2}>
                Discount: {order.discountPrice} ₺{' '}
              </Text>
              <Text style={styles.ordersTextStyle2}>Shipping: FREE</Text>
              <Text style={styles.ordersTextStyle2}>
                Total: {order.totalPrice} ₺
              </Text>
            </View>
          </View>
        </ScrollView>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          {renderContinueButton()}
        </View>
      </Container>
    );
  } else {
    return SplashScreen();
  }
}

export default OrderScreen;

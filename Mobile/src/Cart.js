import {SafeAreaView, View, Text, FlatList, Image} from 'react-native';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {styles} from './styles';
import {Container, Header, Item} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import ShippingAddressScreen from './ShippingAddressScreen';
import {routes} from './routes';
import {useFocusEffect} from '@react-navigation/native';
import NumericInput from 'react-native-numeric-input';
import SplashScreen from './SplashScreen';

const Product = ({product, count, updateCount, deleteItem}) => (
  <Item
    style={{
      flexDirection: 'row',
      borderWidth: 1,
      borderRadius: 16,
      alignItems: 'center',
    }}>
    <Image
      style={{
        flexDirection: 'column',
        height: 100,
        width: 100,
        resizeMode: 'contain',
        borderWidth: 1,
        borderRadius: 35,
        borderColor: 'transparent',
        margin: 8,
      }}
      source={{
        uri: routes.home + product.image,
      }}
    />

    <View style={{justifyContent: 'center', flex: 1, flexDirection: 'column'}}>
      <Text />
      <Text style={{flexShrink: 1, fontSize: 18, marginBottom: 8}}>
        {product.name}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 8,
        }}>
        <Item style={{borderColor: 'white'}} />

        {product.discount !== 0 ? (
          <View style={{alignItems: 'flex-end'}}>
            <Text style={{fontSize: 16}}>
              {product.qty} x{' '}
              {((product.price * (100 - product.discount)) / 100).toFixed(2)} ={' '}
              {(
                product.qty *
                ((product.price * (100 - product.discount)) / 100)
              ).toFixed(2) + ' ₺ '}
            </Text>
            <Text
              style={{
                textDecorationLine: 'line-through',
                color: 'grey',
                fontSize: 16,
              }}>
              {product.qty} x {product.price} ={' '}
              {(product.qty * product.price).toFixed(2) + ' ₺ '}
            </Text>
          </View>
        ) : (
          <Item style={{borderColor: 'white'}}>
            <Text style={{fontSize: 16}}>
              {product.qty} x {product.price} ={' '}
              {(product.qty * product.price).toFixed(2)} ₺
            </Text>
          </Item>
        )}

        <Item style={{borderColor: 'white'}}>
          <Icon.Button
            color="red"
            name="trash"
            backgroundColor="white"
            size={25}
            onPress={() => deleteItem(product._id)}
          />
        </Item>
      </View>
    </View>
  </Item>
);

function Cart({navigation}) {
  const [loginStat, setLoginStat] = useState(false);
  const [productList, setProductList] = useState([]);
  const [count, setCount] = useState(1);
  const [itemsPrice, setItemsPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [usrToken, setUsrToken] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      getLoginStat('isLoggedIn');
      getUserToken();
    }, []),
  );

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

  function getUserToken() {
    AsyncStorage.getItem('userToken')
      .then(token => {
        let tkn = JSON.stringify(token);

        tkn = tkn.replace(/"/g, '');
        tkn = 'Bearer ' + tkn;
        setUsrToken(tkn);
        console.log('token: ', tkn);
        getCartItems(tkn);
      })
      .catch(e => {
        console.log('ERR', e);
      });
  }

  const getCartItems = token => {
    return fetch(routes.api + '/cart/', {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    })
      .then(response => response.json())
      .then(json => {
        setProductList(json);
        console.log('CartItems:', json);
        return json;
      })
      .then(data => {
        let totalItems = 0;
        let totalDiscount = 0;
        let total = 0;
        for (var i = 0; i < data.length; i++) {
          console.log('product data: ', data[i]);
          console.log('product discount: ', data[i].discount);

          totalDiscount +=
            data[i].qty *
            ((parseFloat(data[i].price) * data[i].discount) / 100);
          console.log('total discount: ', totalDiscount);

          totalItems += data[i].qty * parseFloat(data[i].price);

          console.log('total', totalItems);
          setItemsPrice(totalItems);
          setDiscountPrice(totalDiscount);
          console.log('totalPrice', totalPrice);

          setTotalPrice(totalItems - totalDiscount);
        }
      })

      .catch(error => {
        console.error(error);
      });
  };

  function updateCount(value) {
    setCount(value);
  }

  function deleteItem(prodId) {
    AsyncStorage.getItem('userToken')
      .then(token => {
        let tkn = JSON.stringify(token);

        tkn = tkn.replace(/"/g, '');
        tkn = 'Bearer ' + tkn;

        console.log('token: ', tkn);
        return tkn;
      })
      .then(tkn => {
        deleteCartItem(tkn, prodId);
      })
      .catch(e => {
        console.log('ERR', e);
      });
  }

  const deleteCartItem = async (token, prodId) => {
    await fetch(routes.api + '/cart/delete/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        id: prodId,
      }),
    })
      .then(response => {
        console.log('ID:', prodId);
        const statusCode = response.status;
        console.log(statusCode);
        getCartItems(token);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const renderItem = ({item}) => (
    <Product
      product={item}
      count={count}
      updateCount={value => updateCount(value)}
      deleteItem={() => deleteItem(item.product)}
    />
  );

  const onBackPressed = () => {
    navigation.navigate('ProductsScreen');
  };

  function onProceedToCheckoutPressed() {
    if (loginStat === true) {
      navigation.navigate('ShippingAddressScreen', {
        itemsPrice: itemsPrice,
        discountPrice: discountPrice,
        totalPrice: totalPrice,
      });
    } else {
      navigation.navigate('LogInScreen');
    }
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

  return (
    <Container>
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
          style={{
            textAlign: 'center',
            fontSize: 25,
            color: '#FFFF',
            marginRight: 80,
          }}
          onPress={onBackPressed}>
          SHOPPING CART
        </Text>
      </Header>

      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <FlatList
          data={productList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
        <View
          style={{
            borderWidth: 1,
            marginHorizontal: 20,
            padding: 8,
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 16}}>
            SUBTOTAL : {totalPrice.toFixed(2)} ₺
          </Text>
        </View>
        {renderProceedToCheckoutButton()}
      </SafeAreaView>
    </Container>
  );
}

export default Cart;

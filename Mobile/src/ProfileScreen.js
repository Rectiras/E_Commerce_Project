import {ScrollView, SafeAreaView, View, Text, FlatList} from 'react-native';
import React, {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../App';

import {styles} from './styles';
import {Header, Item, Button} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import LogInScreen from './logInScreen';
import {routes} from './routes';
import SplashScreen from './SplashScreen';

const Order = ({order, onPress}) => (
  <Item
    style={{
      flexDirection: 'column',
      margin: 8,
      borderColor: '#343a40',
      borderRadius: 13,
      alignItems: 'center',
    }}>
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <View
        style={{
          marginTop: 15,
          marginBottom: 5,
          flexDirection: 'column',
          alignItems: 'center',
          marginHorizontal: 6,
        }}>
        <Text style={styles.orderTextStyle}>ID</Text>
        <Text style={styles.ordersTextStyle2}>{order._id}</Text>
      </View>

      <View
        style={{
          marginTop: 15,
          marginBottom: 5,
          flexDirection: 'column',
          alignItems: 'center',
          marginHorizontal: 6,
        }}>
        <Text style={styles.orderTextStyle}>DATE</Text>
        <Text style={styles.ordersTextStyle2}>
          {order.createdAt.substring(0, 10)}
        </Text>
      </View>

      <View
        style={{
          marginTop: 15,
          marginBottom: 5,
          flexDirection: 'column',
          alignItems: 'center',
          marginHorizontal: 6,
        }}>
        <Text style={styles.orderTextStyle}>TOTAL </Text>
        <Text style={styles.ordersTextStyle2}>{order.totalPrice}</Text>
      </View>

      <View
        style={{
          marginTop: 15,
          marginBottom: 5,
          flexDirection: 'column',
          alignItems: 'center',
          marginHorizontal: 6,
        }}>
        <Text style={styles.orderTextStyle}>PAID</Text>
        <Text style={styles.ordersTextStyle2}>
          {order.isPaid ? (
            order.createdAt.substring(0, 10)
          ) : (
            <Icon name="times" color="#990F02" size={20} />
          )}
        </Text>
      </View>

      <View
        style={{
          marginTop: 15,
          marginBottom: 5,
          flexDirection: 'column',
          alignItems: 'center',
          marginHorizontal: 6,
        }}>
        <Text style={styles.orderTextStyle}>DELIVERED</Text>
        <Text style={styles.ordersTextStyle2}>
          {order.isDelivered ? 'Yes' : 'No'}
        </Text>
      </View>
    </View>
    <Button block style={styles.smallBlackButtonStyle} onPress={onPress}>
      <Text style={{textAlign: 'center', fontSize: 13, color: '#FFFF'}}>
        DETAILS
      </Text>
    </Button>
  </Item>
);

function ProfileScreen({navigation}) {
  const [userOrders, setUserOrders] = useState('');
  const [usrToken, setUsrToken] = useState('');

  const {logOut} = React.useContext(AuthContext);
  //const {userInfo} = route.params;

  useFocusEffect(
    React.useCallback(() => {
      getUserToken();
      console.log('Got the orders');
    }, []),
  );

  function getUserToken() {
    AsyncStorage.getItem('userToken')
      .then(token => {
        let tkn = JSON.stringify(token);

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
    return fetch(routes.api + '/orders/myorders/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Vary: 'Accept',
        Authorization: token,
      },
    })
      .then(response => response.json())
      .then(json => {
        setUserOrders(json);
        console.log('Orders: ', userOrders);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const onBackPressed = () => {
    navigation.navigate('ProductsScreen');
  };

  function onAccountEditPressed() {
    navigation.navigate('AccountEdit');
  }

  function renderAccountEditButton() {
    return (
      <Button
        block
        style={[styles.buttonStyle, {marginBottom: -6}]}
        onPress={onAccountEditPressed}>
        <Text style={{textAlign: 'center', fontSize: 20, color: '#FFFF'}}>
          EDIT ACCOUNT
        </Text>
      </Button>
    );
  }

  function renderLogOutButton() {
    return (
      <Button block style={styles.buttonStyle} onPress={onLogOutPressed}>
        <Text style={{textAlign: 'center', fontSize: 20, color: '#FFFF'}}>
          LOG OUT
        </Text>
      </Button>
    );
  }

  function onLogOutPressed() {
    const jsonValue = JSON.stringify(false);
    AsyncStorage.setItem('isLoggedIn', jsonValue).then(() => {
      logOut();
      navigation.navigate('LogInScreen');
    });
  }

  const renderItem = ({item}) => (
    <Order
      order={item}
      onPress={() => {
        navigation.navigate('OrderScreen', {itemId: item._id});
      }}
    />
  );

  if (userOrders) {
    return (
      <ScrollView style={{backgroundColor: 'white'}}>
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

        <SafeAreaView>
          <Text
            style={{
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: 25,
              color: '#343a40',
              marginTop: 8,
            }}>
            MY ORDERS
          </Text>
          <FlatList
            data={userOrders}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />

          {renderAccountEditButton()}
          {renderLogOutButton()}
        </SafeAreaView>
      </ScrollView>
    );
  } else {
    return SplashScreen();
  }
}

export default ProfileScreen;

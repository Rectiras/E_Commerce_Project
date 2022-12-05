/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useEffect} from 'react';
import LogInScreen from './src/logInScreen';
import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import ProductsScreen from './src/ProductsScreen';
import SplashScreen from './src/SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import RegisterScreen from './src/registerScreen';
import ProductInfo from './src/ProductInfo';
import Cart from './src/Cart';
import ShippingAddressScreen from './src/ShippingAddressScreen';
import Payment from './src/Payment';
import PlaceOrderScreen from './src/PlaceOrderScreen';
import OrderScreen from './src/OrderScreen';
import ProfileScreen from './src/ProfileScreen';
import AccountEdit from './src/AccountEdit';
import InfoScreen from './src/InfoScreen';

import {LogBox} from 'react-native';

export const AuthContext = React.createContext();

LogBox.ignoreLogs(['Animated: `useNativeDriver` was not specified.']);

function App({navigation}) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
            userCart: action.cart,
          };
        case 'LOG_IN':
          return {
            ...prevState,
            isLoggedIn: true,
            isLoading: false,
            userToken: action.token,
            userCart: action.cart,
          };
        case 'LOG_OUT':
          return {
            ...prevState,
            isLoggedIn: false,
            isLoading: false,
            userToken: null,
            userCart: null,
          };
        case 'REGISTER':
          return {
            ...prevState,
            isLoggedIn: false,
            isLoading: false,
            userToken: null,
            userCart: null,
          };
        case 'NEW_USER':
          return {
            ...prevState,
            isLoggedIn: false,
            isLoading: false,
            userToken: null,
            userCart: null,
          };
      }
    },
    {
      isLoading: true,
      isLoggedIn: false,
      userToken: null,
      userCart: null,
    },
  );

  useEffect(() => {
    AsyncStorage.getItem('userToken').then(value => {
      value = value ? JSON.parse(value) : null;
      if (value !== null) {
        dispatch({type: 'RESTORE_TOKEN', token: value});
        console.log(value);
      } else {
        dispatch({type: 'NEW_USER'});
      }
    });

    AsyncStorage.getItem('isLoggedIn').then(value => {
      value = value ? JSON.parse(value) : null;
      if (value === true) {
        dispatch({type: 'LOG_IN'});
      } else {
        dispatch({type: 'NEW_USER'});
      }
    });
  }, []);

  const authContext = React.useMemo(
    () => ({
      logIn: () =>
        dispatch({
          type: 'LOG_IN',
          token: 'dummy-auth-token',
          cart: 'dummy-cart',
        }),
      logOut: () => dispatch({type: 'LOG_OUT'}),
      register: () => dispatch({type: 'REGISTER'}),
      newUser: () => dispatch({type: 'NEW_USER', token: null}),
    }),
    [],
  );

  const Stack = createStackNavigator();

  if (state.isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="LogInScreen"
          screenOptions={{
            headerShown: false,
          }}>
          {state.isLoggedIn ? (
            <>
              <Stack.Screen name="ProductsScreen" component={ProductsScreen} />
              <Stack.Screen name="ProductInfo" component={ProductInfo} />
              <Stack.Screen name="Cart" component={Cart} />
              <Stack.Screen
                name="ShippingAddressScreen"
                component={ShippingAddressScreen}
              />
              <Stack.Screen name="Payment" component={Payment} />
              <Stack.Screen
                name="PlaceOrderScreen"
                component={PlaceOrderScreen}
              />
              <Stack.Screen name="OrderScreen" component={OrderScreen} />
              <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
              <Stack.Screen name="AccountEdit" component={AccountEdit} />
              <Stack.Screen name="InfoScreen" component={InfoScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="ProductsScreen" component={ProductsScreen} />
              <Stack.Screen name="ProductInfo" component={ProductInfo} />
              <Stack.Screen name="Cart" component={Cart} />
              <Stack.Screen name="LogInScreen" component={LogInScreen} />
              <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
              <Stack.Screen name="InfoScreen" component={InfoScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default App;

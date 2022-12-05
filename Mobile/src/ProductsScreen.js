import {SafeAreaView, View, Text, FlatList, Image, Picker} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {SearchBar} from 'react-native-elements';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../App';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {styles} from './styles';
import ProductInfo from './ProductInfo';
import LogInScreen from './logInScreen';
import {Container, Header, Item} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionButton from 'react-native-action-button';
import {routes} from './routes';
import SplashScreen from './SplashScreen';

import {LogBox} from 'react-native';
import {Rating} from 'react-native-ratings';

LogBox.ignoreAllLogs();

const Product = ({product, onPress}) => (
  <TouchableOpacity onPress={onPress}>
    <Item
      style={{
        flexDirection: 'row',
        marginVertical: 5,
        marginHorizontal: 8,
        borderWidth: 1,
        borderRadius: 16,
      }}>
      <Image
        style={{
          height: 100,
          width: 100,
          resizeMode: 'contain',
          borderWidth: 1,
          borderRadius: 16,
          borderColor: 'transparent',
          marginBottom: 8,
        }}
        source={{
          uri: routes.home + product.image,
        }}
      />
      <View
        style={{
          marginLeft: 8,
          justifyContent: 'center',
          alignItems: 'flex-start',
          flex: 1,
        }}>
        <Text style={{flexShrink: 1}}>{product.name}</Text>
        <Rating
          type="star"
          ratingCount={5}
          startingValue={product.rating}
          imageSize={15}
          readonly="true"
        />
        <Text style={{marginTop: 8}}>{product.description}</Text>
      </View>
      <View style={{justifyContent: 'center', marginLeft: 8, marginRight: 8}}>
        {product.discount !== 0 ? (
          <View style={{alignItems: 'flex-end'}}>
            <Text
              style={{
                backgroundColor: '#3bc1ff',
                padding: 3,
                borderRadius: 5,
                color: 'black',
              }}>
              {' '}
              {(
                product.price -
                (product.price * product.discount) / 100
              ).toFixed(2)}{' '}
              ₺
            </Text>
            <Text style={{textDecorationLine: 'line-through'}}>
              {product.price + ' ₺ '}
            </Text>
          </View>
        ) : (
          <Text>{product.price + ' ₺ '}</Text>
        )}
      </View>
    </Item>
  </TouchableOpacity>
);

function ProductsScreen({navigation}) {
  const [productList, setProductList] = useState([]);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [sortedList, setSortedList] = useState([]);
  const [loginStat, setLoginStat] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [sortType, setSortType] = useState('');

  // const {userInfo} = route.params;

  const {logOut} = React.useContext(AuthContext);

  useFocusEffect(
    React.useCallback(() => {
      console.log('product screen useEffect');
      getLoginStat('isLoggedIn');
      getProducts();
      sortList(sortType);
    }, [sortType]),
  );

  const getProducts = () => {
    return fetch(routes.api + '/products/')
      .then(response => response.json())
      .then(json => {
        var products = json.products;
        return products;
      })
      .then(prods => {
        fetch(routes.api + '/products/?keyword=&page=2')
          .then(response => response.json())
          .then(json => {
            setProductList(prods.concat(json.products));
            setFilteredDataSource(prods.concat(json.products));
          });
      })
      .catch(error => {
        console.error(error);
      });
  };

  function onLogOutPressed() {
    const jsonValue = JSON.stringify(false);
    AsyncStorage.setItem('isLoggedIn', jsonValue).then(() => {
      logOut();
      navigation.navigate('LogInScreen');
    });
  }

  function onLogInPressed() {
    navigation.navigate('LogInScreen');
  }

  const renderItem = ({item}) => (
    <Product
      product={item}
      onPress={() => {
        navigation.navigate('ProductInfo', {itemId: item._id});
      }}
    />
  );

  function renderLoginLogoutButton() {
    if (loginStat === true) {
      return (
        <ActionButton.Item
          buttonColor="#343a40"
          title="LOGOUT"
          onPress={() => onLogOutPressed()}>
          <Icon
            name="sign-out"
            color="#FFBF00"
            size={25}
            style={styles.actionButtonIcon}
          />
        </ActionButton.Item>
      );
    } else {
      return (
        <ActionButton.Item
          buttonColor="#343a40"
          title="LOGIN"
          onPress={() => onLogInPressed()}>
          <Icon
            name="sign-in"
            color="#FFBF00"
            size={25}
            style={styles.actionButtonIcon}
          />
        </ActionButton.Item>
      );
    }
  }

  function getLoginStat(item) {
    AsyncStorage.getItem(item)
      .then(stat => {
        setLoginStat(JSON.parse(stat));

        //console.log('Get login stat ', JSON.parse(stat));
        //console.log(typeof JSON.parse(stat));
      })
      .catch(e => {
        console.log('ERR', e);
      });
  }

  function onCartPressed() {
    navigation.navigate('Cart');
  }

  function onInfoPressed() {
    navigation.navigate('InfoScreen');
  }

  function onProfilePressed() {
    if (loginStat === true) {
      navigation.navigate('ProfileScreen');
    } else {
      navigation.navigate('LogInScreen');
    }
  }

  function renderActionButton() {
    return (
      <ActionButton buttonColor="#343a40" style={{marginBottom: 0}}>
        {renderLoginLogoutButton()}
        <ActionButton.Item
          buttonColor="#343a40"
          title="INFO"
          onPress={() => onInfoPressed()}>
          <Icon
            name="info"
            color="#FFBF00"
            size={25}
            style={styles.actionButtonIcon}
          />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#343a40"
          title="PROFILE"
          onPress={() => onProfilePressed()}>
          <Icon
            name="user"
            color="#FFBF00"
            size={25}
            style={styles.actionButtonIcon}
          />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#343a40"
          title="CART"
          onPress={() => onCartPressed()}>
          <Icon
            name="shopping-cart"
            color="#FFBF00"
            size={25}
            style={styles.actionButtonIcon}
          />
        </ActionButton.Item>
      </ActionButton>
    );
  }

  const searchFilter = text => {
    if (text) {
      const newData = productList.filter(function (item) {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearchKey(text);
    } else {
      setFilteredDataSource(productList);
      setSearchKey(text);
    }
  };

  const sortList = sortKey => {
    let list = filteredDataSource;
    var sorted;
    if (sortKey === 'priceInc') {
      sorted = list.sort(
        (a, b) =>
          (a.price * (100 - a.discount)) / 100 -
          (b.price * (100 - b.discount)) / 100,
      );
    } else if (sortKey === 'priceInc') {
      sorted = list.sort(
        (a, b) =>
          (b.price * (100 - b.discount)) / 100 -
          (a.price * (100 - a.discount)) / 100,
      );
    } else {
      sorted = list.sort((a, b) => b[sortKey] - a[sortKey]);
    }

    setProductList(sorted);
    setFilteredDataSource(sorted);
    setSortedList(sorted);
  };

  if (productList.length !== 0) {
    return (
      <Container>
        <Header
          style={{
            flexDirection: 'row',
            backgroundColor: '#343a40',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 25, color: '#FFFF'}}>PRODUCTS</Text>
        </Header>

        <SearchBar
          placeholder="Search"
          onChangeText={value => searchFilter(value)}
          onClear={() => searchFilter('')}
          value={searchKey}
          platform={false}
        />

        <View style={{margin: 8, borderWidth: 1, borderRadius: 3}}>
          <Picker
            selectedValue={sortType}
            onValueChange={itemValue => setSortType(itemValue)}>
            <Picker.Item label="Sort by" value="" />
            <Picker.Item label="Rating" value="rating" />
            <Picker.Item label="Price Increasing" value="priceInc" />
            <Picker.Item label="Price Decreasing" value="price" />
          </Picker>
        </View>

        <SafeAreaView style={{flex: 1, backgroundColor: '#343a40'}}>
          {false ? (
            <View style={{alignItems: 'center', backgroundColor: 'white'}}>
              <Image
                source={require('./images/sumed_logo.jpg')}
                style={{width: 210, height: 70}}
              />
            </View>
          ) : (
            <></>
          )}

          <FlatList
            backgroundColor="white"
            data={sortType != '' ? sortedList : filteredDataSource}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
          {renderActionButton()}
        </SafeAreaView>
      </Container>
    );
  } else {
    return SplashScreen();
  }
}

export default ProductsScreen;

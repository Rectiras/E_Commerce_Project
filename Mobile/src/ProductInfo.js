import {SafeAreaView, View, Text, FlatList, Image} from 'react-native';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {TouchableOpacity} from 'react-native-gesture-handler';
import {styles} from './styles';
import {Container, Header, Item, Input, Button} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Rating} from 'react-native-ratings';
import NumericInput from 'react-native-numeric-input';
import Cart from './Cart';
import {routes} from './routes';
import {useFocusEffect} from '@react-navigation/native';
import SplashScreen from './SplashScreen';

const Product = ({
  product,
  count,
  updateCount,
  renderReviewInput,
  renderAddToCartButton,
}) => (
  <Item style={{flexDirection: 'column', margin: 8}}>
    <Item style={{flexDirection: 'column', margin: 8}}>
      <Image
        style={styles.productInfoImageStyle}
        source={{uri: routes.home + product.image}}
      />
      <Text style={{flexShrink: 1, fontSize: 30}}>{product.name}</Text>
      <Text style={{margin: 2, fontSize: 18}}>{product.description}</Text>
    </Item>

    {product.discount !== 0 ? (
      <View style={{alignItems: 'center'}}>
        <Text
          style={{
            backgroundColor: '#3bc1ff',
            padding: 3,
            borderRadius: 5,
            fontSize: 25,
            color: 'black',
          }}>
          {' SALE!  '}
          {(product.price - (product.price * product.discount) / 100).toFixed(
            2,
          )}{' '}
          ₺
        </Text>
        <Text
          style={{
            textDecorationLine: 'line-through',
            fontSize: 23,
            padding: 3,
            color: 'grey',
          }}>
          {'PRICE: ' + product.price + ' ₺ '}
        </Text>
      </View>
    ) : (
      <Text style={{fontSize: 25, padding: 3}}>
        {'PRICE: ' + product.price + ' ₺'}
      </Text>
    )}

    <Rating
      style={{margin: 8}}
      type="star"
      ratingCount={5}
      startingValue={product.rating}
      imageSize={25}
      readonly="true"
    />
    <Text style={{margin: 8, fontSize: 18}}>{product.numReviews} reviews</Text>

    {product.countInStock > 0 ? (
      <View style={{alignItems: 'center'}}>
        <Text
          style={{
            marginBottom: 1,
            fontSize: 18,
          }}>
          Status: {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
        </Text>
        <Item style={{margin: 8}}>
          <NumericInput
            value={count}
            initialValue={1}
            valueType="integer"
            minValue={1}
            maxValue={product.countInStock}
            onChange={value => updateCount(value)}
            totalWidth={150}
            totalHeight={50}
            iconSize={25}
            step={1}
            textColor="#343a40"
            iconStyle={{color: 'white'}}
            rightButtonBackgroundColor="#343a40"
            leftButtonBackgroundColor="#343a40"
            style={{margin: 8}}
          />
        </Item>
      </View>
    ) : (
      <Text
        style={{
          backgroundColor: '#ff7c73',
          padding: 10,
          borderRadius: 10,
          fontSize: 18,
        }}>
        Status: {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
      </Text>
    )}

    <View style={{width: '100%'}}>{renderAddToCartButton()}</View>

    {renderReviewInput()}

    <View>
      <Text
        style={{
          fontSize: 25,
          marginVertical: 10,
          marginTop: 10,
          marginBottom: 20,
        }}>
        REVIEWS
      </Text>
    </View>

    {product.reviews == 0 ? (
      <Text style={styles.messageStyle}>No Reviews</Text>
    ) : (
      <Item style={{alignSelf: 'flex-start', flexDirection: 'column'}}>
        <FlatList
          data={product.reviews}
          renderItem={({item}) =>
            item.approved ? (
              <Item
                style={{
                  width: 400,
                  flexDirection: 'column',
                  marginVertical: 10,
                  borderColor: '#343a40',
                  borderRadius: 13,
                }}>
                <Text
                  style={{
                    alignSelf: 'flex-start',
                    flexShrink: 1,
                    fontSize: 18,
                    marginLeft: 15,
                  }}>
                  <Icon name="user" color="black" size={25} /> {item.name}
                </Text>
                <Rating
                  style={{alignSelf: 'flex-start', margin: 8, marginLeft: 15}}
                  type="star"
                  ratingCount={5}
                  startingValue={item.rating}
                  imageSize={25}
                  readonly="true"
                />
                <Text
                  style={{
                    alignSelf: 'flex-start',
                    marginBottom: 15,
                    fontSize: 15,
                    marginLeft: 15,
                  }}>
                  {item.createdAt.substring(0, 10)}
                </Text>
                <Text
                  style={{
                    alignSelf: 'flex-start',
                    marginBottom: 15,
                    fontSize: 18,
                    marginLeft: 15,
                  }}>
                  {item.comment}
                </Text>
              </Item>
            ) : (
              <></>
            )
          }
        />
      </Item>
    )}
  </Item>
);

function ProductInfo({route, navigation}) {
  const {itemId} = route.params;
  const [loginStat, setLoginStat] = useState(false);
  const [productItem, setProductItem] = useState([]);
  const [count, setCount] = useState(1);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [ratingError, setRatingError] = useState('');
  const [rating, setRating] = useState(0);
  const [userToken, setUserToken] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      console.log('product info useEffect');
      getLoginStat('isLoggedIn');
      getProduct();
    }, []),
  );

  function getUserToken() {
    AsyncStorage.getItem('userToken')
      .then(token => {
        let tkn = JSON.stringify(token);

        tkn = tkn.replace(/"/g, '');
        tkn = 'Bearer ' + tkn;
        console.log(tkn);
        submitReview(tkn);
      })
      .catch(e => {
        console.log('ERR', e);
      });
  }
  function getToken() {
    AsyncStorage.getItem('userToken')
      .then(token => {
        let tkn = JSON.stringify(token);

        tkn = tkn.replace(/"/g, '');
        tkn = 'Bearer ' + tkn;
        console.log(tkn);
        addCartItem(tkn);
      })
      .catch(e => {
        console.log('ERR', e);
      });
  }

  function updateCount(value) {
    setCount(value);
  }

  const addCartItem = async token => {
    await fetch(routes.api + '/cart/add/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        id: itemId,
        qty: count,
      }),
    })
      .then(response => {
        const statusCode = response.status;
        console.log(statusCode);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const submitReview = async token => {
    console.log(rating);
    console.log(comment);

    if (comment !== '' && rating !== 0) {
      //alert('Thank you for logging in');
      await fetch(routes.api + '/products/' + itemId + '/reviews/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          rating: rating,
          comment: comment,
        }),
      })
        .then(response => {
          const statusCode = response.status;
          console.log(statusCode);

          if (statusCode === 200) {
            setComment('');
            setRating(0);
            getProduct();
          }
          if (statusCode === 400) {
            alert('You already reviewed this product!');
          }
        })
        .catch(error => {
          console.error(error);
        });
    }

    if (comment !== '') {
      setCommentError('');
    } else {
      setCommentError('Your comment should not be empty');
    }

    if (rating !== 0) {
      setRatingError('');
    } else {
      setRatingError('Your rating should not be zero');
    }
  };

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

  function renderReviewInput() {
    if (loginStat === true) {
      return (
        <Item style={{margin: 20, borderColor: 'black'}}>
          <View
            style={{
              marginLeft: 20,
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, marginBottom: 10}}>
              Write a Review{' '}
            </Text>
            <Text style={{fontSize: 18}}>Rating: </Text>
            <Rating
              style={{margin: 8}}
              type="star"
              ratingCount={5}
              startingValue={rating}
              imageSize={25}
              onFinishRating={rating => setRating(rating)}
            />
            <Text style={{color: 'red', marginLeft: 20, marginBottom: 10}}>
              {ratingError}
            </Text>
            <Text style={{fontSize: 18, marginBottom: 8}}>Review: </Text>

            <Input
              style={{
                flexDirection: 'row',
                height: 80,
                width: 350,
                borderWidth: 1,
                borderRadius: 5,
              }}
              value={comment}
              onChangeText={comment => setComment(comment)}
              onChange={() => setCommentError('')}
            />
            <Text style={{color: 'red', marginLeft: 20}}>{commentError}</Text>

            <Button
              block
              style={{
                height: 40,
                width: 350,
                borderWidth: 1,
                borderRadius: 15,
                margin: 8,
                marginBottom: 20,
                justifyContent: 'center',
                flexDirection: 'column',
                backgroundColor: '#343a40',
                borderColor: '#343a40',
              }}
              onPress={() => getUserToken()}>
              <Text style={{textAlign: 'center', fontSize: 18, color: '#FFFF'}}>
                SUBMIT
              </Text>
            </Button>
          </View>
        </Item>
      );
    } else {
      return (
        <Item style={{flexDirection: 'column'}}>
          <Text
            style={{
              margin: 8,
              color: '#757575',
              fontSize: 20,
              textAlign: 'center',
              textDecorationLine: 'underline',
            }}
            onPress={() => {
              navigation.navigate('LogInScreen');
            }}>
            Please login to write a review{' '}
          </Text>
        </Item>
      );
    }
  }

  const getProduct = () => {
    return fetch(routes.api + '/products/' + itemId)
      .then(response => response.json())
      .then(json => {
        setProductItem(json);
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
      renderItem={item => renderReview(item)}
      renderReviewInput={() => renderReviewInput()}
      renderAddToCartButton={() => renderAddToCartButton()}
    />
  );

  const onBackPressed = () => {
    navigation.navigate('ProductsScreen');
  };

  const onAddToCartPressed = () => {
    getToken();
    navigation.navigate('Cart', {itemId: itemId});
  };

  function renderAddToCartButton() {
    return (
      <TouchableOpacity
        disabled={productItem.countInStock <= 0 ? true : false}
        style={styles.buttonStyle}
        onPress={() => onAddToCartPressed()}>
        <Text style={styles.buttonTextStyle}>Add To Cart</Text>
      </TouchableOpacity>
    );
  }

  if (productItem.name) {
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
            style={{textAlign: 'center', fontSize: 25, color: '#FFFF'}}
            onPress={onBackPressed}>
            {' '}
          </Text>
        </Header>

        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
          <FlatList
            data={[productItem]}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </SafeAreaView>
      </Container>
    );
  } else {
    return SplashScreen();
  }
}

export default ProductInfo;

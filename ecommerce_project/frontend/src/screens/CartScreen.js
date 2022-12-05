import React, {useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card, ListGroupItem } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartActions'


function CartScreen({match, location, history}) {
    const productId = match.params.id
    const qty = location.search ? Number(location.search.split('=')[1]) : 1
    //console.log('qty:', qty)

    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart)
    const { cartItems } = cart
    console.log('cartItems:', cartItems)
    //console.log('cartItems:', cartItems.length)

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId, qty))
        }
        if (!userInfo) {
           history.push('/cart')}
           //history.push('')}
        
    }, [dispatch, productId, qty, userInfo])

    const removeFromCartHandler = (id) => {
        //console.log('remove:',id)
        dispatch(removeFromCart(id))
    }

    const checkouthandler = () => {
        history.push('/login?redirect=shipping')
    }

    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <Message variant='info'>
                        Your cart is empty <Link to='/'>Go Back </Link>
                    </Message>
                ) : (
                    <ListGroup variant='flush'>
                        {cartItems.map(item =>(
                            <ListGroup.Item key={item.product}>
                                <Row>
                                    <Col md={2}>
                                        <Image src={item.image} alt={item.name} fluid rounded/>
                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={2}>
                                    {item.discount > 0
                                        ? <del class="fs-sm text-muted">{item.price}₺<br/></del>
                                        : <p>{item.price}₺</p>}
                                    {item.discount > 0 &&
                                        <p>{(item.price*(1-item.discount/100)).toFixed(2)}₺</p>
                                    }
                                    </Col>
                                    <Col md={3}>
                                        <Form.Control
                                            as="select"
                                            value={item.qty}
                                            onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}
                                        >
                                            {

                                                [...Array(item.countInStock).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))
                                            }
                                        </Form.Control>
                                    </Col>
                                    <Col md={1}>
                                        <Button 
                                            style={{border: '1px solid red',borderRadius: '10px'}}
                                            type='button'
                                            variant='outline-danger'
                                           // variant='light'
                                            onClick={() => removeFromCartHandler(item.product)}
                                        >
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroupItem>
                            <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0 )}) items</h2>
                            {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0 ).toFixed(2)}₺
                            &nbsp;-&nbsp;{cart.cartItems.reduce((acc, item) => acc + (item.discount*item.price/100) * item.qty, 0).toFixed(2)}₺
                            &nbsp;=&nbsp;{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0 ).toFixed(2)-cart.cartItems.reduce((acc, item) => acc + (item.discount*item.price/100) * item.qty, 0).toFixed(2)}₺
                        </ListGroupItem>
                    </ListGroup>

                    <ListGroup.Item>
                        <Button
                            style={{border: '1px solid black',borderRadius: '10px'}}
                            type='button'
                            className='btn-blcok'
                            disabled={cartItems.length === 0}
                            onClick={checkouthandler}
                        >
                            Proceed To Checkout
                        </Button>
                    </ListGroup.Item>
                </Card>
            </Col>
        </Row>
    )
}

export default CartScreen
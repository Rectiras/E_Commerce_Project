import React, { useState, useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET  } from '../constants/orderConstants'


function OrderScreen({ match, history }) {
    const orderId = match.params.id
    const dispatch = useDispatch()


    const [sdkReady, setSdkReady] = useState(false)

    const orderDetails = useSelector(state => state.orderDetails)
    const {order, error, loading} = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const {loading: loadingPay, success: successPay } = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const {loading: loadingDeliver, success: successDeliver } = orderDeliver

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    
    if(!loading && !error){
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    }
   
    

    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
        }

        if(!order || order._id !== Number(orderId) || successDeliver) {
            dispatch({ type: ORDER_PAY_RESET })
            dispatch({ type: ORDER_DELIVER_RESET })

            dispatch(getOrderDetails(orderId))
        }
   
    }, [dispatch, order, orderId, successDeliver])

   const deliverHandler = () => {
       dispatch(deliverOrder(order))

   }

    return loading ? (
        <Loader/>
    ) : error ? (
        <Message variant = 'danger' > {error} </Message>
    ) : (
                <div>
                    <h1>Order:{order._id} </h1>
                    <Row>
                        <Col md={8}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h2>Shipping</h2>
                                    <p><strong>Name: </strong> {order.user.name}</p>
                                    <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                                    <p>
                                        <strong>Shipping Information: </strong>
                                        {order.shippingAddress.name} {'  '} {order.shippingAddress.surname}
                                        <br/> {order.shippingAddress.address}, {'  '} {order.shippingAddress.city}
                                    </p>

                                    {order.isDelivered ? (
                                        <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                                    ) : (
                                            <Message variant='warning'>Not Delivered</Message>
                                        )}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <h2>Payment Method</h2>
                                    <p>
                                        <strong>Method: </strong>
                                        {order.paymentMethod}
                                    </p>
                                    {order.isPaid ? (
                                        <Message variant='success'>Paid on {order.paidAt}</Message>
                                    ) : (
                                            <Message variant='warning'>Not Paid</Message>
                                        )}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <h2>Order Items</h2>
                                    {order.orderItems.lenght === 0 ? <Message variant='info'>Order is empty</Message> : (
                                        <ListGroup variant='flush'>
                                            {order.orderItems.map((item, index) => (
                                                <ListGroup.Item key={index}>
                                                    <Row>
                                                        <Col md={1} className='p-sm-0' >
                                                            <Image src={item.image} alt={item.name} fluid rounded/>
                                                        </Col>
                                                        <Col>
                                                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                        </Col>
                                                        <Col md={4}>
                                                            {item.qty} X  {item.price}₺ = {(item.qty * item.price).toFixed(2)}₺
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    )}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={4}>
                            <a href={ "http://127.0.0.1:8000/images/invoices/invoice" + order._id + ".pdf" } target="_blank">Click for PDF invoice</a>
                            <Card>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <h2>Order Summary</h2>
                                    </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Items:</Col>
                                    <Col><span className='float-right'>{order.itemsPrice}₺</span></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Discount:</Col>
                                    <Col><span className='float-right'>-{order.discountPrice}₺</span></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col><span className='float-right'>FREE</span></Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col><span className='float-right'>{order.totalPrice}₺</span></Col>
                                </Row>
                            </ListGroup.Item>
                        </ListGroup>
                        
                       
                    {loadingDeliver && <Loader />}
                            {userInfo && userInfo.isAdmin && !order.isDelivered && (
                                <ListGroup.Item>
                                    <Button
                                        style = {{border: '1px solid black',borderRadius: '10px'}}
                                        type='button'
                                        className='btn btn-block'
                                        onClick={deliverHandler}
                                    >
                                        Mark As Delivered
                                    </Button>
                                </ListGroup.Item>
                        )}
                    </Card>
                </Col>
            </Row>           
        </div>
    )
}

export default OrderScreen
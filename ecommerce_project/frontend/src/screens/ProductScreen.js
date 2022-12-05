import React, {useState, useEffect}  from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Button, Card, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listProductDetails, createProductReview } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants//productConstants'

function ProductScreen({ match, history }) {
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const dispatch = useDispatch()
    const productDetails = useSelector(state => state.productDetails)
    const {loading, error, product } = productDetails

    const userLogin = useSelector(state => state.userLogin)
    const {userInfo } = userLogin

    const productReviewCreate = useSelector(state => state.productReviewCreate)
    const {
        loading: loadingProductReview, 
        error: errorProductReview, 
        success: successProductReview, 
    } = productReviewCreate

    useEffect(()=> {
        if (successProductReview) {
            setRating(0)
            setComment('')
            dispatch({type: PRODUCT_CREATE_REVIEW_RESET })
        }

        dispatch(listProductDetails(match.params.id))

    }, [dispatch, match, successProductReview])
    
    const addToCartHandler = () => {
        //console.log('Add to cart:', match.params.id)
        history.push(`/cart/${match.params.id}?qtr=${qty}`)
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createProductReview(
            match.params.id, {
                rating,
                comment
            }
        ))

    }
    const mystyle = {
        color: "white",
        backgroundColor: "DodgerBlue",
        padding: "5px",
        fontFamily: "Arial",
        fontSize: "0.8rem"
    
      };
    /*
    {product.discount > 0 && 
        <del class="fs-sm text-muted">₺{product.price}<br/></del>
    }
    ₺{((product.price)*(100-(product.discount).toFixed(2))/100).toFixed(2)}

    
    */

    return (
        <div>
            <Link to='/' type="button" className="btn btn-outline-primary  my-3">Continue Shopping</Link>

            {loading ? <Loader />
                     : error ? <Message variant='danger'>{error}</Message>
                     : (
                         <div>
                            <Row>
                            <Col md={6}>
                                <Image src={product.image} alt={product.name} fluid/>
                            </Col>
                            
                            <Col md={1}></Col>

                            <Col md={4}>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <h3>{product.name}</h3>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'}/>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        Description: {product.description}
                                    </ListGroup.Item>

                                    <ListGroup.Item >
                                        <Row>
                                            <Col>
                                            Status: {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>

                                    {product.countInStock > 0 && (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Quantity</Col>
                                                <Col xs='auto' className='my-1'>
                                                    <Form.Control
                                                        as="select"
                                                        value={qty}
                                                        onChange={(e) => setQty(e.target.value)}
                                                    >
                                                            {
                                                                [...Array(product.countInStock).keys()].map((x) =>(
                                                                    <option key={x + 1} value={x + 1}>
                                                                        {x + 1}
                                                                    </option>
                                                                ))
                                                            }
                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )}

                                    <ListGroup.Item>
                                        <h4>
                                        {product.discount > 0
                                        ? <del class="fs-sm text-muted">{product.price}₺</del>
                                        : <p>{product.price}₺</p>}
                                        {product.discount > 0 && 
                                            <span style={mystyle}>%{product.discount} SALE!<br/></span>
                                        }
                                        {product.discount > 0 &&
                                            <p>{(product.price*(1-product.discount/100)).toFixed(2)}₺</p>
                                        }
                                        </h4>
                                    </ListGroup.Item>

                                    <ListGroup.Item >
                                        <Button 
                                            style={{border: '1px solid black',borderRadius: '10px'}}
                                            onClick={addToCartHandler}
                                            className='btn-block'
                                            disabled={product.countInStock === 0}
                                            type='button'
                                        >Add to Card
                                        </Button>
                                    </ListGroup.Item>
                                </ListGroup>
                                

                            </Col>
                            </Row>

                            <Row>
                                <Col md = {6}>
                                    <h4 style = {{marginLeft: "20px"}}>Reviews</h4>
                                    {product.reviews.length == 0 && <Message variant = 'info'>No Reviews</Message>}

                                    <ListGroup variant = 'flush'>

                                        

                                        

                                        {product.reviews.filter(review => review.approved === true).map((filteredPerson) => (
                                            <ListGroup.Item key = {filteredPerson._id}>
                                                <strong>{filteredPerson.name}</strong>
                                                <Rating value = {filteredPerson.rating} color = '#f8e825'/>
                                                <p>{filteredPerson.createdAt.substring(0, 10)}</p>
                                                <p>{filteredPerson.comment}</p>
                                            </ListGroup.Item>
                                        ))}

                            
                                            <ListGroup.Item>
                                                <h4>Write a review</h4>

                                                {loadingProductReview && <Loader/>}
                                                {successProductReview && <Message variant = 'success'>Review Submitted</Message>}
                                                {errorProductReview && <Message variant = 'danger'>{errorProductReview}</Message>}


                                                {userInfo ? (
                                                    <Form onSubmit = {submitHandler}>
                                                        <Form.Group controlId = 'rating'>
                                                            <Form.Label >Rating</Form.Label>
                                                            <Form.Control
                                                                
                                                                as = 'select'
                                                                value = {rating}
                                                                onChange = {(e) => setRating(e.target.value)}
                                                            >   
                                                                <option value = ''>Select...</option>
                                                                <option value = '1'>1 - Poor</option>
                                                                <option value = '2'>2 - Fair</option>
                                                                <option value = '3'>3 - Good</option>
                                                                <option value = '4'>4 - Very Good</option>
                                                                <option value = '5'>5 - Excellent</option>
                                                            </Form.Control>
                                                        </Form.Group>

                                                    <Form.Group controlId = 'comment'>
                                                        <Form.Label>Review</Form.Label>
                                                        <Form.Control
                                                            as = 'textarea'
                                                            row = '5'
                                                            value = {comment}
                                                            onChange = {(e) => setComment(e.target.value)}>

                                                        </Form.Control>
                                                    </Form.Group>

                                                    <Button
                                                        style = {{border: '1px solid black',borderRadius: '10px', marginLeft : "170px"}}
                                                        disabled = {loadingProductReview}
                                                        type = 'submit'
                                                        variant = 'primary'
                                                    >
                                                        Submit
                                                    </Button>

                                                </Form>
                                            ) : (
                                                <Message variant = 'info'>Please <Link to = '/login'>login</Link> to write a review</Message>
                                            )}
                                        </ListGroup.Item>
                                </ListGroup>
                            </Col>
                        </Row>
                    </div>
                )

            }
        </div>
    )
}

export default ProductScreen

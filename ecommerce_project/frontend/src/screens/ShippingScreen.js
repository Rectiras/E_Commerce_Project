import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress } from '../actions/cartActions'

function ShippingScreen({ history }) {
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    const dispatch = useDispatch()

    const [idNumber, setIDNumber]       = useState(shippingAddress.idNumber)
    const [name, setName]               = useState(shippingAddress.name)
    const [surname, setSurname]         = useState(shippingAddress.surname)
    const [phoneNumber, setPhoneNumber] = useState(shippingAddress.phoneNumber)
    const [city, setCity]               = useState(shippingAddress.city)
    const [address, setAddress]          = useState(shippingAddress.address)

    const submitHandler = (e) => {
        e.preventDefault()
        //console.log('Submited')
        dispatch(saveShippingAddress({idNumber, name, surname, phoneNumber, city, address}))
        history.push('/payment')
    }
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
       
        if (!userInfo) {
           // history.push('/login')}
           history.push('')}
        
    }, [dispatch,userInfo])

    return (
        <FormContainer>
            <CheckoutSteps step1 step2></CheckoutSteps>
            <h1 style={{marginLeft: "150px"}}>Shipping</h1>
            <Form onSubmit={submitHandler}>
                <Row>
                    <Col>
                        <Form.Group controlId='idNumber'>
                            <Form.Label>TC Identity Number</Form.Label>
                            <Form.Control
                                style={{border: '1px solid black',borderRadius: '10px'}}
                                required
                                type='text'
                                placeholder='Enter your TC Identity Number'
                                value= {idNumber ? idNumber : ''}
                                onChange={(e) => setIDNumber(e.target.value)}
                            >
                            </Form.Control>
                            <Form.Text className='text-muted'>Passport number if you are not TC citizen</Form.Text>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId='name'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                style={{border: '1px solid black',borderRadius: '10px'}}
                                required
                                type='text'
                                placeholder='Enter your name'
                                value={ name ? name : ''}
                                onChange={(e) => setName(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId='surname'>
                            <Form.Label>Surname</Form.Label>
                            <Form.Control
                                style={{border: '1px solid black',borderRadius: '10px'}}
                                required
                                type='text'
                                placeholder='Enter your surname'
                                value={ surname ? surname : ''}
                                onChange={(e) => setSurname(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId='number'>
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                style={{border: '1px solid black',borderRadius: '10px'}}
                                required
                                type='text'
                                placeholder='(5XX) XXX XX XX'
                                value={ phoneNumber ? phoneNumber : ''}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId='city'>
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                style={{border: '1px solid black',borderRadius: '10px'}}
                                required
                                type='text'
                                placeholder='Enter city'
                                value={ city ? city : ''}
                                onChange={(e) => setCity(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId='address'>
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                style={{border: '1px solid black',borderRadius: '10px'}}
                                required
                                as='textarea'
                                rows={2}
                                placeholder='Enter address'
                                value={ address ? address : ''}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Button type='submit' variant='primary' 
                    style={{border: '1px solid black',borderRadius: '10px', marginLeft: "200px"}}>
                    Continue
                </Button>
            </Form>
        </FormContainer>
    )
}

export default ShippingScreen

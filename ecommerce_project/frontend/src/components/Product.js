import React from 'react'
import { Button, Card } from 'react-bootstrap'
import Rating from './Rating'
import { Link } from 'react-router-dom'
//import addToCartHandler from '../screens/ProductScreen'

//<Link>
//<Button className='btn-block' onClick={addToCartHandler} disabled={product.countInStock === 0} type='button' style={{border: '1px solid black',borderRadius: '10px'}}>Add To Cart</Button>
//</Link>
const mystyle = {
    color: "white",
    backgroundColor: "DodgerBlue",
    padding: "5px",
    fontFamily: "Arial",
    fontSize: "0.8rem"

  };

function Product({product}) {
    return (
        <Card className="card my-3 p-3 rounded" style={{ width: '16rem' }}>
            <Link to={`/product/${product._id}`}>
                <Card.Img src={product.image} />
            </Link>
            
            <Card.Body>
                <Link to={`/product/${product._id}`}>
                    <Card.Title as="div">
                        <strong>{product.name}</strong>
                    </Card.Title>
                </Link>

                <Card.Text as="div">
                    <div className="my-3">                   
                        <Rating value={product.rating} text={`${product.numReviews} reviews `} color={'#f8e825'}/>
                    </div>
                </Card.Text>

                <Card.Text as="h3">
                    {product.discount > 0 && 
                        <span style={mystyle}>%{product.discount} SALE!</span>
                    }
                    {product.discount > 0 && 
                        <del class="fs-sm text-muted"><br/>{product.price}₺<br/></del>
                    }
                    {((product.price)*(100-(product.discount).toFixed(2))/100).toFixed(2)}₺
                    {product.discount == 0 && 
                        <p><br/></p>
                    }
                    
                </Card.Text>

            </Card.Body>

        </Card>
    )
}

export default Product

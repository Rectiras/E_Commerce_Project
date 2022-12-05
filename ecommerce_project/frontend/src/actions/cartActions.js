import axios from 'axios'
import { 
    CART_ADD_ITEM, 
    CART_REMOVE_ITEM, 
    CART_CLEAR_ITEMS, 
    CART_SAVE_SHIPPING_ADRESS,
    CART_SAVE_PAYMENT_METHOD,
    CART_ADD_ITEM_REQUEST,
    CART_ADD_ITEM_SUCCESS,
    CART_ADD_ITEM_FAIL,
    CART_REMOVE_ITEM_REQUEST,
    CART_REMOVE_ITEM_SUCCESS,
    CART_REMOVE_ITEM_FAIL,
    //CART_CLEAR_ITEMS_REQUEST,
    //CART_CLEAR_ITEMS_SUCCESS,
    //CART_CLEAR_ITEMS_FAIL
} from '../constants/cartConstants'

export const addToCart = (id, qty) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/products/${id}`)

    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            discount: data.discount,
            countInStock: data.countInStock,
            qty
        }
    })
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))



    // CART OPERATIONS
    try {
        dispatch({
            type: CART_ADD_ITEM_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.post(
            `/api/cart/add/`,
            //id means prodctuct_id
            {id,qty},
            config
        )
        
        dispatch({
            type: CART_ADD_ITEM_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: CART_ADD_ITEM_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }


}

export const removeFromCart = (id) => async (dispatch, getState) => {
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id,
    })
    
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))

    
    // CART OPERATIONS
    try {
        dispatch({
            type: CART_REMOVE_ITEM_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.post(
            `/api/cart/delete/`,
            //id means prodctuct_id
            {id},
            config
        )
        
        dispatch({
            type: CART_REMOVE_ITEM_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: CART_REMOVE_ITEM_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}
/*
export const clearCart = () => async (dispatch, getState) => {
    dispatch({
        type: CART_CLEAR_ITEMS,
    })
    
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))

    
    // CART OPERATIONS
    try {
        dispatch({
            type: CART_CLEAR_ITEMS_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.post(
            `/api/cart/clear/`,
            config
        )
        
        dispatch({
            type: CART_CLEAR_ITEMS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: CART_CLEAR_ITEMS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}*/

export const saveShippingAddress = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_SHIPPING_ADRESS,
        payload: data,
    })
    
    localStorage.setItem('shippingAddress', JSON.stringify(data))
}

export const savePaymentMethod = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data,
    })

    localStorage.setItem('paymentMethod', JSON.stringify(data))
}
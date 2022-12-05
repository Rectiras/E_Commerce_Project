import axios from 'axios'
import {
    REFUND_LIST_REQUEST,
    REFUND_LIST_SUCCESS,
    REFUND_LIST_FAIL,
    REFUND_LIST_RESET,

    REFUND_APPROVE_REQUEST,
    REFUND_APPROVE_SUCCESS,
    REFUND_APPROVE_FAIL,
    REFUND_APPROVE_RESET,


} from '../constants/refundConstants'


export const listRefunds = () => async (dispatch, getState) => {
    try { 
        dispatch({
            type: REFUND_LIST_REQUEST
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

        const { data } = await axios.get(
            `/api/refunds/`,
            config
        )

        dispatch({
            type: REFUND_LIST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: REFUND_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const approveRefund= (refund) => async (dispatch, getState) => {
    try {
        dispatch({
            type: REFUND_APPROVE_REQUEST
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

        const { data } = await axios.put(
            `/api/refunds/${refund._id}/approve/`,
            config
        )

        dispatch({
            type: REFUND_APPROVE_SUCCESS,
        })

        dispatch({
            type: REFUND_APPROVE_SUCCESS,
            payload: data
        })


    } catch (error) {
        dispatch({
            type: REFUND_APPROVE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}
import axios from 'axios'
import {
    REVIEW_LIST_REQUEST,
    REVIEW_LIST_SUCCESS,
    REVIEW_LIST_FAIL,
    REVIEW_LIST_RESET,

    REVIEW_APPROVE_REQUEST,
    REVIEW_APPROVE_SUCCESS,
    REVIEW_APPROVE_FAIL,
    REVIEW_APPROVE_RESET,


} from '../constants/reviewConstants'


export const listReviews = () => async (dispatch, getState) => {
    try { 
        dispatch({
            type: REVIEW_LIST_REQUEST
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
            `/api/reviews/`,
            config
        )

        dispatch({
            type: REVIEW_LIST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: REVIEW_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const approveReview= (review) => async (dispatch, getState) => {
    try {
        dispatch({
            type: REVIEW_APPROVE_REQUEST
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
            `/api/reviews/${review._id}/approve/`,
            config
        )

        dispatch({
            type: REVIEW_APPROVE_SUCCESS,
        })

        dispatch({
            type: REVIEW_APPROVE_SUCCESS,
            payload: data
        })


    } catch (error) {
        dispatch({
            type: REVIEW_APPROVE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}
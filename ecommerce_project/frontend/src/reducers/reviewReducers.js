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

export const reviewListReducer = (state = {reviews: []}, action) => {
    switch (action.type) {
        case REVIEW_LIST_REQUEST:
            return { loading: true }

        case REVIEW_LIST_SUCCESS:
            return { loading: false, reviews: action.payload }

        case REVIEW_LIST_FAIL:
            return { loading: false, error: action.payload }

        case REVIEW_LIST_RESET:

        default:
            return state
    }
}

export const reviewApproveReducer = (state = { review: {} }, action) => {
    switch (action.type) {
        case REVIEW_APPROVE_REQUEST:
            return { loading: true }

        case REVIEW_APPROVE_SUCCESS:
            return { loading: false, success: true }

        case REVIEW_APPROVE_FAIL:
            return { loading: false, error: action.payload }

        case REVIEW_APPROVE_RESET:
            

        default:
            return state
    }
}
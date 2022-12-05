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

export const refundListReducer = (state = {refunds: []}, action) => {
    switch (action.type) {
        case REFUND_LIST_REQUEST:
            return { loading: true }

        case REFUND_LIST_SUCCESS:
            return { loading: false, refunds: action.payload }

        case REFUND_LIST_FAIL:
            return { loading: false, error: action.payload }

        case REFUND_LIST_RESET:

        default:
            return state
    }
}

export const refundApproveReducer = (state = { refund: {} }, action) => {
    switch (action.type) {
        case REFUND_APPROVE_REQUEST:
            return { loading: true }

        case REFUND_APPROVE_SUCCESS:
            return { loading: false, success: true }

        case REFUND_APPROVE_FAIL:
            return { loading: false, error: action.payload }

        case REFUND_APPROVE_RESET:
            

        default:
            return state
    }
}
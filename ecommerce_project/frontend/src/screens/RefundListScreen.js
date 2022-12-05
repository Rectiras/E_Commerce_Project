import React, { useState, useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listRefunds,  approveRefund} from '../actions/refundActions'

function RefundListScreen({ history }) {

    const dispatch = useDispatch()

    const refundList = useSelector(state => state.refundList)
    const { loading, error, refunds } = refundList

    const refundApprove = useSelector(state => state.refundApprove)
    const { approved } = refundApprove

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin



    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listRefunds())
        } else {
            history.push('')
        }

    }, [dispatch, history, userInfo])

    function approveHandler(refund) {
        dispatch(approveRefund(refund))
        window.location.reload(false); 
      }


    return (
        <div>
            <h1 style={{ marginLeft: '430px'}}>Refunds</h1>
            {loading
                ? (<Loader />)
                : error
                    ? (<Message variant='danger'>{error}</Message>)
                    : (
                        <Table striped bordered hover responsive className='table-sm'>
                            <thead>
                                <tr>
                                    <th>ID</th>  
                                    <th>ORDER</th>
                                    <th>DATE</th>
                                    <th>MESSAGE</th>
                                    <th>STATUS</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>

                            <tbody>
                            {refunds.map(refund => (
                                    <tr key={refund._id}>
                                        <td>{refund._id}</td>
                                        <td>{refund.order}</td>
                                        <td>{refund.createdAt.substring(0, 10)}</td>

                                        <td>{refund.request_message}</td>


                                        <td>{refund.approved ? (
                                                <i className='fas fa-check' style={{ color: 'green' }}></i>
                                        ) : (
                                                <i className='fas fa-question' style={{ color: 'blue' }}></i>
                                            )}
                                        </td>

                                        <td>
      
                                                <Button variant='light' className='btn-sm' 
                                                    onClick={() => approveHandler(refund)}
                                                    style={{border: '1px solid black',borderRadius: '10px'}}>
                                                    Approve
                                                </Button>
                                            


                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
        </div>
    )
}

export default RefundListScreen
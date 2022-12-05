import React, { useState, useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listReviews,  approveReview} from '../actions/reviewActions'

function ReviewListScreen({ history }) {

    const dispatch = useDispatch()

    const reviewList = useSelector(state => state.reviewList)
    const { loading, error, reviews } = reviewList

    const reviewApprove = useSelector(state => state.reviewApprove)
    const { approved } = reviewApprove

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin



    useEffect(() => {
        if (userInfo && userInfo.isAdmin && userInfo['groups'][0]['name']=='productManager') {
            dispatch(listReviews())
        } else {
            history.push('')
        }

    }, [dispatch, history, userInfo])

    function approveHandler(review) {
        dispatch(approveReview(review))
        window.location.reload(false); 
      }


    return (
        <div>
            <h1 style={{ marginLeft: '430px'}}>Reviews</h1>
            {loading
                ? (<Loader />)
                : error
                    ? (<Message variant='danger'>{error}</Message>)
                    : (
                        <Table striped bordered hover responsive className='table-sm'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>USER</th>
                                    <th>DATE</th>
                                    <th>COMMENT</th>
                                    <th>STATUS</th>
                                    <th>ACTION</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {reviews.map(review => (
                                    <tr key={review._id}>
                                        <td>{review._id}</td>
                                        <td>{review.name}</td>
                                        <td>{review.createdAt.substring(0, 10)}</td>

                                        <td>{review.comment}</td>


                                        <td>{review.approved ? (
                                                <i className='fas fa-check' style={{ color: 'red' }}></i>
                                        ) : (
                                                <i className='fas fa-question' style={{ color: 'blue' }}></i>
                                            )}
                                        </td>

                                        <td>
      
                                                <Button variant='light' className='btn-sm' 
                                                    onClick={() => approveHandler(review)}
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

export default ReviewListScreen
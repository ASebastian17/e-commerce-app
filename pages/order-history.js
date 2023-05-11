import React, { useEffect, useReducer } from 'react';
import Link from 'next/link';
import axios from 'axios';

import Layout from '../components/Layout';
import { FETCH_REQUEST, FETCH_FAIL, FETCH_SUCCESS } from '../utils/constants';
import { getError } from '../utils/error';

const reducer = (state, action) => {
    switch (action.type) {
        case FETCH_REQUEST:
            return { ...state, loading: true, error: '' };

        case FETCH_SUCCESS:
            return { ...state, loading: false, orders: action.payload, error: '' };

        case FETCH_FAIL:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

function OrderHistoryScreen() {
    const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
        loading: true,
        orders: [],
        error: '',
    });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                dispatch({ type: FETCH_REQUEST });
                const { data } = await axios.get('api/orders/history');
                dispatch({ type: FETCH_SUCCESS, payload: data });
            } catch (error) {
                dispatch({ type: FETCH_FAIL, payload: getError(error) });
            }
        };

        fetchOrders();
    }, []);

    return (
        <Layout title='Order history'>
            <h1 className='mb-4 text-lg'>Order history</h1>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className='alert-error'>{error}</div>
            ) : (
                <div className='overflow-x-auto'>
                    <table className='min-w-full'>
                        <thead className='border-b'>
                            <tr>
                                <th className='px-5 text-left'>Id</th>
                                <th className='p-5 text-left'>Date</th>
                                <th className='p-5 text-left'>Total</th>
                                <th className='p-5 text-left'>Paid</th>
                                <th className='p-5 text-left'>Delivered</th>
                                <th className='p-5 text-left'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className='border-b'>
                                    <td className='p-5'>{order._id.substring(16, 24)}</td>
                                    <td className='p-5'>{order.createdAt.substring(0, 10)}</td>
                                    <td className='p-5'>{order.totalPrice}</td>
                                    <td className='p-5'>{order.isPaid ? `${order.paidAt.substring(0, 10)}` : 'Not paid'}</td>
                                    <td className='p-5'>{order.isDelivered ? `${order.deliveredAt.substring(0, 10)}` : 'Not delivered'}</td>
                                    <td className='p-5'>
                                        <Link href={`/order/${order._id}`}>Details</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Layout>
    );
}

OrderHistoryScreen.auth = true;

export default OrderHistoryScreen;

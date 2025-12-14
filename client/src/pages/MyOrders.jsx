import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext';
import { useSearchParams } from 'react-router-dom';
import { dummyOrders } from '../assets/assets';
import toast from 'react-hot-toast';

const MyOrders = () => {
    const [myOrders, setMyOrders] = useState ([]);
    const { currency, axios, user } = useAppContext();
    const [searchParams] = useSearchParams();

    const fetchMyOrders = async () => {
        try {
            const {data} = await axios.get('/api/order/user')
            if(data.success){
                setMyOrders(data.orders)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(user){
            fetchMyOrders()
        }
    },[user])

    useEffect(() => {
        // Check if user came from successful payment
        const reference = searchParams.get('reference');
        const trxref = searchParams.get('trxref');
        if (reference || trxref) {
            toast.success('Payment successful! Your order has been placed.');
            // Refresh orders list to show the new order
            if (user) {
                fetchMyOrders();
            }
            // Clean up URL parameters
            window.history.replaceState({}, document.title, '/my-orders');
        }
    }, [searchParams, user])

  return (
    <div className='mt-16 pb-16'>
        <div className='flex flex-col items-end w-max mb-8'>
            <p className='text-2xl font-medium uppercase'>My Orders</p>
            <div className='w-16 h-0.5 bg-yellow-600 rounded-full'></div>
        </div>
        {myOrders.length === 0 ? (
            <div className='text-center py-12'>
                <p className='text-gray-500 text-lg'>No orders found</p>
            </div>
        ) : (
            myOrders.map((order, index) => (
            <div key={index} className='border border-gray-300 rounded-lg
             p-4 mb-10 py-5 max-w-3xl'>
                <p className='flex justify-between md:items-center
                 text-gray-400 md:font-medium max-md:flex-col'>
                    <span>OrderId: {order._id}</span>
                    <span>Payment: {order.paymentType} {order.paymentType === "Online" && !order.isPaid ? "(Pending)" : order.isPaid ? "(Paid)" : ""}</span>
                    <span>Total Amount: {currency}{order.amount}</span>
                </p>
                {order.items.map((item, index) => (
                    <div key={index} className= {`relative bg-white text-gray-500/70 ${
                        order.items.length !== index + 1 && "border-b"}
                         border-gray-300 flex flex-col md:flex-row md:items-center 
                         justify-between py-5 max-w-4xl w-full md:gap-16`}> 

                        <div className='flex items-center mb-4 md:mb-0'>
                            <div className='bg-yellow-600/10 p-4 rounded-lg'>
                                <img src={item.product.image[0]} alt="" className='w-16 h-16' />
                            </div>
                            <div className='ml-4'> 
                                <h2 className='text-xl font-medium text-gray-800'>
                                 {item.product.name}</h2>
                                <p>Category: {item.product.category}</p>
                            </div>
                        </div>

                        <div className='flex flex-col justify-center md:ml-8 mb-4 md:mb-0'>
                            <p>Quantity: {item.quantity || "1"}</p>
                            <p>Status: {order.status}</p>
                            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p> 
                        </div>
                        <p className='text-yellow-600 text-md font-medium'>
                            Amount: {currency}{item.product.offerPrice * item.quantity}
                        </p>

                    </div>
                ))}
            </div>
            ))
        )}
    </div>
  )
}

export default MyOrders
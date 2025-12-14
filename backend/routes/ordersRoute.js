import express from 'express'
import authSeller from "../middlewares/authSeller.js";
import authUser from "../middlewares/authUser.js";
import { getAllOrders, getUserOrders, placeOrderCOD, placeOrderPaystack } from '../controllers/ordersController.js';







const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD)
orderRouter.get('/user', authUser, getUserOrders)
orderRouter.get('/seller', authSeller, getAllOrders)
orderRouter.post('/paystack', authUser, placeOrderPaystack)

export default orderRouter;
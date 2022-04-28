import express from 'express';
import orderController from '../controllers/orderController';

const routes = express.Router();

routes.get('/', orderController.getOrders);
routes.get('/single_user', orderController.getUserOrders);
routes.post('/add', orderController.addOrder);

export default routes;
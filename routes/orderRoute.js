import express from 'express';
import orderController from '../controllers/orderController';

const routes = express.Router();

routes.get('/', orderController.getOrders);
routes.post('/add', orderController.addOrder);

export default routes;
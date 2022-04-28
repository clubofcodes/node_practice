import express from 'express';
import orderController from '../controllers/orderController';

const routes = express.Router();

routes.get('/', orderController.getOrders);

export default routes;
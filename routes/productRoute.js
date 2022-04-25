import express from 'express';
import { addProduct, getProducts } from '../controllers/productController';

const routes = express.Router();

routes.get('/', getProducts);
routes.post('/add', addProduct)

export default routes;
import express from 'express';
import { addProduct, getProducts, updateProduct } from '../controllers/productController';

const routes = express.Router();

routes.get('/', getProducts);
routes.post('/add', addProduct);
routes.post('/update', updateProduct);

export default routes;
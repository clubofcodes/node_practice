import express from 'express';
import { addProduct, delOneProduct, getProducts, updateProduct } from '../controllers/productController';

const routes = express.Router();

routes.get('/', getProducts);
routes.post('/add', addProduct);
routes.post('/update', updateProduct);
routes.delete('/del/:id', delOneProduct);

export default routes;
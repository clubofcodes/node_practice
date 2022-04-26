import express from 'express';
import { addProduct, delOneProduct, getProducts, remProduct, updateProduct } from '../controllers/productController';

const routes = express.Router();

routes.get('/', getProducts);
routes.post('/add', addProduct);
routes.patch('/update', updateProduct);
routes.patch('/remove', remProduct);
routes.delete('/del/:id', delOneProduct);

export default routes;
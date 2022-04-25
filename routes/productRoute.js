import express from 'express';
import { getProducts } from '../controllers/productController';

const routes = express.Router();

routes.get('/', getProducts);

export default routes;
import express from 'express';
import productController from '../controllers/productController';

const routes = express.Router();

routes.get('/', productController.getProducts);
routes.post('/add', productController.addProduct);
routes.patch('/update', productController.updateProduct);
routes.patch('/sold', productController.changeQuantities);
routes.patch('/addqty', productController.addQty);
routes.get('/quantities/:id', productController.getQuantities);
routes.patch('/remove', productController.remProduct);
routes.delete('/del/:id', productController.delOneProduct);

export default routes;
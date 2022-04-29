import express from 'express';
import productController from '../controllers/productController';

const routes = express.Router();

// basic end-points to get add and update products.
routes.get('/', productController.getProducts);
routes.post('/add', productController.addProduct);
routes.patch('/update', productController.updateProduct);

// end-points to manage quantites for buynow and sold out products.
routes.get('/quantities/:id', productController.getQuantities);
routes.patch('/sold', productController.changeQuantities);
routes.patch('/addqty', productController.addQty);

// end-ponts for filtering the prodtuct.
routes.get('/all', productController.searchProducts);
routes.get('/sort', productController.sortProducts);


// soft delete and hard delete end-points
routes.patch('/remove', productController.remProduct);
routes.delete('/del/:id', productController.delOneProduct);

export default routes;
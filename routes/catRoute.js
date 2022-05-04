import express from 'express';
import catController from '../controllers/catController';
const routes = express.Router();

routes.get('/', catController.getCategories);
routes.post('/add', catController.addCategory);
routes.post('/update', catController.updateCategory);
routes.delete('/remove', catController.remCategory);

export default routes;
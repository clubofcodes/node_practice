import express from 'express';
import favController from '../controllers/favController';

const routes = express.Router();

routes.get('/all', favController.getFavourites);
routes.get('/one', favController.getUserFav);
routes.post('/add', favController.addFavourites);
routes.delete('/delete', favController.deleteFav);

export default routes;
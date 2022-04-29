import express from 'express';
import * as userController from "../controllers/userController";
import verifyToken from '../middleware/verifyToken';

const routes = express.Router();

routes.get('/getusers', verifyToken, userController.getUsers);
routes.post('/adduser', userController.addUser);
routes.patch('/removeuser/:id', userController.remUser);
routes.patch('/setstatus/', userController.setUserStatus);
routes.get('/del_cookie/:key', userController.deleteCookie);
routes.delete('/del/', userController.deleteAll);
routes.delete('/delone/:id', userController.deleteOne);

export default routes;
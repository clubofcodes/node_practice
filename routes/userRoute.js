import express from 'express';
import * as userController from "../controllers/userController";

const routes = express.Router();

routes.get('/getusers', userController.getUsers);
routes.post('/adduser', userController.addUser);
routes.patch('/removeuser/:id', userController.remUser);
routes.patch('/setstatus/', userController.setUserStatus);
routes.get('/del_cookie/:key', userController.deleteCookie);

export default routes;
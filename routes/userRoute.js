import express from 'express';
import * as userController from "../controllers/userController";

const routes = express.Router();

routes.get('/getusers', userController.getUsers);
routes.post('/adduser', userController.addUsers);
routes.patch('/removeuser/:id', userController.remUsers);
routes.patch('/setstatus/', userController.setUserStatus);

export default routes;
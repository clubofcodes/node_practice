import express from 'express';
import * as userController from "../controllers/userController";

const routes = express.Router();

//To GET active users listed method.
routes.get('/getusers', userController.getUsers);
//To Add users method.
routes.post('/adduser', userController.addUsers);
//To update deleted_at which behaves as deleted user.
routes.patch('/removeuser/:id', userController.remUsers);
//To update status to 0 or 1 for Active/Inactive.(LikeWise Toggle)
routes.patch('/setstatus/', userController.setUserStatus);

export default routes;
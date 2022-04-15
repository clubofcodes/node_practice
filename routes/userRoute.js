var routes = require('express').Router();
// import * as userController from "../controllers/userController.js";
const userController = require('../controllers/userController');

routes.get('/getusers', userController.getUsers);
routes.post('/adduser', userController.addUsers);
routes.patch('/removeuser/:id', userController.remUsers);
routes.patch('/setstatus/', userController.setUserStatus);

module.exports = routes;
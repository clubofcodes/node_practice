import express from 'express';
import * as authController from "../controllers/authController";

const routes = express.Router();

routes.post('/register', authController.signUp);
routes.post('/login', authController.signIn);

export default routes;
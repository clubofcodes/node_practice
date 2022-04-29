import express from "express";
import * as userRouter from "./userRoute.js";

const routes = express.Router();

//common endpoint for all userRouter APIs
routes.use("/user", userRouter.default);

export default routes;
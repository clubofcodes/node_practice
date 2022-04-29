import express from "express";
import * as userRouter from "./userRoute";
import * as authRouter from "./authRoute";

const routes = express.Router();

//common endpoint for all userRouter APIs.
routes.use("/user", userRouter.default);
//common endpoint for all auth related APIs.
routes.use("/auth_user", authRouter.default);

export default routes;
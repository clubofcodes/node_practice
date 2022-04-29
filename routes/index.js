import express from "express";
import * as userRouter from "./userRoute";
import * as authRouter from "./authRoute";
import * as productRouter from "./productRoute";

const routes = express.Router();

//common endpoint for all userRouter APIs.
routes.use("/user", userRouter.default);
//common endpoint for all auth related APIs.
routes.use("/auth_user", authRouter.default);
//common endpoint for all product related APIs.
routes.use("/product", productRouter.default);

export default routes;
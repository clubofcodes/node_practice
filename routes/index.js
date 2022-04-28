import express from "express";
import * as userRouter from "./userRoute";
import * as authRouter from "./authRoute";
import * as productRouter from "./productRoute";
import * as orderRouter from "./orderRoute";

const routes = express.Router();

//common endpoint for userRouter all APIs.
routes.use("/user", userRouter.default);
//common endpoint for auth related all APIs.
routes.use("/auth_user", authRouter.default);
//common endpoint for product related all APIs.
routes.use("/product", productRouter.default);
//common endpoint for order related all APIs.
routes.use("/order", orderRouter.default);

export default routes;
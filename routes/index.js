var routes = require("express").Router();
// import * as userRouter from "./userRoute.js";
const userRouter = require('./userRoute');

routes.use("/user", userRouter);

// export default routes;
module.exports = routes;
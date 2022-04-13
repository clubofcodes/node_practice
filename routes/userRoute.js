var express = require('express');
var userRouter = express.Router();
const Users = require("../models/userSchema");


/* GET users listing. */
userRouter.get('/users', function(req, res) {
  res.send('respond with a resource');
});

module.exports = userRouter;

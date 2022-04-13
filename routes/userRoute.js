var express = require('express');
var userRouter = express.Router();
const Users = require("../models/userSchema");


// GET users listing.
userRouter.get('/users', async (req, res) => {
  try {
    const usersData = await Users.find();
    console.log(usersData);
    usersData.length > 0 ?
      res.status(200).send({ status_code: 200, message: "Fetched all users data.", data: usersData }) :
      res.status(200).send({ status_code: 200, message: "No users found!!" });
  } catch (error) {
    console.log("Error", error.message);
    res.status(400).send({ error: error.message });
  }
});

module.exports = userRouter;

var express = require('express');
var userRouter = express.Router();
const User = require("../models/userSchema");

// GET users listing method.
userRouter.get('/user', async (req, res) => {
  try {
    const usersData = await User.find();
    // console.log(usersData);
    usersData.length > 0 ?
      res.status(200).send({ status_code: 200, message: "Fetched all users data.", data: usersData }) :
      res.status(200).send({ status_code: 200, message: "No users found!!" });
  } catch (error) {
    console.log("Fetch User Error", error.message);
    res.status(400).send({ status_code: 400, error: error.message });
  }
});

// Add users method.
userRouter.post('/user', async (req, res) => {

  const { first_name, last_name, username, email, dob } = req.body;

  // console.log(new Date("01/05/1999").toISOString().split('T')[0]); // To get universal format.
  console.log(new Date(dob).toLocaleDateString('en-IN')); // To get Indian format.

  if (!first_name || !last_name || !username || !email || !dob) {
    res.status(400).send({ status_code: 400, error: "Fill all the details" });
  } else {

    try {
      const isUserFound = await User.findOne({ username });
      if (isUserFound) {
        res.status(200).send({ status_code: 200, message: "Please enter a another username!!", data: isUserFound })
      } else {
        const newUserData = new User({ first_name, last_name, username, email, dob });
        await newUserData.save();

        res.status(200).send({ status_code: 200, message: "User added successfully!!", data: newUserData });
      }
    } catch (error) {
      console.log("Add User Error", error.message);
      res.status(400).send({ status_code: 400, error: error.message });
    }
  }
});

userRouter.patch('/user/:id', async (req, res) => {
  try {

    const _id = req.params.id;

    //To verify pwd sent by user is same as encrypted in db.
    const isUserFound = await User.findOne({ _id });

    const todayDate = new Date()

    if (isUserFound) {
      const updatedUserData = await User.findByIdAndUpdate(_id, { deleted_at: Date.now() }, { new: true });
      res.send({ status_code: 200, message: "User deleted successfully!!", data: updatedUserData });
    } else {
      res.status(200).send({ status_code: 200, message: "User not found!!" })
    }

  } catch (error) {
    console.log("Delete User Error", error.message);
    res.status(400).send({ status_code: 400, error: error.message });
  }
});

module.exports = userRouter;

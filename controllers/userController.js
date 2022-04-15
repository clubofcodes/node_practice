const User = require("../models/userSchema");

/**
 * 
 * @param {*} req nothing.
 * @param {*} res all users data with deleted_at:null, success/error message and status code.
 */
const getUsers = async (req, res) => {
    try {
        const usersData = await User.find();
        // console.log(usersData);
        usersData.length > 0 ?
            res.status(200).send({ status_code: 200, message: "Fetched all users data.", data: usersData.filter((user) => user.deleted_at === null) }) :
            res.status(200).send({ status_code: 200, message: "No users found!!" });
    } catch (error) {
        console.log("Fetch User Error", error.message);
        res.status(400).send({ status_code: 400, error: error.message });
    }
}

/**
 * 
 * @param {*} req userSchema fields(first_name, last_name, username, email, dob) from body.
 * @param {*} res added user data, success/error message and status code.
 */
const addUsers = async (req, res) => {

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
}

/**
 * 
 * @param {*} req user object _id from params.
 * @param {*} res user data with updated deleted_at timestamp, success/error message and status code.
 */
const remUsers = (req, res) => {
    try {

        const todayTimeStamp = new Date();
        todayTimeStamp.setHours(todayTimeStamp.getHours() + 5);
        todayTimeStamp.setMinutes(todayTimeStamp.getMinutes() + 30);

        const todayDateInMili = Date.now() //In milli-seconds.

        User.findByIdAndUpdate(req.params.id, { deleted_at: todayTimeStamp }, { new: true }, (err, data) => {
            err ? res.status(400).send({ status_code: 400, error: err }) :
                data ?
                    res.send({ status_code: 200, message: "User deleted successfully!!", data: data }) :
                    res.status(200).send({ status_code: 200, message: "User not found!!" })
        });

    } catch (error) {
        console.log("Delete User Error", error.message);
        res.status(400).send({ status_code: 400, error: error.message });
    }
}

/**
 * 
 * @param {*} req user object _id from body.
 * @param {*} res user data with updated status value, success/error message and status code.
 */
const setUserStatus = async (req, res) => {
    try {

        const userStatus = await User.findOne({ _id: req.body._id });

        User.findByIdAndUpdate(req.body._id, { status: userStatus.status ? 0 : 1 }, { new: true }, (err, data) => {
            err ? res.status(400).send({ status_code: 400, error: err }) :
                data ?
                    res.send({ status_code: 200, message: "User is inactive!!", data: data }) :
                    res.status(200).send({ status_code: 200, message: "User not found!!" })
        });

    } catch (error) {
        console.log("Delete User Error", error.message);
        res.status(400).send({ status_code: 400, error: error.message });
    }
}

module.exports = { getUsers, addUsers, remUsers, setUserStatus };
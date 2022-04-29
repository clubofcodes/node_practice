import * as query_config from "../config/config";
import User from "../models/userSchema";

//object variable containing required status code in api.
// const status_codes = { ok: query_config.all_status_code.ok, err: query_config.all_status_code.bad };

/**
 * 
 * @param {*} req nothing.
 * @param {*} res all users data with deleted_at:null, success/error message and status code.
 */
export const getUsers = async (req, res) => {
    try {
        const usersData = await User.find({ deleted_at: null });
        // console.log(usersData);
        usersData.length > 0 ?
            res.status(200).send({ status_code: 200, message: "Fetched all users data.", data: usersData }) :
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
export const addUsers = async (req, res) => {

    const { first_name, last_name, username, email, dob } = req.body;

    // console.log(new Date("01/05/1999").toISOString().split('T')[0]); // To get universal format.
    console.log(new Date(dob).toLocaleDateString('en-IN')); // To get Indian format.

    if (!first_name || !last_name || !username || !email || !dob) {
        res.status(400).send({ status_code: 400, error: "Fill all the details" });
    } else {

        try {
            const isUserFound = await User.findOne({ username });
            if (isUserFound) {
                res.status(200).send({ status_code: 200, message: "Username already exists, please enter a another username!!", data: isUserFound })
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
export const remUsers = (req, res) => {
    try {
        const todayTimeStamp = new Date();
        //Logic to add GMT +5:30hrs in currentTimeStamp.
        todayTimeStamp.setHours(todayTimeStamp.getHours() + 5);
        todayTimeStamp.setMinutes(todayTimeStamp.getMinutes() + 30);

        const todayDateInMili = Date.now() //In milli-seconds.

        const msg = { ok: "User deleted successfully!!", err: "User not found!!" };
        //calling find_Update method from config to update deleted_at using findByIdAndUpdate.
        query_config.find_Update(User, req.params.id, "deleted_at", todayTimeStamp, res, query_config.all_status_code, msg);

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
export const setUserStatus = async (req, res) => {
    try {
        const userStatus = await User.findOne({ _id: req.body._id });

        const msg = { ok: `User is ${userStatus.status ? "InActive!!" : "Active!!"}`, err: "User not found!!" }
        //calling find_Update method from config to update status using findByIdAndUpdate.
        query_config.find_Update(User, req.body._id, "status", userStatus.status ? 0 : 1, res, query_config.all_status_code, msg);

    } catch (error) {
        console.log("Delete User Error", error.message);
        res.status(400).send({ status_code: 400, error: error.message });
    }
}

// export { getUsers, addUsers, remUsers, setUserStatus };
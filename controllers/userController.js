import * as all_config from "../config";
import User from "../models/userSchema";
import * as common_query from "../service/common";

/**
 * 
 * @param {*} req nothing.
 * @param {*} res all users data with deleted_at:null, success/error message and status code.
 * Author: Rahul Jagetia 
 */
export const getUsers = async (req, res) => {
    try {
        const usersData = await User.find({ deleted_at: null });
        // console.log(usersData);

        //adding a cookie. 
        //used maxAge and expires both, cause some browser doesn't support maxAge.
        res.cookie('collection_size', usersData?.length, {
            // path: '/user/getusers',//sets path to which it belongs.
            maxAge: 60000, //sets time when to delete, take value in mili(1k=1sec).
            expires: new Date(Date.now() + 6000), //sets date when to delete.
            secure: true, //can only be transferred over secure/HTTPS
            httpOnly: true, //cannot be read or modified by the browser
            sameSite: 'Lax' //avoids privacy leaks. such as lax to limit the cookie to same-site requests.
        });

        usersData.length ?
            res.status(all_config.status_codes.ok).send({ status_code: all_config.status_codes.ok, message: "Fetched all users data.", data: usersData }) :
            res.status(all_config.status_codes.ok).send({ status_code: all_config.status_codes.ok, message: "No users found!!" });
    } catch (error) {
        console.log("Fetch User Error", error.message);
        res.status(all_config.status_codes.bad).send({ status_code: all_config.status_codes.bad, error: error.message });
    }
}

/**
 * 
 * @param {*} req userSchema fields(first_name, last_name, username, email, password, dob) from body.
 * @param {*} res added user data, success/error message and status code.
 */
export const addUser = async (req, res) => {

    //de-structuring req.body fields.
    const { first_name, last_name, username, email, password, dob } = req.body;

    // console.log(new Date("01/05/1999").toISOString().split('T')[0]); // To get universal format.
    console.log(new Date(dob).toLocaleDateString('en-IN')); // To get Indian format.

    //to verify empty field.
    if (!first_name || !last_name || !username || !email || !password || !dob) {
        res.status(all_config.status_codes.bad).send({ status_code: all_config.status_codes.bad, error: "Fill all the details" });
    } else {

        try {
            const FoundUserData = await User.findOne({ username });
            //to verify user exists.
            if (isUserFound) {
                res.status(all_config.status_codes.ok).send({ status_code: all_config.status_codes.ok, message: "Username already exists, please enter a another username!!", data: FoundUserData })
            } else {
                const newUserData = new User({ first_name, last_name, username, email, password, dob });
                await newUserData.save();

                res.status(all_config.status_codes.ok).send({ status_code: all_config.status_codes.ok, message: "User registered successfully!!", data: newUserData });
            }
        } catch (error) {
            console.log("Add User Error", error.message);
            res.status(all_config.status_codes.bad).send({ status_code: all_config.status_codes.bad, error: error.message });
        }
    }
}

/**
 * to update deleted_at which behaves as deleted user.
 * @param {*} req user object _id from params.
 * @param {*} res user data with updated deleted_at timestamp, success/error message and status code.
 */
export const remUser = (req, res) => {
    try {
        const todayTimeStamp = new Date();
        //to add GMT +5:30hrs in currentTimeStamp.
        todayTimeStamp.setHours(todayTimeStamp.getHours() + 5);
        todayTimeStamp.setMinutes(todayTimeStamp.getMinutes() + 30);

        // const todayDateInMili = Date.now() //In milli-seconds.

        const msg = { ok: "User deleted successfully!!", err: "User not found!!" };
        //calling find_Update method from config to update deleted_at using findByIdAndUpdate.
        common_query.find_Update(User, req.params.id, "deleted_at", todayTimeStamp, res, all_config.status_codes, msg);

    } catch (error) {
        console.log("Delete User Error", error.message);
        res.status(all_config.status_codes.bad).send({ status_code: all_config.status_codes.bad, error: error.message });
    }
}

/**
 * to update status to 0 or 1 for Active/Inactive(LikeWise Toggle)
 * @param {*} req user object _id from body.
 * @param {*} res user data with updated status value, success/error message and status code.
 */
export const setUserStatus = async (req, res) => {
    try {
        const userStatus = await User.findOne({ _id: req.body._id });

        const msg = { ok: `User is ${userStatus.status ? "InActive!!" : "Active!!"}`, err: "User not found!!" }
        //calling find_Update method from config to update status using findByIdAndUpdate.
        common_query.find_Update(User, req.body._id, "status", userStatus.status ? 0 : 1, res, all_config.status_codes, msg);

    } catch (error) {
        console.log("Delete User Error", error.message);
        res.status(all_config.status_codes.bad).send({ status_code: all_config.status_codes.bad, error: error.message });
    }
}

/**
 * delete the saved cookie.
 * @param {*} req request arguments to get param value.
 * @param {*} res success/error message and status code.
 */
export const deleteCookie = (req, res) => {
    try {
        const cookie_name = req.params.key; // del_cookie/:key params value.
        res.clearCookie(cookie_name);
        res.send({ status_code: all_config.status_codes.ok, message: `Cookie ${cookie_name} has been deleted successfully` });
    } catch (error) {
        res.send({ status_code: all_config.status_codes.bad, error: error.message });
    }
}


export const deleteall = async (req, res) => {
    try {
        await User.deleteMany({});
        res.send({ status_code: all_config.status_codes.ok, message: 'All user deleted successfully!!' });
    } catch (error) {
        res.send({ status_code: all_config.status_codes.bad, error: error.message });
    }
}

// export { getUsers, addUsers, remUsers, setUserStatus };
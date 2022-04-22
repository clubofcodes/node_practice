import { status_codes } from "../config";
import User from "../models/userSchema";
import * as common_query from "../service/common";
import responseFunction from "../utils/responseFunction";
import { isEmpty } from "../utils/schemaValidator";
import { securePassword } from "../utils/securePassword";

/**
 * 
 * @param {*} req nothing.
 * @param {*} res all users data with deleted_at:null, success/error message and status code.
 * Author: Rahul Jagetia 
 */
export const getUsers = async (req, res) => {
    try {
        //find accepts 2 params: first for query(where) and second is for projection to omit any field.
        const usersData = await User.find({ deleted_at: null }, { password: 0 });
        const delUsersData = await User.find({}, { password: 0 });
        // console.log(usersData);

        //adding a cookie. 
        //used maxAge and expires both, cause some browser doesn't support maxAge.
        res.cookie('Available_Users', usersData?.length, {
            // path: '/user/getusers',//sets path to which it belongs.
            maxAge: 60000, //sets time when to delete, take value in mili(1k=1sec).
            expires: new Date(Date.now() + 6000), //sets date when to delete.
            secure: true, //can only be transferred over secure/HTTPS
            httpOnly: true, //cannot be read or modified by the browser
            sameSite: 'Lax' //avoids privacy leaks. such as lax to limit the cookie to same-site requests.
        }).cookie('Deleted_Users', delUsersData?.length - usersData?.length, { maxAge: 60000 }).cookie('Total_Users', delUsersData?.length, { maxAge: 60000 });

        usersData.length ?
            res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Fetched all available users data!!", usersData))
            : res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "No user found!!"));

    } catch (error) {
        console.log("Fetch User Error", error.message);
        res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
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
    if (isEmpty(first_name, last_name, username, email, password, dob)) {
        res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, "Fill all the details."));
    } else {

        try {
            const foundUserData = await User.findOne({ username }, { password: 0 });

            //to verify user exists.
            if (foundUserData) {
                res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Username already exists, please enter a another username!!", foundUserData))
            } else {
                const newUserData = await User.create({ ...req.body, password: await securePassword(password) });

                const { password: hiddenPwd, ...withoutPwdUserData } = newUserData._doc;

                res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "User added successfully!!", withoutPwdUserData));
            }
        } catch (error) {
            console.log("Add User Error", error.message);
            res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
        }
    }
}

/**
 * to update deleted_at which behaves as deleted user.
 * @param {*} req user's object _id from params.
 * @param {*} res user's data with updated deleted_at timestamp, success/error message and status code.
 */
export const remUser = async (req, res) => {
    try {
        const todayTimeStamp = new Date();
        //to add GMT +5:30hrs in currentTimeStamp.
        todayTimeStamp.setHours(todayTimeStamp.getHours() + 5);
        todayTimeStamp.setMinutes(todayTimeStamp.getMinutes() + 30);

        // const todayDateInMili = Date.now() //In milli-seconds.

        const userAvailable = await User.findOne({ _id: req.params.id, deleted_at: null });

        const msg = { ok: "User deleted successfully!!", err: "User doesn't exist!!" };

        userAvailable ?
            //calling find_Update method from config to update deleted_at using findByIdAndUpdate.
            common_query.find_Update(User, req.params.id, "deleted_at", todayTimeStamp, res, status_codes, msg)
            : res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, msg.err));

    } catch (error) {
        console.log("Delete User Error", error.message);
        res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
    }
}

/**
 * to update status to 0 or 1 for Active/Inactive(LikeWise Toggle)
 * @param {*} req user's object _id from body.
 * @param {*} res user's data with updated status value, success/error message and status code.
 */
export const setUserStatus = async (req, res) => {
    if (isEmpty(req.body?._id)) {
        res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, "Enter user _id to set status."));
    }
    else {
        try {
            const userStatus = await User.findOne({ _id: req.body._id });

            const msg = { ok: `User is now ${userStatus?.status ? "InActive!!" : "Active!!"}`, err: "User doesn't exist!!" }

            userStatus ?
                //calling find_Update method from config to update status using findByIdAndUpdate.
                common_query.find_Update(User, req.body._id, "status", userStatus.status ? 0 : 1, res, status_codes, msg)
                : res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, msg.err));

        } catch (error) {
            res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
        }
    }
}

/**
 * delete the saved cookie.
 * @param {*} req request argument to get param value.
 * @param {*} res success/error message and status code.
 */
export const deleteCookie = (req, res) => {
    try {
        const cookie_name = req.params.key; // del_cookie/:key params value.

        res.clearCookie(cookie_name);

        res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, `Cookie ${cookie_name} has been deleted successfully`));

    } catch (error) {
        res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
    }
}

/**
 * to delete all the data from mongodb.
 * @param {*} req does nothing.
 * @param {*} res success/error message and status code.
 */
export const deleteAll = async (req, res) => {
    try {

        await User.deleteMany({});

        res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "All user deleted successfully!!"));

    } catch (error) {
        res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
    }
}

/**
 * to delete data by params id only.
 * @param {*} req request argument to get user's object _id value from params.
 * @param {*} res deleted user's username, success/error message and status code.
 */
export const deleteOne = async (req, res) => {
    try {

        const delUserData = await User.findByIdAndDelete(req.params.id);

        delUserData ?
            res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, `${delUserData?.username} deleted successfully!!`))
            : res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "User doesn't exist!!"));

    } catch (error) {
        res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
    }
}

// export { getUsers, addUsers, remUsers, setUserStatus };
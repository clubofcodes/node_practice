import { status_codes } from "../config";
import User from "../models/userSchema";
import responseFunction from "../utils/responseFunction";
import { securePassword, comparePassword } from "../utils/securePassword";

/**
 * 
 * @param {*} req userSchema fields(first_name, last_name, username, email, password, dob) from body.
 * @param {*} res registered user data, success/error message and status code.
 */
const signUp = async (req, res) => {

    //de-structuring req.body fields.
    const { first_name, last_name, username, email, password, c_pwd, dob } = req.body;

    //to verify empty field.
    if (!first_name || !last_name || !username || !email || !password || !c_pwd || !dob) {
        res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, "Fill all the details"));
    } else if (password !== c_pwd) {
        res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, "Password and Confirm Password does not match!!"));
    }
    else {

        try {
            const foundUserData = await User.findOne({ username });
            //to verify user exists.
            if (foundUserData) {
                res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Username already exists, please enter a another username!!", foundUserData))
            } else {

                const newUserData = new User({ first_name, last_name, username, email, password: await securePassword(password), dob });

                await newUserData.save();

                res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "User registered successfully!!", newUserData));
            }
        } catch (error) {
            res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
        }
    }
}

/**
 *
 * @param {*} req username or email and password.
 * @param {*} res logged in user data, success/error message and status code.
 */
const signIn = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, "Fill all the details"));
    } else {
        try {
            //to verify user either by username or email.
            const loggedInUser = await User.findOne({ username }) || await User.findOne({ email: username });
            const withoutPwdUserData = await User.findOne({ username }, { password: 0 }) || await User.findOne({ email: username }, { password: 0 });

            if (loggedInUser) {

                !await comparePassword(password, loggedInUser.password) ?
                    res.status(status_codes.auth).send(responseFunction(true, status_codes.auth, "Invalid Credentials")) :
                    res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "User logged in successfully!!", withoutPwdUserData));

            } else res.status(status_codes.ok).send(responseFunction(true, status_codes.ok, "User doesn't exist!!"));
        } catch (error) {
            res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
        }
    }
}

export { signUp, signIn };
import * as all_config from "../config";
import User from "../models/userSchema";
import bcrypt from "bcryptjs";

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
        res.status(all_config.status_codes.bad).send({ status_code: all_config.status_codes.bad, error: "Fill all the details!!" });
    } else if (password !== c_pwd) {
        res.status(all_config.status_codes.bad).send({ status_code: all_config.status_codes.bad, error: "Password and Confirm Password does not match!!" });
    }
    else {

        try {
            const isUserFound = await User.findOne({ username });
            //to verify user exists.
            if (isUserFound) {
                res.status(all_config.status_codes.ok).send({ status_code: all_config.status_codes.ok, message: "Username already exists, please enter a another username!!", data: isUserFound })
            } else {
                // generate salt to hash password till 10 rounds.
                const salt = await bcrypt.genSalt(10);
                // pwd encryption.
                const hashed_pwd = await bcrypt.hash(password, salt);

                const newUserData = new User({ first_name, last_name, username, email, password: hashed_pwd, dob });

                await newUserData.save();

                res.status(all_config.status_codes.ok).send({ status_code: all_config.status_codes.ok, message: "User registered successfully!!", data: newUserData });
            }
        } catch (error) {
            res.status(all_config.status_codes.bad).send({ status_code: all_config.status_codes.bad, error: error.message });
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
        res.status(all_config.status_codes.bad).send({ status_code: all_config.status_codes.bad, error: "Fill all the details" });
    } else {
        try {
            //to verify user either by username or email.
            const logedInUser = await User.findOne({ username }) || await User.findOne({ email: username });
            if (logedInUser) {
                //to verify req.body password with db password.
                const isMatch = await bcrypt.compare(password, logedInUser.password);
                !isMatch ?
                    res.status(all_config.status_codes.auth).send({ status_code: all_config.status_codes.auth, error: "Invalid Credentials" }) :
                    res.status(all_config.status_codes.ok).send({ status_code: all_config.status_codes.ok, message: "User logged in successfully!!", data: logedInUser });
            } else res.status(all_config.status_codes.ok).send({ status_code: all_config.status_codes.ok, error: "User doesn't exist!!" });
        } catch (error) {
            res.status(all_config.status_codes.bad).send({ status_code: all_config.status_codes.bad, error: error.message });
        }
    }
}

export { signUp, signIn };
import { JWT_KEY, status_codes } from "../config";
import User from "../models/userSchema";
import responseFunction from "../utils/responseFunction";
import { isEmpty, isPwdValid } from "../utils/schemaValidator";
import { securePassword, comparePassword } from "../utils/securePassword";
import jwt from "jsonwebtoken";
import sendAMail from "../service/sendAMail";
import mailOptions from "../utils/mailOptions";

/**
 * 
 * @param {*} req userSchema fields(first_name, last_name, username, email, password, dob) and c_pwd from body.
 * @param {*} res registered user data, success/error message and status code.
 */
const signUp = async (req, res) => {

    //de-structuring req.body fields.
    const { first_name, last_name, username, email, password, c_pwd, dob, mail_sub, mail_greet, mail_msg } = req.body;

    //to verify empty field.
    if (isEmpty(first_name, last_name, username, email, password, c_pwd, dob)) {
        res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, "Fill all the details."));
    } else if (!isPwdValid(password)) {
        res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, ['Must Contain 8 Characters', 'One Uppercase, One Lowercase', 'One Number and one special case Character']));
    }
    else if (password !== c_pwd) {
        res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, "Password and Confirm Password does not match."));
    }
    else {

        try {
            const foundUserData = await User.findOne({ username }, { password: 0 });
            //to verify user exists.
            if (foundUserData) {
                res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Username already exists, please enter a another username!!", foundUserData))
            } else {

                const newUserData = new User({ first_name, last_name, username, email, password: await securePassword(password), dob });

                await newUserData.save();

                // service call to send mail and passed mailOptions as argument from utils.
                await sendAMail(mailOptions(email, mail_sub, mail_greet, first_name, last_name, mail_msg));

                const { password: hiddenPwd, ...withoutPwdUserData } = newUserData._doc;

                res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "User registered successfully!!", withoutPwdUserData));
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

    if (isEmpty(username, password)) {
        res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, "Fill all the details."));
    } else {
        try {
            // to verify user either by username or email.
            const loggedInUser = await User.findOne({ username }) || await User.findOne({ email: username });
            const withoutPwdUserData = await User.findOne({ username }, { password: 0 }) || await User.findOne({ email: username }, { password: 0 });

            if (loggedInUser && loggedInUser.status === 0) {
                res.status(status_codes.auth).send(responseFunction(false, status_codes.ok, "Your account is blocked!!", withoutPwdUserData))
            } else if (loggedInUser && !loggedInUser.deleted_at) {
                // to verify password matches with the db password.
                if (!await comparePassword(password, loggedInUser.password)) res.status(status_codes.auth).send(responseFunction(true, status_codes.auth, "Invalid Credentials."))
                else {

                    // to share security information between two parties — a client and a server.
                    // generates the token string madeup of 3 parts(header, payload, Key)
                    const jwtToken = jwt.sign({ _id: loggedInUser._id }, JWT_KEY);
                    // console.log(jwtToken);

                    // passes token to header.
                    res.header("auth-token", jwtToken);

                    res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "User logged in successfully!!", withoutPwdUserData));
                }

            } else res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "User doesn't exist!!"));
        } catch (error) {
            res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
        }
    }
}

export { signUp, signIn };
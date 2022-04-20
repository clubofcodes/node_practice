import * as all_config from "../config";
import User from "../models/userSchema";

/**
 * 
 * @param {*} req userSchema fields(first_name, last_name, username, email, password, dob) from body.
 * @param {*} res added user data, success/error message and status code.
 */
const signUp = async (req, res) => {

    //de-structuring req.body fields.
    const { first_name, last_name, username, email, password, c_pwd, dob } = req.body;

    console.log(new Date(dob).toLocaleDateString('en-IN')); // To get Indian format.

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
                const newUserData = new User({ first_name, last_name, username, email, password, dob });
                await newUserData.save();

                res.status(all_config.status_codes.ok).send({ status_code: all_config.status_codes.ok, message: "User added successfully!!", data: newUserData });
            }
        } catch (error) {
            console.log("Add User Error", error.message);
            res.status(all_config.status_codes.bad).send({ status_code: all_config.status_codes.bad, error: error.message });
        }
    }
}

export { signUp };
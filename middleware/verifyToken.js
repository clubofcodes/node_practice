import { JWT_KEY, status_codes } from "../config";
import responseFunction from "../utils/responseFunction";
import jwt from "jsonwebtoken";
import User from "../models/userSchema";
import { isEmpty } from "../utils/schemaValidator";

/**
 * middleware to prevent route from unauthorized user.
 * @param {*} req to get token from header if genrated by user during login and send logged in user data.
 * @param {*} res sends catch_block/unauthorized error msg if any, including status code.
 * @param {*} next it passes control to the next matching route.
 */
const verifyToken = async (req, res, next) => {
    try {
        // console.log(req.headers.authorization);

        // getting logged in user token from header.
        const authorizedToken = req.headers.authorization;
        
        //to verify accessing middleware route with token.
        if (isEmpty(authorizedToken)) {
            res.status(status_codes.auth).send(responseFunction(true, status_codes.auth, "Unauthorized user, no token provided."))
        } else {
            //token verification.
            const isUserValid = jwt.verify(authorizedToken, JWT_KEY);
            // console.log(isUserValid);
            const currentUser = await User.findOne({ _id: isUserValid._id });
            //Does user exists? (Ex. user is logged in and user/admin delete's the account)
            if (!currentUser) { throw new Error("User doesn't exist, need to register first.") };
            //to set field in req with logged in user data.
            req.loggedInUser = currentUser;

            next();
        }

    } catch (error) {
        console.log("JWT middleware: ", error);
        res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
    }
}

export default verifyToken;
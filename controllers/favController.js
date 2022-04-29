import { status_codes } from "../config";
import Fav from "../models/favSchema";
import responseFunction from "../utils/responseFunction";
import { isEmpty } from "../utils/schemaValidator";

const favController = {
    /**
     * @param {*} req nothing.
     * @param {*} res sends all favourites data, success/error message and status code.
     * Author: Rahul Jagetia 
     */
    getFavourites: async (req, res) => {
        try {

            const favData = await Fav.find({}).populate("u_id p_id");

            favData.length ?
                res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Fetched all products favourites!!", favData))
                : res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "No Favourites Yet!!"));
        } catch (error) {
            console.log("All fav Fetch Error", error.message);
            res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
        }
    },

    /**
     * to get favourites list of particular user by user_id.
     * @param {*} req to get user id (i.e., u_id) from body.
     * @param {*} res sends all favourites product data added by user else error message with status code.
     */
    getUserFav: async (req, res) => {
        //to verify empty field.
        if (isEmpty(req.body.u_id)) res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, "User id is required."))
        else {
            try {
                const userfavData = await Fav.findOne({ u_id: req.body.u_id }).populate("u_id").populate("p_id"); //or .populate("u_id p_id")
                // console.log(userfavData);

                !userfavData?.u_id || !userfavData ?
                    res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "User doesn't exist!!"))
                    : !userfavData.p_id ?
                        res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "No Favourites Yet!!"))
                        : res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, `Fetched favourites of ${userfavData.u_id?.username}`, userfavData));
            } catch (error) {
                console.log("UserWise fav Fetch Error", error.message);
                res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
            }
        }
    },

    /**
     * @param {*} req to get favSchema fields from body. 
     * @param {*} res sends added favourite's data, success/error message and status code.
     */
    addFavourites: async (req, res) => {

        //de-structuring req.body fields.
        const { p_id, u_id } = req.body;

        //to verify empty field.
        if (isEmpty(p_id, u_id)) res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, "Both user and product id are required."));
        else {

            try {
                // to find user exists.
                const foundUserData = await Fav.findOne({ u_id });

                if (foundUserData) {
                    const updateFavData = await Fav.findByIdAndUpdate(foundUserData._id, { p_id }, { new: true }).populate("p_id u_id");
                    res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Added to favourites!!", updateFavData));
                } else {
                    const newFavData = await Fav.create({ p_id, u_id });
                    await newFavData.populate("u_id p_id");
                    res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Added to favourites!!", newFavData));
                }

            } catch (error) {
                console.log("Add Fav Error", error.message);
                res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
            }
        }
    },

    /**
     * @param {*} req to get product id (i.e., p_id) from body.
     * @param {*} res sends deleted success/error message and status code.
     */
    deleteFav: async (req, res) => {

        //de-structuring req.body fields.
        const { u_id, p_id } = req.body;

        //to verify empty field.
        if (isEmpty(u_id, p_id)) res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, "Both user and product id are required."));
        else {

            try {
                const findFavProduct = await Fav.findOne({ $and: [{ u_id }, { p_id }] });
                // console.log(findFavProduct);

                if (!findFavProduct || !findFavProduct?.p_id) res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "No Favourites Yet!!"))
                else {
                    //to delete favourite from db.
                    findFavProduct.p_id = null;
                    findFavProduct.save();
                    res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Deleted from favourite!!"));
                }

            } catch (error) {
                console.log("Fav delete Error", error.message);
                res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
            }
        }
    },
}

export default favController;
import { status_codes } from "../config";
import Product from "../models/productSchema";
import responseFunction from "../utils/responseFunction";

/**
 * 
 * @param {*} req nothing.
 * @param {*} res all products data, success/error message and status code.
 * Author: Rahul Jagetia 
 */
const getProducts = async (req, res) => {
    try {
        //find accepts 2 params: first for query(where) and second is for projection to omit any field.
        const productsData = await Product.find({});
        console.log(productsData);

        productsData.length ?
            res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Fetched all products data!!", productsData))
            : res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "No product found!!"));
    } catch (error) {
        console.log("Product Fetch Error", error.message);
        res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
    }
}

export { getProducts };
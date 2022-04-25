import { status_codes } from "../config";
import Product from "../models/productSchema";
import { find_Update } from "../service/common";
import responseFunction from "../utils/responseFunction";
import { isEmpty } from "../utils/schemaValidator";

/**
 * @param {*} req nothing.
 * @param {*} res all available products data, success/error message and status code.
 * Author: Rahul Jagetia 
 */
const getProducts = async (req, res) => {
    try {
        //find accepts 2 params: first for query(where) and second is for projection to omit any field.
        const availableProducts = await Product.find({ deleted_at: null });
        // console.log(availableProducts);

        availableProducts.length ?
            res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Fetched all products data!!", availableProducts))
            : res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "No product found!!"));
    } catch (error) {
        console.log("Product Fetch Error", error.message);
        res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
    }
}


/**
 * @param {*} req to get productSchema fields from body.
 * @param {*} res sends added product's data, success/error message and status code.
 */
const addProduct = async (req, res) => {

    //de-structuring req.body fields.
    const { id, product_name, description, price, weight, size, discount_percentage, brand_name, total_quantity, remaining_quantity, sold_quantity, product_origin } = req.body;

    //to verify empty field.

    if (isEmpty(id, product_name, description, price, weight, size, discount_percentage, brand_name, total_quantity, remaining_quantity, sold_quantity, product_origin)) {
        res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, "Fill all the details."));
    } else {

        try {
            //to verify product exists.
            const foundProductData = await Product.findOne({ $or: [{ id }, { product_name }] });
            if (foundProductData) {
                res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Product is already available, please enter a another product!!", foundProductData));
            } else {
                const newProductData = await Product.create(req.body);

                res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Product added successfully!!", newProductData));
            }
        } catch (error) {
            console.log("Add Product Error", error.message);
            res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
        }
    }
}

/**
 * to update product single or multi fields.
 * @param {*} req product's object _id and fields to update from body.
 * @param {*} res updated product's data, success/error message and status code.
 */
const updateProduct = async (req, res) => {
    if (isEmpty(req.body?._id)) {
        res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, "Enter user object_id to update product."));
    }
    else {
        try {
            //to verify product exists.
            const foundProductData = await Product.findOne({ _id: req.body._id });
            if (!foundProductData) res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Product not available."));
            else {
                //de-structuring req.body fields to remove _id from update.
                const { _id: obj_id, ...withoutObjIdData } = req.body;

                //calling find_Update method from config to update product using findByIdAndUpdate.
                const updatedData = await find_Update(Product, req.body._id, withoutObjIdData);

                updatedData &&
                    res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Product Updated!!", updatedData));
            }

        } catch (error) {
            res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
        }
    }
}

export { getProducts, addProduct, updateProduct };
import { status_codes } from "../config";
import Product from "../models/productSchema";
import { find_Update } from "../service/common";
import { calc } from "../utils/calculation";
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
            const foundProductData = await Product.findOne({ $or: [{ id }, { product_name }, { description }] });
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
 * to update product's single or multi fields.
 * @param {*} req product id/object _id and fields to update from body.
 * @param {*} res sends updated product's data if product is updated, success/error message and status code.
 */
const updateProduct = async (req, res) => {
    if (isEmpty(req.body?._id) && isEmpty(req.body?.id)) res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, "Enter product id or object_id to update product."));
    else {

        try {
            //to verify product exists.
            const foundProductData = await Product.findOne({ $or: [{ _id: req.body._id }, { id: req.body.id }] });
            if (!foundProductData) res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "There is no such product."));
            else {
                //de-structuring req.body fields to remove _id from update.
                const { _id: obj_id, id: p_id, ...withoutIdData } = req.body;

                // //will give array of product if any of withoutObjIdData field matches in db.
                // const matchedProductData = await Product.findOne($or);
                // console.log(matchedProductData, matchedProductData.length);

                // //checks that incoming data is same or new.
                // if (matchedProductData.length) res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Got same data, No document was updated."));
                // else {
                //to check product is removed then don't update.
                if (!foundProductData.deleted_at) {
                    const updatedData = await Product.findByIdAndUpdate(req.body._id || foundProductData._id, withoutIdData, { new: true });

                    updatedData &&
                        res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Product Updated!!", updatedData));
                } else res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "You are trying to update removed product."));

                // }
            }

        } catch (error) {
            res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
        }
    }
}

/**
 * to remove data by id only from body.
 * @param {*} req argument to get product's object _id from body.
 * @param {*} res sends removed product's name, success/error message and status code.
 */
const remProduct = async (req, res) => {
    if (isEmpty(req.body?._id) && isEmpty(req.body?.id)) res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, "Enter product id or object_id to update product."))
    else {

        try {

            //to verify product exists.
            const foundProductData = await Product.findOne({ $or: [{ _id: req.body._id }, { id: req.body.id }] });
            // console.log(!foundProductData, (req.body._id || foundProductData._id));

            if (!foundProductData) res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "There is no such product."));
            else {
                // console.log(calc.currentTimeStamp());
                // to check product is removed then don't let remove and update delete_at with currentTimeStamp.
                if (!foundProductData.deleted_at) {
                    const updatedData = await Product.findByIdAndUpdate(req.body._id || foundProductData._id, { deleted_at: calc.currentTimeStamp() }, { new: true });

                    updatedData &&
                        res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, `<${updatedData?.product_name}> Product is removed!!`, updatedData));
                } else res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, `Product is already removed on <${calc.remDateGMT(foundProductData.deleted_at.toString())}> .`));
            }

        } catch (error) {
            res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
        }
    }
}

/**
 * to delete data by params id only.
 * @param {*} req request argument to get user's object _id value from params.
 * @param {*} res deleted product's name, success/error message and status code.
 */
const delOneProduct = async (req, res) => {
    try {

        const delProductData = await Product.findByIdAndDelete(req.params.id);

        delProductData ?
            res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, `<${delProductData?.product_name}> deleted successfully!!`))
            : res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "There is no such product."));

    } catch (error) {
        res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
    }
}

export { getProducts, addProduct, updateProduct, remProduct, delOneProduct };
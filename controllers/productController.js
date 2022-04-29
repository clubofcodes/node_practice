import { status_codes } from "../config";
import Product from "../models/productSchema";
import { calc } from "../utils/calculation";
import responseFunction from "../utils/responseFunction";
import { isEmpty } from "../utils/schemaValidator";

const productController = {
    /**
     * @param {*} req nothing.
     * @param {*} res sends all available product data, success/error message and status code.
     * Author: Rahul Jagetia 
     */
    getProducts: async (req, res) => {
        // console.log(req.query);
        if (req.query?.search || !isEmpty(req.query?.search)) productController.searchProducts(req, res);
        else {
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
    },

    /**
     * @param {*} req to get productSchema fields from body. 
     * @param {*} res sends added product's data, success/error message and status code.
     */
    addProduct: async (req, res) => {

        //de-structuring req.body fields.
        const { id, product_name, description, price, weight, size, discount_percentage, brand_name, total_quantity, product_origin } = req.body;

        //to verify empty field.
        if (isEmpty(id, product_name, description, price, weight, size, discount_percentage, brand_name, total_quantity, product_origin)) {
            res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, "Fill all the details."));
        } else {

            try {
                //to verify product exists.
                const foundProductData = await Product.findOne({ $or: [{ id }, { product_name }, { description }] });
                if (foundProductData) {
                    res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Product is already available, please enter a another product!!", foundProductData));
                } else {
                    const newProductData = await Product.create({ ...req.body, remaining_quantity: total_quantity });

                    res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Product added successfully!!", newProductData));
                }
            } catch (error) {
                console.log("Add Product Error", error.message);
                res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
            }
        }
    },

    /**
     * @param {*} req product id/object_id and fields to update from body.
     * @param {*} res sends updated product's data if product is updated, success/error message and status code.
     */
    updateProduct: async (req, res) => {
        if (isEmpty(req.body?._id) && isEmpty(req.body?.id)) res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, "Enter product id or object_id to update product."));
        else {

            try {
                //to verify product exists.
                const foundProductData = await Product.findOne({ $or: [{ _id: req.body._id }, { id: req.body.id }] });
                if (!foundProductData) res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "There is no such product."));
                else {
                    // de-structuring req.body fields to remove _id from update.
                    const { _id: obj_id, id: p_id, ...withoutIdData } = req.body;

                    // will give array of product if any of withoutObjIdData field matches in db.
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
    },

    /**
     * to list count of all quantity.
     * @param {*} req product id/object_id and sold_quantity to update from body.
     * @param {*} res sends product all quantities in data object, success/error message and status code.
     */
    getQuantities: async (req, res) => {
        try {

            const requestedProduct = req.params.id.length === 24 ? await Product.findOne({ $and: [{ _id: req.params.id }, { deleted_at: null }] }) : await Product.findOne({ $and: [{ id: req.params.id }, { deleted_at: null }] });
            // console.log(requestedProduct ? requestedProduct.total_quantity : `${req.params.id} is removed or doesn't exists.`);

            //to fetch quantities of that product only which is available and not removed.
            if (requestedProduct) {
                //de-structuring quantity fields from product data(i.e., available). 
                const { product_name, total_quantity, remaining_quantity, sold_quantity } = requestedProduct?._doc;
                res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, `Fetched all quantities of ${product_name}`, { total_quantity, remaining_quantity, sold_quantity }))
            } else res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, `${requestedProduct?.id || req.params.id} is removed or doesn't exists.`));

        } catch (error) {
            console.log("Product Fetch Error", error.message);
            res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
        }
    },

    /**
     * to update remaining quantity and sold quantity by depending on each other.
     * @param {*} req product id/object_id and sold_quantity to update from body.
     * @param {*} res sends sold product's data with sold_quantity, success/error message with product_name/qty and status code.
     */
    changeQuantities: async (req, res) => {
        const { _id, id, sold_quantity } = req.body;
        if (isEmpty(_id, sold_quantity) && isEmpty(id, sold_quantity)) res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, "Enter product id/object_id and sold_quantity to buy product."));
        else {

            try {
                //to verify product exists.
                const foundProductData = await Product.findOne({ $and: [{ $or: [{ _id }, { id }] }, { deleted_at: null }] });
                // to show msg if product doesn't exist.
                if (!foundProductData) res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Product is removed or doesn't exists."));
                // when product is out of stock.
                else if (isNaN(sold_quantity)) res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, `${sold_quantity} is not a valid quantity.`));
                else if (sold_quantity === 0 || Number(foundProductData.remaining_quantity) === 0) res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, `${foundProductData.product_name} is sold out.`));
                // to check no. of products(buying) available to purchase.
                else if (foundProductData.remaining_quantity < sold_quantity) res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, `Only ${foundProductData.remaining_quantity} quantity is available of ${foundProductData?.product_name}.`));
                else {
                    const soldProductData = await Product.findByIdAndUpdate(_id || foundProductData._id, { sold_quantity: Number(foundProductData.sold_quantity) + sold_quantity, remaining_quantity: Number(foundProductData.remaining_quantity) - sold_quantity }, { new: true });
                    res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, `${sold_quantity} product sold out.`, soldProductData));
                }

            } catch (error) {
                res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
            }
        }
    },

    /**
     * to add more product's quantity into total_quantity field as well as remaining_quantity field.
     * @param {*} req product id/object_id and add_qty to update from body.
     * @param {*} res sends added quantity product's data with product's name and added qty, success/error message with product_name/qty and status code.
     */
    addQty: async (req, res) => {
        //de-structuring req.body
        const { _id, id, add_qty } = req.body;
        if ((isEmpty(_id, add_qty) && isEmpty(id, add_qty))) res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, "Enter product id/object_id and add_qty to add product quantity."));
        else {

            try {
                //to verify product exists.
                const foundProductData = await Product.findOne({ $and: [{ $or: [{ _id }, { id }] }, { deleted_at: null }] });
                // to show msg if product doesn't exist.
                if (!foundProductData) res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Product is removed or doesn't exists."));
                // to show error message when add_aty value is string or less than 0.
                else if (add_qty <= 0 || (isNaN(add_qty))) res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, `${add_qty} quantity can't be added.`));
                else {
                    const addedQtyProductData = await Product.findByIdAndUpdate(_id || foundProductData._id, { total_quantity: Number(foundProductData.total_quantity) + add_qty, remaining_quantity: Number(foundProductData.remaining_quantity) + add_qty }, { new: true });
                    res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, `${add_qty} quantity of ${foundProductData.product_name} added!!`, addedQtyProductData));
                }

            } catch (error) {
                res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
            }
        }
    },

    /**
     * to only search from all product's.
     * @param {*} req query params of search string.
     * @param {*} res sends single or list of product that matches search string, success/error message with quantity and search string and status code.
     */
    searchProducts: async (req, res) => {
        // console.log(Object.keys(req.query).length === 0, req.query.search);
        const search_str = req.query?.search.split(" ")[0];
        // console.log(search_str);
        if (isEmpty(req.query, search_str) || !/^[a-z0-9]+$/i.test(search_str)) res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, "Search value is required and only type string is valid."));
        else {
            try {
                //to match case-insensitive string in product_name using RegExp.
                const searchedProductsData = await Product.find({ product_name: new RegExp(search_str, 'i') }); //Search Query Method - 2: product_name: { $regex: `${search_str}`, $options: 'i' }

                searchedProductsData.length ?
                    res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, `Found ${searchedProductsData.length} product with ${search_str}.`, searchedProductsData))
                    : res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, `No results found for ${search_str}.`));
            } catch (error) {
                res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
            }
        }
    },

    /**
     * to only search from all product's.
     * @param {*} req query params of sort and by string.
     * @param {*} res sends single or list of product as per sorting, success/error message with quantity and sorted by and status code.
     */
    sortProducts: async (req, res) => {
        // de-structuring req.query
        const { sort, by } = req.query;
        if (isEmpty(req.query, sort, by) || !/^[a-z0-9_]+$/i.test(sort) || !/^[a-z0-9]+$/i.test(by)) res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, "Sort and by value is required and only type string is valid."));
        else {
            try {
                //
                const sortedProductsData = await Product.find({}).sort({ [sort]: by });

                sortedProductsData.length ?
                    res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, `Sorted ${sortedProductsData.length} product by ${sort}.`, sortedProductsData))
                    : res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, `Can't sort for ${sort}.`));
            } catch (error) {
                res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
            }
        }
    },

    /**
     * to soft remove data by id from body.
     * @param {*} req argument to get product's object _id from body.
     * @param {*} res sends removed product's name, success/error message and status code.
     */
    remProduct: async (req, res) => {
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
    },

    /**
     * to hard delete data by params id.
     * @param {*} req request argument to get user's object _id value from params.
     * @param {*} res deleted product's name, success/error message and status code.
     */
    delOneProduct: async (req, res) => {
        try {

            const delProductData = await Product.findByIdAndDelete(req.params.id);

            delProductData ?
                res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, `<${delProductData?.product_name}> deleted successfully!!`))
                : res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "There is no such product."));

        } catch (error) {
            res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
        }
    }
}

export default productController;
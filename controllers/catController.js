import Cat from "../models/catSchema";
import { status_codes } from "../config";
import responseFunction from "../utils/responseFunction";
import { isEmpty } from "../utils/schemaValidator";
import { calc } from "../utils/calculation";
import Product from "../models/productSchema";

const catController = {
    /**
     * @param {*} req nothing.
     * @param {*} res sends all categories array list, success/error message and status code.
     * Author: Rahul Jagetia 
     */
    getCategories: async (req, res) => {
        try {

            const categoryData = await Cat.find({ deleted_at: null });

            categoryData.length ?
                res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Fetched all category!!", categoryData))
                : res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Can't find any category!!"));
        } catch (error) {
            console.log("All Category Fetch Error", error.message);
            res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
        }
    },

    /**
     * @param {*} req to get category name from body.
     * @param {*} res sends added category name, success/error message and status code.
     */
    addCategory: async (req, res) => {

        //de-structuring req.body fields.
        const { cat_name } = req.body;

        //to verify empty field.
        if (isEmpty(cat_name) || !/^[a-z ]{3,50}$/i.test(cat_name)) res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, "Category name is required, minimum 3 character long and only alphabets."));
        else {

            try {
                // to find user exists.
                const foundCategoryData = await Cat.findOne({ cat_name });

                if (foundCategoryData) res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Same Category is available, enter another!!", foundCategoryData))
                else {
                    const newCategoryData = await Cat.create({ cat_name });
                    res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Category added successfully!!", newCategoryData));
                }

            } catch (error) {
                console.log("Add Category Error", error.message);
                res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
            }
        }
    },

    /**
     * @param {*} req to get category name from body.
     * @param {*} res sends updated category data, success/error message with category name and status code.
     */
    updateCategory: async (req, res) => {

        //de-structuring req.body fields.
        const { _id, cat_name } = req.body;

        //to verify empty field.
        if (isEmpty(_id, cat_name) || !/^[a-z ]{3,50}$/i.test(cat_name)) res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, "Category name is required, minimum 3 character long and only alphabets."));
        else {

            try {
                // to find user exists.
                const foundCategoryData = await Cat.findOne({ $and: [{ _id }, { deleted_at: null }] });

                if (!foundCategoryData) res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, `${cat_name} category is removed or doesn't exists.`))
                else {
                    const updatedCategoryData = await Cat.findByIdAndUpdate(_id, { cat_name, updated_at: calc.currentTimeStamp() }, { new: true });
                    res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Category updated successfully!!", updatedCategoryData));
                }

            } catch (error) {
                console.log("Update Category Error", error.message);
                res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
            }
        }
    },

    /**
     * @param {*} req to get category object_id from params.
     * @param {*} res sends removed category name, success/error message with category name and status code.
     */
    remCategory: async (req, res) => {

        //de-structuring req.body fields.
        const { cat_name } = req.body;

        //to verify empty field.
        if (isEmpty(cat_name) || !/^[a-z ]{3,50}$/i.test(cat_name)) res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, "Category name is required, minimum 3 character long and only alphabets."));
        else {

            try {
                const findCategoryName = await Cat.findOne({ $and: [{ cat_name }, { deleted_at: null }] });

                if (!findCategoryName) res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, `${cat_name} category is removed or doesn't exists.`))
                else {
                    const removedCategoryData = await Cat.findOneAndUpdate({ cat_name }, { deleted_at: calc.currentTimeStamp() }, { new: true });

                    if (removedCategoryData.deleted_at) {
                        const categoryProductData = await Product.find({ cat_name_id: { $exists: true, $eq: findCategoryName?._id } });
                        //to remove products of cat_name from db.
                        (categoryProductData.length) &&
                            await Product.updateMany({ cat_name_id: { $exists: true, $eq: findCategoryName?._id }, deleted_at: null }, { deleted_at: calc.currentTimeStamp() });
                    }

                    res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, `${cat_name} category is Removed!!`));
                }

            } catch (error) {
                console.log("Remove Category Error", error.message);
                res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
            }
        }
    },
}

export default catController;
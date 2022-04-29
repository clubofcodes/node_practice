import { status_codes } from "../config";
import Order from "../models/orderSchema";
import responseFunction from "../utils/responseFunction";
import { isEmpty } from "../utils/schemaValidator";

const orderController = {
    /**
     * @param {*} req nothing.
     * @param {*} res sends all orders data, success/error message and status code.
     * Author: Rahul Jagetia 
     */
    getOrders: async (req, res) => {
        try {
            const orderedData = await Order.find({});

            orderedData ?
                res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Fetched all orders!!", orderedData))
                : res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "No orders found!!"));
        } catch (error) {
            console.log("Order Fetch Error", error.message);
            res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
        }
    },

    /**
     * to get orders list of particular user by user_id.
     * @param {*} req to get user id (i.e., u_id) from body.
     * @param {*} res sends all orders placed by user else error message with status code.
     */
    getUserOrders: async (req, res) => {
        //to verify empty field.
        if (isEmpty(req.body.u_id)) res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, "User id is required."))
        else {
            try {
                const userOrderedData = await Order.findOne({ u_id: req.body.u_id }).populate("u_id").populate("p_id"); //or .populate("u_id p_id")
                console.log(userOrderedData);

                !userOrderedData?.u_id || !userOrderedData ?
                    res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "User doesn't exist!!"))
                    : !userOrderedData.p_id ?
                        res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "No orders found!!"))
                        : res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, `Fetched orders of ${userOrderedData.u_id?.username}`, userOrderedData));
            } catch (error) {
                console.log("Order Fetch Error", error.message);
                res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
            }
        }
    },

    /**
     * @param {*} req to get orderSchema fields from body. 
     * @param {*} res sends added order's data, success/error message and status code.
     */
    addOrder: async (req, res) => {

        //de-structuring req.body fields.
        const { p_id, u_id } = req.body;

        //to verify empty field.
        if (isEmpty(p_id, u_id)) res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, "Both user and product id are required."));
        else {

            try {
                // to find user exists.
                const foundUserData = await Order.findOne({ u_id });

                if (foundUserData) {
                    const updateOrderData = await Order.findByIdAndUpdate(foundUserData._id, { p_id }, { new: true }).populate("p_id u_id");
                    res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Order added successfully!!", updateOrderData));
                } else {
                    const newOrderData = await Order.create({ p_id, u_id });
                    console.log(await newOrderData.populate("p_id u_id"));
                    res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Order added successfully!!", newOrderData));
                }

            } catch (error) {
                console.log("Add Order Error", error.message);
                res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
            }
        }
    },

    /**
     * @param {*} req to get product id (i.e., p_id) from body.
     * @param {*} res sends canceled order data, success/error message and status code.
     */
    cancelOrder: async (req, res) => {

        //de-structuring req.body fields.
        const { u_id, p_id } = req.body;

        //to verify empty field.
        if (isEmpty(u_id, p_id)) res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, "Both user and product id are required."));
        else {

            try {
                const findProductOrder = await Order.findOne({ $and: [{ u_id }, { p_id }] });
                // console.log(findProductOrder);

                if (!findProductOrder || !findProductOrder?.p_id) res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Can't find order with that product."))
                else {
                    //to delete order from db.
                    findProductOrder.p_id = null;
                    findProductOrder.save();
                    res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Order cancelled successfully!!", findProductOrder));
                }

            } catch (error) {
                console.log("Cancel Order Error", error.message);
                res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
            }
        }
    },
}

export default orderController;
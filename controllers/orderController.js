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
                const newOrderData = await Order.create({ p_id, u_id });

                res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Order added successfully!!", newOrderData));
            } catch (error) {
                console.log("Add Order Error", error.message);
                res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
            }
        }
    },
}

export default orderController;
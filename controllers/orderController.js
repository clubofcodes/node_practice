import { status_codes } from "../config";
import Order from "../models/orderSchema";
import { calc } from "../utils/calculation";
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
            const ordersData = await Order.find({});
            console.log(ordersData);

            ordersData.length ?
                res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "Fetched all orders!!", ordersData))
                : res.status(status_codes.ok).send(responseFunction(false, status_codes.ok, "No orders found!!"));
        } catch (error) {
            console.log("Order Fetch Error", error.message);
            res.status(status_codes.bad).send(responseFunction(true, status_codes.bad, error.message));
        }
    },

    /**
     * @param {*} req to get orderSchema fields from body. 
     * @param {*} res sends added product's data, success/error message and status code.
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
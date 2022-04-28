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
    }
}

export default orderController;
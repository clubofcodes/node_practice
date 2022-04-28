import { Schema, model } from "mongoose";
import { schema_configs } from "../config";

/**
 * order collection schema field declaration with validations.
 */
const orderSchema = Schema({
    p_id: {
        ...schema_configs.basic_validators,
        unique: true
    },
    u_id: {
        ...schema_configs.basic_validators,
        unique: true
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: false
    }
});

const Order = model("Order", orderSchema);
export default Order;
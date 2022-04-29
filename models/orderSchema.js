import { Schema, model } from "mongoose";

/**
 * order collection schema field declaration with ref to other collections.
 */
const orderSchema = Schema({
    u_id: {
        type: Schema.Types.ObjectId,
        unique:true,
        ref: 'User'
    }, 
    p_id: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: false
    }
});

const Order = model("Order", orderSchema);
export default Order;
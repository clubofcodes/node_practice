import { Schema, model } from "mongoose";
import { schema_configs } from "../config";

/**
 * product collection schema field declaration with validations.
 * Available types:[String, Number, Date, Buffer, Boolean, Mixed, ObjectId, Array, Decimal128, Map, Schema]
 */
const productSchema = Schema({
    id: {
        ...schema_configs.basic_validators,
        unique: true
    },
    product_name: {
        ...schema_configs.basic_validators,
        unique: true
    },
    description: {
        ...schema_configs.basic_validators,
    },
    price: {
        type: Schema.Types.Mixed,
        ...schema_configs.basic_validators,
    },
    weight: {
        type: Number,
        ...schema_configs.basic_validators,
    },
    size: {
        type: Number,
        ...schema_configs.basic_validators,
    },
    discount_percentage: {
        type: Number,
        ...schema_configs.basic_validators,
    },
    brand_name: {
        ...schema_configs.basic_validators,
    },
    cat_name_id: {
        type: Schema.Types.ObjectId,
        ref: "Category"
    },
    total_quantity: {
        type: Number,
        ...schema_configs.basic_validators
    },
    remaining_quantity: {
        type: Number,
        ...schema_configs.basic_validators
    },
    sold_quantity: {
        type: Number,
        ...schema_configs.basic_validators,
        default: 0
    },
    product_origin: {
        ...schema_configs.basic_validators
    },
    deleted_at: {
        type: Date,
        default: null
    },
    updated_at: {
        type: Date,
        default: null
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: false
    }
});

const Product = model("Product", productSchema);
export default Product;
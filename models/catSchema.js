import { Schema, model } from "mongoose";
import { schema_configs } from "../config";

/**
 * Categories collection schema field declaration.
 */
const favSchema = Schema({
    cat_name: {
        ...schema_configs.basic_validators,
        unique: true
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

const Cat = model("Category", favSchema);
export default Cat;
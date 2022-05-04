import { Schema, model } from "mongoose";

/**
 * favourites collection schema field declaration with ref to User and Product collection.
 */
const favSchema = Schema({
    u_id: {
        type: Schema.Types.ObjectId,
        unique: true,
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

const Fav = model("Favourite", favSchema);
export default Fav;
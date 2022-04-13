const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase:true,
        match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*(\.\w{2,64})+$/, 'Please fill a valid email address']
    },
    dob: {
        type: Date,
        required: true,
    },
    status: {
        type: Number,
        enum: [0, 1],
        default: 1
    },
    deleted_at: {
        type: Date,
        default: null
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

// Method-2: using set
// userSchema.set('timestamps', true);

const User = mongoose.model("User", userSchema);
module.exports = User;
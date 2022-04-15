const mongoose = require("mongoose");

/**
 * user collection schema field declaration with validations.
 */
const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, ' Must be at least 3, got {VALUE}']
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, ' Must be at least 3, got {VALUE}']
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_\W]).{4,25}$/, 'Not a valid username!!']
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*(\.\w{2,64})+$/, 'Please enter a valid email address!!']
    },
    dob: {
        type: String,
        required: true,
        // validate: {
        //     validator: function (v) {
        //         return /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/.test(v);
        //     },
        //     message: props => `${props.value} is not a valid dob in DD/MM/YYYY format.`
        // },
        match: [/^(0[1-9]|1[0-2])-(0[1-9]|1\d|2\d|3[01])-(19|20)\d{2}$/, 'Enter a valid dob in DD-MM-YYYY format.']
    },
    status: {
        type: Number,
        enum: {
            values: [0, 1],
            message: '{VALUE} is not supported'
        },
        default: 1
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

// Method-2: using set
// userSchema.set('timestamps', true);

const User = mongoose.model("User", userSchema);
module.exports = User;
import { Schema, model } from "mongoose";
import { schema_configs } from "../config";

/**
 * user collection schema field declaration with validations.
 */
const userSchema = Schema({
    first_name: {
        ...schema_configs.basic_validators,
        minlength: [3, ' Must be at least 3, got {VALUE}']
    },
    last_name: {
        ...schema_configs.basic_validators,
        minlength: [3, ' Must be at least 3, got {VALUE}']
    },
    username: {
        ...schema_configs.basic_validators,
        unique: true,
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_\W]).{4,25}$/, 'Not a valid username!!']
    },
    email: {
        ...schema_configs.basic_validators,
        lowercase: true,
        match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*(\.\w{2,64})+$/, 'Please enter a valid email address!!']
    },
    password: {
        ...schema_configs.basic_validators,
    },
    dob: {
        ...schema_configs.basic_validators,
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
            values: [schema_configs.enum_val.inactive, schema_configs.enum_val.active],
            message: '{VALUE} is not supported'
        },
        default: schema_configs.enum_val.active
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

const User = model("User", userSchema);
export default User;
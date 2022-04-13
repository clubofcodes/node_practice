//Import or include pkg Using ES6 module
// import { connect } from "mongoose";

const mongoose = require("mongoose");

//Getting mongodb connection string from environment variables.
const DB = process.env.DATABASE;

//To connect the practice_db database running in MongoDB with the mongoose.connect() method.
mongoose.connect(DB)
    .then(() => console.log("Database Connected"))
    .catch(err => console.log("Database Error: ", err.message));
//Import or include pkg Using ES6 module
// import { connect } from "mongoose";

const mongoose = require("mongoose");

//Getting mongodb connection string from environment variables.
// const DB = process.env.CLUSTER_DB;
const DB = process.env.LOCAL_DB;

//To connect the practice_db database running in MongoDB with the mongoose.connect() method.
mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Database Connected"))
    .catch(err => console.log("Database Error: ", err.message));
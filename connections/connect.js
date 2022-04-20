//Import or include pkg Using ES6 module
import { connect } from "mongoose";
//included config.js to access all db related variables.
import * as dbconfig from "../config";

//Getting mongodb connection string from environment variables.
// const CDB = `mongodb+srv://${dbconfig.configs.staging.db_user}:${dbconfig.configs.staging.db_pwd}@${dbconfig.configs.staging.cluster_name}.onh30.mongodb.net/${dbconfig.configs.staging.db_pwd}?retryWrites=true&w=majority`; //staging cluster db string.
const LDB = `mongodb://localhost:27017/${dbconfig.configs.local.db_name}`; //local db string.
// console.log(dbconfig);

//To connect the practice_db database running in MongoDB with the mongoose.connect() method.
connect(LDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Database Connected Successfully!!"))
    .catch(err => console.log("Database Error: ", err.message));
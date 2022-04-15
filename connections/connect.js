//Import or include pkg Using ES6 module
import { connect } from "mongoose";

//Getting mongodb connection string from environment variables.
// const DB = process.env.CLUSTER_DB; //cloud cluster db string.
const DB = process.env.LOCAL_DB; //local db string.
// console.log(DB);

//To connect the practice_db database running in MongoDB with the mongoose.connect() method.
connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Database Connected"))
    .catch(err => console.log("Database Error: ", err.message));

// export default connect;
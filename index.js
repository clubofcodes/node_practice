//Import or include pkg Using ES6 module
import "dotenv/config";

import express from "express";
const app = express();

//imported db connection file.
import "./connections/connect";

//Importing all routes from routes dir.
import routes from "./routes/index.js";

//Getting port number string from environment variables.
const port = process.env.PORT || 3000;

//About/Info route
app.get("/about", (req, res) => {
    // res.send("Welcome to world of APIs.");

    // Method-2 : multiple res.write with res.end().
    res.write("Welcome to world of APIs.\n\n");
    res.write(`To get users list go at http://localhost:${port}/user/getusers`);
    // res.send(); //or
    res.end();

    //Method-3 : multiple res.write with res.close().
    // var i = 1, max = 5;

    // //set the appropriate HTTP header
    // res.setHeader('Content-Type', 'text/html');

    // //send multiple responses to the client
    // for (; i <= max; i++) {
    //     console.log(i);
    //     res.write('<h1>This is the response #: ' + i + '</h1>');
    // }

    // res.close();
});

//to get default json format from body.
app.use(express.json());

//other all routes.
app.use("/", routes);

/**
 * listens for connetion on defined port
 */
app.listen(port, () => console.log(`Your app listening at http://localhost:${port}`));
//Imported or included pkg Using ES6 module

//imported db connection file.
import "./connections/connect";

//to fetch default and common configuration such as port variable and other environment variables.
import * as common_config from "./config";

//imported express to set up a server.
import express from "express";
const app = express();

//imported cookie parser to get/set and save cookies.
import cookieParser from "cookie-parser";

//body parsing middleware used to process data sent through an HTTP request body.
import bodyparser from "body-parser";

//HTTP server-side framework used to create and manage a session middleware.
import session from "express-session";

//Importing all routes from routes dir.
import routes from "./routes/index";

//Getting port number from environment variables.
const port = common_config.configs.local.port || 3000;

//to get default json format from body.
app.use(express.json());

//body parser middleware.
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//Use of cookie in our app
app.use(cookieParser(""));

//About/Info default home route.
app.get("/", (req, res) => {
    // res.send("Welcome to world of APIs.");

    // Method-2 : multiple res.write with res.end().
    // res.write("Welcome to world of APIs.\n\n");
    // res.write(`To get users list go at http://localhost:${port}/user/getusers`);
    // res.end();

    // console.log(req.cookies);
    //Instructions object with cookies
    const response = {
        Title: "Welcome to world of APIs.",
        Info: "To get users list go to below address.",
        Route: `http://localhost:${port}/user/getusers`,
        Cookies: Object.keys(req.cookies).length ? req.cookies : "No cookies available."
    }
    res.send(response); //or

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

//other all routes.
app.use("/", routes);

/**
 * listens for connetion on defined port
 */
app.listen(port, () => console.log(`Your app listening at http://localhost:${port}`));
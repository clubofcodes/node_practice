//Import or include pkg Using ES6 module
// import express from "express";
// import "./connections/connect";
// import "dotenv/config";

//Import or include pkg using old way.
require("dotenv").config();
const express = require("express");
const app = express();
require("./connections/connect");
//Importing all routes from routes dir.
const router = require("./routes/index");
//Getting port number string from environment variables.
const port = process.env.PORT || 3000;

//Default route
app.get("/", (req, res) => {
    // res.send("Welcome to world of APIs.");

    // Method-2 : multiple res.write with res.end().
    res.write("Welcome to world of APIs.\n\n");
    res.write(`To get users list go at http://localhost:${port}/api/user`);
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

app.use(express.json({ extended: false }));

app.use("/api", router.userRouter);

app.listen(port, () => console.log(`Your app listening at http://localhost:${port}`));
import express from "express";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("Hello Wordl!");

    //Method-2 : multiple res.write with res.end().
    // res.write("Shows first line\n");
    // res.write("Shows second line");
    // res.send(); or res.end();

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

app.listen(port, () => {
    console.log(`Your app listening at http://localhost:${port}`);
});

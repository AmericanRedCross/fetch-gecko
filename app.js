const settings = require('./settings.js'); 
const express = require("express");
const path = require("path");

const port = settings.app.port;
const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.listen(port, 'localhost', () => {
 console.log(`Listening to requests on localhost:${port}`);
});
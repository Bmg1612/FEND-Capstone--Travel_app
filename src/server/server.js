const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { urlencoded } = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const listening = require("../client/js/listeningTest");

// Express to run server and routes
// Start up an instance of app
const app = express();
// Cors for cross origin allowance
app.use(cors());
// Configuring express to use body-parser as middle-ware.
app.use(bodyParser.json());
app.use(
  urlencoded({
    extended: true,
  })
);

// Initialize the main project folder
app.use(express.static("dist"));

console.log(__dirname);

app.get("/", (req, res) =>
  res.sendFile(path.resolve("src/client/views/index.html"))
);

// Setup empty JS object to act as endpoint for all routes
const dataObject = {};

// Spin up the server
const port = 8081;
app.listen(port, () => {
  console.log("App is listening on port 8081");
  listening(port);
});

weatherBitKey = process.env.WEATHERBIT_API_KEY;
pixabayKey = process.env.PIXABAY_API_KEY;

// Sending the API key to the client
app.get("/api", (req, res) =>
  res.send({
    weatherKey: weatherBitKey,
    photoKey: pixabayKey,
  })
);

app.post("/addText", (req, res) => {
  (dataObject["city_name"] = req.body.city_name),
    (dataObject["country_code"] = req.body.country_code),
    (dataObject["temperature"] = req.body.temp),
    (dataObject["app_temp"] = req.body.app_temp),
    (dataObject["description"] = req.body.description),
    (dataObject["photo"] = req.body.photo),
    console.log(dataObject);

  res.send(dataObject);
});

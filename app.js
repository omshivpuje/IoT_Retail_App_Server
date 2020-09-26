const express = require("express");
const app = express();

http = require("http");
const server = http.createServer(app);
const socketIO = require("socket.io");

const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./config/utils");

mongoose.connect(config.database, { useMongoClient: true });
mongoose.connection.on("connected", () => {
    console.log("Connected to database " + config.database);
});
mongoose.connection.on("error", err => {
    console.log("Database error: " + err);
});

const io = socketIO(server);
io.on("connection", socket => {
    console.log("Websocket Client Connected");
    socket.on("disconnect", data => {
        console.log("Websocket Client Disconnected");
    });
});
module.exports.SOCKETIO = io;

const user = require("./routes/user");
const inventory = require("./routes/inventory");
const archive = require("./routes/archieve");

const port = process.env.PORT || 1888;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

app.use("/user", user);
app.use("/inventory", inventory);
app.use("/archive", archive);

app.get("/", (req, res) => {
    res.send("Invalid Endpoint");
});
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});
server.listen(port, () => {
    console.log("Server started on port " + port);
});
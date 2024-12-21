require("dotenv").config();
const express = require("express");
const coursesRouter = require("./Routes/courses.route");
const usersRouter = require("./Routes/Users.route");
const httpStatusText = require("./Utilities/httpStatusText");
const Path = require("path");
const mongoose = require("mongoose");
const connectionURL = process.env.CONNECTIONSTRING;

mongoose
    .connect(connectionURL)
    .then(() => console.log("Connected succesfully to the server"))
    .catch((err) => console.log(err));

let app = express();

app.use("/Uploads", express.static(Path.join(__dirname, "Uploads")));

app.use(express.json());

app.use("/api/courses", coursesRouter);

app.use("/api/users", usersRouter);

app.all("*", async (req, res, next) => {
    res.status(404).json({
        status: httpStatusText.ERROR,
        message: "Routing not found",
    });
});

app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        status: error.statusText || httpStatusText.ERROR,
        message: error.message,
        data: null,
    });
});

app.listen(process.env.PORT, "Localhost", () => {
    console.log("listening on port", process.env.PORT);
});

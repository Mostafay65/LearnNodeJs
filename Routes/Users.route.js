const express = require("express");
const usersController = require("../Controllers/Users.controller.js");
const Authorize = require("../middelwares/Authorize.js");
const { Roles } = require("../Utilities/Roles.js");
const path = require("path");
const multer = require("multer");
const AppError = require("../Utilities/AppError.js");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../Uploads"));
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        cb(
            null,
            file.originalname.split(".")[0] + "-" + Date.now() + "." + ext
        );
    },
});

const fileFilter = function (req, file, cb) {
    if (file.mimetype.split("/")[0] == "image") cb(null, true);
    else cb(new AppError("Only images are allowed"), false);
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1 * 1024 * 1024, // 1MB
    },
});

const router = express.Router();

// get all users
router
    .route("/")
    .get(Authorize(Roles.ADMIN, Roles.MANAGER), usersController.getAllUsers);

// Register
router
    .route("/register")
    .post(upload.single("avatar"), usersController.Register);

// Login
router.route("/login").post(usersController.Login);
module.exports = router;

const mongoose = require("mongoose");
const validator = require("validator");
const { Roles } = require("../Utilities/Roles");

const usersSchema = new mongoose.Schema({
    Name: {
        type: String,
        require: true,
    },
    Phonenumber: {
        type: String,
        required: true,
        validate: [
            (value) => validator.isMobilePhone(value, "ar-EG"),
            (props) => `${props.value} is not a valid mobile number`,
        ],
    },
    Email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, "Email field is required"],
    },
    Password: {
        type: String,
        required: true,
        minlength: [8, "Password must me at least 8 characters"],
    },
    Role: {
        type: String,
        enum: [Roles.USER, Roles.ADMIN, Roles.MANAGER],
        default: Roles.USER,
    },
    Avatar: {
        type: String,
        default: "profile.jpg",
    },
});

module.exports = mongoose.model("Users", usersSchema);

const httpStatusText = require("../Utilities/httpStatusText");
const User = require("../Models/Users.model");
const asyncWrapper = require("../middelwares/asyncWrapper");
const AppError = require("../Utilities/AppError");
const bcrypt = require("bcrypt");

const GenerateJWT = require("../Utilities/GenerateJWT");

const getAllUsers = asyncWrapper(async (req, res, next) => {
    const Users = await User.find({}, { __v: 0 });
    return res.json({ status: httpStatusText.SUCCESS, data: { Users } });
});

const Register = asyncWrapper(async (req, res, next) => {
    if ((await User.findOne({ Email: req.body.Email })) != null) {
        return next(
            new AppError("Email already exists", 400, httpStatusText.FAIL)
        );
    }
    const newUser = new User({
        ...req.body,
        Password: await bcrypt.hash(req.body.Password, 10),
        Avatar: req.file.filename,
    });

    // generate jwt token
    const token = GenerateJWT({
        email: newUser.Email,
        id: newUser._id,
        role: newUser.Role,
    });
    // const token = jwt.sign({ email: newUser.Email, id: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1m" })
    await newUser.save();

    console.log("avatar ==> ", req.file);

    return res.json({
        status: httpStatusText.SUCCESS,
        data: { newUser, token },
    });
});

const Login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
        return next(
            new AppError(
                "Email and Password are required",
                400,
                httpStatusText.FAIL
            )
        );

    const user = await User.findOne({ Email: email });
    if (user == null)
        return next(new AppError("User not found", 404, httpStatusText.FAIL));

    if (!(await bcrypt.compare(password, user.Password)))
        return next(
            new AppError(
                "Email or password are incorrect",
                400,
                httpStatusText.FAIL
            )
        );

    // generate JWT token
    const token = GenerateJWT({ email, id: user._id, role: user.Role });
    return res.json({
        status: httpStatusText.SUCCESS,
        data: { token },
    });
});

module.exports = {
    getAllUsers,
    Register,
    Login,
};

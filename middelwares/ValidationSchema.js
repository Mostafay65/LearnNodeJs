const { body, validationResult } = require("express-validator");
const httpStatusText = require("../Utilities/httpStatusText");
const validationSchema = () => {
    return [
        body("title")
            .notEmpty()
            .withMessage("Title is required")
            .isLength({ max: 50, min: 5 })
            .withMessage("Title should be at most 50 characters"),
        body("price").notEmpty().withMessage("Price is required"),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: httpStatusText.FAIL,
                    data: errors.array(),
                });
            }
            next();
        },
    ];
};

module.exports = validationSchema;

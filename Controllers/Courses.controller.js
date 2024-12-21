const httpStatusText = require("../Utilities/httpStatusText");
const Course = require("../Models/Course.model");
const asyncWrapper = require("../middelwares/asyncWrapper");
const AppError = require("../Utilities/AppError");

const getAllCourses = async (req, res) => {
    const courses = await Course.find({}, { __v: 0 });
    res.json({ status: httpStatusText.SUCCESS, data: { courses } });
};

const getSingleCourse = asyncWrapper(async (req, res, next) => {
    let course = await Course.findById(req.params.courseId, { __v: false });
    if (!course) {
        return next(
            new AppError("Course  not found", 404, httpStatusText.FAIL)
        );
    }
    res.json({ status: httpStatusText.SUCCESS, data: { course } });
});

const createCourse = asyncWrapper(async (req, res, next) => {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: { course: newCourse },
    });
});

const updateCourse = asyncWrapper(async (req, res, next) => {
    const reslt = await Course.updateOne(
        { _id: req.params.courseId },
        req.body
    );
    if (reslt.matchedCount == 0)
        return next(
            new AppError("Course  not found", 404, httpStatusText.FAIL)
        );
    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: {
            course: await Course.find(
                { _id: req.params.courseId },
                { __v: false }
            ),
        },
    });
});
const deleteCourse = asyncWrapper(async (req, res, next) => {
    const course = await Course.findOneAndDelete(
        {
            _id: req.params.courseId,
        },
        { __v: false }
    );
    if (!course)
        return next(
            new AppError("Course  not found", 404, httpStatusText.FAIL)
        );
    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: { course },
    });
});

module.exports = {
    getAllCourses,
    getSingleCourse,
    createCourse,
    updateCourse,
    deleteCourse,
};

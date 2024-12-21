const express = require("express");
const courseController = require("../Controllers/Courses.controller.js");
const validationSchema = require("../middelwares/ValidationSchema");
const router = express.Router();


router.route("/")
    .get(courseController.getAllCourses)
    .post(validationSchema(), courseController.createCourse);

router.route("/:courseId")
    .get(courseController.getSingleCourse)
    .patch(courseController.updateCourse)
    .delete(courseController.deleteCourse);


module.exports = router;
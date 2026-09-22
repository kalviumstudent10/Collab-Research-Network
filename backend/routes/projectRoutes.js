const express = require("express");
const { getProjects, createProject, updateProject } = require("../controllers/projectController");

const router = express.Router();
router.route("/").get(getProjects).post(createProject);
router.route("/:id").put(updateProject);

module.exports = router;
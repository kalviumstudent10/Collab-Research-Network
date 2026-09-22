const express = require("express");
const { getProjects, createProject, updateProject, deleteProject } = require("../controllers/projectController");

const router = express.Router();
router.route("/").get(getProjects).post(createProject);
router.route("/:id").put(updateProject).delete(deleteProject);

module.exports = router;
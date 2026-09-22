const express = require("express");
const { getProjects, createProject } = require("../controllers/projectController");

const router = express.Router();
router.route("/").get(getProjects).post(createProject);

module.exports = router;
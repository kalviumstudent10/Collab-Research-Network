const express = require("express");
const { getCollaborationRequests } = require("../controllers/collaborationRequestController");

const router = express.Router();
router.route("/").get(getCollaborationRequests);

module.exports = router;
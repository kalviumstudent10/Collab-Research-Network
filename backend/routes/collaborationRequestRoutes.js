const express = require("express");
const {
	createCollaborationRequest,
	getCollaborationRequests,
} = require("../controllers/collaborationRequestController");

const router = express.Router();
router.route("/").get(getCollaborationRequests).post(createCollaborationRequest);

module.exports = router;
const express = require("express");
const {
	createCollaborationRequest,
	getCollaborationRequests,
	updateCollaborationRequest,
} = require("../controllers/collaborationRequestController");

const router = express.Router();
router.route("/").get(getCollaborationRequests).post(createCollaborationRequest);
router.route("/:id").put(updateCollaborationRequest);

module.exports = router;
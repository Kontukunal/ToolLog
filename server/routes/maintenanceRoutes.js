const express = require("express");
const router = express.Router();
const maintenanceController = require("../controllers/maintenanceController");

router.post("/", maintenanceController.createMaintenanceLog);
router.get("/equipment/:id", maintenanceController.getEquipmentMaintenanceLogs);

module.exports = router;

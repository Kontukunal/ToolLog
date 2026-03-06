const MaintenanceLog = require("../models/MaintenanceLog");
const Equipment = require("../models/Equipment");

exports.createMaintenanceLog = async (req, res) => {
  try {
    const { equipment, maintenanceDate, notes, performedBy } = req.body;

    const existingEquipment = await Equipment.findById(equipment);
    if (!existingEquipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }

    const maintenanceLog = new MaintenanceLog({
      equipment,
      maintenanceDate,
      notes,
      performedBy,
    });

    await maintenanceLog.save();

    existingEquipment.status = "Active";
    existingEquipment.lastCleanedDate = maintenanceDate;

    if (!existingEquipment.canBeActive()) {
      return res.status(400).json({
        success: false,
        message: "Equipment cannot be marked as Active due to date constraint",
      });
    }

    await existingEquipment.save();

    const populatedLog = await MaintenanceLog.findById(
      maintenanceLog._id,
    ).populate({
      path: "equipment",
      populate: { path: "type", select: "name" },
    });

    res.status(201).json({
      success: true,
      data: populatedLog,
      message: "Maintenance log created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating maintenance log",
      error: error.message,
    });
  }
};

exports.getEquipmentMaintenanceLogs = async (req, res) => {
  try {
    const { id } = req.params;

    const logs = await MaintenanceLog.find({ equipment: id })
      .populate({
        path: "equipment",
        populate: { path: "type", select: "name" },
      })
      .sort({ maintenanceDate: -1 });

    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching maintenance logs",
      error: error.message,
    });
  }
};

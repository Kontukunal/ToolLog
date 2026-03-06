const Equipment = require("../models/Equipment");
const EquipmentType = require("../models/EquipmentType");
const MaintenanceLog = require("../models/MaintenanceLog");

exports.getAllEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find()
      .populate("type", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: equipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching equipment",
      error: error.message,
    });
  }
};

exports.createEquipment = async (req, res) => {
  try {
    const { name, type, status, lastCleanedDate } = req.body;

    const equipmentType = await EquipmentType.findById(type);
    if (!equipmentType) {
      return res.status(400).json({
        success: false,
        message: "Invalid equipment type",
      });
    }

    const equipment = new Equipment({
      name,
      type,
      status,
      lastCleanedDate,
    });

    if (status === "Active" && !equipment.canBeActive()) {
      return res.status(400).json({
        success: false,
        message:
          "Equipment cannot be marked as Active if last cleaned date is older than 30 days",
      });
    }

    await equipment.save();

    const populatedEquipment = await Equipment.findById(equipment._id).populate(
      "type",
      "name",
    );

    res.status(201).json({
      success: true,
      data: populatedEquipment,
      message: "Equipment created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating equipment",
      error: error.message,
    });
  }
};

exports.updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, status, lastCleanedDate } = req.body;

    const equipment = await Equipment.findById(id);
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }

    if (type) {
      const equipmentType = await EquipmentType.findById(type);
      if (!equipmentType) {
        return res.status(400).json({
          success: false,
          message: "Invalid equipment type",
        });
      }
    }

    if (name) equipment.name = name;
    if (type) equipment.type = type;
    if (lastCleanedDate) equipment.lastCleanedDate = lastCleanedDate;

    if (status === "Active") {
      if (!equipment.canBeActive()) {
        return res.status(400).json({
          success: false,
          message:
            "Equipment cannot be marked as Active if last cleaned date is older than 30 days",
        });
      }
      equipment.status = status;
    } else if (status) {
      equipment.status = status;
    }

    await equipment.save();

    const updatedEquipment = await Equipment.findById(id).populate(
      "type",
      "name",
    );

    res.status(200).json({
      success: true,
      data: updatedEquipment,
      message: "Equipment updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating equipment",
      error: error.message,
    });
  }
};

exports.deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;

    const maintenanceLogs = await MaintenanceLog.findOne({ equipment: id });
    if (maintenanceLogs) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete equipment with maintenance history",
      });
    }

    const equipment = await Equipment.findByIdAndDelete(id);
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Equipment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting equipment",
      error: error.message,
    });
  }
};

exports.getEquipmentTypes = async (req, res) => {
  try {
    const types = await EquipmentType.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: types,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching equipment types",
      error: error.message,
    });
  }
};

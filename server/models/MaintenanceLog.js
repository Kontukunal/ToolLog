const mongoose = require("mongoose");

const maintenanceLogSchema = new mongoose.Schema(
  {
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },
    maintenanceDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    notes: {
      type: String,
      required: true,
      trim: true,
    },
    performedBy: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("MaintenanceLog", maintenanceLogSchema);

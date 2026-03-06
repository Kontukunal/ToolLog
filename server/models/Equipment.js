const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EquipmentType",
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Under Maintenance"],
      default: "Inactive",
    },
    lastCleanedDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

equipmentSchema.virtual("maintenanceLogs", {
  ref: "MaintenanceLog",
  localField: "_id",
  foreignField: "equipment",
});

equipmentSchema.methods.canBeActive = function () {
  if (!this.lastCleanedDate) return false;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return this.lastCleanedDate >= thirtyDaysAgo;
};

module.exports = mongoose.model("Equipment", equipmentSchema);

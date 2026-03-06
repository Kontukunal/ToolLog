const mongoose = require("mongoose");
const EquipmentType = require("./models/EquipmentType");
require("dotenv").config();

const seedTypes = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://localhost:27017/equipment-management",
    );

    await EquipmentType.deleteMany({});

    const types = [
      {
        name: "HVAC",
        description: "Heating, Ventilation, and Air Conditioning equipment",
      },
      {
        name: "Electrical",
        description: "Electrical equipment and components",
      },
      { name: "Plumbing", description: "Plumbing fixtures and systems" },
      { name: "Safety", description: "Safety and security equipment" },
      { name: "IT", description: "Information technology equipment" },
      { name: "Medical", description: "Medical and healthcare equipment" },
      { name: "Laboratory", description: "Laboratory equipment" },
      { name: "Kitchen", description: "Kitchen and food service equipment" },
    ];

    await EquipmentType.insertMany(types);

    console.log("Equipment types seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding types:", error);
    process.exit(1);
  }
};

seedTypes();

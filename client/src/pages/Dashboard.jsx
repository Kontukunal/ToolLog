import React, { useState, useEffect } from "react";
import EquipmentTable from "../components/EquipmentTable";
import EquipmentForm from "../components/EquipmentForm";
import Button from "../components/Button";
import Alert from "../components/Alert";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  getEquipment,
  getEquipmentTypes,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from "../services/api";

const Dashboard = () => {
  const [equipment, setEquipment] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [equipmentData, typesData] = await Promise.all([
        getEquipment(),
        getEquipmentTypes(),
      ]);
      setEquipment(equipmentData);
      setEquipmentTypes(typesData);
      setError(null);
    } catch (err) {
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEquipment = () => {
    setEditingEquipment(null);
    setFormError(null);
    setShowForm(true);
  };

  const handleEditEquipment = (equipment) => {
    setEditingEquipment(equipment);
    setFormError(null);
    setShowForm(true);
  };

  const handleDeleteEquipment = async (id) => {
    try {
      await deleteEquipment(id);
      setEquipment((prev) => prev.filter((item) => item._id !== id));
      setSuccess("Equipment deleted successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || "Failed to delete equipment");
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      let updatedEquipment;

      if (editingEquipment) {
        updatedEquipment = await updateEquipment(
          editingEquipment._id,
          formData,
        );
        setEquipment((prev) =>
          prev.map((item) =>
            item._id === editingEquipment._id ? updatedEquipment : item,
          ),
        );
        setSuccess("Equipment updated successfully");
      } else {
        updatedEquipment = await createEquipment(formData);
        setEquipment((prev) => [updatedEquipment, ...prev]);
        setSuccess("Equipment added successfully");
      }

      setShowForm(false);
      setEditingEquipment(null);
      setFormError(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setFormError(err.message || "Failed to save equipment");
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEquipment(null);
    setFormError(null);
  };

  const handleMaintenanceAdded = () => {
    fetchData();
    setSuccess("Maintenance logged successfully");
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <svg
                  className="h-8 w-8 text-blue-600 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                ToolLog
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your equipment and track maintenance lifecycle
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleAddEquipment}
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              }
            >
              Add Equipment
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess(null)}
          />
        )}

        <EquipmentTable
          equipment={equipment}
          onEdit={handleEditEquipment}
          onDelete={handleDeleteEquipment}
          onMaintenance={handleMaintenanceAdded}
          isLoading={loading}
        />

        {showForm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-all">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingEquipment ? "Edit Equipment" : "Add New Equipment"}
                </h3>
                <EquipmentForm
                  initialData={editingEquipment || {}}
                  equipmentTypes={equipmentTypes}
                  onSubmit={handleFormSubmit}
                  onCancel={handleFormCancel}
                  isEditing={!!editingEquipment}
                  error={formError}
                  onErrorClear={() => setFormError(null)}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

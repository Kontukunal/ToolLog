import React, { useState, useEffect } from "react";
import { getMaintenanceLogs, addMaintenanceLog } from "../services/api";
import Button from "./Button";
import Input from "./Input";
import Alert from "./Alert";
import LoadingSpinner from "./LoadingSpinner";

const MaintenanceHistory = ({
  equipmentId,
  equipmentName,
  isModal = false,
  onClose,
  onMaintenanceAdded,
}) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    maintenanceDate: new Date().toISOString().split("T")[0],
    notes: "",
    performedBy: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchLogs();
  }, [equipmentId]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await getMaintenanceLogs(equipmentId);
      setLogs(data);
      setError(null);
    } catch (err) {
      setError("Failed to load maintenance history");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.maintenanceDate)
      errors.maintenanceDate = "Maintenance date is required";
    if (!formData.notes.trim()) errors.notes = "Notes are required";
    if (!formData.performedBy.trim())
      errors.performedBy = "Performed by is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await addMaintenanceLog({
        equipment: equipmentId,
        ...formData,
      });

      setSuccessMessage("Maintenance log added successfully");
      setShowAddForm(false);
      setFormData({
        maintenanceDate: new Date().toISOString().split("T")[0],
        notes: "",
        performedBy: "",
      });

      await fetchLogs();
      if (onMaintenanceAdded) onMaintenanceAdded();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to add maintenance log");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const content = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Maintenance History - {equipmentName}
        </h3>
        <div className="space-x-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Cancel" : "Log Maintenance"}
          </Button>
          {isModal && (
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded-lg border border-gray-200 space-y-3"
        >
          <Input
            label="Maintenance Date"
            type="date"
            name="maintenanceDate"
            value={formData.maintenanceDate}
            onChange={handleInputChange}
            error={formErrors.maintenanceDate}
            required
          />

          <Input
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            error={formErrors.notes}
            placeholder="Enter maintenance notes"
            required
          />

          <Input
            label="Performed By"
            name="performedBy"
            value={formData.performedBy}
            onChange={handleInputChange}
            error={formErrors.performedBy}
            placeholder="Enter technician name"
            required
          />

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="success" size="sm">
              Save Log
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : logs.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500">
            No maintenance history available
          </p>
          <p className="text-xs text-gray-400">
            Click "Log Maintenance" to add your first record
          </p>
        </div>
      ) : (
        <div className="flow-root">
          <ul className="-mb-8">
            {logs.map((log, index) => (
              <li key={log._id}>
                <div className="relative pb-8">
                  {index !== logs.length - 1 && (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    ></span>
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <svg
                          className="h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5">
                      <div className="text-sm text-gray-500">
                        <span className="font-medium text-gray-900">
                          {log.performedBy}
                        </span>{" "}
                        performed maintenance on{" "}
                        <span className="font-medium text-gray-900">
                          {formatDate(log.maintenanceDate)}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="font-medium">Notes:</p>
                        <p>{log.notes}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-lg bg-white">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
          <div className="mt-3">{content}</div>
        </div>
      </div>
    );
  }

  return content;
};

export default MaintenanceHistory;

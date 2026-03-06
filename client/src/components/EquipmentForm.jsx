import React, { useState, useEffect } from "react";
import Input from "./Input";
import Select from "./Select";
import Button from "./Button";
import Alert from "./Alert";
import { validateEquipment } from "../utils/validation";

const EquipmentForm = ({
  initialData = {},
  equipmentTypes = [],
  onSubmit,
  onCancel,
  isEditing = false,
  error: propError,
  onErrorClear,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    status: "Inactive",
    lastCleanedDate: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        name: initialData.name || "",
        type: initialData.type?._id || initialData.type || "",
        status: initialData.status || "Inactive",
        lastCleanedDate: initialData.lastCleanedDate
          ? new Date(initialData.lastCleanedDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (propError) {
      setFormError(propError);
    }
  }, [propError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (formError) {
      setFormError("");
      if (onErrorClear) onErrorClear();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateEquipment(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await onSubmit(formData);
  };

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Under Maintenance", label: "Under Maintenance" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <Alert
          type="error"
          message={formError}
          onClose={() => {
            setFormError("");
            if (onErrorClear) onErrorClear();
          }}
        />
      )}

      <Input
        label="Equipment Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Enter equipment name"
        required
      />

      <Select
        label="Equipment Type"
        name="type"
        value={formData.type}
        onChange={handleChange}
        options={equipmentTypes}
        error={errors.type}
        placeholder="Select equipment type"
        required
      />

      <Select
        label="Status"
        name="status"
        value={formData.status}
        onChange={handleChange}
        options={statusOptions}
        error={errors.status}
        required
      />

      <Input
        label="Last Cleaned Date"
        name="lastCleanedDate"
        type="date"
        value={formData.lastCleanedDate}
        onChange={handleChange}
        error={errors.lastCleanedDate}
        required
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {isEditing ? "Update Equipment" : "Add Equipment"}
        </Button>
      </div>
    </form>
  );
};

export default EquipmentForm;

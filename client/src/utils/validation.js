export const validateEquipment = (data) => {
  const errors = {};

  if (!data.name || !data.name.trim()) {
    errors.name = "Equipment name is required";
  } else if (data.name.length < 3) {
    errors.name = "Equipment name must be at least 3 characters";
  }

  if (!data.type) {
    errors.type = "Equipment type is required";
  }

  if (!data.status) {
    errors.status = "Status is required";
  }

  if (!data.lastCleanedDate) {
    errors.lastCleanedDate = "Last cleaned date is required";
  } else {
    const selectedDate = new Date(data.lastCleanedDate);
    const today = new Date();
    if (selectedDate > today) {
      errors.lastCleanedDate = "Last cleaned date cannot be in the future";
    }
  }

  return errors;
};

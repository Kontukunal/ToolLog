const API_BASE_URL = "http://localhost:5000/api";

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data.data;
};

// Equipment APIs
export const getEquipment = async () => {
  const response = await fetch(`${API_BASE_URL}/equipment`);
  return handleResponse(response);
};

export const createEquipment = async (equipmentData) => {
  const response = await fetch(`${API_BASE_URL}/equipment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(equipmentData),
  });
  return handleResponse(response);
};

export const updateEquipment = async (id, equipmentData) => {
  const response = await fetch(`${API_BASE_URL}/equipment/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(equipmentData),
  });
  return handleResponse(response);
};

export const deleteEquipment = async (id) => {
  const response = await fetch(`${API_BASE_URL}/equipment/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};

export const getEquipmentTypes = async () => {
  const response = await fetch(`${API_BASE_URL}/equipment/types`);
  return handleResponse(response);
};

// Maintenance APIs
export const getMaintenanceLogs = async (equipmentId) => {
  const response = await fetch(
    `${API_BASE_URL}/maintenance/equipment/${equipmentId}`,
  );
  return handleResponse(response);
};

export const addMaintenanceLog = async (logData) => {
  const response = await fetch(`${API_BASE_URL}/maintenance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(logData),
  });
  return handleResponse(response);
};

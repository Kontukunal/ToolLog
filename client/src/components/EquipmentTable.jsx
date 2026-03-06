import React, { useState } from "react";
import Button from "./Button";
import MaintenanceHistory from "./MaintenanceHistory";

const EquipmentTable = ({
  equipment,
  onEdit,
  onDelete,
  onMaintenance,
  isLoading,
}) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Active: "bg-green-100 text-green-800 border-green-200",
      Inactive: "bg-gray-100 text-gray-800 border-gray-200",
      "Under Maintenance": "bg-yellow-100 text-yellow-800 border-yellow-200",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status] || statusColors.Inactive}`}
      >
        {status}
      </span>
    );
  };

  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Equipment
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Last Cleaned
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {equipment.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    <svg
                      className="h-12 w-12 text-gray-400 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                      />
                    </svg>
                    <p className="text-lg font-medium">No equipment found</p>
                    <p className="text-sm mt-1">
                      Get started by adding your first equipment
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              equipment.map((item) => (
                <React.Fragment key={item._id}>
                  <tr
                    className={`hover:bg-gray-50 transition-colors ${expandedRow === item._id ? "bg-blue-50" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleExpand(item._id)}
                          className="mr-3 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <svg
                            className={`h-5 w-5 transform transition-transform ${expandedRow === item._id ? "rotate-90" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {item._id.slice(-6)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {item.type?.name || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(item.lastCleanedDate)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedEquipment(item)}
                      >
                        Maintenance
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onEdit(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this equipment?",
                            )
                          ) {
                            onDelete(item._id);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                  {expandedRow === item._id && (
                    <tr className="bg-gray-50">
                      <td colSpan="5" className="px-6 py-4">
                        <MaintenanceHistory
                          equipmentId={item._id}
                          equipmentName={item.name}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedEquipment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <MaintenanceHistory
                equipmentId={selectedEquipment._id}
                equipmentName={selectedEquipment.name}
                onClose={() => setSelectedEquipment(null)}
                onMaintenanceAdded={onMaintenance}
              />
            </div>

            <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
              <Button
                variant="secondary"
                onClick={() => setSelectedEquipment(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentTable;

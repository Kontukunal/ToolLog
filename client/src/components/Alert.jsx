import React, { useEffect } from "react";

const Alert = ({ type = "info", message, onClose, autoClose = true }) => {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const types = {
    success: {
      bg: "bg-green-50",
      border: "border-green-400",
      text: "text-green-800",
      icon: "✓",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-400",
      text: "text-red-800",
      icon: "✕",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-400",
      text: "text-yellow-800",
      icon: "⚠",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-400",
      text: "text-blue-800",
      icon: "ℹ",
    },
  };

  const style = types[type];

  return (
    <div
      className={`${style.bg} ${style.border} border-l-4 p-4 mb-4 rounded-r-lg shadow-sm`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className={`${style.text} font-bold`}>{style.icon}</span>
        </div>
        <div className="ml-3 flex-1">
          <p className={`${style.text} text-sm`}>{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-auto ${style.text} hover:opacity-75`}
          >
            <span className="text-lg">×</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;

/**
 * Utility function to get user-friendly error messages based on HTTP status codes
 * @param {Object} error - The error object from API calls
 * @param {string} action - The action being performed (e.g., "creating", "updating", "deleting")
 * @param {string} entity - The entity being acted upon (e.g., "category", "product", "supplier")
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (
  error,
  action = "performing action on",
  entity = "item"
) => {
  const status = error?.response?.status;
  const errorMessage = error?.message || "";
  const isNetworkError =
    errorMessage.toLowerCase().includes("network error") ||
    errorMessage.toLowerCase().includes("failed to fetch") ||
    errorMessage.toLowerCase().includes("unauthorized") ||
    errorMessage.toLowerCase().includes("forbidden");

  // Check if user is not logged in (no token in localStorage)
  const hasToken = localStorage.getItem("token");

  // If no token and we get certain types of errors, it's likely an auth issue
  if (!hasToken && (isNetworkError || status === 401 || status === 403)) {
    return "Please log in.";
  }

  // If user has token but gets 403, they're authenticated but not authorized (not admin)
  if (hasToken && status === 403) {
    return `Admins are only allowed to ${action} ${entity}s. Please contact your system administrator.`;
  }

  if (status === 401) {
    return "Please log in.";
  }

  if (status === 404) {
    return `${
      entity.charAt(0).toUpperCase() + entity.slice(1)
    } not found. Please check the ID and try again.`;
  }

  if (status === 400) {
    return `Invalid data: ${
      error?.response?.data || "Please check your input and try again."
    }`;
  }

  if (status === 500) {
    return "Server Error: Something went wrong on our end. Please try again later.";
  }

  // Default error message
  const errorData = error?.response?.data;
  if (typeof errorData === "string") {
    return errorData;
  }

  if (errorData?.title) {
    return errorData.title;
  }

  if (errorData?.message) {
    return errorData.message;
  }

  // If no token and we get a generic error, suggest logging in
  if (!hasToken) {
    return "Please log in.";
  }

  return (
    error?.message ||
    "Network Error: Please check your connection and try again."
  );
};

/**
 * Get the appropriate error styling based on error type
 * @param {Object} error - The error object
 * @returns {Object} - CSS classes for styling
 */
export const getErrorStyling = (error) => {
  const status = error?.response?.status;

  if (status === 403) {
    return {
      container: "bg-orange-50 border-orange-300 text-orange-800",
      icon: "⚠️",
    };
  }

  if (status === 401) {
    return {
      container: "bg-yellow-50 border-yellow-300 text-yellow-800",
      icon: "🔐",
    };
  }

  return {
    container: "bg-red-50 border-red-300 text-red-800",
    icon: "❌",
  };
};

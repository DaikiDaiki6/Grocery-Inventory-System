/**
 * Utility functions for authentication and authorization
 */

/**
 * Decode JWT token to get user information
 * @param {string} token - JWT token
 * @returns {Object|null} - Decoded token payload or null if invalid
 */
export const decodeToken = (token) => {
  try {
    if (!token) return null;

    // JWT tokens have 3 parts separated by dots
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Decode the payload (second part)
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));

    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

/**
 * Check if current user is an admin
 * @returns {boolean} - True if user is admin, false otherwise
 */
export const isUserAdmin = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  const decoded = decodeToken(token);
  if (!decoded) return false;

  // Check if user has admin role
  return decoded.role === "Admin";
};

/**
 * Check if user is authenticated (has valid token)
 * @returns {boolean} - True if user is logged in, false otherwise
 */
export const isUserAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  const decoded = decodeToken(token);
  if (!decoded) return false;

  // Check if token is expired
  const currentTime = Math.floor(Date.now() / 1000);
  if (decoded.exp && decoded.exp < currentTime) {
    // Token is expired, remove it
    localStorage.removeItem("token");
    return false;
  }

  return true;
};

/**
 * Get current user information
 * @returns {Object|null} - User info or null if not authenticated
 */
export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const decoded = decodeToken(token);
  if (!decoded) return null;

  return {
    username: decoded.name,
    role: decoded.role,
    userId: decoded.nameid,
  };
};

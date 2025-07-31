import { useState, useEffect } from "react";
import axios from "../api/axios";

function SessionManager() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [message, setMessage] = useState("");

  // Check login status on component mount
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get("/auth/test");
        setIsLoggedIn(true);
        setUserInfo({
          message: response.data.message,
          timestamp: response.data.timestamp,
        });
      } catch (error) {
        // Token is invalid or expired
        setIsLoggedIn(false);
        setUserInfo(null);
        localStorage.removeItem("token");
      }
    } else {
      setIsLoggedIn(false);
      setUserInfo(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserInfo(null);
    setMessage("Logged out successfully!");

    // Clear message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  };

  const testAdminAccess = async () => {
    try {
      const response = await axios.get("/auth/admin-test");
      setMessage("Admin access confirmed: " + response.data.message);
    } catch (error) {
      setMessage(
        "Admin access denied: " + (error.response?.data || error.message)
      );
    }
  };

  const testProtectedEndpoint = async () => {
    try {
      const response = await axios.get("/products");
      setMessage(
        `Successfully accessed Products API! Found ${response.data.length} products.`
      );
    } catch (error) {
      setMessage(
        "Failed to access Products API: " +
          (error.response?.data || error.message)
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Session Management
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Manage your authentication session and test API access
      </p>

      {/* Login Status */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Current Status</h3>
        <div
          className={`p-3 rounded ${
            isLoggedIn
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isLoggedIn ? (
            <div>
              <p className="font-semibold">✅ Logged In</p>
              <p className="text-sm mt-1">Token is valid and active</p>
              {userInfo && (
                <p className="text-xs mt-1">
                  Last verified: {new Date(userInfo.timestamp).toLocaleString()}
                </p>
              )}
            </div>
          ) : (
            <div>
              <p className="font-semibold">❌ Not Logged In</p>
              <p className="text-sm mt-1">No valid token found</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {isLoggedIn ? (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Actions</h3>

          <button
            onClick={testProtectedEndpoint}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Test Products API Access
          </button>

          <button
            onClick={testAdminAccess}
            className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
          >
            Test Admin Access
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-600 mb-3">
            Please login to access protected features
          </p>
          <a
            href="/auth-test"
            className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Go to Login
          </a>
        </div>
      )}

      {/* Message Display */}
      {message && (
        <div className="mt-4 p-3 bg-gray-100 rounded border-l-4 border-blue-500">
          <p className="text-sm text-gray-800">{message}</p>
        </div>
      )}

      {/* Token Info */}
      {isLoggedIn && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Token Information</h3>
          <div className="p-2 bg-gray-100 rounded text-xs">
            <p>
              <strong>Token:</strong>{" "}
              {localStorage.getItem("token")?.substring(0, 50)}...
            </p>
            <p>
              <strong>Token Length:</strong>{" "}
              {localStorage.getItem("token")?.length || 0} characters
            </p>
            <p>
              <strong>Expires:</strong> 60 minutes from login
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionManager;

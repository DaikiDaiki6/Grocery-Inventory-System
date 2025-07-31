import { useState } from "react";
import axios from "../api/axios";

function AuthTest() {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
  });
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", loginData);
      setToken(response.data.token);
      setMessage("Login successful! Redirecting to dashboard...");
      // Store token in localStorage for future use
      localStorage.setItem("token", response.data.token);

      // Redirect to home page after successful login
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      setMessage("Login failed: " + (error.response?.data || error.message));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/register", registerData);
      setMessage("Registration successful! You can now login.");
    } catch (error) {
      setMessage(
        "Registration failed: " + (error.response?.data || error.message)
      );
    }
  };

  const testAuth = async () => {
    try {
      const response = await axios.get("/auth/test", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Auth test successful: " + response.data.message);
    } catch (error) {
      setMessage(
        "Auth test failed: " + (error.response?.data || error.message)
      );
    }
  };

  const testAdmin = async () => {
    try {
      const response = await axios.get("/auth/admin-test", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Admin test successful: " + response.data.message);
    } catch (error) {
      setMessage(
        "Admin test failed: " + (error.response?.data || error.message)
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Grocery Inventory System
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Sign in to access your inventory management dashboard. Admin accounts
        must be created by database administrators.
      </p>

      {/* Register Form */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          Create New Account
        </h3>
        <form onSubmit={handleRegister} className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            value={registerData.username}
            onChange={(e) =>
              setRegisterData({ ...registerData, username: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={registerData.password}
            onChange={(e) =>
              setRegisterData({ ...registerData, password: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            Create Account
          </button>
        </form>
      </div>

      {/* Login Form */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Sign In</h3>
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            value={loginData.username}
            onChange={(e) =>
              setLoginData({ ...loginData, username: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
          >
            Sign In
          </button>
        </form>
      </div>

      {/* Test Buttons */}
      {token && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">
            Test Your Access
          </h3>
          <button
            onClick={testAuth}
            className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition"
          >
            Test Basic Access
          </button>
          <button
            onClick={testAdmin}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
          >
            Test Admin Access
          </button>
        </div>
      )}

      {/* Message Display */}
      {message && (
        <div className="mt-4 p-3 bg-gray-100 rounded border-l-4 border-blue-500">
          <p className="text-sm text-gray-800">{message}</p>
        </div>
      )}

      {/* Token Display */}
      {token && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            Authentication Token:
          </h3>
          <div className="p-2 bg-gray-100 rounded text-xs break-all border">
            <p className="text-gray-600">{token.substring(0, 50)}...</p>
            <p className="text-gray-500 mt-1">Token expires in 60 minutes</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuthTest;

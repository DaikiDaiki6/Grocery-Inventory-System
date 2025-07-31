import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import axios from "./api/axios";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

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
    window.location.href = "/";
  };

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <Link
            to="/"
            className="text-2xl font-bold tracking-wide hover:text-gray-300 transition flex"
          >
            <img src="/vite.svg" alt="logo" className="h-8 w-auto pr-4" />
            Grocery Inventory
          </Link>
        </div>

        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link to="/" className="hover:text-gray-400 transition">
            Home
          </Link>

          {isLoggedIn ? (
            <>
              <Link to="/session" className="hover:text-gray-400 transition">
                Session Manager
              </Link>
              <div className="flex items-center space-x-3">
                <span className="text-green-400 text-xs">✅ Logged In</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition text-xs"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <span className="text-red-400 text-xs">❌ Not Logged In</span>
              <Link
                to="/auth-test"
                className="text-blue-400 hover:text-blue-300 transition text-xs underline"
              >
                Sign In
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

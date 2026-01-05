import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import Eye Icons
import loginBg from "../../assets/login.png";
import Navbar from "../../component/homepage/Navbar";
import Toast from "../../component/Toast";
import { setLogin } from "../../redux/UserSlice";
import API from "../../utils/API";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle visibility
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loginPromise = API.post("/admin-auth/login", { email, password });

    toast.promise(loginPromise, {
      loading: "Authenticating Admin...",
      success: "Welcome Admin!",
      error: (err) => err.response?.data?.message || "Admin Login Failed",
    });

    try {
      const response = await loginPromise;
      dispatch(setLogin({ user: response.data.user }));
      localStorage.setItem("token", response.data.token);
      navigate("/admin");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <div
        className="flex items-center justify-center p-3 bg-cover bg-center min-h-screen relative"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        <Toast />
        <div className="absolute bg-black opacity-70 h-full w-full"></div>

        <div className="relative z-10 w-full max-w-md p-6 sm:p-8 bg-opacity-70 backdrop-blur-md rounded-lg shadow-xl border border-gray-700">
          {/* Heading */}
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-4xl font-bold fira-sans text-white">
              Admin Portal
            </h2>
            <p className="text-lg text-[#F4BE85] fira-sans mt-2">
              Sri Sai Ram Real Estate & Construction
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-1 animate-fade-in font-[Montserrat]">
              <label className="block text-gray-200 font-medium">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                className="w-full px-4 py-2 border border-gray-300 border-opacity-50 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {/* Password Field with Toggle */}
            <div className="space-y-1 animate-fade-in delay-200">
              <label className="block text-gray-200 font-medium">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 pr-12 border border-gray-300 border-opacity-50 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />

                {/* Show / Hide Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all"
            >
              {loading ? "Verifying..." : "Login to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;

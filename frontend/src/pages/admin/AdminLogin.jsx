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

        <div className="relative z-10 w-full max-w-md p-8 bg-gray-900 bg-opacity-80 backdrop-blur-md rounded-xl shadow-2xl border border-red-500/30">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold fira-sans text-white uppercase tracking-wider">
              Admin Portal
            </h2>
            <p className="text-lg text-[#F4BE85] fira-sans">
              Sri Sai Ram Real Estate & Construction
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1 mont">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
                placeholder="example@gmail.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1 mont">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} // Dynamic type switching
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition pr-12"
                  placeholder="••••••••"
                  required
                />
                {/* Toggle Button */}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
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

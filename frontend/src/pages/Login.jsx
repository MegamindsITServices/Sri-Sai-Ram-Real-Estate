import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Toast from "../component/Toast";
import { setLogin } from "../redux/UserSlice";
import API from "../utils/API";
import login from "../assets/login.png";
import Navbar from "../component/homepage/Navbar";
// import { tst } from "../utils/utils";
// import Navbar from "../component/Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const { user } = useSelector((state) => state.user);
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  //   useEffect(() => {
  //     if (user) {
  //       navigate("/");
  //     }
  //   }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      setLoading(false);
      return;
    }

    const loginPromise = API.post("/auth/login", { email, password });

    toast.promise(loginPromise, {
      loading: "Logging In...",
      success: "Login successful!",
      error: (err) =>
        err.response?.data?.message ||
        "Failed to Login/SignIn. Please try again.",
    });

    // Inside handleSubmit → after successful login
    try {
      const response = await loginPromise;

      dispatch(
        setLogin({
          user: response.data.user,
        })
      );

      localStorage.setItem("token", response.data.token);

      // Role-based redirect
      const userRole = response.data.user.role;

      if (userRole === "admin") {
        navigate("/admin"); // or '/admin/dashboard'
        toast.success("Welcome Admin!");
      } else {
        navigate("/");
        toast.success("Login successful!");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="flex items-center justify-center p-3 bg-cover bg-center grainy-dark min-h-screen"
        style={{ backgroundImage: `url(${login})` }}
      >
        <Toast />

        {/* Background Overlay */}
        <div className="absolute bg-black opacity-60 h-screen w-full border"></div>

        {/* Login Card */}
        <div className="relative z-10 w-full max-w-md p-6 sm:p-8 bg-opacity-70 backdrop-blur-md rounded-lg shadow-xl border border-gray-700">
          <h2 className="text-2xl sm:text-4xl font-bold mb-6 fira-sans text-center text-white">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-1 animate-fade-in font-[Montserrat]">
              <label
                htmlFor="email"
                className="block text-gray-200 font-medium"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } border-opacity-50 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1 animate-fade-in delay-200">
              <label
                htmlFor="password"
                className="block text-gray-200 font-medium"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } border-opacity-50 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary`}
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/auth/forgot-password"
                className="text-primary hover:underline text-sm"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all"
              >
                {loading ? "Loading..." : "Login"}
              </button>
            </div>
          </form>

          {/* Navigation to Register */}
          <div className="text-center mt-4">
            <span className="text-gray-200">Don't have an account? </span>
            <button
              onClick={() => navigate("/register")}
              className="text-blue-400 underline hover:underline font-medium"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

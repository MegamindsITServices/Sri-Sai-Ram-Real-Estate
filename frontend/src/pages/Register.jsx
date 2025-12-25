import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import Toast from "../component/Toast";
import API from "../utils/API";
import Navbar from "../component/homepage/Navbar";
import { useSelector } from "react-redux";
import login from '../assets/login.png'
const Register = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFormVisible(true);
    }, 500); // Delay matching the form slide-in duration
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  // Validation logic
  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z ]{3,}$/; // Name must be at least 3 characters and only letters/spaces
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/; // Password rules

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (!nameRegex.test(formData.name)) {
      newErrors.name =
        "Name must contain only letters and spaces, min 3 chars.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 6 chars, include 1 uppercase, 1 number, and 1 special char.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      toast.error("Please fix the errors and try again.");
      setLoading(false);
      return;
    }

    const registrationPromise = API.post("/auth/register", {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    toast.promise(registrationPromise, {
      loading: "Registering...",
      success: "Registration successful! Redirecting...",
      error: (err) =>
        err.response?.data?.message ||
        "Failed to Register/Signup. Please try again.",
    });

    try {
      const { data } = await registrationPromise;

      navigate("/auth/email-sent");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar className="relative z-20" />
      <div
        className="flex items-center justify-center min-h-screen bg-cover bg-center p-4 grainy-dark"
        style={{ backgroundImage: `url(${login})` }}
      >
        <Toast />

        {/* Semi-transparent Overlay */}
        <div className="absolute bg-black opacity-60 h-screen w-full border z-10"></div>

        {/* Sign Up Card */}
        <div className="relative z-20 w-full max-w-lg bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-lg shadow-lg border border-gray-500 border-opacity-40">
          {/* Title */}
          <h2 className="text-2xl md:text-4xl fira-sans text-center text-white mb-6">
            Sign Up
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Fields */}
            {[
              { label: "Name", name: "name", type: "text", placeholder: "Enter Name" },
              { label: "Email", name: "email", type: "email", placeholder: "user@gmail.com" },
              { label: "Password", name: "password", type: "password", placeholder: "********" },
              { label: "Confirm Password", name: "confirmPassword", type: "password", placeholder: "********" },
            ].map((field, index) => (
              <div
                key={field.name}
                className={`font-[Montserrat] transition-opacity duration-300 delay-${index * 100}`}
              >
                <label className="block text-gray-200 mb-2">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all ${
                    errors[field.name]
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-primary"
                  }`}
                />
                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                )}
              </div>
            ))}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md text-white bg-blue-600 hover:bg-primary-dark transition-all ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            {/* Navigation Link */}
            <div className="text-center mt-4 text-gray-200">
              <span>Already have an account? </span>
              <button
                type="button"
                className="text-blue-400 underline hover:underline"
                onClick={() => navigate("/login")}
              >
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>

    </>
  );
};

export default Register;

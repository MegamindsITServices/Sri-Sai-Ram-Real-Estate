import React, { useState } from 'react';
import founder from '../../assets/founder.png'
import API from '../../utils/API';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const ContactUs = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validate = () => {
    const newErrors = {};
    
    // Validate name
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    
    // Validate email
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Validate message
    if (!message.trim()) {
      newErrors.message = "Message is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitMsg = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitLoading(true);

    try {
      await toast.promise(
        API.post("/msg/putMsg", {
          name,
          email,
          message,
        }),
        {
          loading: "Sending message...",
          success: "Message sent successfully!",
          error: "Failed to submit message. Please try again.",
        }
      );

      setName("");
      setEmail("");
      setMessage("");
      setErrors({});
      toggleSidebar();
    } finally {
      setSubmitLoading(false);
    }
  };


  return (
    <div className="flex flex-col lg:flex-row items-start justify-between p-5 md:p-8 lg:p-10 min-h-64 relative md:pl-20">
      {/* Left Section */}
      <div className="lg:w-1/2 w-full p-4 space-y-6 md:pl-20">
        <h2 className="text-4xl md:text-4xl font-bold text-gray-800 fira-sans">
          Contact Us
        </h2>
        <p className="text-sm md:text-base lg:text-lg text-black font-[Montserrat]">
          <strong>Better yet, See us in person!</strong>
          <br />
          We love our customers, so feel free to visit during normal business
          hours.
        </p>
        <div>
          <h3
            className="text-base md:text-lg lg:text-xl font-semibold"
            style={{ fontFamily: "Fira Sans" }}
          >
            Location
          </h3>
          <p
            className="text-gray-700 text-sm md:text-base lg:text-lg"
            style={{ fontFamily: "Montserrat" }}
          >
            Ramapuram Putlur Road, Shree Ram Nagar, Kakkalur Industrial Estate,
            Thiruvallur, Tamil Nadu, India
          </p>
        </div>
        <div>
          <h3
            className="text-base md:text-lg lg:text-xl font-semibold"
            style={{ fontFamily: "Fira Sans" }}
          >
            Business Hours
          </h3>
          <p
            className="text-sm md:text-base lg:text-lg"
            style={{ fontFamily: "Montserrat" }}
          >
            Monday to Friday: 9:00 AM - 5:00 PM
            <br />
            Saturday: 10:00 AM - 2:00 PM
            <br />
            Sunday: Closed
          </p>
        </div>
        <button
          onClick={toggleSidebar}
          className="text-sm md:text-base lg:text-lg rounded-sm text-white px-6 py-3 bg-[#2b2bd9] font-medium hover:bg-blue-700 transition-all"
          style={{ fontFamily: "Montserrat" }}
        >
          Drop us a message!
        </button>
      </div>

      {/* Right Section (Map) */}
      <div className="lg:w-1/2 w-full p-4">
        <iframe
          className="w-full h-[300px] md:h-[350px] lg:h-[400px] rounded-xl border border-gray-300"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3914.7447897750445!2d79.9279747!3d13.131686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a528f6cd1eeeb73%3A0xdd165de74773170!2sSRI%20SAI%20RAM%20REAL%20ESTATE%20%26%20CONSTRUCTION!5e0!3m2!1sen!2sin!4v1710527264123!5m2!1sen!2sin"
          loading="lazy"
          allowFullScreen
        ></iframe>
      </div>

      {/* Sidebar */}
      <div
        className="absolute top-0 left-0 !pl-7 md:!pl-28 h-full w-full lg:w-1/2 bg-white p-5 z-10 transition-transform"
        style={{
          transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 1.2s cubic-bezier(0.02, 0.6, 0.3, 1)",
        }}
      >
        <h2
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-6"
          style={{ fontFamily: "Fira Sans" }}
        >
          Drop a Message
        </h2>
        <form className="space-y-6" onSubmit={submitMsg}>
          <div>
            <label
              htmlFor="name"
              className="block text-md md:text-[32px] font-semibold mont text-gray-700"
            >
              Name*
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full border ${
                errors.name ? "border-red-500" : "border-gray-300"
              }  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Your Name"
            />
            {/* {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>} */}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-md md:text-[32px] font-semibold mont text-gray-700"
              style={{ fontFamily: "Montserrat" }}
            >
              Email*
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border ${
                errors.email ? "border-red-500" : "border-gray-300"
              }  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Your Email"
            />
            {/* {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>} */}
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-md md:text-[32px] font-semibold mont text-gray-700"
              style={{ fontFamily: "Montserrat" }}
            >
              Message*
            </label>
            <textarea
              id="message"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`w-full border ${
                errors.message ? "border-red-500" : "border-gray-300"
              }  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter Your Message"
            ></textarea>
            {/* {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>} */}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => !submitLoading && toggleSidebar()}
              disabled={submitLoading}
              className="text-sm md:text-base text-gray-700 px-4 py-2 mr-2 border 
             disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitLoading}
              className="flex items-center gap-2 text-sm md:text-base text-white px-4 py-2 
             bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-50"
              style={{ fontFamily: "Montserrat" }}
            >
              {submitLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
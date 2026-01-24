import React from "react";

const TestimonialCard = ({ image, name, profession, feedback }) => {
  return (
    <div className="border rounded-xl shadow-lg bg-white p-6 max-w-sm">
      {/* Profile Section */}
      <div className="flex items-center space-x-4">
        <img
          src={image || "/default-user.jpg"}
          alt={name}
          className="w-14 h-14 rounded-md object-cover"
        />
        <div>
          <h3 className="font-bold text-lg text-gray-900">{name}</h3>
          {profession && <p className="text-sm text-gray-600">{profession}</p>}
        </div>
      </div>

      {/* Star Ratings */}
      <div className="mt-2 flex">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <span key={index} className="text-yellow-500 text-lg">
              ★
            </span>
          ))}
      </div>

      {/* Review Text */}
      <p className="mt-3 text-gray-700 text-sm leading-relaxed">{feedback}</p>
    </div>
  );
};

export default TestimonialCard;

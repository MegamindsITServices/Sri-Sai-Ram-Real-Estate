import React, { useState } from "react";
import review from "../../assets/review.jpg";
import toast from "react-hot-toast";
import home from "../../assets/h1.webp";

const Review = ({setReviewModel}) => {
  const [rating, setRating] = useState(0);
  const [reviewMessage, setReviewMessage] = useState("");

  const handleRating = (value) => {
    
    setRating(value);
  };


  return (
    <>
     <div className="fixed inset-0 pl-4 md:pl-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white rounded-xl p-6 md:p-8 w-[90%] max-h-[90%] overflow-y-auto max-w-3xl custom-scrollbar relative shadow-lg transition-transform duration-300 ease-in-out transform scale-100">
    {/* Close Button */}
    <button
      className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
      onClick={() => setReviewModel(false)}
      aria-label="Close Modal"
    >
      ✖
    </button>

    <div className="flex flex-col md:flex-row gap-6 mt-4 md:mt-0">
      {/* Left Section: Photo */}
      <div className="flex-shrink-0 w-full md:w-1/2 flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden">
        <img
          src={home}
          alt="Review Photo"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Section: Review Form */}
      <div className="w-full md:w-1/2 flex flex-col">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 fira-sans">Rate & Review</h2>

        {/* Star Rating */}
        <div className="flex items-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              xmlns="http://www.w3.org/2000/svg"
              className={`h-8 w-8 cursor-pointer ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
              fill={star <= rating ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={() => handleRating(star)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
          ))}
        </div>

        {/* Review Message */}
        <textarea
          className="border border-gray-300 rounded-lg p-3 mb-4 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-[Montserrat]"
          rows="4"
          placeholder="Write your review here..."
          value={reviewMessage}
          onChange={(e) => setReviewMessage(e.target.value)}
        ></textarea>

        {/* Submit Button */}
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors font-[Montserrat]"
          onClick={() => {
            if(rating===0 ){
              return toast.error("Select the rating")
            }
            if(!reviewMessage){
              return toast.error("Give the review");
            }
            setReviewModel(false);
            toast.success("review submitted")
          }}
        >
          Submit Review
        </button>
      </div>
    </div>
  </div>
</div>

    </>
  );
};

export default Review;

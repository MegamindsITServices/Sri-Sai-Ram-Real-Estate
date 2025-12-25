import React from "react";
import { Loader2 } from "lucide-react";

const Loader = ({ size = "md", text = "Loading..." }) => {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6">
      <Loader2 className={`animate-spin text-[#F5BE86] ${sizeClasses[size]}`} />

      {text && (
        <p className="text-sm text-gray-600 font-[Montserrat]">{text}</p>
      )}
    </div>
  );
};

export default Loader;

import React from "react";

const Logo = () => {
  return (
    <div className="flex gap-1 items-center md:pl-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="59"
        viewBox="0 0 57 58"
        fill="none"
      >
        <path
          d="M0.925781 67.0556H9.02047V46.4833L18.0056 39.7063V67.0556H14.3023V13.4665H24.5623V38.0904H20.7578V0.732422H33.7497V54.0562H29.3988V42.2869H43.1193V67.152H38.8292V17.1806L47.7535 23.9817V67.152H56.4553"
          stroke="#F4BE85"
          strokeWidth="2"
        />
      </svg>

      <div className="text-xs md:text-md text-[#933748] flex flex-col items-start marcellus-regular font-semibold">
        <p>SRI SAI RAM REAL ESTATE</p>
        <p>& CONSTRUCTION</p>
        <p
          className="marcellus-regular items-start text-left font-normal text-[#e57f14] text-xs"
        >
          A SAFFRON’S REAL ESTATE PRIVATE LIMITED
        </p>
      </div>
    </div>
  );
};


export default Logo;

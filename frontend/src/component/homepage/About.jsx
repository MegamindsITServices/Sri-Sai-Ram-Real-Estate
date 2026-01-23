import React, { useEffect } from 'react';
import founder from '../../assets/founder.png'
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate=useNavigate();
  // useEffect(()=>{
  //   window.scrollTo({
  //     top: 0,
  //     behavior: 'smooth'  // Smooth scrolling effect added here
  //   });
  // },[])
  return (
    <>
    <div className="p-6 md:p-8  bg-[#E9E9FB]  pt-16 md:pt-32 relative  -top-20 md:-top-24 lg:-top-40 pl-4 md:pl-20 ">
      <h2 className="text-lg md:text-4xl font-bold text-gray-800 mb-6 md:mb-8 uppercase tracking-wide text-start pl-4 fira-sans">
        About SRI SAI RAM REAL ESTATE
      </h2>
      <div className="flex flex-col md:flex-row items-center md:items-start rounded-lg overflow-hidden p-4 md:p-6 space-y-6 md:space-y-0 md:space-x-8">
        {/* Image Section */}
        <div className="relative w-full md:w-1/3">
  <img 
    src={founder} // Replace with the correct path for your image
    alt="Founder Image" 
    className="w-full h-full md:h-auto rounded-sm object-center shadow-md"
  />
  {/* Name Overlay */}
  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
    <h3 className="text-lg font-semibold font-[Montserrat]">K SURESH BABU GARU</h3>
    <p className="text-sm font-[Montserrat]">FOUNDER</p>
  </div>
</div>

        {/* Content Section */}
        <div className="flex flex-col justify-center space-y-6 w-full md:w-2/3">
          {/* History Section */}
          <div>
            <h2 className="text-base md:text-lg font-semibold text-black mb-2 font-[Montserrat]">
              Our History
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base font-[Montserrat]">
              Welcome to Sri Sai Ram Real Estate, where we have been serving the real estate needs of our valued customers since 1980. Our journey began as a land selling company, and over the years, we have grown and evolved to become a trusted name in the real estate industry.
            </p>
          </div>
          {/* Vision Section */}
          <div>
            <h2 className="font-[Montserrat] md:text-lg font-semibold text-black mb-2 ">
              Our Vision
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base font-montserrat">
              Founded in 1980, our story is one of growth and adaptation. We started our journey with a singular focus: to provide our customers with the perfect piece of land to build their dreams upon. Our dedication and commitment to this vision allowed us to thrive in the competitive real estate market.
            </p>
          </div>
          {/* Button Section */}
          <div className="pt-4">
            <button 
              className="inline-flex items-center justify-center gap-2.5 px-6 py-2.5 bg-[#2b2bd9] hover:bg-[#1e1ecb] text-white rounded-sm text-sm md:text-base font-medium shadow-md transition duration-200"
              onClick={() => navigate("/about")}
            >
              Know more
            </button>
          </div>
        </div>
      </div>
    </div>


    </>
  );
}

export default About;

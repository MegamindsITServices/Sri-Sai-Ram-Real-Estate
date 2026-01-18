
import React, { useState, useEffect, useRef } from "react";


const Overview = () => {
  const [counts, setCounts] = useState({
    experience: 0,
    projects: 0,
    customers: 0,
    sqft: 0,
  });

  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateNumbers();
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const animateNumbers = () => {
    const duration = 2000; // Animation duration (ms)
    const fps = 60;
    const interval = duration / fps;

    const targets = {
      experience: 35,
      projects: 80,
      customers: 2001,
      sqft: 1000000,
    };

    let steps = fps; // Number of animation frames

    const incrementValues = {
      experience: targets.experience / steps,
      projects: targets.projects / steps,
      customers: targets.customers / steps,
      sqft: targets.sqft / steps,
    };

    let count = {
      experience: 0,
      projects: 0,
      customers: 0,
      sqft: 0,
    };

    const animate = () => {
      if (steps <= 0) return;
      steps -= 1;

      setCounts((prevCounts) => ({
        experience: Math.min(prevCounts.experience + incrementValues.experience, targets.experience),
        projects: Math.min(prevCounts.projects + incrementValues.projects, targets.projects),
        customers: Math.min(prevCounts.customers + incrementValues.customers, targets.customers),
        sqft: Math.min(prevCounts.sqft + incrementValues.sqft, targets.sqft),
      }));

      requestAnimationFrame(animate);
    };

    animate();
  };
  return (
    <>
       <div ref={sectionRef} className=" w-full h-auto pl-4 md:pl-0 flex justify-center relative -top-20 ">
      <div className="w-[90%] md:w-[86%] h-full z-10 backdrop-blur-[3px] gap-6 flex flex-col md:flex-row items-center justify-around border p-6 bg-white/70 py-11">
        <div className="h-auto md:h-[70%] border-black md:border-r-2 px-6 flex flex-col items-center justify-center mb-4 md:mb-0 text-gray-800">
          <h1 className="text-4xl lg:text-[64px] font-bold fira-sans bg-gradient-to-b from-black via-gray-600 py-1 to-black bg-clip-text text-transparent">{Math.floor(counts.experience)+1}+</h1>
          <p className="text-base md:text-lg font-bold mt-4 mont">Years of Experience</p>
        </div>
        <div className="h-auto md:h-[70%] border-black md:border-r-2 px-6 flex flex-col items-center justify-center mb-4 md:mb-0 text-gray-800">
          <h1 className="text-4xl lg:text-[64px] font-bold fira-sans bg-gradient-to-b from-black via-gray-600 py-1 to-black bg-clip-text text-transparent">{Math.floor(counts.projects)+1}+</h1>
          <p className="text-base md:text-lg font-bold mt-4 mont ">Projects Done</p>
        </div>
        <div className="h-auto md:h-[70%] border-black md:border-r-2 px-6 flex flex-col items-center justify-center mb-4 md:mb-0 text-gray-800">
          <h1 className="text-4xl lg:text-[64px] font-bold fira-sans bg-gradient-to-b from-black via-gray-600 py-1 to-black bg-clip-text text-transparent">{Math.floor(counts.customers)}+</h1>
          <p className="text-base md:text-lg font-bold mt-4 mont">Customers Served</p>
        </div>
        <div className="h-auto md:h-[70%] px-6 flex flex-col items-center justify-center text-gray-800">
          <h1 className="text-4xl lg:text-[64px] font-bold fira-sans bg-gradient-to-b from-black via-gray-600 py-1 to-black bg-clip-text text-transparent">
            {
              Math.floor(counts.sqft)+1 !==1000000 ? `${Math.floor(counts.sqft)+1}k+`:'1M+'
            }
            </h1>
          <p className="text-base md:text-lg font-bold mt-4 mont">Sq.ft Sold</p>
        </div>
      </div>
    </div>



    </>
  );
}

export default Overview;

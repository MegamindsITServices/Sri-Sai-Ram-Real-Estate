// LoadingScreen.js
import { useState, useEffect } from "react";
import name from "../assets/safron (2).png";
import { motion } from "framer-motion";
import safron from "../assets/safron (1).png";
import SEO from "./SEO";
const Enterance = ({ loading }) => {
  const [step, setStep] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 10); // Adjust speed by changing interval time

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (!loading) {
      setAnimate(true);
    }
  }, [loading]);
  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prevStep) => (prevStep < 13 ? prevStep + 1 : 13));
    }, 100); // Change interval to control speed of the animation

    return () => clearInterval(interval);
  }, []);
  const logos = [
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="140"
      height="245"
      viewBox="0 0 205 251"
      fill="none"
    >
      <g id="Frame 427319932">
        <path
          className="path-stroke animation-shock"
          id="Vector 12"
          d="M0 248.887H29.8834V171.701"
          stroke="#F4BE85"
          stroke-width="3.62191"
        />
      </g>
    </svg>,
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="140"
      height="245"
      viewBox="0 0 205 252"
      fill="none"
    >
      <g id="Frame 427319932">
        <path
          className="path-stroke animation-shock"
          id="Vector 12"
          d="M0 249.685H29.8834V172.499L63.0539 147.072"
          stroke="#F4BE85"
          stroke-width="3.62191"
        />
      </g>
    </svg>,
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="140"
      height="245"
      viewBox="0 0 205 252"
      fill="none"
    >
      <g id="Frame 427319932">
        <path
          className="path-stroke animation-shock"
          id="Vector 12"
          d="M0 249.482H29.8834V172.296L63.0539 146.869V249.482"
          stroke="#F4BE85"
          stroke-width="3.62191"
        />
      </g>
    </svg>,
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="140"
      height="245"
      viewBox="0 0 205 252"
      fill="none"
    >
      <g id="Frame 427319932">
        <path
          className="path-stroke animation-shock"
          id="Vector 12"
          d="M0 249.279H29.8834V172.093L63.0539 146.665V249.279H49.3823V48.2148"
          stroke="#F4BE85"
          stroke-width="3.62191"
        />
      </g>
    </svg>,
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="140"
      height="245"
      viewBox="0 0 205 252"
      fill="none"
    >
      <g id="Frame 427319932">
        <path
          className="path-stroke animation-shock"
          id="Vector 12"
          d="M0 249.669H29.8834V172.483L63.0539 147.056V249.669H49.3823V48.6056H87.2595V140.994H73.2143V0.828125"
          stroke="#F4BE85"
          stroke-width="3.62191"
        />
      </g>
    </svg>,
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="140"
      height="245"
      viewBox="0 0 205 254"
      fill="none"
    >
      <g id="Frame 427319932">
        <path
          className="path-stroke animation-shock"
          id="Vector 12"
          d="M0 251.466H29.8834V174.28L63.0539 148.853V251.466H49.3823V50.4025H87.2595V142.79H73.2143V2.625H121.177V202.693"
          stroke="#F4BE85"
          stroke-width="3.62191"
        />
      </g>
    </svg>,
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="140"
      height="245"
      viewBox="0 0 205 254"
      fill="none"
    >
      <g id="Frame 427319932">
        <path
          className="path-stroke animation-shock"
          id="Vector 12"
          d="M0 251.263H29.8834V174.077L63.0539 148.65V251.263H49.3823V50.1994H87.2595V142.587H73.2143V2.42188H121.177V202.49H105.115V158.332"
          stroke="#F4BE85"
          stroke-width="3.62191"
        />
      </g>
    </svg>,
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="140"
      height="245"
      viewBox="0 0 205 253"
      fill="none"
    >
      <g id="Frame 427319932">
        <path
          className="path-stroke animation-shock"
          id="Vector 12"
          d="M0 251.06H29.8834V173.874L63.0539 148.447V251.06H49.3823V49.9963H87.2595V142.384H73.2143V2.21875H121.177V202.287H105.115V158.129H155.767"
          stroke="#F4BE85"
          stroke-width="3.62191"
        />
      </g>
    </svg>,
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="140"
      height="245"
      viewBox="0 0 205 253"
      fill="none"
    >
      <g id="Frame 427319932">
        <path
          className="path-stroke animation-shock"
          id="Vector 12"
          d="M0 250.857H29.8834V173.671L63.0539 148.244V250.857H49.3823V49.7931H87.2595V142.181H73.2143V2.01562H121.177V202.084H105.115V157.926H155.767V251.219"
          stroke="#F4BE85"
          stroke-width="3.62191"
        />
      </g>
    </svg>,
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="140"
      height="245"
      viewBox="0 0 205 253"
      fill="none"
    >
      <g id="Frame 427319932">
        <path
          className="path-stroke animation-shock"
          id="Vector 12"
          d="M0 250.654H29.8834V173.468L63.0539 148.041V250.654H49.3823V49.59H87.2595V141.978H73.2143V1.8125H121.177V201.881H105.115V157.723H155.767V251.016H139.929"
          stroke="#F4BE85"
          stroke-width="3.62191"
        />
      </g>
    </svg>,
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="140"
      height="245"
      viewBox="0 0 205 254"
      fill="none"
    >
      <g id="Frame 427319932">
        <path
          className="path-stroke animation-shock"
          id="Vector 12"
          d="M0 251.451H29.8834V174.265L63.0539 148.838V251.451H49.3823V50.3869H87.2595V142.775H73.2143V2.60938H121.177V202.678H105.115V158.52H155.767V251.813H139.929V64.322"
          stroke="#F4BE85"
          stroke-width="3.62191"
        />
      </g>
    </svg>,
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="140"
      height="245"
      viewBox="0 0 205 254"
      fill="none"
    >
      <g id="Frame 427319932">
        <path
          className="path-stroke animation-shock"
          id="Vector 12"
          d="M0 251.248H29.8834V174.061L63.0539 148.634V251.248H49.3823V50.1838H87.2595V142.572H73.2143V2.40625H121.177V202.475H105.115V158.317H155.767V251.609H139.929V64.1189L172.875 89.6364"
          stroke="#F4BE85"
          stroke-width="3.62191"
        />
      </g>
    </svg>,
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="140"
      height="245"
      viewBox="0 0 205 254"
      fill="none"
    >
      <g id="Frame 427319932">
        <path
          className="path-stroke animation-shock"
          id="Vector 12"
          d="M0 251.044H29.8834V173.858L63.0539 148.431V251.044H49.3823V49.9806H87.2595V142.369H73.2143V2.20312H121.177V202.271H105.115V158.113H155.767V251.406H139.929V63.9158L172.875 89.4333V251.406"
          stroke="#F4BE85"
          stroke-width="3.62191"
        />
      </g>
    </svg>,
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="140"
      height="245"
      viewBox="0 0 205 254"
      fill="none"
    >
      <g id="Frame 427319931">
        <path
          className="path-stroke animation-shock"
          id="Vector 12"
          d="M0 250.841H29.8834V173.655L63.0539 148.228V250.841H49.3823V49.7775H87.2595V142.165H73.2143V2H121.177V202.068H105.115V157.91H155.767V251.203H139.929V63.7126L172.875 89.2302V251.203H205"
          stroke="#F4BE85"
          stroke-width="3.62191"
        />
      </g>
    </svg>,
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="140"
      height="245"
      viewBox="0 0 205 254"
      fill="none"
    >
      <g id="Frame 427319931">
        <path
          className="path-stroke animation-shock"
          id="Vector 12"
          d="M0 250.841H29.8834V173.655L63.0539 148.228V250.841H49.3823V49.7775H87.2595V142.165H73.2143V2H121.177V202.068H105.115V157.91H155.767V251.203H139.929V63.7126L172.875 89.2302V251.203H205"
          stroke="#F4BE85"
          stroke-width="3.62191"
        />
      </g>
    </svg>,
  ];

  return (
    <div
      className={`absolute z-50 bg-[#E9E9FB] w-full flex justify-center items-center h-screen transition-transform $`}
    >
      <SEO
        title="Sri Sai Ram Real Estate & Construction | Trusted Builders Since 1980"
        description="Sri Sai Ram Real Estate & Construction is a trusted real estate and construction company delivering premium residential and commercial projects since 1980."
        keywords="Sri Sai Ram Real Estate, construction company Tamil Nadu, real estate builders, residential construction, commercial construction"
        url="https://srisairam.co.in/"
      />
      <div
        className={`flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-12 ${
          animate ? "moving-div" : ""
        }`}
      >
        <div
          className={`flex transition-transform duration-[2000ms] ease-out text-[#F4BE85] justify-center items-center `}
          key={step}
        >
          {logos[step]}
        </div>

        <img
          className="w-[70%] sm:w-[50%] md:w-[40%] lg:w-[45%]"
          src={name}
          alt="name"
        />
        <div className="w-[85%] border-[#F4B26E]  rounded-sm mt-3">
          <div
            className="h-3 w-[70%] sm:w-[50%] md:w-[40%] lg:w-[50%] bg-orange-400 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          ></div>

          <div className="flex items-center justify-center mt-5">
            <h1 className="marcellus-regular  text-[#E58015]">
              A SAFFRONS REAL ESTATE COMPANY
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enterance;

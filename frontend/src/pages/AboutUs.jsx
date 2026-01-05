import React from "react";
import Navbar from "../component/homepage/Navbar";
import background from "../assets/project.jpeg";
import founder from "../assets/founder.png";
import about from "../assets/about.jpeg";
import cloud from "../assets/cloud.png";
import ProjectSlider from "../component/slider/ProjectSlider";
import build from "../assets/build.jpeg";
import comitment from "../assets/comitment.jpg";
import vision from "../assets/vision.png";
import Why from "../component/Why";
import Footer from "../component/homepage/Footer";
import { useNavigate } from "react-router-dom";
import estate from "../assets/estate.jpg";
import { Link } from "react-router-dom";
import overlay from "../assets/overlay.jpg";
import Layout from "../component/layout/Layout";
import SEO from "../component/SEO";
const AboutUs = () => {
  const navigate = useNavigate();
  let i = 21;
  const zero = () => {
    while (i > 0) {
      if (i % 2 === 0) {
        i = i / 2;
      } else {
        i = i - 1;
      }
    }
    console.log(i);
  };
  zero();
  return (
    <>
      <Navbar />

      <SEO
        title="About Sri Sai Ram Real Estate & Construction | Our History & Vision"
        description="Learn about Sri Sai Ram Real Estate & Construction, our founder K. Suresh Babu Garu, our journey since 1980, values, commitment, and vision."
        keywords="about Sri Sai Ram Real Estate, construction company history, real estate company Tamil Nadu, trusted builders"
        url="https://srisairam.co.in/about"
      />

      {/* Background Section */}
      <Layout
        title={"About Us - SRI SAI ESTATE"}
        description={
          "SRI SAI Real Estate is a trusted name in property consulting and development. Learn about our mission, team, values, and years of experience in the real estate industry."
        }
        keywords={
          "about real estate company, property consultants, experienced realtors, trusted real estate firm, SRI SAI Real Estate team"
        }
      >
        <div
          className="w-full min-h-72 max-h-72 inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${background})` }}
        >
          <div className="flex flex-col justify-end gap-3 h-72 pb-8 pl-14 text-white">
            <h1 className="text-4xl font-bold leading-tight fira-sans">
              About Us
            </h1>
            <p className="text-lg md:text-xl hover:cursor-pointer font-[Montserrat]">
              <Link to="/">Home</Link> {`>`} <span>About Us</span>
            </p>
          </div>
        </div>

        <div className="px-8 md:px-12 min-h-72 pt-10 relative">
          <div className="flex flex-col md:flex-row items-center rounded-lg space-y-6 md:space-y-0 md:space-x-10">
            <div className="flex flex-col justify-center space-y-4 w-full md:w-2/3 ">
              <h1 className="top-4 relative text-[40px] md:text-4xl text-gray-800 mb-2 uppercase tracking-wide fira-sans text-center md:text-left">
                K SURESH BABU Garu
              </h1>
              <p className="text-sm md:text-base font-[Montserrat] text-center md:text-left">
                Founder
              </p>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base lg:text-lg font-[Montserrat]">
                Our esteemed founder, K. Suresh Babu Garu, was a visionary
                leader whose passion for service and dedication to excellence
                left an indelible mark on the Sri Sai Ram Group and Sasvat
                Charitable Trust. With a rich legacy of compassionate
                leadership, he spearheaded initiatives that transformed
                countless lives and uplifted communities.
              </p>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base lg:text-lg font-[Montserrat]">
                Driven by his unwavering commitment to philanthropy and social
                responsibility, Mr. Suresh Babu Garu played a pivotal role in
                shaping the Sri Sai Ram Group's success in the real estate and
                construction industry. His visionary leadership and
                forward-thinking approach laid the foundation for the
                organization's growth and expansion over 3 decades.
              </p>
            </div>
            <div className="w-full md:w-1/3 h-full">
              <img
                src={founder}
                alt="Founder Image"
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>

        <div className="px-5 min-h-72 relative mt-3">
          <p className="text-gray-600 leading-relaxed text-sm md:text-base pl-3 md:pl-7 lg:text-lg font-[Montserrat]">
            My belief has always been that success is not measured solely by
            financial achievements but by the positive change we bring to the
            world. Through Sasvat Charitable Trust, I have strived to address
            pressing social issues, provide essential resources, and give back
            to society in a meaningful way.
            <br />
            As I reflect on this journey, I take immense pride in the values of
            compassion, integrity, and excellence that have shaped our mission.
            My hope is that this legacy continues to inspire future generations
            to carry forward this vision and make a lasting difference in the
            lives of others.
          </p>
        </div>

        <div className="p-6 sm:p-8 md:p-12  pt-10 relative bg-[#F0F1F2]">
          <div className="flex flex-col md:flex-row items-center rounded-lg overflow-hidden p-4 sm:p-6 md:p-8 space-y-6 md:space-y-0 md:space-x-10">
            <div className="flex flex-col justify-center space-y-6 w-full md:w-2/3">
              <div className="flex flex-col">
                <h1 className="text-2xl sm:text-3xl md:text-4xl leading-snug text-gray-800 fira-sans">
                  About <br /> SRI SAI RAM ESTATE <br /> & CONSTRUCTION
                </h1>
                <div className="text-sm sm:text-base md:text-lg font-[Montserrat] text-gray-600 leading-relaxed mt-4">
                  Welcome to Sri Sai Ram Real Estate, where we have been serving
                  the real estate needs of our valued customers since 1980. Our
                  journey began as a land selling company, and over the years,
                  we have grown and evolved to become a trusted name in the real
                  estate industry.
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 flex justify-center">
              <img
                src={about}
                alt="About Image"
                className="w-full sm:w-3/4 md:w-full h-auto rounded-lg object-cover shadow-md"
              />
            </div>
          </div>
        </div>

        <div className="relative  py-0 md:py-10 bg-[#FFF9EB]">
          <img
            src={cloud}
            className="absolute -translate-y-[80px]  sm:-translate-y-[180px]  lg:-translate-y-[350px] left-1/2 -translate-x-1/2 w-[90%] pointer-events-none"
          />
        </div>

        <div className="bg-[#FFF9EB] py-24 px-6 md:px-12">
  <div className="flex flex-col sm:flex-row items-center gap-10">
    
    <div className="w-full  space-y-6">
      <h1 className="text-4xl fira-sans text-gray-800">
        Our History
      </h1>
      <p className="text-sm md:text-lg font-[Montserrat] text-gray-600 leading-relaxed">
        Founded in 1980, our story is one of growth and adaptation. We started
        our journey with a singular focus: to provide our customers with the
        perfect piece of land to build their dreams upon. Our dedication and
        commitment to this vision allowed us to thrive in the competitive real
        estate market.
      </p>
    </div>

    <div className="relative w-full flex mt-5  justify-end mr-3">
      <div className="relative">
        <img
          src={estate}
          alt="Estate"
          className="w-[320px] md:w-[500px] rounded-lg shadow-md"
        />
        <div className="absolute -top-16 md:-top-24 right-0 text-[80px] md:text-[120px] font-bold bg-clip-text text-transparent bg-gradient-to-b from-black via-gray-700 to-black">
          1980
        </div>
      </div>
    </div>

  </div>
</div>


        <ProjectSlider />

        <div
          className="w-full min-h-64 max-h-[70vh] inset-0 bg-cover bg-center flex items-center justify-center py-7 "
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(${build})`,
          }}
        >
          <div className="text-center w-full text-black px-4 sm:px-6 py-8 sm:py-12 md:py-36 rounded-lg flex flex-col justify-center items-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 text-shadow fira-sans">
              Expanding Horizons
            </h1>
            <p className="text-sm sm:text-base md:text-lg px-4 sm:px-12 md:px-20 mt-5 sm:mt-7 font-[Montserrat]">
              As the real estate landscape continued to change, so did we.
              Recognizing the evolving needs of our clients, we took the bold
              step of expanding our services. In response to increasing demand,
              we began to construct homes that not only met industry standards
              but also exceeded the expectations of our discerning customers.
              This expansion allowed us to offer a comprehensive range of
              services, from land acquisition to the construction of your dream
              home.
            </p>
            <div className="bg-[#F5BE86] h-6 sm:h-8 w-20 sm:w-24 mt-4 sm:mt-6"></div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row w-full">
          {/* Left Section: Full-side Image */}
          <div className="w-full md:w-1/2 h-56 sm:h-64 md:h-full">
            <img
              src={comitment}
              alt="Real Estate"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Section: Content */}
          <div className="w-full md:w-1/2 flex items-center justify-center bg-[#E9E9FB]">
            <div className="text-center px-4 sm:px-6 py-6 sm:py-8 md:px-12 md:py-12">
              <h2 className="text-2xl text-start sm:text-3xl md:text-4xl text-gray-800 mb-4 sm:mb-6 fira-sans">
                Our Commitment
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed font-[Montserrat] text-start">
                At Sri Sai Ram Real Estate, our commitment to excellence remains
                unwavering. We are driven by a passion for quality, a dedication
                to customer satisfaction, and a profound understanding of the
                real estate market. Our team of experienced professionals is
                here to guide you through every step of your real estate
                journey, ensuring that your dreams become a reality.
              </p>
            </div>
          </div>
        </div>

        <div
          className="w-full bg-cover bg-center    flex items-center justify-center h-[90vh]"
          style={{ backgroundImage: `url(${vision})` }}
        >
          <div className="text-center w-full text-black px-4 sm:px-6 h-[30vh] sm:h-[40vh] md:h-[50vh] lg:h-[60vh] rounded-lg flex flex-col justify-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-3 sm:mb-4 md:mb-6 text-shadow fira-sans">
              Our Vision
            </h1>
            <p className=" sm:text-sm md:text-base lg:text-lg xl:text-xl px-3 sm:px-10 md:px-20 lg:px-32 xl:px-48 font-[Montserrat] mt-2 sm:mt-3 font-semibold">
              Our vision is to be the premier destination for all your real
              estate needs. Whether you're looking for the perfect plot of land
              or the keys to your dream home, we are here to make your
              aspirations come true.
            </p>
          </div>
        </div>

        <div>
          <Why />
        </div>
      </Layout>

      {/* <div className='relative -top-20'>
  <div className='w-full h-20 border border-red-500'>

  </div>
  <div className='max-h-[780px] overflow-hidden relative -top-20 '>
    <img src={overlay} />
  </div>
</div> */}
      <Footer />
    </>
  );
};

export default AboutUs;

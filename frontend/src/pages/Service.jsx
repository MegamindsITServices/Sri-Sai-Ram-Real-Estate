import service2 from "../assets/service2.jpg";
import home from "../assets/h1.webp";
import working from "../assets/working.jpg";
import Footer from "../component/homepage/Footer";
import Navbar from "../component/homepage/Navbar";
import background from "../assets/project.jpeg";
import m1 from "../assets/m1 (1).png";
import m2 from "../assets/m1 (3).png";
import m3 from "../assets/m1 (3).png";
import m4 from "../assets/m1 (4).png";
import m5 from "../assets/m1 (5).png";
import m6 from "../assets/m1 (6).png";
import { Helmet } from "react-helmet";
import SEO from "../component/SEO";
const teamMembers = [
  {
    name: "Team member",
    role: "Team member Role",
    phone: "+91 999 666 1234",
    image: m1,
  },
  {
    name: "Team member",
    role: "Team member Role",
    phone: "+91 999 666 1234",
    image: m2,
  },
  {
    name: "Team member",
    role: "Team member Role",
    phone: "+91 999 666 1234",
    image: m3,
  },
  {
    name: "Team member",
    role: "Team member Role",
    phone: "+91 999 666 1234",
    image: m4,
  },
  {
    name: "Team member",
    role: "Team member Role",
    phone: "+91 999 666 1234",
    image: m5,
  },
  {
    name: "Team member",
    role: "Team member Role",
    phone: "+91 999 666 1234",
    image: m6,
  },
];
const services = [
  {
    title: "Discover Your Plot",
    description:
      "Explore the perfect piece of land tailored to your needs with ease.",
    icon: home,
  },
  {
    title: "Make the Most of Your Land",
    description:
      "Maximize your land's potential with strategic insights and tools.",
    icon: service2,
  },
  {
    title: "Crafting Your Vision",
    description:
      "Turn your ideas into reality with expert guidance and support.",
    icon: working,
  },
];

const Service = () => {
  return (
    <>
      <Navbar />
      <SEO
        title="Real Estate & Construction Services | Sri Sai Ram Estate"
        description="Explore expert real estate and construction services by Sri Sai Ram Estate including plot selection, land development, and complete construction solutions."
        keywords="real estate services, construction services, plot selection, land development, home construction, property consulting, Sri Sai Ram Estate"
        image="https://srisairam.co.in/og-services.jpg"
        url="https://srisairam.co.in/service"
      />

      <div
        className="w-full min-h-72 max-h-72 inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="flex flex-col justify-end gap-3 h-72 pb-8 pl-14 text-white">
          <h1 className="text-4xl fira-sans">Services</h1>
          <p className="text-xl font-[Montserrat]">
            <span
              onClick={() => navigate("/")}
              className="border-b-2 cursor-pointer"
            >
              Home
            </span>{" "}
            {">"}
            <span>Services</span>
          </p>
        </div>
      </div>

      <section className="py-8 px-5 md:px-[65px] flex items-center justify-center">
        <div className="max-w-6xl  px-4 sm:px-6 lg:px-8  bg-white">
          <h2 className="text-3xl pl-3 sm:text-4xl fira-sans font-bold text-start text-gray-800 mb-2">
            Our Services
          </h2>
          <div className="max-w-6xl mx-auto py-10 px-5">
            <div className="grid md:grid-cols-1 gap-5">
              {services.map((service, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-center  ${
                    index % 2 !== 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <img
                    src={service.icon}
                    alt={service.title}
                    className="w-full md:w-1/3 h-56 object-cover rounded-sm shadow-lg"
                  />
                  <div className="bg-amber-50 p-6 py-10 rounded-sm shadow-md">
                    <h3 className="text-xl fira-sans">{service.title}</h3>
                    <p className="text-gray-600 font-[Montserrat]">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* <div className="max-w-5xl mx-auto py-10">
        <h2 className="text-4xl font-bold mb-6 fira-sans">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-[Montserrat]">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex items-center bg-purple-100 p-10 rounded-sm shadow-md">
              <img src={member.image} alt={member.name} className="w-20 h-20  object-cover" />
              <div className="ml-4">
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
                <p className="text-gray-700 flex items-center">
                  📞 <span className="ml-1">{member.phone}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div> */}
      <Footer />
    </>
  );
};

export default Service;

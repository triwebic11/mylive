import { FaWhatsapp } from "react-icons/fa";
import { company1, company2, company3, company4 } from "../assets";

const AboutUs = () => {
  return (
    <section className="bg-gray-100 min-h-screen py-12 mt-8 px-6 md:px-16 lg:px-24">
      <div className=" p-8 md:p-12 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-10  pb-4">
          About Us – HEAVEN LIRA MARKETING LTD{" "}
        </h1>

        <div className="text-center bg-white rounded-2xl shadow-2xl p-6 my-10">
          <h2 className="text-xl font-semibold mb-2 text-indigo-700">
            📞 Contact
          </h2>
          <div className="flex flex-col items-center space-y-2 text-lg">
            <a
              href="https://wa.me/8801747998102"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-green-600 hover:underline"
            >
              <FaWhatsapp className="mr-2 text-xl" /> 01747998102
            </a>
          </div>
        </div>

        <div className="mb-10 bg-white rounded-2xl shadow-xl p-10 text-center justify-center">
          <h2 className="text-3xl font-bold mb-8 text-indigo-600">
            About Our Company
          </h2>

          <p>
            Our company is officially registered and certified by the government
            authorities. We proudly hold all necessary licenses and
            certifications to operate legally and professionally. Transparency,
            compliance, and trust are the foundation of our services.
          </p>
        </div>

        <div className="mb-10 bg-white rounded-2xl shadow-xl p-10">
          <h2 className="text-3xl font-bold mb-8 text-indigo-600 text-center justify-center">
            Investment Information
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Heaven lira marketing LTD.. is a direct-selling company engaged in
            offering a wide range of products directly to consumers. The company
            operates in the direct selling industry, which is characterized by
            selling products or services directly to customers through a network
            of independent distributors or salespeople rather than through
            traditional retail channels. The "About Us" section for heaven lira
            marketing LTD.. could emphasize its commitment to quality,
            innovation, and customer satisfaction. Here's a sample:
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Welcome to heaven lira marketing LTD... a pioneering force in the direct selling industry. Our mission is to empower individuals by providing high-quality products that enhance their lives while offering an opportunity for financial growth and independence.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Founded on the principles of trust, transparency, and integrity, heaven lira marketing LTD...has rapidly grown to become a leading name in direct selling. We offer a diverse portfolio of products ranging from health and wellness to personal care, catering to the varied needs of our customers. Our commitment to excellence drives us to continually innovate and bring the best products to the market.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            At heaven lira marketing LTD..., we believe in the power of people. Our network of independent distributors is the backbone of our company, and we are dedicated to their success. We provide comprehensive training, support, and the tools they need to achieve their goals, whether they are looking to supplement their income or build a full-time business. We are more than just a company; we are a community. Together, we are making a positive impact on lives around the world, one product at a time. Join us in our journey and live on with heaven lira marketing LTD...
          </p>
        </div>


        <div className="text-center bg-white rounded-2xl shadow-2xl p-6 my-10">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-indigo-600">
              About Our Company Certificates{" "}
            </h2>
            <p className="text-gray-800 font-medium mb-10 max-w-3xl text-md mx-auto">
              Our company is officially registered and certified by the
              government authorities. We proudly hold all necessary licenses and
              certifications to operate legally and professionally.
              Transparency, compliance, and trust are the foundation of our
              services. 
            </p>

            {/* Image Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <a href={company1} target="_blank" rel="noopener noreferrer">
                <img
                  to="_blank"
                  src={company1}
                  alt="Company Office 1"
                  className="w-full h-84 object-cover hover:scale-110 duration-500 cursor-pointer rounded-xl shadow-md"
                />
              </a>
              <a href={company4} target="_blank" rel="noopener noreferrer">
                <img
                  src={company4}
                  alt="Company Office 2"
                  className="w-full h-84 object-cover hover:scale-110 duration-500 cursor-pointer  rounded-xl shadow-md"
                />
              </a>
              <a href={company3} target="_blank" rel="noopener noreferrer">
                <img
                  src={company3}
                  alt="Company Team 1"
                  className="w-full h-84 object-cover  hover:scale-110 duration-500 cursor-pointer rounded-xl shadow-md"
                />
              </a>
              <a href={company2} target="_blank" rel="noopener noreferrer">
                <img
                  target="blank"
                  src={company2}
                  alt="Company Team 2"
                  className="w-full h-84 object-cover hover:scale-110 duration-500 cursor-pointer rounded-xl shadow-md"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

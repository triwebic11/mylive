import React from "react";
import HomeSlider from "../components/Slider";
import OurProducts from "../components/OurProducts";
import ListOfDistributors from "../components/ListOfDistributors";
import Box from "../components/Box";
import Container from "../components/Container";
import { IoIosHome } from "react-icons/io";
import { TfiCup } from "react-icons/tfi";
import { BiDonateHeart } from "react-icons/bi";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="py-16">
      <HomeSlider />
      <ListOfDistributors></ListOfDistributors>
      <Container>
        <div className="flex flex-col max-w-[1450px] mx-auto md:flex-row justify-between items-center gap-5 py-10">
          <Box
            icon={<TfiCup />}
            title="Awards"
            pragraph="Accolades from around the "
            bg="bg-orange-700"
          />
          <Box
            icon={<IoIosHome />}
            title="About SHS Lira"
            pragraph="A brief history of SHS Lira"
            bg="bg-blue-700"
          />
          <Box
            icon={<BiDonateHeart />} 
            title="CSR"
            pragraph="SHS Lira's contribution to the society"
            bg="bg-green-700"
          />
        </div>
        <div className="w-full flex justify-center items-center py-10">
          <video
            src="https://res.cloudinary.com/dlmbqhvnm/video/upload/v1751724178/WhatsApp_Video_2025-07-05_at_4.50.56_AM_titwwy.mp4"
            controls
            className="w-full"
          ></video>
        </div>
      </Container>
      <OurProducts></OurProducts>
    </div>
  );
};

export default Home;

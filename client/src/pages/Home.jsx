import React from "react";
import HomeSlider from "../components/Slider";
import ListOfDistributors from "../components/ListOfDistributors";
import Box from "../components/Box";
import Container from "../components/Container";
import { IoIosHome } from "react-icons/io";
import { TfiCup } from "react-icons/tfi";
import { BiDonateHeart } from "react-icons/bi";

const Home = () => {
  return (
    <div>
      <HomeSlider />
      <ListOfDistributors />
      <Container>
        <div className="flex flex-col md:flex-row justify-center items-center gap-5 py-10">
          <Box
            icon={<IoIosHome />}
            title="About Liveon"
            pragraph="A brief history of Liveon"
            bg="bg-blue-700"
          />
          <Box
            icon={<TfiCup />}
            title="Awards"
            pragraph="Accolades from around the "
            bg="bg-orange-700"
          />
          <Box
            icon={<BiDonateHeart />}
            title="CSR"
            pragraph="Liveon's contribution to the society"
            bg="bg-green-700"
          />
        </div>
      </Container>
    </div>
  );
};

export default Home;

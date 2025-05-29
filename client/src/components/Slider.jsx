import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { onion, toxin, halwa, helth } from "../assets";
const HomeSlider = () => {
  const settings = {
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div className="slider-container max-w-[1900px]">
      <Slider {...settings}>
        <div>
          <img src={onion} alt="Onion" className="w-full max-h-[70vh] " />
        </div>
        <div>
          <img src={toxin} alt="Toxin" className="w-full max-h-[70vh] " />
        </div>
        <div>
          <img src={halwa} alt="Halwa" className="w-full max-h-[70vh] " />
        </div>
        <div>
          <img src={helth} alt="Helth" className="w-full max-h-[70vh] " />
        </div>
      </Slider>
    </div>
  );
};

export default HomeSlider;

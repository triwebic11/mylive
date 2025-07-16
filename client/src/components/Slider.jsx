import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { detargent, soap, neamSoap, cleaner } from "../assets";
const HomeSlider = () => {
  const settings = {
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };
  return (
    <div className="slider-container max-w-[1900px] mx-auto">
      <Slider {...settings}>
        <div>
          <img src={detargent} alt="Detergent" className="w-full max-h-[70vh] " />
        </div>
        <div>
          <img src={soap} alt="Soap" className="w-full max-h-[70vh] " />
        </div>
        <div>
          <img src={neamSoap} alt="NeamSoap" className="w-full max-h-[70vh] " />
        </div>
        <div>
          <img src={cleaner} alt="cleaner" className="w-full max-h-[70vh] " />
        </div>
      </Slider>
    </div>
  );
};

export default HomeSlider;

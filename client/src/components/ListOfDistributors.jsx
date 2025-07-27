import React, { useState } from "react";

import Container from "./Container";
import { odoc } from "../assets";
import Button from "./Button";
import CountUp from "react-countup";
const ListOfDistributors = () => {
  const [number, setNumber] = useState(0);
  // console.log(number);
  return (
    <div>
      <Container className="-translate-y-10 hover:-translate-y-4 duration-500">
        <div className="relative">
          <img src={odoc} alt="List of distributors" className="w-full h-[450px] md:h-84" />
          <div className="absolute top-0 w-full h-full mt-8 ">
            <h1 className="text-center text-xl font-bold">
              List Of Distributors Contributing To ODOC Campaign
            </h1>
            <div className="flex flex-col md:flex-row justify-around items-center mt-6 text-center">
              <div className="w-full md:w-1/3  md:px-10">
                <h1 className="font-bold text-xl mb-6">
                  Total Number Of Contributors
                </h1>
                <CountUp
                  start={0}
                  end={4513}
                  duration={5}
                  onUpdate={(currentValue) => {
                    if (!isNaN(currentValue)) {
                      setNumber(Math.floor(currentValue));
                    }
                  }}
                  className="text-3xl bg-gray-700 text-white px-4 py-2 rounded-md "
                />{" "}
                <br />
                {/* <div className="flex gap-1">
                  {String(number)
                    .split("")
                    .map((digit, index) => (
                      <span
                        key={index}
                        className="bg-blue-200 px-2 py-1 rounded shadow-md mx-0.5"
                      >
                        {digit}
                      </span>
                    ))}
                </div> */}
                <Button />
              </div>
              <div className="w-full md:w-1/3  md:px-10">
                <h1 className="font-bold text-xl">
                  Worldwide Top 10 Contributors
                </h1>
                <Button />
              </div>
              <div className="w-full md:w-1/3 md:px-10">
                <h1 className="font-bold text-xl">
                  Contributors Contributed USD 100 and Above
                </h1>
                <Button />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ListOfDistributors;

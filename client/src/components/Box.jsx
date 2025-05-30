import React from "react";

const Box = ({ icon, title, pragraph, bg }) => {
  return (
    <div
      className={`flex flex-col justify-center items-center gap-3 text-white ${bg} px-8 py-6 md:hover:scale-110 duration-500 cursor-pointer w-full mx-4 h-[250px]`}
    >
      <span className="text-4xl">{icon}</span>
      <h1 className="text-3xl">{title}</h1>
      <p>{pragraph}</p>
    </div>
  );
};

export default Box;

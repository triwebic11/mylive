import React from "react";

const Box = ({ icon, title, pragraph }) => {
  return (
    <div className="flex flex-col gap-3 text-white">
      <span>{icon}</span>
      <h1>{title}</h1>
      <p>{pragraph}</p>
    </div>
  );
};

export default Box;

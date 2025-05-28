import React from "react";

const Button = ({ title }) => {
  return (
    <button className="text-white bg-orange-700 hover:bg-transparent px-3 py-2 duration-300 border border-orange-700 hover:text-red-800  cursor-pointer my-3">
      {title || "VIEW MORE"}
    </button>
  );
};

export default Button;

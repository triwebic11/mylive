import React from "react";

const FormInput = ({ label, type = "text", placeholder, register, name, validation, error }) => {
  return (
    <div>
      {label && (
        <label htmlFor={name} className="block text-base font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, validation)}
        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-400"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default FormInput;

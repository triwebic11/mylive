import React from "react";
import cn from "./cn";
const Container = ({ children, className }) => {
    return (
        <div className={cn("max-w-[1500px] mx-auto px-4", className)}>{children}</div>
    );
};

export default Container;
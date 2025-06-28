import React from 'react';

const DashboardHeadings = ({heading, smalltext}) => {
    return (
        <div>
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-3">{heading}</h1>
      <p className="text-gray-600 mb-1">
        {smalltext}
      </p>
        </div>
    );
};

export default DashboardHeadings;
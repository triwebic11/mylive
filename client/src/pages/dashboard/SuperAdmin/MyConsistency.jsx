import React from "react";
import useUserById from "../../../Hooks/useUserById";

const MyConsistency = () => {
  const [data] = useUserById();
  const last4MonthsPoints = (incoming) => {
    const result = {};
    const now = new Date();

    for (let i = 0; i < 4; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = month.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      const monthPoints = incoming
        .filter((entry) => {
          const date = new Date(entry.date);
          return (
            date.getMonth() === month.getMonth() &&
            date.getFullYear() === month.getFullYear()
          );
        })
        .reduce((sum, entry) => sum + (entry.pointReceived || 0), 0);

      result[monthKey] = monthPoints;
    }

    return result;
  };

  // Example usage
  const incomingEntries = data?.AllEntry.incoming;
  const pointsByMonth = last4MonthsPoints(incomingEntries);

  // console.log("my consistancy",pointsByMonth);

<<<<<<< HEAD
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      {/* <h1 className="text-lg font-semibold text-gray-800 mb-2 pl-8">My Consistency</h1> */}
      <h2 className="text-2xl font-bold text-black mb-6">My Consistency</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(pointsByMonth)?.map(([month, totalPoints], index) => (
          <div
            key={index}
            className="bg-white shadow-sm rounded-lg p-6 text-center border"
          >
            <p className="text-3xl font-medium text-gray-900">
              {totalPoints.toFixed(2)}
            </p>
            <p className="mt-2 text-gray-600">{month}</p>
          </div>
        ))}
      </div>
    </div>
  );
=======
    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6">
            {/* <h1 className="text-lg font-semibold text-gray-800 mb-2 pl-8">My Consistency</h1> */}
            <h2 className="text-2xl font-bold text-black mb-6">My Consistency</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(pointsByMonth)?.map(([month, totalPoints], index) => (
                    <div
                        key={index}
                        className="bg-white shadow-sm rounded-lg p-6 text-center border"
                    >
                        <p className="text-3xl font-medium text-gray-900">{totalPoints.toFixed(2)}</p>
                        <p className="mt-2 text-gray-600">{month}</p>
                    </div>
                ))}
            </div>
        </div>
    );
>>>>>>> b2eca6c2642bf81dc293d4162dfef964d1f965c6
};

export default MyConsistency;

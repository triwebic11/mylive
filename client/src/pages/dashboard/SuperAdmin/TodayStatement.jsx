import React from "react";
import useAgregate from "../../../Hooks/useAgregate";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useUserById from "../../../Hooks/useUserById";
import { useQuery } from "@tanstack/react-query";

const Row = ({ label, value }) => (
    <div className="flex items-center py-1 text-white">
        <span className="whitespace-nowrap text-sm md:text-base">{label}</span>
        <span className="flex-1 border-b border-dotted border-white opacity-40 mx-2"></span>
        <span className="whitespace-nowrap font-medium text-sm md:text-base">{value}</span>
    </div>
);

export default function TodayStatement() {
    const axiosPublic = useAxiosPublic()
    const [data] = useUserById()


   
  const {
    data: agregate,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["agregate", data?._id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/users/userStatements/${data?._id}`);
      return res.data;
    },
  });
//   console.log("agretateee", agregate?.summary);
    return (
        <section className="w-full flex justify-center pt-10 pb-16 px-4 md:px-0">
            <div className="w-full max-w-md">
                {/* Title */}
                <h2 className="text-center text-xl md:text-2xl font-semibold mb-4">
                    Today Statement
                </h2>

                {/* Card */}
                <div className="rounded bg-teal-700 shadow-lg p-6">
                    {
                        agregate?.summary?.map((item, idx)=>{
                           return <Row label={item?.title} value={item.value} />
                            
                        })
                    }
                    
                </div>
            </div>
        </section>
    );
}

import React from "react";

const Row = ({ label, value }) => (
    <div className="flex items-center py-1 text-white">
        <span className="whitespace-nowrap text-sm md:text-base">{label}</span>
        <span className="flex-1 border-b border-dotted border-white opacity-40 mx-2"></span>
        <span className="whitespace-nowrap font-medium text-sm md:text-base">{value}</span>
    </div>
);

export default function TodayStatement({
    data = {
        idActive: 0,
        generationCommission: 0,
        refCommission: 0,
        megaGenerationCommission: 0,
        repurchaseSponsorCommission: 0,
        repurchaseValidity: "8d 23h 35m 41s",
    },
}) {
    return (
        <section className="w-full flex justify-center pt-10 pb-16 px-4 md:px-0">
            <div className="w-full max-w-md">
                {/* Title */}
                <h2 className="text-center text-xl md:text-2xl font-semibold mb-4">
                    Today Statement
                </h2>

                {/* Card */}
                <div className="rounded bg-teal-700 shadow-lg p-6">
                    <Row label="ID Active" value={data.idActive} />
                    <Row
                        label="Generation Commission"
                        value={data.generationCommission.toFixed(2)}
                    />
                    <Row label="Ref Commission" value={data.refCommission.toFixed(2)} />
                    <Row
                        label="Mega Generation Commission"
                        value={data.megaGenerationCommission.toFixed(2)}
                    />
                    <Row
                        label="Repurchase Sponsor Commission"
                        value={data.repurchaseSponsorCommission.toFixed(2)}
                    />
                    <Row label="Repurchase Validity" value={data.repurchaseValidity} />
                </div>
            </div>
        </section>
    );
}

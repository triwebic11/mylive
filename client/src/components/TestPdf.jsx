import React, { useRef } from "react";

const TestPdf = () => {
  const pdfRef = useRef();

  const handleDownloadPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = pdfRef.current;

    const opt = {
      margin: 0.5,
      filename: `test.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="p-10">
      <div ref={pdfRef} className="bg-white p-10 text-black">
        <h1 className="text-2xl font-bold">Hello PDF</h1>
        <p>This is a test PDF content.</p>
      </div>

      <button
        onClick={handleDownloadPDF}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Download PDF
      </button>
    </div>
  );
};

export default TestPdf;

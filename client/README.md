import { useState, useEffect, useRef, useContext } from "react";
import { FaPrint } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../../assets/Logo/logo.png";
import useAuth from "../../Hooks/useAuth";
import { StateContext } from "../../Provider/StateProvider/StateProvider";
import Logo from "../logo/Logo";

const Invoice = ({ transaction }) => {
  const pdfRef = useRef()
  // console.log(transaction)
  // const { deliverydata } = useContext(StateContext)
  
  const [data, setData] = useState(transaction);
  useEffect(() => {
    
      setData(transaction);

  }, [transaction]);


  const preprocessStyles = () => {
    const elements = document.querySelectorAll("*");
    elements.forEach((el) => {
      const computedStyle = window.getComputedStyle(el);
      const propsToCheck = ["backgroundColor", "color", "borderColor", "boxShadow"];

      propsToCheck.forEach((prop) => {
        if (computedStyle[prop] && computedStyle[prop].includes("oklch")) {
          if (prop === "backgroundColor" || prop === "color") {
            el.style[prop] = prop === "backgroundColor" ? "#ffffff" : "#000000";
          } else {
            el.style[prop] = "transparent";
          }
        }
      });
    });
  }
  const downloadPdf = () => {
    preprocessStyles()
    const input = pdfRef.current;

    // Using html2canvas to convert HTML to canvas
    html2canvas(input, {
      scale: 2,  // Adjust the scale for higher resolution if needed
      useCORS: true, // Ensure CORS for cross-origin images
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size in mm

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Get the dimensions of the image
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Calculate the scaling ratio to fit the content within the A4 page size
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      // Calculate the X and Y position for centering the image on the PDF
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10; // Adjust the Y position (top margin)

      // Add the image to the PDF document
      pdf.addImage(
        imgData,
        'PNG',
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );

      // Save the PDF as 'invoice.pdf'
      pdf.save('invoice.pdf');
    });
  }

  return (
    <div className="max-w-4xl mx-auto  shadow-lg rounded-lg">
      <div ref={pdfRef} className="px-10">
        <div className="space-y-5">

          <div className="min-h-screen bg-red-50 dark:bg-gray-900 p-6">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
              <div className="flex justify-center items-center">

                <Logo></Logo>
              </div>
              <h2 className="text-xl font-semibold text-center mb-4">Order Confirmation Details</h2>
              <h2 className="text-xl font-semibold text-center mb-4">Payment Confirmation Details</h2>

              <div className="border-b pb-4 mb-4">
                <p><strong>Customer Name:</strong> {data?.cus_Name}</p>
                <p><strong>Email:</strong> {data?.cus_email}</p>
                <p><strong>Phone:</strong> {data?.number}</p>
                <p><strong>Order Date:</strong> {new Date(data?.date).toLocaleString()}</p>
                <p><strong>Order number:</strong> {data?.orderNumber}</p>
              </div>

              <div className="border-b pb-4 mb-4">

                <p><strong>Delivery Label:</strong> {data?.deliveryLabel}</p>
                <p><strong>Delivery Status:</strong> <span className="text-orange-500">{data?.deliveryStatus}</span></p>
                <p><strong>Delivery Location:</strong> <span className="text-orange-500">{${data?.location?.district}, ${data?.location?.city} , ${data?.location?.area}, ${data?.location?.localArea}}</span></p>
              </div>

              <div className="border-b pb-4 mb-4">
                <p><strong>Payment Status:</strong> <span className="text-red-500">{data?.paymentStatus}</span></p>
                <p><strong>Transaction ID:</strong> {data?.transecId || "N/A"}</p>
              </div>

              <div className="border-b pb-4 mb-4">
                <p><strong>Items Total Shipping Cost:</strong> ৳{data?.itemsTotalShippingCost}</p>
                <p><strong>Total Price:</strong> ৳{data?.totalPrice}</p>
              </div>

              <h3 className="text-lg font-semibold mt-4">Ordered Products</h3>
              <div className="grid grid-cols-1 gap-4 mt-2">
                {data?.products?.map((product, index) => (
                  <div key={index} className="border p-4 rounded-lg flex items-center space-x-4 bg-gray-50 dark:bg-gray-700">
                    <img src={product.productSelectedImage} alt={product.name} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
                      <p className="text-sm font-semibold text-orange-500">৳{product.price * product.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
        {/* <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">
            <img src={logo} alt="Company Logo" className="w-32" />
          </h2>
          <h3 className="text-xl font-semibold">Invoice</h3>
        </div>
        <div className="mt-4 flex justify-between text-sm text-gray-700">
          <p>
            <strong>Date:</strong> {invoiceDate}
          </p>
          <p>
            <strong>Invoice No:</strong> {invoiceNumber}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold">Invoiced To:</p>
            <p>{user?.displayName}</p>
            <p>{user?.email}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">Pay To:</p>
            <p>Kazi AgriTech</p>
            <p>Chittagong , Chittagong, Bangladesh</p>
            <p>01836-761707</p>
            <p>Kaziagritech007@gmail.com</p>
          </div>
        </div>

        <table className="w-full mt-6 border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Product Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Quantity</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Discount</th>
              <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {selectedOrders?.map((order, index) => (
              <tr key={index} className="border-b border-gray-300">
                <td className="px-4 py-2">{order.service}</td>
                <td className="px-4 py-2">{order.description}</td>
                <td className="px-4 py-2 text-center">${order.rate}</td>
                <td className="px-4 py-2 text-center">{order.qty}</td>
                <td className="px-4 py-2 text-right">${(order.rate * order.qty).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 text-right">
          <p>
            <strong>Sub Total:</strong>{" "}
            {selectedOrders
              .reduce((sum, item) => sum + item.rate * item.qty, 0)
              .toFixed(2)}
          </p>
          <p>
            <strong>Tax (10%):</strong>{" "}
            {(
              selectedOrders.reduce((sum, item) => sum + item.rate * item.qty, 0) *
              0.1
            ).toFixed(2)}
          </p>
          <p className="text-lg font-bold">
            <strong>Total:</strong>{" "}
            {(
              selectedOrders.reduce((sum, item) => sum + item.rate * item.qty, 0) *
              1.1
            ).toFixed(2)}
          </p>
        </div> */}
      </div>

      <button
        onClick={downloadPdf}
        className="mt-4 flex items-center m-auto justify-center bg-green-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
      >
        <FaPrint className="mr-2" /> Print & Download
      </button>
    </div>
  );
};

export default Invoice;
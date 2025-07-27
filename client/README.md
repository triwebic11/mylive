const express = require("express");
const router = express.Router();
const AdminOrder = require("../models/AdminOrder");
const User = require("../models/User");


async function buildTree(userId) {
  console.log("Building tree for user:", userId);
  const user = await User.findById(userId);
  if (!user) return null;

  console.log("Building tree for user:", user.name);

  // 🔍 Find users who have this user's referral code in either placementBy or referredBy
  const children = await User.find({
    $or: [
      { placementBy: user.referralCode },
      { referredBy: user.referralCode },
    ]
  });

  console.log("Children found:", children.length);

  // Recursively build tree for all children
  const childrenTrees = await Promise.all(
    children.map(child => buildTree(child._id))
  );

  return {
    name: user.name,
    _id: user._id,
    Position: user.Position,
    phone: user?.phone,
    referralCode: user.referralCode,
    referredBy: user.referredBy,
    placementBy: user.placementBy,
    left: childrenTrees[0] || null,
    right: childrenTrees[1] || null,
    // children: childrenTrees, // 🌲 full array of children
  };
}

const getReferralTreeById = async (req, res) => {
  try {
    const { userId } = req.params;
    const tree = await buildTree(userId);
    console.log("Referral Tree for:", userId);
    res.json(tree);
  } catch (err) {
    console.error("Tree build error:", err);
    res.status(500).json({ error: "Failed to fetch referral tree" });
  }
};

const distributeGrandPoint = async (buyerId, grandPoint, buyerphone, grandTotalPrice) => {
  // const buyer = await User.findById(buyerId);
  const buyer = await User.findOne({ phone: buyerphone });
  if (!buyer) return;

  console.log("Distributing grand points for buyer(je product kinlo):", buyer);

  const tenPercent = grandPoint * 0.10;
  const thirtyPercent = grandPoint * 0.30;
  const twentyPercent = grandPoint * 0.20;

  // 1. ✅ Buyer gets 10%
  // buyer.points = (buyer.points || 0) + tenPercent;
  // buyer.AllEntry = buyer.AllEntry || { incoming: [], outgoing: [] };
  // buyer.AllEntry.incoming.push({
  //   fromUser: buyer._id,
  //   pointReceived: tenPercent,
  //   sector: '10% personal reward from purchase',
  //   date: new Date()
  // });
  // await buyer.save();
  // 2. 🔁 Upline 30% generation share
  
  
  // 30% generation commission
  const maxLevel = 10; // or set dynamically from buyer if needed
  const pointPerLevel = thirtyPercent / maxLevel;
  console.log("Max level:", maxLevel, "Point per level:", pointPerLevel);

  //   let receiversCount = 0; // ei variable diye track korbo koyjon receive korlo

  // let current = buyer;
  // let level = 1;

  // while (level <= maxLevel) {
  //   const referrer = await User.findOne({ referralCode: current.referredBy });

  //   if (!referrer) break;

  //   console.log(`Level ${level} referrer:`, referrer.name || "None");

  //   if (referrer.GenerationLevel >= level) {
  //     receiversCount++; // ✅ jodi ei level e receive kore tahole count barabo

  //     referrer.points = (referrer.points || 0) + pointPerLevel;
  //     referrer.AllEntry = referrer.AllEntry || { incoming: [] };
  //     referrer.AllEntry.incoming.push({
  //       fromUser: buyerId,
  //       pointReceived: pointPerLevel,
  //       sector: `Level ${level} generation commission`,
  //       date: new Date()
  //     });

  //     await referrer.save();
  //   }

  //   current = referrer;
  //   level++;
  // }

  // // 🔍 Ekhon console e output dao
  // console.log(`Total ${receiversCount} referrers received generation commission from 30%`);




  // 3. 📞 20% to phone number referrer
  if (buyerphone) {
    const phoneReferrer = await User.findOne({ referralCode: buyer?.referredBy });
    console.log("Phone referrer found:", phoneReferrer ? phoneReferrer.name : "None");
    if (phoneReferrer) {
      phoneReferrer.points = (phoneReferrer.points || 0) + twentyPercent;
      phoneReferrer.AllEntry = phoneReferrer.AllEntry || { incoming: [] };
      phoneReferrer.AllEntry.incoming.push({
        fromUser: buyerId,
        pointReceived: twentyPercent,
        sector: '20% phone referrer commission',
        date: new Date()
      });
      await phoneReferrer.save();
    }
  }
  // 20% Advance Consistency
  // const isAdvanceConsistancy = grandTotalPrice >= 5000 || grandTotalPrice <= 10000;
  // if (isAdvanceConsistancy) {
  //   console.log("Advance Consistency condition met for buyer:", buyer.name);
  //   if (buyer) {
  //     buyer.points = (buyer.points || 0) + twentyPercent;
  //     buyer.AllEntry = buyer.AllEntry || { incoming: [], outgoing: [] };
  //     buyer.AllEntry.incoming.push({
  //       fromUser: buyer._id,
  //       pointReceived: twentyPercent,
  //       sector: '20% Advance Consistency commission',
  //       date: new Date()
  //     });
  //     await buyer.save();
  //   }
  // }

  // 10% repurchase bonus
  
  
  // 
  
  
  
  
  // Repurchaseer 10% bonus
  const alreadyReceivedPersonalReward = buyer.AllEntry.incoming.some(
    (entry) => entry.sector === "10% personal reward from purchase"
  );

  if (alreadyReceivedPersonalReward) {
    console.log("Already received personal reward.");
    buyer.points = (buyer.points || 0) + tenPercent;
    buyer.AllEntry = buyer.AllEntry || { incoming: [], outgoing: [] };
    buyer.AllEntry.incoming.push({
      fromUser: buyer._id,
      pointReceived: tenPercent,
      sector: '10% personal reward from purchase',
      date: new Date()
    });
    await buyer.save();
  } else {
    console.log("Eligible to receive personal reward.");
  }

  // 10% Commission for 4 months Consistency Purchase Product
// const checkContinuousPurchases = (incoming) => {
//   const now = new Date(); // আজকের তারিখ
//   const monthsToCheck = 4;
//   const purchaseMonths = new Set();

//   // Step 1: Filter and prepare month-year keys from incoming data
//   incoming.forEach((entry) => {
//     if (entry.sector === "10% personal reward from purchase") {
//       const entryDate = new Date(entry.date);
//       const year = entryDate.getFullYear();
//       const month = entryDate.getMonth(); // 0-based (Jan = 0)
//       const key = `${year}-${month}`;
//       purchaseMonths.add(key);
//     }
//   });

//   // Step 2: Check if each of the last 4 months is present in the set
//   const checkDate = new Date(now.getFullYear(), now.getMonth(), 1); // start of this month

//   for (let i = 1; i <= monthsToCheck; i++) {
//     checkDate.setMonth(checkDate.getMonth() - 1); // go to previous month
//     const year = checkDate.getFullYear();
//     const month = checkDate.getMonth();
//     const key = `${year}-${month}`;
//     if (!purchaseMonths.has(key)) {
//       return false; // missed at least one month
//     }
//   }

//   return true; // all 4 months are present
// };

// 🔍 ব্যবহারের উদাহরণ:
// const hasContinuousPurchases = checkContinuousPurchases(buyer.AllEntry.incoming);

// if (hasContinuousPurchases) {
//   console.log("✅ User has purchased continuously for the last 4 months.");
//   buyer.points = (buyer.points || 0) + tenPercent;
//     buyer.AllEntry = buyer.AllEntry || { incoming: [], outgoing: [] };
//     buyer.AllEntry.incoming.push({
//       fromUser: buyer._id,
//       pointReceived: tenPercent,
//       sector: '10% bonus for 4 months Consistancy from purchase',
//       date: new Date()
//     });
//     await buyer.save();
// } else {
//   console.log("❌ User missed at least one of the last 4 months.");
// }




};




// 👉 POST: Admin creates an order
// server/routes/adminOrders.js
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      dspPhone,
      products,
      grandTotal,
      grandPoint,
      grandDiscount,
    } = req.body;

    const newOrder = new AdminOrder({
      userId,
      dspPhone,
      products,
      grandTotal,
      grandPoint,
      grandDiscount,
      date: new Date().toISOString(),
    });

    const savedOrder = await newOrder.save();
    await distributeGrandPoint(userId, grandPoint, dspPhone, grandTotal);
    console.log("userId:", savedOrder, "grandPoint:", grandPoint, "Phone:", dspPhone);
    // console.log("Order created:", savedOrder._id);

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ message: "Failed to create order", error });
  }
});

// ✅ GET: Fetch by DSP phone
router.get("/by-phone/:phone", async (req, res) => {
  try {
    const orders = await AdminOrder.find({ dspPhone: req.params.phone });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err });
  }
});

// ✅ GET: Fetch by userId
router.get("/by-user/:userId", async (req, res) => {
  try {
    const orders = await AdminOrder.find({ userId: req.params.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await AdminOrder.find(); // ✅ সব order fetch করবে
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err });
  }
});

module.exports = router;




































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
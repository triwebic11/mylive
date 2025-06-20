const { ObjectId } = require("mongodb");
const nodemailer = require("nodemailer");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; 



const CashOnDeliveryModel = require("../models/CashOnDeliveryModel");

const generateUniqueOrderNumberforcashondelivery = async () => {
  let orderNumber;
  let isUnique = false;

  while (!isUnique) {
    orderNumber = Math.floor(10000000000 + Math.random() * 90000000000); // Generate 11-digit number
    const existingCashOnDelivery = await CashOnDeliveryModel.findOne({ orderNumber });
    // const existingPayment = await paymentsCollections.findOne({ orderNumber });

    if (!existingCashOnDelivery) {
      isUnique = true;
    }
  }
  return orderNumber;
};


// post cashondelivery
const CashonDeliverypost = async (req, res) => {
  try {
    const order = req.body;
    const orderNumber = await generateUniqueOrderNumberforcashondelivery();
    order.orderNumber = orderNumber;

    const result = await CashOnDeliveryModel.insertOne(order);

    // Send Email
    // const mailOptions = {
    //   from: process.env.EMAIL_USER,
    //   to: order?.email,
    //   subject: 'Order Confirmation from SHS Lira Enterprise LTD',
    //   html: `
    //     <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f7f7f7;">
    //     <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
    //       <div style="background-color: #4CAF50; color: #ffffff; padding: 10px 0; text-align: center; border-radius: 8px 8px 0 0;">
    //         <h1 style="margin: 0;">Order Confirmation</h1>
    //       </div>
    //       <div style="text-align: center; margin: auto; width: 100%; padding: 20px;">
    //         <div>
    //           <img src="https://i.ibb.co.com/TqgPrsDc/logo.png" alt="logo" style="width: 100px; height: auto; margin: 0 auto; display: block;" />
    //         </div>
    //       </div>
    //       <div style="padding: 20px; line-height: 1.6;">
    //         <h2 style="color: #333; margin-bottom: 10px;">Hello, ${order?.cus_Name}!</h2>
    //         <p style="color: #555; font-size: 16px;">Thank you for shopping with us. Your order has been successfully placed!</p>
    //         <p style="color: #555;">Location: ${order?.location?.district} - ${order?.location?.city} - ${order?.location?.area} - ${order?.location?.localArea}</p>
    //         <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin-top: 20px;">
    //           <h3 style="color: #333;">Order Details</h3>
    //           <table style="width: 100%; border-collapse: collapse;">
    //             <tr>
    //               <th style="padding: 10px; border: 1px solid #ddd; text-align: left; background-color: #4CAF50; color: #ffffff;">Product</th>
    //               <th style="padding: 10px; border: 1px solid #ddd; text-align: left; background-color: #4CAF50; color: #ffffff;">Quantity</th>
    //               <th style="padding: 10px; border: 1px solid #ddd; text-align: left; background-color: #4CAF50; color: #ffffff;">Price</th>
    //             </tr>
    //             ${order?.products?.map(item => `
    //               <tr>
    //                 <td style="padding: 10px; border: 1px solid #ddd;">${item?.name}</td>
    //                 <td style="padding: 10px; border: 1px solid #ddd;">${item?.quantity}</td>
    //                 <td style="padding: 10px; border: 1px solid #ddd;">$${item?.price}</td>
    //               </tr>
    //             `).join("")}
    //           </table>
    //         </div>
    //         <p style="color: #555; font-size: 16px;">We are processing your order and will notify you when it ships. If you have any questions, feel free to <a href="mailto:kaziagri5@gmail.com" style="color: #4CAF50;">contact us</a>.</p>
    //         <a href="https://kaziagritech.com" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: #ffffff; text-decoration: none; border-radius: 5px; margin-top: 20px;">Visit Our Store</a>
    //       </div>
    //       <div style="text-align: center; padding: 10px 0; background-color: #f1f1f1; border-radius: 0 0 8px 8px; color: #777; font-size: 14px;">
    //         <p>If you did not make this order, please <a href="mailto:kaziagri5@gmail.com" style="color: #4CAF50;">contact us</a> immediately.</p>
    //         <p>Best regards,<br><strong>Your Kazi AgriTech Team</strong></p>
    //       </div>
    //     </div>
    //     </body>
    //   `
    // };

    // await transporter.sendMail(mailOptions);

    // Clear user's cart
    // await cartsCollections.deleteMany({ CustomerEmail: order.cus_email });

    // Send final response
    res.status(201).json(result);
  } catch (err) {
    console.error("CashOnDelivery error:", err);
    res.status(500).json({ message: "Failed to place order", error: err.message });
  }
};



const getCashonDelivery = async (req, res) => {
  try {
    const orders = await CashOnDeliveryModel.find();
    res.status(200).json(orders);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};
const updatecashondelivery = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    const result = await CashOnDeliveryModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, upsert: true } // return updated doc
    );

    res.status(200).json(result);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update order", error: err.message });
  }
};


module.exports = { getCashonDelivery, CashonDeliverypost, updatecashondelivery };

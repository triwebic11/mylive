const CashOnDeliveryModel = require("../models/CashOnDeliveryModel"); 

// post cashondelivery
const CashonDeliverypost = async (req, res) => {
  try {
       const NewOrder = req.body;
      const result = await CashOnDeliveryModel.insertOne(NewOrder)
      res.send(result)
   
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
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


module.exports = {  getCashonDelivery, CashonDeliverypost };

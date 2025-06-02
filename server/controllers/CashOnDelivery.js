const { ObjectId } = require("mongodb");


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


module.exports = {  getCashonDelivery, CashonDeliverypost , updatecashondelivery};

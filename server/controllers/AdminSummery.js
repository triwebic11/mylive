

exports.AdminSummery = async (req, res) => {
  try {
    
    res.status(201).json({ message: "Bank info created", data: newInfo });
  } catch (err) {
    res.status(500).json({ message: "Failed to create bank info", error: err });
  }
};


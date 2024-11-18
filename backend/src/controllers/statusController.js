const Request = require('../models/requestModel');

const getStatus = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await Request.findOne({ requestId });

    if (!request) return res.status(404).json({ error: 'Request not found.' });

    res.status(200).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { getStatus };

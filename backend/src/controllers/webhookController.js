const Request = require('../models/requestModel');

const handleWebhook = async (req, res) => {
  try {
    const { requestId, outputData } = req.body;

    const request = await Request.findOne({ requestId });

    if (!request) return res.status(404).json({ error: 'Request not found.' });

    request.products.forEach((product, index) => {
      product.outputImageUrls = outputData[index].outputImageUrls;
    });

    request.status = 'Completed';
    await request.save();

    res.status(200).json({ message: 'Webhook processed successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { handleWebhook };

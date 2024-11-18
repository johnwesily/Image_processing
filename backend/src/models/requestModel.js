const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  serialNumber: String,
  productName: String,
  inputImageUrls: [String],
  outputImageUrls: [String],
});

const requestSchema = new mongoose.Schema({
  requestId: String,
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Incomplete','failed'], default: 'Pending' },
  products: [productSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Request', requestSchema);

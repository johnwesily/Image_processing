const multer = require('multer');
const csvParser = require('../utils/csvParser');
const Request = require('../models/requestModel');
const { v4: uuidv4 } = require('uuid');

const upload = multer({ dest: 'uploads/' });
const imageQueue = require('../workers/imageWorker');

const uploadFile = async (req, res) => {
    try {
      const { file } = req;
      if (!file) return res.status(400).json({ error: 'CSV file is required.' });
  
      const data = await csvParser(file.path);
  
      const requestId = uuidv4();
      const request = new Request({
        requestId,
        products: data.map((item) => ({
          serialNumber: item['Serial Number'],
          productName: item['Product Name'],
          inputImageUrls: item['Input Image Urls'], // Already parsed as an array
        })),
      });
  
      console.log('Request Object to be Saved:', request); // Log data
  
      await request.save(); // Perform insertion

      imageQueue.add({
        requestId
      });
  
      res.status(200).json({ requestId });
    } catch (error) {
      console.error('Error in uploadFile:', error);
      res.status(500).json({ error: 'Server error.' });
    }
  };
  

module.exports = { upload, uploadFile };

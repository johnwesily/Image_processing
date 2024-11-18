// 

const fs = require('fs');
const path = require('path');
const Queue = require('bull');
const axios = require('axios');
const sharp = require('sharp');
const Request = require('../models/requestModel');

// Create a queue for image processing
const imageQueue = new Queue('imageQueue', {
  redis: { port: 6379, host: '127.0.0.1' },
});

// Ensure the `compressed` directory exists
const compressedDir = path.join(__dirname, '../../compressed');
if (!fs.existsSync(compressedDir)) {
  fs.mkdirSync(compressedDir, { recursive: true }); // Create directory if it doesn't exist
}

// Worker to process image jobs
imageQueue.process(async (job) => {
  const { requestId } = job.data;

  try {
    // Retrieve the request by requestId
    const request = await Request.findOne({ requestId });
    if (!request) {
      console.error(`Request with ID ${requestId} not found`);
      return;
    }

    console.log(`Processing started for Request ID: ${requestId}`);

    // Update status to "In Progress"
    request.status = 'In Progress';
    await request.save();

    let processingFailed = false;

    // Process each product
    for (const product of request.products) {
      const { inputImageUrls, serialNumber, productName } = product;
      const outputImageUrls = [];

      for (const url of inputImageUrls) {
        if (!url) {
          outputImageUrls.push(null); // Maintain the same order for invalid URLs
          continue;
        }

        try {
          // Enforce .jpeg extension for compressed images
          const imageName = `${serialNumber}-${path.basename(url, path.extname(url))}.jpeg`;
          const compressedPath = path.join(compressedDir, imageName);

          // Download the image
          const response = await axios({ url, responseType: 'stream' });

          // Compress the image and ensure output as JPEG
          await new Promise((resolve, reject) => {
            response.data
              .pipe(sharp().jpeg({ quality: 50 })) // Convert to JPEG with compression
              .toFile(compressedPath, (err) => (err ? reject(err) : resolve()));
          });

          // Simulate uploading the compressed image
          const outputUrl = `${process.env.BASE_URL || 'https://example.com'}/${path.basename(
            compressedPath
          )}`;
          outputImageUrls.push(outputUrl);

          console.log(`Processed image for ${productName} (${serialNumber}): ${url}`);
        } catch (error) {
          console.error(`Failed to process image ${url}:`, error.message);
          outputImageUrls.push(null); // Maintain order even if an error occurs
          processingFailed = true; // Mark as failed if any URL fails
        }
      }

      // Update the product's outputImageUrls
      product.outputImageUrls = outputImageUrls;
    }

    // Update status based on processing outcome
    request.status = processingFailed ? 'Incomplete' : 'Completed';
    await request.save();

    console.log(
      `Processing ${processingFailed ? 'incomplete' : 'completed'} for Request ID: ${requestId}`
    );
  } catch (error) {
    console.error(`Error processing job for Request ID: ${requestId}`, error);

    // Set status to "Incomplete" if the entire job fails
    await Request.findOneAndUpdate(
      { requestId },
      { $set: { status: 'Incomplete' } }
    );
  }
});

// Log job failures
imageQueue.on('failed', async (job, err) => {
  console.error(`Job failed for Request ID: ${job.data.requestId}`, err);
  try {
    await Request.findOneAndUpdate(
      { requestId: job.data.requestId },
      { $set: { status: 'Failed' } }
    );
  } catch (updateError) {
    console.error(`Failed to update status for Request ID: ${job.data.requestId}`, updateError);
  }
});

// Retry configuration
imageQueue.on('error', (error) => {
  console.error('Queue error:', error);
});

console.log('Image worker is running...');
module.exports = imageQueue;

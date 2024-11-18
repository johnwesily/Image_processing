const fs = require('fs');
const csv = require('csv-parser');

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Split multiple image URLs into an array
        if (data['Input Image Urls']) {
            data['Input Image Urls'] = data['Input Image Urls'].split('\n').map((url) => url.trim());
          }
        results.push(data);
      })
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};

module.exports = parseCSV;

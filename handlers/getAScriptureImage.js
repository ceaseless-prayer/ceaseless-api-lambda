'use strict';

const AWS = require('aws-sdk'),
  _ = require('lodash'),
  s3 = new AWS.S3(),
  IMAGE_BUCKET = process.env.IMAGE_BUCKET,
  CDN_PREFIX = process.env.CDN_PREFIX;

let scriptureImages = [];
let imageListRefreshDate = 0;

function refreshImageList() {
  return new Promise(function(resolve, reject) {
    s3.listObjectsV2({ Bucket: IMAGE_BUCKET }, function(err, data) {
      if (err) {
        reject(err);
      } else {
        console.log('Refreshing image list', imageListRefreshDate);
        let si = _.map(data.Contents, 'Key');
        imageListRefreshDate = Date.now();
        resolve(si);
      }
    });
  });
}

function getAScriptureImage(event, context, callback) {
  let pick = function(si) {
    if (!si || si.length === 0) {
      si = scriptureImages;
    } else {
      scriptureImages = si;
    }

    if (si.length === 0) {
      console.log('No scriptureImages available...');
      return callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          response: 'No images available'
        })
      });
    }

    let selected = si[_.random(si.length - 1)];
    let selectedImageUrl = CDN_PREFIX + selected;
    let response = {
      statusCode: 200,
      body: JSON.stringify({
        imageUrl: selectedImageUrl
      })
    };
    callback(null, response);
  };

  let onerror = function() {
    let response = {
      statusCode: 500,
      body: JSON.stringify({ response: 'Failed to get images' })
    };
    callback(null, response);
  };

  console.log('Checking refresh:', Date.now(), imageListRefreshDate);
  // refresh the list once an hour.
  if (Date.now() - imageListRefreshDate > 1000 * 60 * 60) {
    refreshImageList()
      .then(pick)
      .catch(onerror);
  } else {
    pick();
  }
}

module.exports = getAScriptureImage;

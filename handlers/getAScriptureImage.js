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
        imageListRefreshDate = Date.now();
        scriptureImages = _.map(data.Content, 'Key');
        resolve(scriptureImages);
      }
    });
  });
}

function getAScriptureImage(event, context, callback) {
  let pick = function() {
    let selected = scriptureImages[_.random(scriptureImages.length - 1)];
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

  if (Date.now() - imageListRefreshDate > 10000) {
    refreshImageList()
      .then(pick)
      .catch(onerror);
  } else {
    pick();
  }
}

module.exports = getAScriptureImage;

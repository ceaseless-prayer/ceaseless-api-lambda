"use strict";

var _ = require('lodash')
, votd = require('./data/votd.js')
, ntBooks = require('./data/ntBooks.js')
, languageVolumeMap = require('./data/languageVolumeMap.js')

exports.handler = function(event, context, callback) {
  console.log('Beginning Execution');
  console.log('==================================');
  console.log('event', event);
  console.log('==================================');

  // simple request handler for different APIs
  let handlers = {
    "/votd": getVerseOfTheDay,
    "/getScripture": getScripture,
    "/getAScriptureImage": getAScriptureImage,

  };
  let resource = event["resource"];
  if (resource in handlers) {
    return handlers[resource](event, context, callback);
  }

  const response = {
    statusCode: 405,
    headers: {
      "Access-Control-Allow-Origin" : "*",
      "Access-Control-Allow-Credentials" : true
    },
    body: JSON.stringify({
      message: `Invalid HTTP Resource: ${resource}`
    }),
  };

  callback(null, response);
}

var getVerseOfTheDay = function(event, context, callback) {

  // default verse
  var reference = {
    book: "John",
    chapter: "12",
    verse_start: "27",
    verse_end: "28"
  };
  let language = event["queryStringParameters"]["language"];
  if (language == 'hi_IN') {
    do {
      reference = votd[_.random(votd.length-1)];
    } while (ntBooks.indexOf(reference.book) <= -1);
  } else {
    reference = votd[_.random(votd.length-1)];
  }

  var response = {
    statusCode: 200,
    body: JSON.stringify(reference)
  };

  callback(null, response);
};

var getScripture = function(event, context, callback) {
  var response = {
    statusCode: 500,
    body: JSON.stringify({response:"Unsupported Operation"})
  };
  callback(null, response);
};

var getAScriptureImage = function(event, context, callback) {
  var response = {
    statusCode: 500,
    body: JSON.stringify({response:"Unsupported Operation"})
  };
  callback(null, response);
};

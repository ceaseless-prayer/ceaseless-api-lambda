'use strict';

const _ = require('lodash'),
  handlers = require('./handlers');

exports.handler = function(event, context, callback) {
  console.log('Beginning Execution');
  console.log('==================================');
  console.log('event', event);
  console.log('==================================');

  // simple request handler for different APIs
  let resource = event['resource'];
  if (resource in handlers) {
    return handlers[resource](event, context, callback);
  }

  const response = {
    statusCode: 405,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      message: `Invalid HTTP Resource: ${resource}`
    })
  };

  callback(null, response);
};

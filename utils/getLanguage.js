'use strict';

const _ = require('lodash');

function getLanguage(event) {
  // first check the query string params:
  let qsp = event['queryStringParameters'] || '';
  let language = qsp['language'];

  // if nothing there, then check the body
  if (_.isEmpty(language)) {
    let body = event['body'] || '';
    language = body['language'];
  }

  // last resort use default
  if (_.isEmpty(language)) {
    language = 'en';
  }

  return language;
}

module.exports = getLanguage;

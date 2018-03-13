'use strict';

const votd = require('../bible/votd'),
  _ = require('lodash'),
  dbpUtils = require('../bible/dbpUtils'),
  request = require('request'),
  dbpApiKey = process.env.DBP_API_KEY;

function getScripture(event, context, callback) {
  // if empty body, just pick a random verse
  let reference = JSON.parse(event['body']);
  if (_.isEmpty(event['body'])) {
    reference = votd[_.random(votd.length - 1)] || {};
  }
  console.log('reference: ', reference);
  let language = reference.language || 'en';
  let version = reference.version;
  let dam_id = dbpUtils.getVolume(reference.book, language, version);
  let dbpUrl =
    'http://dbt.io/text/verse?v=2&key=' +
    dbpApiKey +
    '&book_id=' +
    reference.book +
    '&chapter_id=' +
    reference.chapter +
    '&verse_start=' +
    reference.verse_start +
    '&verse_end=' +
    reference.verse_end +
    '&dam_id=' +
    dam_id;
  console.log('Getting verse from ' + dbpUrl);

  request.get({ url: dbpUrl, json: true }, function(e, r, verses) {
    if (e) {
      callback(null, { statusCode: r.statusCode, body: e });
    } else {
      callback(null, dbpUtils.formatDBPScripture(verses, language, version));
    }
  });
}

module.exports = getScripture;

"use strict";

var _ = require('lodash')
, request = require('request')
, votd = require('./data/votd.js')
, ntBooks = require('./data/ntBooks.js')
, languageVolumeMap = require('./data/languageVolumeMap.js')
, dbpApiKey = process.env.DBP_API_KEY;

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

var getLanguage = function(event, context){
  // first check the query string params:
  let language = event["queryStringParameters"]["language"];
  // if nothing there, then check the body
  if (_.isEmpty(language)) {
    language = event["body"]["language"];
  }
  // last resort use default
  if (_.isEmpty(language)) {
    language = "en";
  }
  return language;
};

var getScripture = function(event, context, callback) {
  // if empty body, just pick a random verse
  var reference = JSON.parse(event["body"]);
  if (_.isEmpty(event["body"])) {
    reference = votd[_.random(votd.length-1)];
  }
  console.log("reference: ", reference);
  var language = reference.language || 'en';
  var version = reference.version;
  var dam_id = getVolume(reference.book, language, version);
  var dbpUrl = 'http://dbt.io/text/verse?v=2&key=' +
    dbpApiKey +
    '&book_id=' + reference.book +
    '&chapter_id=' + reference.chapter +
    '&verse_start=' + reference.verse_start +
    '&verse_end=' + reference.verse_end +
    '&dam_id=' + dam_id;
  console.log('Getting verse from ' + dbpUrl);

  request.get({url:dbpUrl, json: true}, function (e, r, verses) {
    if (e) {
      res.send(r.statusCode, e);
      callback(null, {statusCode: r.statusCode, body: e });
    } else {
      callback(null, formatDBPScripture(verses, language, version));
    }
  });
};

var formatDBPScripture = function (verses, language, version) {
  if (_.isEmpty(verses)) {
    console.error('Failed to get verses.');
    return {
      text: 'Pray without ceasing.',
      citation: '1 Thessalonians 5:17',
      bible: 'ENGESV'
    };
  } else {
    var citation = verses[0].book_name + ' ' +
      verses[0].chapter_id + ':' + verses[0].verse_id;

    if (_.size(verses) > 1) {
      citation += '-' + _.last(verses).verse_id;
    }
    citation += ' ' + getVolumeCode(language, version);

    var details = getDetailsByLanguage(language, version);
    return {
      statusCode: 200,
      body: JSON.stringify({
        text: _.map(verses, 'verse_text')
          .map(function (v) { return v.trim(); }).join(' '),
        citation: citation,
        bible: details.bible || 'ENGESV'
      })
    };
  }
};

var getDetailsByLanguage = function(language, version) {
  return languageVolumeMap[language + "-" + version]
    || languageVolumeMap[language]
    || languageVolumeMap['default'];
}

var getVolume = function (book, language, version) {
  var details = getDetailsByLanguage(language, version);
  return ntBooks.indexOf(book) > -1 ? details.nt : details.ot;
};

var getVolumeCode = function (language, version) {
  var details = getDetailsByLanguage(language, version);
  return details.code;
};

var getAScriptureImage = function(event, context, callback) {
  var response = {
    statusCode: 500,
    body: JSON.stringify({response:"Unsupported Operation"})
  };
  callback(null, response);
};

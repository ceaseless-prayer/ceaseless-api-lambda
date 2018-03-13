'use strict';

const _ = require('lodash'),
  votd = require('../bible/votd'),
  ntBooks = require('../bible/ntBooks'),
  getLanguage = require('../utils/getLanguage');

function getVerseOfTheDay(event, context, callback) {
  // default verse
  let reference = {
    book: 'John',
    chapter: '12',
    verse_start: '27',
    verse_end: '28'
  };
  let language = getLanguage(event);
  if (language === 'hi_IN') {
    do {
      reference = votd[_.random(votd.length - 1)];
    } while (ntBooks.indexOf(reference.book) <= -1);
  } else {
    reference = votd[_.random(votd.length - 1)];
  }

  let response = {
    statusCode: 200,
    body: JSON.stringify(reference)
  };

  callback(null, response);
}

module.exports = getVerseOfTheDay;

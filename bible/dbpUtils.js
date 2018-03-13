'use strict';

const languageVolumeMap = require('./languageVolumeMap'),
  _ = require('lodash'),
  ntBooks = require('./ntBooks');

function getDetailsByLanguage(language, version) {
  return (
    languageVolumeMap[language + '-' + version] ||
    languageVolumeMap[language] ||
    languageVolumeMap['default']
  );
}

function getVolume(book, language, version) {
  let details = getDetailsByLanguage(language, version);
  return ntBooks.indexOf(book) > -1 ? details.nt : details.ot;
}

function getVolumeCode(language, version) {
  let details = getDetailsByLanguage(language, version);
  return details.code;
}

function formatDBPScripture(verses, language, version) {
  if (_.isEmpty(verses)) {
    console.error('Failed to get verses.');
    return {
      text: 'Pray without ceasing.',
      citation: '1 Thessalonians 5:17',
      bible: 'ENGESV'
    };
  } else {
    let citation =
      verses[0].book_name +
      ' ' +
      verses[0].chapter_id +
      ':' +
      verses[0].verse_id;

    if (_.size(verses) > 1) {
      citation += '-' + _.last(verses).verse_id;
    }
    citation += ' ' + getVolumeCode(language, version);

    let details = getDetailsByLanguage(language, version);
    return {
      statusCode: 200,
      body: JSON.stringify({
        text: _.map(verses, 'verse_text')
          .map(function(v) {
            return v.trim();
          })
          .join(' '),
        citation: citation,
        bible: details.bible || 'ENGESV'
      })
    };
  }
}

let utils = {
  getDetailsByLanguage,
  getVolume,
  getVolumeCode,
  formatDBPScripture
};

module.exports = utils;

const getVerseOfTheDay = require('./getVerseOfTheDay'),
  getScripture = require('./getScripture'),
  getAScriptureImage = require('./getAScriptureImage');

const handlers = {
  '/votd': getVerseOfTheDay,
  '/getScripture': getScripture,
  '/getAScriptureImage': getAScriptureImage
};

module.exports = handlers;

// For development/testing purposes
exports.handler = function(event, context, callback) {
  console.log('Running index.handler');
  console.log('==================================');
  console.log('event', event);
  console.log('==================================');
  console.log('Stopping index.handler');

  // hardcoded response for now
  var responseBody = {
    book: "John",
    chapter: "12",
    verse_start: "27",
    verse_end: "28"
  };

  var response = {
    statusCode: "200",
    body: JSON.stringify(responseBody)
  };

  callback(null, response);
  // or
  // callback( 'some error type' );
};

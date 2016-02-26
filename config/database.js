(function() {
  'Use strict';

  module.exports = {
    'url': process.env.DATABASE_URL || 'mongodb://localhost/restApi'
  };
})();

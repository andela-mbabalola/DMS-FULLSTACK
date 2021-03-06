(function() {
  'Use strict';

  var documents = require('./../models/document.models.js'),
    config = require('./../../config/adminConfig.js');

  /**
   * [function description]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @param  {Function} next [pass control to the next handler]
   * @return {[json]}        [message that permission has been denied]
   */

  exports.userAccess = function(req, res, next) {
    console.log(req.params.id);
    documents.findOne(req.params.id, function(err, doc) {
      console.log(doc, 'here');
      if (err) {
        res.send(err);
      } else if (!doc) {
        res.status(404).json({
          message: 'Docs not found'
        });
      } else {
        if (req.decoded._doc._id !== doc.ownerId.toString() &&
          req.decoded._doc.role !== config.role &&
          req.decoded._doc.role !== doc.role.toString()) {
          res.status(403).json({
            message: 'Access denied'
          });
        } else {
          next();
        }
      }
    });
  };
})();

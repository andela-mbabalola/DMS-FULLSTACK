(function() {
  'Use strict';

  var bcrypt = require('bcrypt');

  /**
   * [function to encrypt a password and compare with another]
   * @param  {[String]} password       [password to be compared with]
   * @param  {[String]} hashedPassword [encrypted password to be decrypted]
   * @return {[boolean]}                [if passwords are the same or not]
   */
  exports.comparePassword = function(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  };

  /**
   * [function to strip part of the information retieved]
   * @param  {[object]} user [user's data fetched from the db]
   * @return {[object]}      [user's data]
   */
   exports.stripUser = function(user) {
    user.password = null;
    user.token = null;
    user.facebook_auth_id = null;
    user.facebook_auth_token = null;
    user.google_auth_id = null;
    user.google_auth_token = null;
    return user;
  };


})();

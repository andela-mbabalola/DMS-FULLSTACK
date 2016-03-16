(function() {
  'Use strict';

  var User = require('./../models/user.models.js'),
    Role = require('./../models/role.models.js'),
    config = require('./../../config/config'),
    jwt = require('jsonwebtoken'),
    helpers = require('./../helpers/helper'),
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

  /**
   * [function to retain an authenticated user's session]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[object]}     [user's details and token]
   */
  exports.session = function(req, res) {
    var token = req.headers['x-access-token'] || req.body.token;
    if (token && token !== 'null') {
      jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
          res.status(403).json({
            error: 'Session has expired or does not exist.'
          });
        } else {
          User.findOne({
            _id: decoded._doc._id
          }, function(err, user) {
            if (err) {
              res.status(500).json({
                message: 'Error retrieving user',
                err: err
              });
            } else if (!user) {
              res.status(404).json({
                message: 'User not found'
              });
            } else {
              delete user.password;
              req.decoded = user;
              res.json(helpers.stripUser(user));
            }
          });
        }
      });
    } else {
      res.status(401).json({
        error: 'Session has expired or does not exist.'
      });
    }
  };


  /**
   * [function to login a valid user]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[json]}     [success message that user has been logged in]
   */
  exports.login = function(req, res) {
     var token;
    //checking if the user exists
    User.findOne({
      $or: [{
        email: req.body.email
      }, {
        facebook_id: req.body.facebook_id || 'eiaowfeaoiwfeoiawefio',
      }, {
        google_id: req.body.google_id || 'awhfoeahifeoaw'
      }]
    }, function(err, user) {
      if (err) {
        res.send(err);
      } else {
        //if user is not found
        if (!user) {
          res.status(404).json({
            message: 'Authentication failed. User not found'
          });
        } else if (user) {
          if(req.body.email && !(req.body.facebook_id || req.body.google_id)){
              //check if password matches
              if (helpers.comparePassword(req.body.password, user.password)) {
                //if user was found and password matches
                //create a token
                 token = jwt.sign(user, config.secret, {
                  expiresInMinutes: 1440
                });

                res.status(200).json({
                  message: 'Successfully logged in',
                  token: token,
                  user: user
                });
              } else {
                res.status(404).json({
                  message: 'Authentication failed. Wrong password'
                });
              }}
          else if (user.facebook_id === req.body.facebook_id ||
            user.google_id === req.body.google_id) {
             token = jwt.sign(user, config.secret, {
              expiresInMinutes: 1440
            });
            res.status(200).json({
              login: 'successful',
              token: token,
              user: user
            });
          }
          }
        }
    });
  };

  /**
   * [function to create a new user]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[json]}     [success message that user has been created]
   */
  exports.createUser = function(req, res) {
    //check if role exists
    Role.findOne({
      _id: req.body.role,
    }, function(err, role) {
      if (err) {
        res.send(err);
      }
      //if role does not exist
      if (!role) {
        res.status(400).json({
          message: 'Role not found. Create first'
        });
      } else {
        //check if user exists
        User.findOne({
          $or: [{
            email: req.body.email
          }, {
            facebook_id: req.body.facebook_id || 'eiaowfeaoiwfeoiawefio',
          }, {
            google_id: req.body.google_id || 'awhfoeahifeoaw'
          }]
        }, function(err, user) {
          if (err) {
            res.send(err);
          }

          if (user) {
            res.status(409).json({
              message: 'User already exists!'
            });
          } else {
            if (!req.body.email) {
              res.status(406).send({
                message: 'Please enter your email'
              });
            } else if (!req.body.password) {
              res.status(406).send({
                message: 'Please enter your password'
              });
            } else {
              var googleId = req.body.type === 'google' ?
                req.body.google_id : null;
              var facebookId = req.body.type === 'facebook' ?
                req.body.facebook_id : null;
              var newUser = new User({
                name: {
                  firstName: req.body.firstName,
                  lastName: req.body.lastName
                },
                email: req.body.email,
                password: req.body.password,
                userName: req.body.userName,
                google_id: googleId,
                facebook_id: facebookId,
                role: role,
              });
              //createa new user
              newUser.save(function(err, user) {
                if (err) {
                  res.send(err);
                } else {
                  var token = jwt.sign(newUser, config.secret, {
                    expiresInMinutes: 1440
                  });

                  res.status(200).json({
                    message: 'User Successfully created!',
                    token: token,
                    user: user
                  });
                }
              });
            }
          }
        });
      }
    });
  };

  /**
   * [function to get all the users in the database]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[json]}     [all users available in the database]
   */
  exports.getAllUsers = function(req, res) {
    //search for all the users
    User.find({}).exec(function(err, users) {
      if (err) {
        res.send(err);
      } else {
        //if users are found
        res.status(200).send(users);
      }
    });
  };

  /**
   * [function to get a user by its Id]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[json]}     [user with specific Id]
   */
  exports.getUserById = function(req, res) {
    //search for a user with a specific Id
    User.findById(req.params.id, function(err, user) {
      if (err) {
        res.send(err);
        //if no user is found
      } else if (!user) {
        res.status(404).json({
          message: 'User not found!'
        });
      } else {
        //if a user is found
        res.status(200).json(user);
      }
    });
  };

  /**
   * [function to update a user's details]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[json]}     [success message that user has been updated]
   */
  exports.updateUser = function(req, res) {
    req.body.name = {
      firstName: req.body.name.firstName,
      lastName: req.body.name.lastName
    };

    //check if role exists
    Role.findOne({
      _id: req.body.role,
    }, function(err, role) {
      if (err) {
        res.send(err);
        //if role is not found
      } else if (!role) {
        res.status(400).json({
          message: 'Role does not exist, create first'
        });
      } else {
        req.body.role = role;
        if(!req.body.password) {
          delete req.body.password;
        } else {
          console.log(req.body);
          // generate a salt
          bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err) {
               res.send(err);
            }

            // hash the password using our new salt
            bcrypt.hash(req.body.password, salt, function(err, hash) {
              if (err) {
                res.send(err);
              }
              // override the cleartext password with the hashed one
              req.body.password = hash;
              //find user and update its details
              User.findByIdAndUpdate(
                req.params.id, req.body,
                function(err, user) {
                  if (err) {
                    res.send(err);
                    //if user is not found
                  } else if (!user) {
                    res.status(404).json({
                      message: 'User does not exist'
                    });
                  } else {
                    res.status(200).json({
                      message: 'User Successfully updated!'
                    });
                  }
                });
            });
          });
         }
         //find user and update its details
         User.findByIdAndUpdate(
           req.params.id, req.body,
           function(err, user) {
             if (err) {
               res.send(err);
               //if user is not found
             } else if (!user) {
               res.status(404).json({
                 message: 'User does not exist'
               });
             } else {
               res.status(200).json({
                 message: 'User Successfully updated!'
               });
             }
           });
      }
    });
  };

  /**
   * [function to delete a user]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[json]}     [success message that user has been deleted]
   */
  exports.deleteUser = function(req, res) {
    //find a user and delete
    User.findByIdAndRemove(req.params.id, function(err, user) {
      if (err) {
        res.send(err);
        //if user is not found
      } else if (!user) {
        res.status(404).json({
          message: 'User does not exist!'
        });
      } else {
        res.status(200).json({
          message: 'User successfully deleted!'
        });
      }
    });
  };

  /**
   * [function to find a user by documents he/she has]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[json]}     [documents the user has]
   */
  exports.findUserByDocs = function(req, res) {
    Document.find({
      ownerId: req.params.id
    }, function(err, docs) {
      if (err) {
        res.send(err);
      } else if (!docs) {
        res.status(404).send({
          message: 'Documents not found'
        });
      } else {
        res.status(200).json(docs);
      }
    });
  };

  exports.logout = function(req, res) {
    delete req.headers['x-access-token'];
      return res.status(200).json({
        message: 'User has been successfully logged out'
      });
  };
})();

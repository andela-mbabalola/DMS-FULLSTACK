(function() {
  'Use strict';

  var roleController = require('./../controllers/role.controllers'),
    auth = require('./../middlewares/auth'),
    roleAccess = require('./../middlewares/roleAccess');

  function roleRoute(router) {
    router.route('/role/roles')
      .get(roleController.getAllRoles);

    //mounting the authMiddleware middleware on all the routes
    //router.all('/*', auth.authMiddleware);
    //route to get, edit and delete a role with a specific Id
    router.route('/role/superAdministrator/:id')
      .get(roleController.getRoleById)
      .get(roleController.getAllRoles)
      .put(roleController.editRole)
      .delete(roleController.deleteRole);


    //route to create and return all available role(s)
    router.route('/role/superAdministrator/:userName')
      .post(roleAccess.roleAccess, auth.verifyAdmin, roleController.createRole);

    router.route('/role/superAdministrator/owner/:id')
    .post(roleAccess.roleAccess, auth.verifyAdmin, roleController.createRole)
    .get(auth.verifyAdmin, roleController.getAllRoles);

    router.route('/role/superAdministrator/:userName/:id')
      .delete(roleAccess.roleAuth, roleController.deleteRole);

  }
  //exporting all available routes
  module.exports = roleRoute;

})();

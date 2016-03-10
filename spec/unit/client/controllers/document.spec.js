(function() {
  'use strict';

  describe('Tests for userDocumentCtrl', function() {
    var controller,
      DocModal,
      scope,
      state,
      stateParams,
      mdToast,
      mdDialog,
      Users = {
        userDocs: function(user, cb) {
          cb(null, {
            doc: [{
              title: 'here',
              content: 'this is it'
            }]
          });
        }
      },
      currentUser = {
        _id: 1,
        userName: 'tee',
        firstName: 'toptea',
        lastName: 'tay',
        email: 'tay@gmail.com',
        password: 'tay',
        role: '45'
      },
      Documents = {
        save: function(doc, cb, errCb) {
          return !doc.fail ? cb(doc) : errCb(null, true);
        },
        update: function(doc, cb) {
          return doc ? cb(doc) : cb(true, null);
        },
        get: function(id, cb) {
          cb([1]);
        },
        remove: function(docId, cb, errCb) {
          return !docId ? errCb() : cb();
        }
      };

    beforeEach(function() {
      module('Doccy');
    });

    beforeEach(module(function($provide) {
      var facebook,
        google;
      facebook = google = {
        init: function() {
          return 'something';
        }
      };
      mdDialog = {
        confirm: function() {
          return mdDialog;
        },
        show: function() {
          return mdDialog;
        },
        then: function(cb) {
          cb();
        },
        targetEvent: function() {
          return mdDialog;
        },
        ok: function() {
          return mdDialog;
        },
        ariaLabel: function() {
          return mdDialog;
        },
        textContent: function() {
          return mdDialog;
        },
        title: function() {
          return mdDialog;
        },
        cancel: function() {
          return 'canceled';
        }
      };
      $provide.value('facebook', facebook);
      $provide.value('google', google);
      $provide.value('mdDialog', mdDialog);
    }));

    beforeEach(inject(function($injector) {
      var $controller = $injector.get('$controller');
      scope = $injector.get('$rootScope');
      mdToast = $injector.get('$mdToast');
      DocModal = $injector.get('DocModal');
      mdDialog = $injector.get('mdDialog');
      state = $injector.get('$state');
      stateParams = $injector.get('$stateParams');
      controller = $controller('userDocumentCtrl', {
        $scope: scope,
        Users: Users,
        Documents: Documents,
        $mdDialog: mdDialog,
        $stateParams: stateParams
      });
    }));

    beforeEach(function() {
      scope.currentUser = currentUser;
      spyOn(Users, 'userDocs').and.callThrough();
      scope.init();
    });

    it('should call init and return a document', function() {
      expect(Users.userDocs).toHaveBeenCalled();
    });

    it('should define and create a document', function() {
      scope.currentUser = currentUser;
      scope.document = {
        _id: '345',
        title: 'doc test',
        content: 'doc test content',
        ownerId: scope.currentUser._id,
        role: scope.currentUser.role
      };
      spyOn(Documents, 'save').and.callThrough();
      spyOn(state, 'go').and.callThrough();
      spyOn(mdDialog, 'cancel').and.callThrough();
      scope.addDocument();
      expect(Documents.save).toHaveBeenCalled();
      expect(state.go).toHaveBeenCalled();
      expect(mdDialog.cancel).toHaveBeenCalled();
    });

    it('should show the addDocumentModal', function() {
      spyOn(DocModal, 'modal').and.callThrough();
      scope.addDocumentModal();
      expect(DocModal.modal).toHaveBeenCalled();
    });

    it('should create a document and fail', function() {
      scope.currentUser = currentUser;
      scope.document = {
        _id: null,
        fail: true
      };
      spyOn(Documents, 'save').and.callThrough();
      spyOn(state, 'go').and.callThrough();
      scope.addDocument();
      expect(state.go).not.toHaveBeenCalled();
    });

    it('should get document by their Id', function() {
      spyOn(Documents, 'get').and.callThrough();
      scope.getADoc();
      expect(Documents.get).toHaveBeenCalled();
    });

    it('should call delete function and delete document', function() {
      scope.doc = {
        id: 1
      };
      spyOn(Documents, 'remove').and.callThrough();
      spyOn(mdDialog, 'confirm').and.returnValue(mdDialog);
      spyOn(mdDialog, 'show').and.returnValue(mdDialog);
      spyOn(mdToast, 'show').and.callThrough();
      scope.deleteUserDoc('ev', scope.doc);
      expect(mdDialog.confirm).toHaveBeenCalled();
      expect(mdDialog.show).toHaveBeenCalled();
      expect(mdToast.show).toHaveBeenCalled();
      expect(Documents.remove).toHaveBeenCalled();
    });

    it('should  show mdToast dialog for update', function() {
      spyOn(mdToast, 'show').and.callThrough();
      scope.editDocument();
      expect(mdToast.show).toHaveBeenCalled();
    });

    it('should call update function', function() {
      scope.doc = {
        id: 1
      };
      spyOn(Documents, 'update').and.callThrough();
      spyOn(mdToast, 'show').and.callThrough();
      spyOn(state, 'go').and.callThrough();
      scope.editDocument();
      expect(Documents.update).toHaveBeenCalled();
      expect(mdToast.show).toHaveBeenCalled();
      expect(state.go).toHaveBeenCalledWith('userProfile.documents', {
        id: 1
      }, {
        reload: true
      });
    });

    it('should call update function and fail', function() {
      scope.doc = null;
      spyOn(mdToast, 'show').and.callThrough();
      spyOn(Documents, 'update').and.callThrough();
      scope.editDocument();
      expect(Documents.update).toHaveBeenCalled();
      expect(mdToast.show).toHaveBeenCalled();
    });
  });
})();

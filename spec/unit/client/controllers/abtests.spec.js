beforeEach(module(function($provide){
  var facebook,
  google;
  facebook = google = {
    init: function(){
      return 'something';
    }
  };
  $provide.value('facebook', facebook);
  $provide.value('google', google);
}));

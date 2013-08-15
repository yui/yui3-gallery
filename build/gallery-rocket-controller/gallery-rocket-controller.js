YUI.add('gallery-rocket-controller', function (Y, NAME) {

'use strict';

var Controller = Y.Base.create('rocketController', Y.Base, [Y.REventBroker], {
  destructor: function() {
    this.stopListening();
  }
}, {
  ATTRS: {
  }
});

Y.RController = Controller;


}, 'gallery-2013.08.15-00-45', {"requires": ["gallery-rocket-event-broker"]});

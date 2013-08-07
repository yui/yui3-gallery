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

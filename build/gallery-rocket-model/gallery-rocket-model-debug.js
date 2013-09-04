YUI.add('gallery-rocket-model', function (Y, NAME) {

'use strict';

var Model;

// TODO add model relate support. aka hasOne, hasMany
Model = Y.Base.create('rocketModel', Y.Model, [Y.REventBroker], {
  initializer: function(config) {
  },

  destructor: function() {
    this.stopListening();
  }
}, {
  ATTRS: {
  }
});

Y.RModel = Model;


}, 'gallery-2013.09.04-21-56', {"requires": ["model", "gallery-rocket-event-broker"]});

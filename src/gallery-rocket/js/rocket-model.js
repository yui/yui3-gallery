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

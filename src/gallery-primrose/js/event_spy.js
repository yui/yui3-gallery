/**
@class EventSpy
@namespace Primrose
@extends Y.Primrose.Spy
@constructor
**/
Y.namespace('Primrose').EventSpy = Y.Base.create('primrose.eventSpy',
  Y.Primrose.Spy,
  [],
{
  initializer: function () {
    this.listen();
  },

  /**
  listens for the target event being fired

  @method listen
  **/
  listen: function () {
    var host        = this.get('host'),
        targetName  = this.get('targetName');
    
    host.on(targetName, this.increment, this);
  }

});

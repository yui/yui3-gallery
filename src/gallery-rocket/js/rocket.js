'use strict';

var getClassName = Y.ClassNameManager.getClassName;

Y.App.CLASS_NAMES = {
  app  : getClassName('rocket'),
  views: getClassName('rocket', 'views')
};

Y.Rocket = Y.App;

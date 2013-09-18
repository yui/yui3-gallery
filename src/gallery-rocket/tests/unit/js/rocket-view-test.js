YUI.add('rocket-view-test', function(Y) {
  var suite = new Y.Test.Suite('View');

  suite.add(new Y.Test.Case({
    name: 'Lifecycle'
  }));

  suite.add(new Y.Test.Case({
    name: 'Attributes'
  }));

  suite.add(new Y.Test.Case({
    name: 'Methods'
  }));

  suite.add(new Y.Test.Case({
    name: 'Usages',

    setUp: function () {
      Y.one('body').appendChild('<div>').set('id', 'container');
      this.view = null;
    },

    tearDown: function () {
      Y.one('#container') && Y.one('#container').remove(true);
      delete this.view;
    },

    'if no container, render template under body': function() {
      this.view = new Y.RView({
        template: 'Hello rocket'
      });
      this.view.render();
      Y.Assert.areEqual(Y.one('body div').getHTML(), 'Hello rocket');
      Y.one('body div').remove(true);
    },

    'if container exist, render template under container, also render with attribute': function() {
      this.view = new Y.RView({
        template: 'Hello {{city}}',
        city: 'shanghai',
        container: '#container'
      });
      this.view.render();
      Y.Assert.areEqual(Y.one('#container').getHTML(), 'Hello shanghai');
    },

    'render view with model': function() {
      var model = new Y.RModel({
        action: 'Hello',
        target: 'rocket'
      });
      this.view = new Y.RView({
        template: '{{action}} {{target}}',
        model: model,
        container: '#container'
      });
      this.view.render();
      Y.Assert.areEqual(Y.one('#container').getHTML(), 'Hello rocket');

      model.set('action', 'Hi');
      Y.Assert.areEqual(Y.one('#container').getHTML(), 'Hi rocket', 'Model update should automatically update view');

      model = null;
    },

    'render view with modelList': function() {
      var models = new Y.ModelList({
        items: [
          { project: 'Ember' },
          { project: 'Angular' },
          { project: 'Backbone' }
        ]});
      this.view = new Y.RView({
        template: '<ul>{{# each modelList}}<li>{{project}}</li>{{/each}}</ul>',
        modelList: models,
        container: '#container'
      });
      this.view.render();
      Y.Assert.areEqual(Y.one('#container').getHTML(), '<ul><li>Ember</li><li>Angular</li><li>Backbone</li></ul>');

      models.item(1).set('project', 'Rocket');
      Y.Assert.areEqual(Y.one('#container').getHTML(), '<ul><li>Ember</li><li>Rocket</li><li>Backbone</li></ul>');

      models = null;
    }
  }));

  Y.Test.Runner.add(suite);
}, '@VERSION@', {
  requires: ['test', 'gallery-rocket-view']
});

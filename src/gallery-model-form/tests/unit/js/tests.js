YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-model-form'),
        form = '<form id="test-form">' +
                    '<input type="text" name="test-name" id="test-name" value="test value" />' +
               '</form>',
        modelForm;

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',

        setUp: function() {
            if (!Y.one('#form-test')) {
                Y.one('body').appendChild('<div>').set('id', 'form-test');

                modelForm = new Y.ModelForm({
                    boundingBox: Y.one('#form-test'),
                    markup: form
                }).render();
            }
        },

        tearDown: function() {},

        'Form Object Test': function() {
            Y.Assert.isObject(modelForm.getForm());
        },

        'Form ID Test': function() {
            Y.Assert.areEqual(modelForm.getForm().get('id'), 'test-form');
        },

        'Model check': function() {
            var formModel = modelForm.get('model');
            Y.Assert.areSame('test value', formModel.get('test-name'));
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'gallery-model-form', 'test', 'test-console' ] });

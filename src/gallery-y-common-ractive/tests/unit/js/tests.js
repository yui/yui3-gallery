YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-y-common-ractive');

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',
        'test is empty': function() {
            Y.Assert.fail('No Tests Provided For This Module');
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test' ] });

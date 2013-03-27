YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-namespace-with-array');

    suite.add(new Y.Test.Case({
        name: 'namespace regular function works',
        'test namespace works correct': function() {
            Y.log('hello')
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test' ] });

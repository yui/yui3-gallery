YUI.add('tag-tests', function(Y) {
    var suite = new Y.Test.Suite("Tag Tests");

    suite.add(new Y.Test.Case({
        name: "register",

        "should run": function() {
            //Y.Tag.register('.test-1')

            //Y.Assert.areSame(true, true);
        }
    }));

    Y.Test.Runner.add(suite);
}, '@VERSION@', {requires:['test', 'gallery-tag']});
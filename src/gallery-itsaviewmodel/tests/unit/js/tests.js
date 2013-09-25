YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-itsaviewmodel');

/*

todo:

test1: is a form generated when editable elements, but no formtag in the template nor in the container

test2: is a form NOT generated when editable elements and a formtag in the template available but not in the container

test3: is a form NOT generated when editable elements and the container is a formtag

*/
    suite.add(new Y.Test.Case({
        name: 'Automated Tests',
        'test is empty': function() {
            Y.Assert.fail('No Tests Provided For This Module');
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test' ] });

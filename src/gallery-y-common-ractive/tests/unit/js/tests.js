YUI.add('module-tests', function (Y) {

    var suite = new Y.Test.Suite('gallery-y-common-ractive');

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',
        
        'application initialized': function () {
            this.wait(function () {
                Y.Assert.isNull(Y.one('#el img'));
            }, 1000);
         },
        
        'style decorator test': function () {
            this.wait(function () {
                Y.Assert.areEqual(Y.one('.style-test').getAttribute('style'), 'width: 400px; height: 200px;background: url(http://placehold.it/48x48)');
            }, 1000);
         }
        
        
    }));

    Y.Test.Runner.add(suite);


}, '', {
    requires: ['test', 'node']
});
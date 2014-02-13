YUI.add('transitionend-tests', function(Y) {

    var Assert = Y.Test.Assert;

    var suite = new Y.Test.Suite('transitionend');

    suite.add(new Y.Test.Case({
        name: 'support tests',
        'support is defined': function() {
            Assert.isObject(Y.support, 'Y.support is not defined');
            Assert.isBoolean(Y.support.transitionend, 'Y.support.transitionend is not defined');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'event tests',

        _should: {
            ignore: {
                'transitionend test': !Y.support.transitionend
            }
        },

        'transitionend test': function () {
            var test = this,
                node = Y.one('.test'),
                startTime = Y.Lang.now();

            node.on('transitionend', function () {
                test.resume(function () {
                    Assert.isTrue(Y.Lang.now() > startTime, 'transition should take some time');
                });
            });
            node.setStyle('width', '200px');

            test.wait();
        }
    }));

    Y.Test.Runner.add(suite);


},'', {
    requires: [
        'test',
        'gallery-transitionend',
        'node'
    ]
});

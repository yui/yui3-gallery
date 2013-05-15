YUI.add('affix-tests', function(Y) {

    var Assert = Y.Test.Assert;

    var suite = new Y.Test.Suite('affix');

    suite.add(new Y.Test.Case({
        name: 'Affix Tests',

        'test scrolling': function () {
            var test = this,
                node = Y.one('#affix').plug(Y.Plugin.Affix),
                offset = node.getData('offset-top');

            Assert.areEqual('static', node.getComputedStyle('position'), 'before scrolling position should be static');

            setTimeout(function () {
                Y.config.win.scrollTo(0, 350);
                setTimeout(function () {
                    test.resume(function () {
                        Assert.areEqual('fixed', node.getComputedStyle('position'), 'after scrolling position should be fixed');
                        var top = node.getComputedStyle('top');
                        Assert.areEqual(offset, top.substr(0, top.length - 2), 'after scrolling position should equal offset');
                    });
                }, 10);
            }, 20);

            test.wait();
        }
    }));

    Y.Test.Runner.add(suite);

},'', { requires: [ 'test' ] });

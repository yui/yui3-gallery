YUI.add('scrollspy-tests', function(Y) {

    var Assert = Y.Test.Assert;

    var suite = new Y.Test.Suite('scrollspy'),
        body = Y.one('body'),
        menu = Y.one('.yui3-menu');

    suite.add(new Y.Test.Case({
        name: 'ScrollSpy class behavior',
        'module loaded': function () {
            Assert.isFunction(Y.Plugin.ScrollSpy);
        },
        'successfully plugged and unplugged': function () {
            var node = Y.Node.create('<div></div>');

            node.plug(Y.Plugin.ScrollSpy, {
                target: Y.Node.create('<ul></ul>')
            });

            Assert.isInstanceOf(Y.Plugin.ScrollSpy, node.scrollspy, 'scrollspy was not plugged successfully');

            node.unplug(Y.Plugin.ScrollSpy);

            Assert.isUndefined(node.scrollspy, 'scrollspy was not unplugged successfully');
        },
        'attributes get value from data properties': function () {
            var node = Y.Node.create('<div data-target=".content" data-delay="50"></div>');
            
            node.plug(Y.Plugin.ScrollSpy);

            Assert.areSame(Y.one('.content'), node.scrollspy.get('target'), 'target should be gotten from the data-target attribute');
            Assert.areSame(50, node.scrollspy.get('scrollDelay'), 'scrollDelay should be gotten from the data-delay attribute');

            node.unplug(Y.Plugin.ScrollSpy);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'ScrollSpy functional tests',
        'after plugging the correct element is active': function () {
            var test = this;

            setTimeout(function () {
                test.resume(function () {
                    Assert.isFalse(menu.one('li + li').hasClass('yui3-menu-active'), 'menu should not already have an active class');

                    body.plug(Y.Plugin.ScrollSpy, {
                        target: '.yui3-menu'
                    });

                    Assert.isTrue(menu.one('li + li').hasClass('yui3-menu-active'), 'scrollspy should refresh synchronously the first time');
                });
            }, 10);

            Y.config.win.scrollTo(0, 0);

            test.wait();
        },
        'scrolling an element into view activates the right menu item': function () {
            var test = this;

            body.scrollspy.onceAfter('scroll', function () {
                test.resume(function () {
                    var active = menu.one('.yui3-menu-active a');
                    Assert.areSame('#sports', active.getAttribute('href'), 'active element is the correct one');
                });
            });

            document.getElementById('sports').scrollIntoView();

            test.wait();
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test' ] });

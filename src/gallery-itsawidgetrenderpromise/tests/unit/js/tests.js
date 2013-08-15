YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-itsawidgetrenderpromise');

    suite.add(new Y.Test.Case({
        name: 'test 1',
        'check renderPromise if widget is indeed completely rendered':  function() {
            var cal = new Y.Calendar();
            cal.renderPromise(5000).then(
                function() {
                    Y.Assert.isTrue(cal.get('rendered'), 'renderPromise is fulfilled, but the rendered-attribute is false');
                },
                function(reason) {
                    Y.Assert.fail(reason);
                }
            );
            cal.render();
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 2',
        'check multiple renderPromises with Y.batch if all widgeta are completely rendered':  function() {
            var cal1 = new Y.Calendar(),
                cal2 = new Y.Calendar(),
                cal3 = new Y.Calendar(),
                cal4 = new Y.Calendar(),
                cal5 = new Y.Calendar();
            Y.batch(
                cal1.renderPromise(),
                cal2.renderPromise(),
                cal3.renderPromise(),
                cal4.renderPromise(),
                cal5.renderPromise()
            ).then(
                function() {
                    var allrendered = cal1.get('rendered') && cal2.get('rendered') && cal3.get('rendered') && cal4.get('rendered') && cal5.get('rendered');
                    Y.Assert.isTrue(allrendered, 'all Y.batch()-renderPromises are fulfilled, but some rendered-attribute are false');
                },
                function(reason) {
                    Y.Assert.fail(reason);
                }
            );
            cal1.render();
            cal2.render();
            cal3.render();
            cal4.render();
            cal5.render();
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 3',
        'check readyPromise if widget is indeed completely ready':  function() {
            var readyafterrender = false,
                ready = false,
                cal = new Y.Calendar();
            cal.promiseBeforeReady = function() {
                // when this function is called, 'rendered' should be true
                readyafterrender = cal.get('rendered');
                return new Y.Promise(function (resolve) {
                    // simulate delay with a timer
                    Y.later(1000, null, function() {
                        ready = true;
                        resolve();
                    });
                });
            };
            cal.readyPromise(5000).then(
                function() {
                    Y.Assert.isTrue(
                        (readyafterrender && ready),
                        'readyPromise is fulfilled, but ' + (!readyafterrender ? 'promiseBeforeReady() executed before the widget was rendered ' : '') + (!ready ? 'promiseBeforeReady is not completed' : ''));
                },
                function(reason) {
                    Y.Assert.fail(reason);
                }
            );
            cal.render();
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 4',
        'check renderOnAvailablePromise if a widget is rendered when Node is inserted after delay':  function() {
            var cal = new Y.Calendar();
            cal.renderOnAvailablePromise('#testnode4', {timeout: 2000}).then(
                function() {
                    var nodeavailable = Y.one('#testnode4'),
                        widgetrendered = cal.get('rendered');
                    // we only can assert true if the widget is being rendered indeed:
                    cal.renderPromise(5000).then(
                        function() {
                            Y.Assert.isTrue(
                                (nodeavailable && !widgetrendered),
                                'renderOnAvailablePromise is fulfilled, but '+ (!nodeavailable ? 'srcNode not in the DOM ' : '') + (widgetrendered ? 'widget is already rendered' : '')
                            );
                        },
                        function(reason) {
                            Y.Assert.fail(reason);
                        }
                    );
                },
                function(reason) {
                    Y.Assert.fail(reason);
                }
            );
            // now insert #testnode4 after delay
            Y.later(1000, null, function() {
                Y.one('body').prepend('<div id="testnode4"></div>');
            });
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 5',
        'check renderOnAvailablePromise if Promise get fulfilled after render':  function() {
            var cal = new Y.Calendar();
            cal.renderOnAvailablePromise('#testnode5', {promisetype: 'afterrender', timeout: 2000}).then(
                function() {
                    var nodeavailable = Y.one('#testnode5'),
                        widgetrendered = cal.get('rendered');
                    Y.Assert.isTrue(
                        (nodeavailable && widgetrendered),
                        'renderOnAvailablePromise is fulfilled, but '+ (!nodeavailable ? 'srcNode not in the DOM ' : '') + (!widgetrendered ? 'widget is not rendered' : '')
                    );
                },
                function(reason) {
                    Y.Assert.fail(reason);
                }
            );
            // now insert #testnode6 after delay
            Y.later(1000, null, function() {
                Y.one('body').prepend('<div id="testnode5"></div>');
            });
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 6',
        'check renderOnAvailablePromise if Promise get fulfilled after ready':  function() {
            var ready = false,
                cal = new Y.Calendar();
            cal.promiseBeforeReady = function() {
                return new Y.Promise(function (resolve) {
                    // simulate delay with a timer
                    Y.later(1000, null, function() {
                        ready = true;
                        resolve();
                    });
                });
            };
            cal.renderOnAvailablePromise('#testnode6', {promisetype: 'afterready', timeout: 2000}).then(
                function() {
                    var nodeavailable = Y.one('#testnode6');
                    Y.Assert.isTrue(
                        (nodeavailable && ready),
                        'renderOnAvailablePromise is fulfilled, but '+ (!nodeavailable ? 'srcNode not in the DOM ' : '') + (!ready ? 'readyPromise is not finished yet' : '')
                    );
                },
                function(reason) {
                    Y.Assert.fail(reason);
                }
            );
            // now insert #testnode7 after delay
            Y.later(1000, null, function() {
                Y.one('body').prepend('<div id="testnode6"></div>');
            });
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 7',
        'check renderOnAvailablePromise if the promise is rejected when the widget is destroyed before node-insert':  function() {
            var cal = new Y.Calendar();
            cal.renderOnAvailablePromise('#testnode7', {timeout: 2000}).then(
                function() {
                    Y.Assert.fail('renderOnAvailable succeeded, but the widget was destroyed.');
                },
                function() {
                    Y.Assert.pass();
                }
            );
            // now insert #testnode4 after delay
            Y.later(1000, null, function() {
                cal.destroy();
                Y.one('body').prepend('<div id="testnode7"></div>');
            });
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 8',
        'check renderWhenAvailable if a widget is rendered multiple times':  function() {
            var cal = new Y.Calendar(),
                createnodetimer,
                count = 0;
            cal.renderWhenAvailable('#testnode8');
            cal.after('render', function() {
                if (cal.get('boundingBox').one('.yui3-calendar-header-label')) {
                    count++;
                }
            });
            // now insert #testnode9 after delay
            createnodetimer = Y.later(1000, null, function() {
                Y.one('body').prepend('<div id="testnode8"></div>');
                Y.later(500, null, function() {
                    Y.one('#testnode8').remove(true);
                });
            }, null, true);
            this.wait(function(){
                createnodetimer.cancel();
                Y.Assert.areEqual(4, count, 'renderWhenAvailable did not render the widget the expected amout of times.');
            }, 4750);
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test', 'gallery-itsawidgetrenderpromise', 'calendar' ] });
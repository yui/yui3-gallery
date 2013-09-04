YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-itsaeditorrenderpromise');

    suite.add(new Y.Test.Case({
        name: 'test 1',
        'check renderPromise if editor is indeed completely rendered':  function() {
            var editor = new Y.EditorBase();
            editor.renderPromise(5000).then(
                function() {
                    Y.Assert.isTrue((editor.frame && editor.frame._rendered), 'renderPromise is fulfilled, but the rendered-attribute is false');
                },
                function(reason) {
                    Y.Assert.fail(reason);
                }
            );
            editor.render();
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 2',
        'check multiple renderPromises with Y.batch if all editors are completely rendered':  function() {
            var editor1 = new Y.EditorBase(),
                editor2 = new Y.EditorBase(),
                editor3 = new Y.EditorBase(),
                editor4 = new Y.EditorBase(),
                editor5 = new Y.EditorBase();
            Y.batch(
                editor1.renderPromise(),
                editor2.renderPromise(),
                editor3.renderPromise(),
                editor4.renderPromise(),
                editor5.renderPromise()
            ).then(
                function() {
                    var allrendered = ((editor1.frame && editor1.frame._rendered) &&
                                       (editor2.frame && editor2.frame._rendered) &&
                                       (editor3.frame && editor3.frame._rendered) &&
                                       (editor4.frame && editor4.frame._rendered) &&
                                       (editor5.frame && editor5.frame._rendered));
                    Y.Assert.isTrue(allrendered, 'all Y.batch()-renderPromises are fulfilled, but some rendered-attribute are false');
                },
                function(reason) {
                    Y.Assert.fail(reason);
                }
            );
            editor1.render();
            editor2.render();
            editor3.render();
            editor4.render();
            editor5.render();
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 3',
        'check readyPromise if editor is indeed completely ready':  function() {
            var readyafterrender = false,
                ready = false,
                editor = new Y.EditorBase();
            editor.promiseBeforeReady = function() {
                // when this function is called, 'rendered' should be true
                readyafterrender = (editor.frame && editor.frame._rendered);
                return new Y.Promise(function (resolve) {
                    // simulate delay with a timer
                    Y.later(1000, null, function() {
                        ready = true;
                        resolve();
                    });
                });
            };
            editor.readyPromise(5000).then(
                function() {
                    Y.Assert.isTrue(
                        (readyafterrender && ready),
                        'readyPromise is fulfilled, but ' + (!readyafterrender ? 'promiseBeforeReady() executed before the editor was rendered ' : '') + (!ready ? 'promiseBeforeReady is not completed' : ''));
                },
                function(reason) {
                    Y.Assert.fail(reason);
                }
            );
            editor.render();
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 4',
        'check renderOnAvailablePromise if a editor is rendered when Node is inserted after delay':  function() {
            var editor = new Y.EditorBase();
            editor.renderOnAvailablePromise('#testnode4', {timeout: 2000}).then(
                function() {
                    var nodeavailable = Y.one('#testnode4'),
                        editorrendered = (editor.frame && editor.frame._rendered);
                    // we only can assert true if the editor is being rendered indeed:
                    editor.renderPromise(5000).then(
                        function() {
                            Y.Assert.isTrue(
                                (nodeavailable && !editorrendered),
                                'renderOnAvailablePromise is fulfilled, but '+ (!nodeavailable ? 'srcNode not in the DOM ' : '') + (editorrendered ? 'editor is already rendered' : '')
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
            var editor = new Y.EditorBase();
            editor.renderOnAvailablePromise('#testnode5', {promisetype: 'afterrender', timeout: 2000}).then(
                function() {
                    var nodeavailable = Y.one('#testnode5'),
                        editorrendered = (editor.frame && editor.frame._rendered);
                    Y.Assert.isTrue(
                        (nodeavailable && editorrendered),
                        'renderOnAvailablePromise is fulfilled, but '+ (!nodeavailable ? 'srcNode not in the DOM ' : '') + (!editorrendered ? 'editor is not rendered' : '')
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
                editor = new Y.EditorBase();
            editor.promiseBeforeReady = function() {
                return new Y.Promise(function (resolve) {
                    // simulate delay with a timer
                    Y.later(1000, null, function() {
                        ready = true;
                        resolve();
                    });
                });
            };
            editor.renderOnAvailablePromise('#testnode6', {promisetype: 'afterready', timeout: 2000}).then(
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
        'check renderOnAvailablePromise if the promise is rejected when the editor is destroyed before node-insert':  function() {
            var editor = new Y.EditorBase();
            editor.renderOnAvailablePromise('#testnode7', {timeout: 2000}).then(
                function() {
                    Y.Assert.fail('renderOnAvailable succeeded, but the editor was destroyed.');
                },
                function() {
                    Y.Assert.pass();
                }
            );
            // now insert #testnode4 after delay
            Y.later(1000, null, function() {
                editor.destroy();
                Y.one('body').prepend('<div id="testnode7"></div>');
            });
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 8',
        'check renderWhenAvailable if an editor is rendered multiple times':  function() {
            var editor = new Y.EditorBase(),
                createnodetimer,
                count = 0;
            editor.renderWhenAvailable('#testnode8');
            editor.frame.after('ready', function() {
                if (editor.frame && editor.frame._rendered) {
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
                Y.Assert.areEqual(4, count, 'renderWhenAvailable did not render the editor the expected amout of times.');
            }, 4750);
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test', 'gallery-itsaeditorrenderpromise', 'editor-base' ] });
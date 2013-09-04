YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-itsanodepromise'),
        nodeName = 'testnode',
        nodeId = '#'+nodeName,
        nodeTemplate = '<div id="'+nodeName+'{follownr}">Here is some content<div>with an innerdiv</div></div>',
        NODE_NOT_AVAILABLE = 'Node not available',
        NODE_SHOULD_NOT_BE_AVAILABLE = 'Node is found, but should not be available yet',
        NODE_SHOULD_NOT_BE_CONTENTREADY = 'Node is found, but should not be contentready yet',
        NODE_NOT_CONTENTREADY = 'Node not contentready',
        NODE_NOT_REMOVED_INTIME = 'Node not removed within timeout settings',
        NODE_REMOVED_BUT_SHOULDNT = 'Node was marked as removed but still exists',
        NODE_UNAVAILABLE_BEFORE_AVAILABLE = 'Node was noticed as unavailable before it got available, when using "afteravailable=true"',
        NODE_AVAILABLE_AGAIN_NOT_WORKING = 'Y.Node.fireAvailabilities --> availableagain didn\'t fire expected number of times',
        bodynode = Y.one('body'),
        YNode = Y.Node;

    function insertNode(follownr) {
        bodynode.append(Y.Lang.sub(nodeTemplate, {follownr: follownr}));
    }

    function insertNodeTimedout(follownr) {
        Y.later(
            1000,
            null,
            insertNode,
            follownr
        );
    }

    suite.add(new Y.Test.Case({
        name: 'test 1',
        'check node which is already available - without timeout':  function() {
            var follownr = 1,
                nodeAvailablePromise = YNode.availablePromise(nodeId+follownr);
            nodeAvailablePromise.then(
                function() {
                    Y.Assert.pass();
                },
                function() {
                    Y.Assert.fail(NODE_NOT_AVAILABLE);
                }
            );
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 2',
        'check node which is already available - with timeout of 1 second':  function() {
            var follownr = 2,
                nodeAvailablePromise = YNode.availablePromise(nodeId+follownr, 1000);
            nodeAvailablePromise.then(
                function() {
                    Y.Assert.pass();
                },
                function() {
                    Y.Assert.fail(NODE_NOT_AVAILABLE);
                }
            );
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 3',
        'check node that is inserted after 1 second - without timeout':  function() {
            var follownr = 3;
            insertNodeTimedout(follownr);
            var nodeAvailablePromise = YNode.availablePromise(nodeId+follownr);
            nodeAvailablePromise.then(
                function() {
                    Y.Assert.pass();
                },
                function() {
                    Y.Assert.fail(NODE_NOT_AVAILABLE);
                }
            );
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 4',
        'check node that is inserted after 1 second - with timeout of 0.5 seconds':  function() {
            var follownr = 4;
            insertNodeTimedout(follownr);
            var nodeAvailablePromise = YNode.availablePromise(nodeId+follownr, 500);
            nodeAvailablePromise.then(
                function() {
                    Y.Assert.fail(NODE_SHOULD_NOT_BE_AVAILABLE);
                },
                function() {
                    Y.Assert.pass();
                }
            );
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 5',
        'check node that is inserted after 1 second - with timeout of 2 seconds':  function() {
            var follownr = 5;
            insertNodeTimedout(follownr);
            var nodeAvailablePromise = YNode.availablePromise(nodeId+follownr, 2000);
            nodeAvailablePromise.then(
                function() {
                    Y.Assert.pass();
                },
                function() {
                    Y.Assert.fail(NODE_NOT_AVAILABLE);
                }
            );
        }
    }));

    // the same for the contentReady promise

    suite.add(new Y.Test.Case({
        name: 'test 6',
        'check node which is already contentready - without timeout':  function() {
            var follownr = 6,
                nodeContentreadyPromise = YNode.contentreadyPromise(nodeId+follownr);
            nodeContentreadyPromise.then(
                function() {
                    Y.Assert.pass();
                },
                function() {
                    Y.Assert.fail(NODE_NOT_CONTENTREADY);
                }
            );
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 7',
        'check node which is already contentready - with timeout of 1 second':  function() {
            var follownr = 7,
                nodeContentreadyPromise = YNode.contentreadyPromise(nodeId+follownr, 1000);
            nodeContentreadyPromise.then(
                function() {
                    Y.Assert.pass();
                },
                function() {
                    Y.Assert.fail(NODE_NOT_CONTENTREADY);
                }
            );
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 8',
        'check node that is contentready after 1 second - without timeout':  function() {
            var follownr = 8;
            insertNodeTimedout(follownr);
            var nodeContentreadyPromise = YNode.contentreadyPromise(nodeId+follownr);
            nodeContentreadyPromise.then(
                function() {
                    Y.Assert.pass();
                },
                function() {
                    Y.Assert.fail(NODE_NOT_CONTENTREADY);
                }
            );
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 9',
        'check node that is contentready after 1 second - with timeout of 0.5 seconds':  function() {
            var follownr = 9;
            insertNodeTimedout(follownr);
            var nodeContentreadyPromise = YNode.contentreadyPromise(nodeId+follownr, 500);
            nodeContentreadyPromise.then(
                function() {
                    Y.Assert.fail(NODE_SHOULD_NOT_BE_CONTENTREADY);
                },
                function() {
                    Y.Assert.pass();
                }
            );
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 10',
        'check node that is contentready after 1 second - with timeout of 2 seconds':  function() {
            var follownr = 10;
            insertNodeTimedout(follownr);
            var nodeContentreadyPromise = YNode.contentreadyPromise(nodeId+follownr, 2000);
            nodeContentreadyPromise.then(
                function() {
                    Y.Assert.pass();
                },
                function() {
                    Y.Assert.fail(NODE_NOT_CONTENTREADY);
                }
            );
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 11',
        'check if removing a node fulfills the promise':  function() {
            var follownr = 11,
                nodeUnavailablePromise = YNode.unavailablePromise(nodeId+follownr, {timeout: 2000});
            nodeUnavailablePromise.then(
                function() {
                    Y.Assert.pass();
                },
                function(reason) {
                    Y.Assert.fail(NODE_NOT_REMOVED_INTIME);
                }
            );
            Y.later(1000, null, function() {
                Y.one(nodeId+follownr).remove(true);
            });
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 12',
        'check if removedPromise fulfills when node is not in the DOM':  function() {
            var follownr = 12;
                nodeUnavailablePromise = YNode.unavailablePromise(nodeId+follownr, {timeout: 2000});
            nodeUnavailablePromise.then(
                function() {
                    Y.Assert.pass();
                },
                function(reason) {
                    Y.Assert.fail(NODE_NOT_REMOVED_INTIME);
                }
            );
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 13',
        'check if removing a node rejects the promise if it is removed after timeout':  function() {
            var follownr = 13;
                nodeUnavailablePromise = YNode.unavailablePromise(nodeId+follownr, {timeout: 2000});
            nodeUnavailablePromise.then(
                function() {
                    Y.Assert.fail(NODE_NOT_REMOVED_INTIME);
                },
                function(reason) {
                    Y.Assert.pass();
                }
            );
            Y.later(3000, null, function() {
                Y.one(nodeId+follownr).remove(true);
            });
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 14',
        'check if removing a parentnode fulfills the unavailablepromise':  function() {
            var follownr = 14,
                nodeUnavailablePromise = YNode.unavailablePromise(nodeId+follownr, {timeout: 2000});
            nodeUnavailablePromise.then(
                function() {
                    Y.Assert.pass();
                },
                function(reason) {
                    Y.Assert.fail(NODE_NOT_REMOVED_INTIME);
                }
            );
            Y.later(1000, null, function() {
                Y.one(nodeId+follownr).get('parentNode').remove(true);
            });
        }
    }));


    suite.add(new Y.Test.Case({
        name: 'test 15',
        'check if removing a childnode does not fulfills the unavailablepromise':  function() {
            var follownr = 15,
                nodeUnavailablePromise = YNode.unavailablePromise(nodeId+follownr, {timeout: 2000});
            nodeUnavailablePromise.then(
                function() {
                    Y.Assert.fail(NODE_REMOVED_BUT_SHOULDNT);
                },
                function(reason) {
                    Y.Assert.pass();
                }
            );
            Y.later(1000, null, function() {
                Y.one(nodeId+follownr).one('.childnode').remove(true);
            });
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 16',
        'check if unavailable with afteravailable=true works':  function() {
            var follownr = 16,
                insertedbydelay = false,
                nodeUnavailablePromise = YNode.unavailablePromise(nodeId+follownr, {afteravailable: true, timeout: 3000});
            nodeUnavailablePromise.then(
                function() {
                    Y.Assert.isTrue(insertedbydelay, NODE_UNAVAILABLE_BEFORE_AVAILABLE);
                },
                function(reason) {
                    Y.Assert.fail(NODE_NOT_REMOVED_INTIME);
                }
            );
            Y.later(2000, null, function() {
                Y.one(nodeId+follownr).remove(true);
            });
            Y.later(1500, null, function() {
                insertedbydelay = true;
                Y.one('body').append('<div id="'+nodeName+follownr+'"></div>');
            });
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 17',
        'check if availableagain event gets fired multiple times':  function() {
            var follownr = 17,
                nodestring = '<div id="'+nodeName+follownr+'"></div>',
                body = Y.one('body'),
                count = 0;
            YNode.fireAvailabilities(nodeId+follownr);
            Y.later(100, null, function() {
                body.append(nodestring);
            });
            Y.later(200, null, function() {
                Y.one(nodeId+follownr).remove(true);
            });
            Y.later(300, null, function() {
                body.append(nodestring);
            });
            Y.later(400, null, function() {
                Y.one(nodeId+follownr).remove(false);
            });
            Y.later(500, null, function() {
                body.append(nodestring);
            });
            Y.later(600, null, function() {
                Y.one(nodeId+follownr).remove(true);
            });
            Y.on('availableagain', function() {
                count++;
            }, nodeId+follownr);
            this.wait(function() {
                Y.Assert.areEqual(3, count, NODE_AVAILABLE_AGAIN_NOT_WORKING);
            }, 1000);
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test', 'gallery-itsanodepromise', 'yui-later' ] });

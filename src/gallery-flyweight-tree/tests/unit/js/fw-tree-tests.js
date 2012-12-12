YUI.add('fw-tree-tests', function(Y) {
    var A = Y.Assert,
        TV = Y.Base.create(
            'fw-test',
            Y.FlyweightTreeManager,
            [],
            {
                initializer: function (config) {
                    this._loadConfig(config.tree);
                }
            }
        ),
        tv,
        LABEL = 'label',
        ID = 'id',
        buildTree = function (depth, width, expanded) {
            var buildBranch = function (currDepth, label) {
                var branch = [], i;
                for (i = 0; i < width; i += 1) {
                    branch.push({
                        label: label + '-' + i,
                        expanded:expanded,
                        children: (currDepth < depth)? buildBranch(currDepth + 1, label + '-' + i ):undefined
                    });
                }
                return branch;
            };
            return new TV({tree:buildBranch(0, LABEL)}).render('#container');

        },

        suite = new Y.Test.Suite("FWTreeView Test Suite");

    suite.add(new Y.Test.Case({
        name: "FlyweightTree",
        tearDown: function () {
            tv.destroy();
        },
        'test node pools': function () {
            tv = new TV({tree:[
               {
                    label: 'label-0',
                    expanded: false,
                    children: [
                        'label-0-0',
                        'label-0-1',
                        'label-0-2'
                    ]
                },
                'label-1',
                'label-2'
            ]});
            Y.Object.each(tv._pool, function () {
                A.fail('There shouldn\'t have been any items');
            });
            tv.destroy();
            tv = buildTree(4,4,false);
            A.areEqual(1, tv._pool._default.length,'The tree is collapsed, only one node is needed');
            Y.Array.each(tv._pool._default, function (node) {
                A.isNull(node._iNode, 'instances in pool should have iNode: null');
            });
            tv._forSomeINode(function(iNode) {
                A.areEqual(0, iNode._refCount || 0, 'all tree should have no nodes held: ' + iNode.label);
                A.isNull(iNode._nodeInstance ||  null, 'all tree should have no nodes held: ' + iNode.label);
            });
            tv.expandAll();
            A.areEqual(5, tv._pool._default.length,'The tree is fully expanded, 1 for the root + 1 for each level of depth');
            Y.Array.each(tv._pool._default, function (node) {
                A.isNull(node._iNode, 'instances in pool should have iNode: null');
            });
            tv._forSomeINode(function(iNode) {
                A.areEqual(0, iNode._refCount || 0, 'all tree should have no nodes held: ' + iNode.label);
                A.isNull(iNode._nodeInstance ||  null, 'all tree should have no nodes held: ' + iNode.label);
            });
            tv.destroy();
            tv = buildTree(4,4);
            A.areEqual(5, tv._pool._default.length,'For a fully expanded tree, only 1 node more than the depth');
        },
        'Test dynamic Loading': function () {
            var node, other;

            tv = new TV({
                tree: [
                    {
                            label:'label-0',
                            children: []
                    },
                    'label-1',
                    'label-2'
                ],
                dynamicLoader: function (node, callback) {
                    var i, branch = [],
                       label = node.get(LABEL);

                    for (i = 0; i < 3; i += 1) {
                        branch[i] = label + '-' + i;
                    }

                    callback(branch);
                }
            });
            tv.render();
            tv.getNodeBy(LABEL,'label-1').expand().release();
            tv.getNodeBy(LABEL,'label-1-1').expand().release();
            tv.getNodeBy(LABEL,'label-1-1-0').expand().release();
            tv.getNodeBy(LABEL,'label-2').expand().release();
            node = tv.getNodeBy(LABEL,'label-1-1-0-1');
            A.areEqual(3, node.get('depth'), 'node 1-1-0-1 should be at depth 3');
            A.areEqual('label-1-1-0-1', node.get(LABEL), 'node should be labeled label 1-1-0-1');
            other = node.getNextSibling();
            A.areEqual(3, other.get('depth'), 'node 1-1-0-2 should be at depth 3');
            A.areEqual('label-1-1-0-2', other.get(LABEL), 'node should be labeled label 1-1-0-2');
            A.isNull(other.getNextSibling(),' there should be no next to 1-1-0-2');
            other.release();
            other = node.getPreviousSibling();
            A.areEqual(3, other.get('depth'), 'node 1-1-0-0 should be at depth 3');
            A.areEqual('label-1-1-0-0', other.get(LABEL), 'node should be labeled label 1-1-0-0');
            A.isNull(other.getPreviousSibling(),' there should be no next to 1-1-0-0');
            other.release();
            other = node.getParent();
            A.areEqual(2, other.get('depth'), 'node 1-1-0 should be at depth 2');
            A.areEqual('label-1-1-0', other.get(LABEL), 'node should be labeled label 1-1-0');
            other.release();
            node.release();
            node = tv.getNodeBy(LABEL,'label-0');
            A.isFalse(node.hasChildren(),'should not have children');
            node.expand();
            node.release();

            A.isNotNull(tv.getNodeBy(LABEL,'label-0-0').release(), 'there should not be any children');

        },
        'Test dynamic Loader returns nothing': function () {
            var node;
            tv = new TV({
                tree: [
                    'label-0',
                    'label-1',
                    'label-2'
                ],
                dynamicLoader: function (node, callback) {
                    callback();
                }
            });
            tv.render();
            node = tv.getNodeBy(LABEL,'label-1');
            A.isUndefined(node.get('isLeaf'), 'after loading nothing, isLeaf should be unknown');
            node.expand();
            A.isTrue(node.get('isLeaf'), 'after loading nothing, isLeaf should be True');
            node.release();

            tv.set('dynamicLoader', false);
            A.isFunction(tv.get('dynamicLoader'),'false is not valid for dynamic loader');
            tv.set('dynamicLoader', null);
            A.isNull(tv.get('dynamicLoader'),'dynamic loader should be null');
         },
        'Test focused node gets expanded': function () {

            tv = buildTree(3,4, false);
            tv.forSomeNodes(function (node) {
                A.isFalse(node.hasChildren() && node.get('expanded'), 'All nodes should be collapsed:' + node.get(LABEL));
            });
            var focusedTest = function (label) {
                var focusedNode = tv.getNodeBy(LABEL, label);
                tv.set('focusedNode', focusedNode);

                var node , ancestor = focusedNode , ancestry = [];
                while (ancestor) {
                    node = ancestor;
                    ancestor = ancestor.getParent();
                    node.release();
                    if (!ancestor) {
                        break;
                    }
                    ancestry.push(ancestor.get(ID));
                }
                tv.forSomeNodes(function (node) {
                    if (ancestry.indexOf(node.get(ID)) !== -1) {
                        A.isTrue(node.get('expanded'), 'Ancestors of ' + label + ' should be expanded: ' + node.get(LABEL));
                    } else {
                        A.isFalse(node.hasChildren() && node.get('expanded'), 'Only the ancestors of ' + label + ' should be expanded:' + node.get(LABEL));
                    }
                });
                focusedNode.release();
            };
            focusedTest('label-1-1-1');
            tv.collapseAll();
            focusedTest('label-1-1');

        },
        'Requesting a held node should return the same reference': function () {
            tv = buildTree(2,2);
            var node = tv.getNodeBy(LABEL, 'label-1'),
                other = tv.getNodeBy(LABEL, 'label-1');


            A.areSame(node, other, 'Node references should be the same');
            node.release();
            other.release();
        },
        'Trying alternate ways to use getNodeBy': function () {
            tv = buildTree(2,2);
            var node = tv.getNodeBy(LABEL, 'label-1'),
                other = tv.getNodeBy(function(node) {
                    return node.get(LABEL) === 'label-1';
                });

            A.areSame(node, other, 'Node references should be the same');
            A.isNull(tv.getNodeBy(LABEL, 'qqqq'), 'node not found, should be null')
            A.isNull(tv.getNodeBy(1), 'bad argument, should be null')
            node.release();
            other.release();
        },
        'is depth correct': function () {
            tv = buildTree(4,2);
            tv.forSomeNodes(function(node, depth) {
                A.areEqual(depth, node.get('depth'), 'depth should be equal: ' + node.get(LABEL));
            });
            tv._forSomeINode(function (iNode, depth) {
                var node = tv._poolFetch(iNode);
                A.areEqual(depth, node.get('depth'), 'depths should match: ' + iNode.label);
                node.release();
            });
        },
        'Does hold end release work?': function () {
            tv = buildTree(2,2);
            var node = tv.getNodeBy(LABEL, 'label-1-1'),
                other;

            tv._forSomeINode(function(iNode) {
                if (iNode._refCount) {
                    A.areEqual(node._iNode, iNode, 'only the one held should have a refCount');
                    A.areEqual(1, iNode._refCount, ' refCount should be 1');
                    A.areEqual(node, iNode._nodeInstance, ' node instance should point to node')
                }
            });
            other = tv.getNodeBy(LABEL, 'label-1-1');
            A.areSame(node, other, 'two reference should return the same node instance');
            tv._forSomeINode(function(iNode) {
                if (iNode._refCount) {
                    A.areEqual(other._iNode, iNode, 'only the one held should have a refCount');
                    A.areEqual(2, iNode._refCount, ' refCount should be 1');
                    A.areEqual(other, iNode._nodeInstance, ' node instance should point to node')
                }
            });


            other.release();
            tv._forSomeINode(function(iNode) {
                if (iNode._refCount) {
                    A.areEqual(other._iNode, iNode, 'released nodes will still point to an iNode if there is another reference');
                    A.areEqual(1, iNode._refCount, ' refCount should be 1');
                }
            });
            node.release();
            tv._forSomeINode(function(iNode) {
                A.isNull(other._iNode, 'fully released nodes should not point to an iNode');
                A.areEqual(0, iNode._refCount || 0, 'now all nodes have been released');
            });
        },
        'Test multiple types': function () {
            Y.TN1 = Y.Base.create(
                'test-node-1',
                Y.FlyweightTreeNode,
                [],
                {}
            );
            var TN2 = Y.Base.create(
                'test-node-2',
                Y.FlyweightTreeNode,
                [],
                {}
            );
            tv = new TV({tree: [
                {
                    label: 'TN1',
                    type: 'TN1',
                    children: [
                        {
                            label: 'TN2',
                            type: TN2
                        },
                        'DT',
                        {
                            label:'TN1',
                            type: 'TN1'
                        }
                    ]
                },
                {
                    label: 'TN2',
                    type: TN2,
                    children: [
                        {
                            label: 'TN1',
                            type: Y.TN1
                        },
                        'DT'
                    ]
                }
            ]}).render('#container');
            tv.forSomeNodes(function (node) {
                switch (node.get(LABEL)) {
                    case 'TN1':
                        A.isTrue(node instanceof Y.TN1, 'wrong type 1');
                        break;
                    case 'TN2':
                        A.isTrue(node instanceof TN2, 'wrong type 2');
                        break;
                    case 'DT':
                        A.isTrue(node instanceof Y.FlyweightTreeNode, 'wrong type defult');
                        break;
                    default:
                        A.fail('there shouldn\'t be any other type of node');

                }
            });
            A.areEqual(2, tv._pool['test-node-1'].length,'There should be 1 TN1');
            A.areEqual(1, tv._pool['test-node-2'].length,'There should be 1 TN2');
            A.areEqual(1, tv._pool._default.length,'There should be 1 default');
        },
        'Test _domEvents': function () {
            var worked = false,
                TN = Y.Base.create(
                    'test-node',
                    Y.FlyweightTreeNode,
                    [],
                    {
                        initializer: function () {
                            this._root._domEvents = ['click'];
                            this._handle = this.after('click', this._afterClick);
                        },
                        destructor: function () {
                            this._handle.detach();
                        },
                        _afterClick: function (ev) {
                            A.isFalse(worked, 'after click should be called only once');
                            worked = true;
                            A.areEqual('click', ev.domEvent.type, 'event type should be click');
                            A.areSame(el, ev.domEvent.target, 'target should be the element?');
                            A.areSame(this, ev.target, 'The target should be this same node');
                        }
                    }
                ),
                el;
            tv = new TV({
                tree: [
                    'label-0',
                    'label-1'
                ],
                defaultType:TN
            });
            tv.render('#container');
            el  = Y.one('.' + Y.FlyweightTreeNode.CNAMES.CNAME_CONTENT);
            el.simulate('click');
            A.isTrue(worked, 'event should have been fired');
            el = tv.get('contentBox');
            el.simulate('click')
        },
        _should: {
            error: {
                'node with no name': "Node contains unknown type",
                'node with bad node type string':'Missing node class: Y.asdf'
            }
        },
        'node with no name': function () {

            var TN = Y.Base.create(
                    // No NAME, it should produce an error.
                    '',
                    Y.FlyweightTreeNode,
                    [],
                    {}
                );
            tv = new TV({
                tree: [
                    {
                        label:'label-0',
                        type: TN
                    }
                ]
            });

            // this should throw an error
            tv.render('#container');
        },
        'node with bad node type string': function () {

            tv = new TV({
                tree: [
                    {
                        label:'label-0',
                        type: 'asdf'
                    }
                ]
            });

            tv.render('#container');
        },
        'return to unknown pool': function () {

            var TN = Y.Base.create(
                    'some-pool',
                    Y.FlyweightTreeNode,
                    [],
                    {}
                ),
                TNBad = Y.Base.create(
                    'whatever',
                    Y.FlyweightTreeNode,
                    [],
                    {}
                ),
                node;
            tv = new TV({
                tree: [
                    {
                        label:'label-0',
                        type: TN
                    },
                    'label-1'
                ]
            });

            tv.render('#container');
            A.areEqual(1,tv._pool['some-pool'].length,'there should be one item in the pool');
            node = tv.getNodeBy(LABEL, 'label-0');
            node._iNode.type = TNBad;
            node.release();
            A.areEqual(0,tv._pool['some-pool'].length,'the node should have not returned to the pool');
        },
        'change label': function () {
            tv = buildTree(2,2);
            var node = tv.getNodeBy(LABEL, 'label-1-1'),
                el = Y.one('#' + node.get('id') + ' .' + Y.FlyweightTreeNode.CNAMES.CNAME_CONTENT);
            A.areEqual(el.getHTML(), node.get(LABEL), 'check the label is in place');
            node.set(LABEL, 'whatever');
            A.areEqual('whatever', el.getHTML(), 'check the label has changed');
        },
        'test loop quit': function () {
            tv = buildTree(2,2);
            var count = 0;
            tv._forSomeINode(function () {
                count += 1;
            });
            A.areEqual(14,count, 'number of nodes on the tree');
            count = 0;
            tv._forSomeINode(function (iNode) {
                count +=1;
                return iNode.label === 'label-1';
            });
            A.areEqual(8,count, 'number of nodes until quit');
        },
        'test various focus set': function () {
            tv = buildTree(2,2);

            var node = tv.getNodeBy(LABEL,'label-1'),
                other,
                FN = 'focusedNode';

            tv.set(FN, node);
            node.release();
            node = tv.get(FN);
            A.areEqual('label-1',node.get(LABEL), 'label-1 should have received the focus');
            node.release();

            tv.set(FN,Y.Base);
            node = tv.get(FN);
            A.areEqual('label-1',node.get(LABEL), 'label-1 should still have received the focus');
            node.release();

            tv.set(FN,null);
            node = tv.get(FN);
            A.areEqual('label-0', node.get(LABEL), 'label-0 should have received the focus');
            node.release();

            node = tv.getNodeBy(LABEL, 'label-1');
            node.focus();
            other = tv.get(FN);
            A.areEqual('label-1',other.get(LABEL), 'label-1 should have received the focus again');
            other.release();

            node.blur();
            other = tv.get(FN);
            A.areEqual('label-0', other.get(LABEL), 'label-0 should have received the focus again');


            other.release();
            node.release();
        },
        'test various expansion methods': function () {
            tv = buildTree(2,2, false);
            var node = tv.getNodeBy(LABEL,'label-1'),
                X = 'expanded';



            tv.forSomeNodes(function (node) {
               A.isFalse(node.get(X), 'all nodes should be collapsed ');
            });

            node.toggle();
            tv.forSomeNodes(function (node) {
               A.isTrue(node.get(LABEL) === 'label-1' || !node.get(X), 'after toggling label-1 ');
            });

            node.toggle();
            tv.forSomeNodes(function (node) {
               A.isFalse(node.get(X), 'back to all collapsed ') ;
            });

            node.expand();
            tv.forSomeNodes(function (node) {
               A.isTrue(node.get(LABEL) === 'label-1' || !node.get(X), 'after expanding label-1 ');
            });

            node.collapse();
            tv.forSomeNodes(function (node) {
               A.isFalse(node.get(X), 'again, all collapsed ') ;
            });

            node.release();

            node = tv.getNodeBy(LABEL, 'label-1-1');
            node.expand();
            node.release();
            tv.destroy();
            tv = new TV({tree:[
               {
                    label: 'label-0',
                    expanded: false,
                    children: [
                        'label-0-0',
                        'label-0-1',
                        'label-0-2'
                    ]
                },
                'label-1',
                'label-2'
            ]});
            node = tv.getNodeBy(LABEL,'label-0');
            node.expand();
            node.release();

        },
        'going up': function () {
            tv = buildTree(3,3, false);

            var node = tv.getNodeBy(LABEL,'label-2-2'),
                other;

            other = node.getParent();
            A.areEqual('label-2', other.get(LABEL),'label-2 is parent to label-2-2');
            A.isFalse(other.isRoot(), 'label-2 should not be the root');
            node.release();
            node = other.getParent();
            A.isTrue(node.isRoot(), ' the parent of label-2 should be the root');
            other.release();

            node.release();

        },
        'next and previous on single children': function () {
            tv = new TV({tree:['label']}).render('#container');

            var node = tv.getNodeBy(LABEL,'label'),
                other;

            other = node.getNextSibling();
            A.isNull(other,'single child has no next');
            other = node.getPreviousSibling();
            A.isNull(other,'single child has no previous');

            node.release();

        },
        'setting the id': function () {
            tv = new TV({tree:['label-1', {label:'label-2',id:'abc'}]});
            var node = tv.getNodeBy(LABEL, 'label-1'),
                id = node.get(ID);
            A.areEqual('yui_3', id.substr(0,5),'id should get a "yui_3" prefix');
            node.release();

            node = tv.getNodeBy(LABEL, 'label-2');
            A.areEqual('abc', node.get(ID), 'id should be abc');
            node.set(ID, 'def');
            A.areEqual('def', node.get(ID), 'id should now be def');
            tv.render('#container');
            node.set(ID,'ghi');
            A.areEqual('def', node.get(ID), 'id should still be def');
            A.isNotNull(Y.one('#' + 'def'), 'node should have rendered with id: def');
            A.isNotNull(Y.one('#' + id), 'node should have rendered with id: ' + id);
            node.release();
        },
        'confusing the tree': function () {
            tv = buildTree(3,3, true);

            var node = tv.getNodeBy(LABEL,'label-2-2'),
                oldId = node._iNode.id,
                el = Y.one('#' + node._iNode.id + ' .' + Y.FlyweightTreeNode.CNAMES.CNAME_CONTENT);

            node.set(LABEL,'qwe');
            A.areEqual('qwe',el.getHTML(),'label should have been changed');

            // confuse the manager (id mismatch)
            node._iNode.id = 'abc';
            node.set(LABEL,'xyz');
            A.areEqual('qwe',el.getHTML(),'label should have remained the same');
            node.set(LABEL,'qwe');

            A.isNull(tv._findINodeByElement(el),'with the mismatch, it cannot find it');

            // restore the id
            node._iNode.id = oldId;

            node.set(LABEL,'xyz');
            A.areEqual('xyz',el.getHTML(),'label should have changed again');

            // more confusion, droo the CSS className that helps locate it.
            el.removeClass(Y.FlyweightTreeNode.CNAMES.CNAME_CONTENT);
            node.set(LABEL,'qwe');
            A.areEqual('xyz',el.getHTML(),'could not find it');

            node.release();

        }
    }));
    Y.Test.Runner.add(suite);

},'', { requires: ['gallery-flyweight-tree', 'test', 'base-build', 'node-event-simulate' ] });

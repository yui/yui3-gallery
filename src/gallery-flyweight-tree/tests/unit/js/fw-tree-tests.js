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
        'test node pools': function () {
            var tv = new TV({tree:[
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
            A.areEqual(2, tv._pool._default.length,'The tree is fully expanded, 1 for the node being expanded, one for the children');
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
            tv.destroy();
        },
        'Test dynamic Loading': function () {
            var node, other, tv = new TV({
                tree: [
                    'label-0',
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
            tv.destroy();
        },
        'Test focused node gets expanded': function () {

            var tv = buildTree(3,4, false);
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
            tv.destroy();

        },
        'Requesting a held node should return the same reference': function () {
            var tv = buildTree(2,2),
                node = tv.getNodeBy(LABEL, 'label-1'),
                other = tv.getNodeBy(LABEL, 'label-1');

            A.areSame(node, other, 'Node references should be the same');
            node.release();
            other.release();
            tv.destroy();
        },
        'is depth correct': function () {
            var tv = buildTree(4,2);
            tv.forSomeNodes(function(node, depth) {
                A.areEqual(depth, node.get('depth'), 'depth should be equal: ' + node.get(LABEL));
            });
            tv._forSomeINode(function (iNode, depth) {
                var node = tv._poolFetch(iNode);
                A.areEqual(depth, node.get('depth'), 'depths should match: ' + iNode.label);
                node.release();
            });
            tv.destroy();

        },
        'Does hold end release work?': function () {
            var tv = buildTree(2,2),
                node = tv.getNodeBy(LABEL, 'label-1-1'),
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
            tv.destroy();
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
            var tv = new TV({tree: [
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

            tv.destroy();
        }
    }));
	Y.Test.Runner.add(suite);

},'', { requires: ['gallery-flyweight-tree', 'test', 'base-build', 'node-event-simulate' ] });

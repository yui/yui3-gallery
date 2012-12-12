YUI.add('treeview-tests', function(Y) {
    var A = Y.Assert,
        TV = Y.FWTreeView,
        SELECTED = 'selected',
        EXPANDED = 'expanded',
        LABEL = 'label',
        ID = 'id',

        buildTree = function (levels, width, expanded) {
             var build = function (prefix, depth) {

                 var i, branch = [];

                 for (i = 0; i < width; i += 1) {
                     branch[i] = {label: prefix + '-' + i};
                     if (expanded !== undefined) {
                         branch[i].expanded = expanded;
                     }
                     if (depth < levels -1) {
                         branch[i].children = build(prefix + '-' + i, depth + 1);
                     }
                 }
                 return branch;
             };
             return build('label', 0);
        },
        treeDef = buildTree(3,3,false),

        suite = new Y.Test.Suite("FWTreeView Test Suite");

    suite.add(new Y.Test.Case({
        name: "FWTreeView",
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
        'Test selection': function () {
            var tv,
                check = function (which) {
                    tv.forSomeNodes(function (node) {
                        A.areEqual(parseInt(node.get(LABEL),10), node.get(SELECTED), which + ': ' + node.get(ID));
                    });
                },
                build = function(tree) {
                    tv = (new TV({tree:tree})).render('#container');

                },
                buildAndCheck = function(which, tree) {
                    build(tree);
                    check(which);
                    tv.destroy();
                };

            buildAndCheck('silly test not selected', [
                {
                    id:'a',
                    label:0
                }
            ]);

            buildAndCheck('silly test selected',[
                {
                    id:'a',
                    label: 2,
                    selected:true
                }
            ]);
            build([
                {
                    id:'a',
                    label:0,
                    children: [
                        {
                            id:'b',
                            label: 0
                        }
                    ]
                }
            ]);
            check('initially all off');
            tv.getNodeBy(ID,'b').set(SELECTED,true).set(LABEL, 2).release();
            tv.getNodeBy(ID,'a').set(LABEL, 2).release();
            check('selection should have moved up');
            tv.destroy();
        },
        'test a node type with no label': function () {
            var TVNoLabel = Y.Base.create(
                    'no-label-node',
                    Y.FWTreeNode,
                    [ ],
                    { },
                    {
                        INNER_TEMPLATE: '<div tabIndex="{tabIndex}" class="{CNAME_CONTENT}"><div class="{CNAME_TOGGLE}"></div>' +
                                        '<div class="{CNAME_BAD_LABEL}" role="link">{label}</div></div>'

                    }
                ), tv = new TV({
                    tree: [
                        {
                            label: 'abc',
                            type: TVNoLabel
                        },{
                            label: 'def',
                            type: TVNoLabel
                        }
                    ]
                });
            tv.render('#container');
            var node = tv.getNodeBy(LABEL,'abc');
            node.set(LABEL,'123');
            A.areEqual('123', node.get(LABEL));
            node.release();
            tv.destroy();



        },
        'Test some clicking': function () {
            var tv = new TV({tree: treeDef}),
                node = tv.getNodeBy(LABEL, 'label-1-1'),
                el;

            tv.render('#container');
            tv.set('focusedNode', node);

            A.isFalse(node.get(EXPANDED), 'node should not be expanded yet');
            el = Y.one('#' + node.get(ID) + ' .' + Y.FWTreeNode.CNAMES.CNAME_TOGGLE);
            el.simulate('click');
            A.isTrue(node.get(EXPANDED), 'node should be expanded');

            el.simulate('click');
            A.isFalse(node.get(EXPANDED), 'node should not be expanded');

            A.areEqual(0, node.get(SELECTED), 'node should not be selected');
            el = Y.one('#' + node.get(ID) + ' .' + Y.FWTreeNode.CNAMES.CNAME_SELECTION);
            el.simulate('click');
            A.areEqual(2, node.get(SELECTED), 'node should now be selected');


            el = Y.one('#' + node.get(ID) + ' .' + Y.FWTreeNode.CNAMES.CNAME_LABEL);
            el.simulate('click');
            A.areEqual(2, node.get(SELECTED), 'clicking on the label should not change anything');
            A.isFalse(node.get(EXPANDED), 'clicking on the label should not change anything');

            tv.set('toggleOnLabelClick', true);
            el.simulate('click');
            A.isTrue(node.get(EXPANDED), 'with toggleOnLabelClick set, it should expand');

            el = Y.one('#' + node.get(ID) + ' .' + Y.FWTreeNode.CNAMES.CNAME_ICON);
            el.simulate('click');
            A.isFalse(node.get(EXPANDED), 'clicking on the label should not change anything');

            tv.set('toggleOnLabelClick', true);
            el.simulate('click');
            A.isTrue(node.get(EXPANDED), 'with toggleOnLabelClick set, it should expand');

            el = Y.one('#' + node.get(ID) + ' .' + Y.FWTreeNode.CNAMES.CNAME_CONTENT);
            el.simulate('click');
            A.isTrue(node.get(EXPANDED), 'with toggleOnLabelClick set, it should expand');
            A.areEqual(2, node.get(SELECTED), 'clicking on the label should not change anything');

            node.release();
            tv.destroy();
        },

        'Test focused node gets expanded': function () {

            var tv = new TV({tree: treeDef});
            tv.render('#container');
            tv.forSomeNodes(function (node) {
                A.isFalse(node.hasChildren() && node.get(EXPANDED), 'All nodes should be collapsed:' + node.get(LABEL));
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
                        A.isTrue(node.get(EXPANDED), 'Ancestors of ' + label + ' should be expanded: ' + node.get(LABEL));
                    } else {
                        A.isFalse(node.hasChildren() && node.get(EXPANDED), 'Only the ancestors of ' + label + ' should be expanded:' + node.get(LABEL));
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
            var tv = new TV({tree:treeDef}),
                node = tv.getNodeBy(LABEL, 'label-1'),
                other = tv.getNodeBy(LABEL, 'label-1');

            A.areSame(node, other, 'Node references should be the same');
            node.release();
            other.release();
            tv.destroy();
        },
        'test toggle Selection' : function () {
            var tv = new TV({tree: treeDef});
            tv.render('#container');
            var node = tv.getNodeBy(LABEL, 'label-1');
            A.areEqual(0,node.get(SELECTED), 'node should start unselected');
            node.toggleSelection();
            A.areEqual(2,node.get(SELECTED), 'node should now be selected');
            node.toggleSelection();
            A.areEqual(0,node.get(SELECTED), 'node should now be unselected');
            node.toggleSelection();
            A.areEqual(2,node.get(SELECTED), 'node should now be selected again');
            A.isTrue(node.get('propagateUp'),'propagateUp should be enabled');
            A.isTrue(node.get('propagateDown'),'propagateDown should be enabled');
            node.set('selectionEnabled', false);
            A.isNull(node.get(SELECTED), 'When selection is not enabled it should return null');
            A.isFalse(node.get('propagateUp'),'propagateUp should be disabled (disabled nodes do not propagete)');
            A.isFalse(node.get('propagateDown'),'propagateDown should be disabled (disabled nodes do not propagete)');
            node.toggleSelection();
            A.isNull(node.get(SELECTED), 'even when toggled');
            A.areEqual(0,node._iNode[SELECTED], 'Internally it should really change');
            var el = Y.one('#' + node.get(ID) + ' .' + Y.FWTreeNode.CNAMES.CNAME_SELECTION);
            el.simulate('click');
            A.isNull(node.get(SELECTED), 'even when toggled');
            node.set('selectionEnabled', true);
            A.areEqual(2,node.get(SELECTED), 'node should be selected again as before');
            node.toggleSelection();
            A.areEqual(0,node.get(SELECTED), 'selection should toggle as before');

            tv.destroy();

        },
        'testing initial values': function () {
            var oneTest = function (which) {
                var TVNoSelection = Y.Base.create(
                    'no-selection-node',
                    Y.FWTreeNode,
                    [ ],
                    { },
                    {
                        ATTRS: {
                            selectionEnabled: {
                                value: which
                            },
                            propagateUp: {
                                value: which
                            },
                            propagateDown: {
                                value: which
                            },
                            expanded: {
                                value: which
                            }
                        }
                    }
                ),
                tv = new TV({
                     tree: buildTree(3,3),
                     defaultType: TVNoSelection
                });
                tv.render('#container');
                tv.forSomeNodes(function (node) {
                    A.areEqual(which,node.get('selectionEnabled'),which + ' selectionEnabled failed: ' + node.get(LABEL));
                    A.areEqual(which,node.get('propagateUp'),which + ' propagateUp failed: ' + node.get(LABEL));
                    A.areEqual(which,node.get('propagateDown'),which + ' propagateDown failed: ' + node.get(LABEL));
                    A.areEqual(which,node.get(EXPANDED),which + ' expanded failed: ' + node.get(LABEL));
                });
                tv.destroy();
            };
            oneTest(true);
            oneTest(false);
        },
        'Moving around with the keys': function () {

            var tv = new TV({tree: treeDef});
            tv.render('#container');
            var cbx = tv.get('contentBox'),
                enterPressed = false,
                press = function (key) {
                    cbx.simulate('keydown', {keyCode: key});
                },
                is = function (label, step) {
                    var node = tv.get('focusedNode');
                    A.areEqual('label-' + label, node.get('label'), step + ' Should have moved to: ' + label);
                    node.release();
                },
                test = function (key, label, step) {
                    press(key);
                    is(label, step);
                },
                expanded = function (state, step) {
                    var node = tv.get('focusedNode');
                    A.areEqual(state, node.get(EXPANDED), 'Should be expanded?: ' + step);
                    node.release();
                },
                selected = function (state, step) {
                    var node = tv.get('focusedNode');
                    A.areEqual(state, node.get('selected'), 'Should be selected?: ' + step);
                    node.release();
                },

                node = tv.getNodeBy(LABEL, 'label-1');
            tv.set('focusedNode', node);
            node.release();

            test(38, '0',1); // up
            test(38, '0',2); // up (shouldn't move)
            test(40, '1',3); // down
            test(40, '2',4); // down
            test(40, '2',5); // down (shouldn't move)
            test(36, '0',6); // home
            expanded(false,6);
            test(39, '0',7); // right, first press should expand
            expanded(true,7);
            test(39, '0-0',8); // right, second press should move
            expanded(false,8);
            test(39, '0-0',9);
            expanded(true,9);
            test(39, '0-0-0',10); // right
            test(40, '0-0-1',11); // down
            test(40, '0-0-2',12); // down
            test(40, '0-1',13); // down
            test(40, '0-2',14); // down
            test(40, '1',15); // down
            test(40, '2',16); // down
            test(106, '2',17); // * (expand all);
            test(39, '2-0',18);
            expanded(true,18);
            test(39, '2-0-0',19);
            test(39, '2-0-0',19); // right: shouldn't have moved
            test(40, '2-0-1',20);
            test(37, '2-0',21); // left
            expanded(true,21);
            test(37, '2-0',22); // left
            expanded(false,22);
            test(37, '2',23); // left
            expanded(true,23);
            test(37, '2',24); // left
            expanded(false,24);
            test(37, '2',24.5); // left (shouldn't have moved)'
            test(36, '0',25); // home
            test(35, '2',26); //end
            test(38, '1-2-2',27); //up
            test(37, '1-2',28); // left
            selected(false,28);
            test(32, '1-2',29); // space bar
            selected(2,29);
            test(39, '1-2-0',30); // right
            selected(2,30);
            test(38, '1-2',31); //up
            test(37, '1-2',32); // left
            test(37, '1',33); // left
            selected(1,33);
            test(38,'0-2-2',34);
            selected(0,35);

            tv.after('enterkey', function (ev) {
                A.areEqual('label-0-2-2', ev.node.get(LABEL), 'Label on enter');
                enterPressed = true;
            });
            A.isFalse(enterPressed, 'before enter key');
            test(13,'0-2-2',34) //enter
            A.isTrue(enterPressed, 'after enter key');
            test(65, '0-2-2',35);  // nothing special should happen with any other key


            tv.destroy();
        },

        'doing things in an empty tree': function () {
            var tv = new TV({tree: []}),
                cbx = tv.get('contentBox'),
                press = function (key) {
                    cbx.simulate('keydown', {keyCode: key});
                };
            tv.render('#container');
            press(13); // enter
            press(32); // spacebar
            press(35); //end
            press(36); // home
            press(37); // left
            press(38); // up
            press(39); //right
            press(40); // down
            tv.expandAll();
            tv.collapseAll();
            tv.forSomeNodes(function(node) {
               A.fail('shouldn\'t be here: ' + node.get('label'));
            });
            tv.destroy();
        }
    }));
	Y.Test.Runner.add(suite);

},'', { requires: ['gallery-fwt-treeview', 'test', 'base-build', 'node-event-simulate' ] });

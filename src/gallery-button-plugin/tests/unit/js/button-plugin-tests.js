YUI.add('button-plugin-tests', function(Y) {
    var A = Y.Assert,
        SELECTED = 'selected',
        BP = Y.ButtonPlugin,
        addToggles = BP.addToggles,
        btn, group,
        container = Y.one('#container'),
        suite = new Y.Test.Suite("FWTreeView Test Suite");

    suite.add(new Y.Test.Case({
        name: "FWTreeView",
        'Test basic toggling': function () {
            container.setHTML('<button class="yui3-button-toggle">press</button>');
            btn = container.one('button');
            A.isUndefined(btn.get(SELECTED), 'before pluging in there should be no selected attribute');
            addToggles();
            A.isFalse(btn.get(SELECTED), 'after pluging in it should be false');
            btn.remove(true);


            container.setHTML('<button class="yui3-button-toggle yui3-button-selected">press</button>');
            btn = container.one('button');
            A.isUndefined(btn.get(SELECTED), 'before pluging in there should be no selected attribute');

            addToggles(btn);

            A.isTrue(btn.get(SELECTED), 'after pluging in it should be true');

            btn.simulate('click');
            A.isFalse(btn.get(SELECTED), 'after clicking in it should be false');
            A.isFalse(btn.hasClass('yui3-button-selected'), 'should no longer have the selected className');
            A.isNull(btn.get('aria-pressed'), 'should not have aria-pressed=true');

            btn.simulate('click');
            A.isTrue(btn.get(SELECTED), 'after clicking in it once again should be True');
            A.isTrue(btn.hasClass('yui3-button-selected'), 'should now have the selected className');
            A.areEqual('true', btn.get('aria-pressed'), 'should now have aria-pressed=true');

            btn.remove(true);


        },
        'test group': function () {
            container.setHTML(
                '<div class="yui3-button-group-exclusive">' +
                    '<button id="a" class="yui3-button-toggle">press</button>' +
                    '<button id="b" class="yui3-button-toggle  yui3-button-selected">press</button>' +
                '</div>'
            );
            group = container.one('div');
            A.isUndefined(group.get(SELECTED), 'group before toggle should be undefined');
            addToggles();
            btn = container.one('#b');
            A.areSame(btn, group.get(SELECTED), 'now, button b should be selected');
            A.isTrue(btn.get(SELECTED), 'button b should agree');
            btn = container.one('#a');
            A.isFalse(btn.get(SELECTED), 'button a should not be selected');
            btn.simulate('click');
            A.isTrue(btn.get(SELECTED), 'button a should not be selected');
            A.areSame(btn, group.get(SELECTED), 'now, button a should be selected');
            A.isFalse(container.one('#b').get(SELECTED), 'button b should not be selected');
            container.empty();
        },
        'alternative classnames': function () {
            container.setHTML(
                '<div class="exclusive">' +
                    '<button id="a" class="toggle">press</button>' +
                    '<button id="b" class="toggle selected">press</button>' +
                '</div>'
            );
            group = container.one('div');
            A.isUndefined(group.get(SELECTED), 'group before toggle should be undefined');
            addToggles(container, {
                C_TOGGLE:'toggle',
                C_SELECTED:'selected',
                C_EXCLUSIVE:'exclusive'
            });
            btn = container.one('#b');
            A.areSame(btn, group.get(SELECTED), 'now, button b should be selected');
            A.isTrue(btn.get(SELECTED), 'button b should agree');
            btn = container.one('#a');
            A.isFalse(btn.get(SELECTED), 'button a should not be selected');
            btn.simulate('click');
            A.isTrue(btn.get(SELECTED), 'button a should not be selected');
            A.areSame(btn, group.get(SELECTED), 'now, button a should be selected');
            A.isFalse(container.one('#b').get(SELECTED), 'button b should not be selected');
            container.empty();
        },
        'more alternative classnames': function () {
            container.setHTML(
                '<div class="exclusive">' +
                    '<button id="a" class="toggle unselected">press</button>' +
                    '<button id="b" class="toggle ">press</button>' +
                '</div>'
            );
            group = container.one('div');
            A.isUndefined(group.get(SELECTED), 'group before toggle should be undefined');
            BP.C_TOGGLE='toggle';
            BP.C_SELECTED='';
            BP.C_NOT_SELECTED='unselected';
            BP.C_EXCLUSIVE='exclusive';

            addToggles();
            btn = container.one('#b');
            A.areSame(btn, group.get(SELECTED), 'now, button b should be selected');
            A.isTrue(btn.get(SELECTED), 'button b should agree');
            btn = container.one('#a');
            A.isFalse(btn.get(SELECTED), 'button a should not be selected');
            btn.simulate('click');
            A.isTrue(btn.get(SELECTED), 'button a should not be selected');
            A.areSame(btn, group.get(SELECTED), 'now, button a should be selected');
            A.isFalse(container.one('#b').get(SELECTED), 'button b should not be selected');
            container.empty();
        }
    }));
	Y.Test.Runner.add(suite);

},'', { requires: ['gallery-button-plugin', 'test', 'base-build', 'node-event-simulate' ] });

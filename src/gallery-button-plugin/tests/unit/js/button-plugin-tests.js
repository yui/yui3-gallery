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
        tearDown: function () {
            container.empty();
        },
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
            A.isTrue(btn.get(SELECTED), 'button a should be selected');
            A.areSame(btn, group.get(SELECTED), 'now, button a should be selected');
            A.isFalse(container.one('#b').get(SELECTED), 'button b should not be selected');


            btn.simulate('click');
            A.isFalse(btn.get(SELECTED), 'button a should not be selected');
            A.isNull(group.get(SELECTED), 'now,no button should be selected');
            A.isFalse(container.one('#b').get(SELECTED), 'button b should not be selected either');
        },
        'test group 2': function () {
            container.setHTML(
                '<div class="yui3-button-group-exclusive">' +
                    '<button id="a" class="yui3-button-toggle">press</button>' +
                    '<button id="b" class="yui3-button-toggle  yui3-button-selected">press</button>' +
                '</div>'
            );
            group = container.one('div');
            A.isUndefined(group.get(SELECTED), 'group before toggle should be undefined');

            addToggles(group);

            btn = container.one('#b');
            A.areSame(btn, group.get(SELECTED), 'now, button b should be selected');
            A.isTrue(btn.get(SELECTED), 'button b should agree');
            btn = container.one('#a');
            A.isFalse(btn.get(SELECTED), 'button a should not be selected');

            btn.simulate('click');
            A.isTrue(btn.get(SELECTED), 'button a should not be selected');
            A.areSame(btn, group.get(SELECTED), 'now, button a should be selected');
            A.isFalse(container.one('#b').get(SELECTED), 'button b should not be selected');
        },
        'mixed group': function () {
            container.setHTML(
                '<div class="yui3-button-group-exclusive">' +
                    '<button id="a" class="yui3-button-toggle">press</button>' +
                    '<button id="b" class="yui3-button-toggle  yui3-button-selected">press</button>' +
                    '<button id="c">press</button>' +
                '</div>'
            );
            group = container.one('div');
            A.isUndefined(group.get(SELECTED), 'group before toggle should be undefined');

            var a = container.one('#a'),
                b = container.one('#b'),
                c = container.one('#c');

            addToggles();

            A.areSame(b, group.get(SELECTED), 'now, button b should be selected');
            A.isTrue(b.get(SELECTED), 'button b should agree');

            A.isFalse(a.get(SELECTED), 'button a should not be selected');

            a.simulate('click');
            A.areSame(a, group.get(SELECTED), 'now, button a should be selected');
            A.isTrue(a.get(SELECTED), 'button a should be selected');
            A.isFalse(b.get(SELECTED), 'button b should not be selected');
            A.isUndefined(c.get(SELECTED), 'button c should not have such property');

            c.simulate('click'); // nothing should change since c is not part of this
            A.areSame(a, group.get(SELECTED), 'now, button a should be selected');
            A.isTrue(a.get(SELECTED), 'button a should be selected');
            A.isFalse(b.get(SELECTED), 'button b should not be selected');
            A.isUndefined(c.get(SELECTED), 'button c should not have such property');


            a.simulate('click');
            A.isNull(group.get(SELECTED), 'now,no button should be selected');
            A.isFalse(a.get(SELECTED), 'button a should not be selected');
            A.isFalse(b.get(SELECTED), 'button b should not be selected either');
            A.isUndefined(c.get(SELECTED), 'button c should not have such property');

            c.simulate('click'); // nothing should change since c is not part of this
            A.isNull(group.get(SELECTED), 'now,no button should be selected');
            A.isFalse(a.get(SELECTED), 'button a should not be selected');
            A.isFalse(b.get(SELECTED), 'button b should not be selected either');
            A.isUndefined(c.get(SELECTED), 'button c should not have such property');
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
        },
        'missing classnames': function () {
            container.setHTML(
                '<div class="exclusive">' +
                    '<button id="a" class="toggle">press</button>' +
                    '<button id="b" class="toggle selected">press</button>' +
                '</div>'
            );
            group = container.one('div');
            A.isUndefined(group.get(SELECTED), 'group before toggle should be undefined');

            BP.C_SELECTED='';
            BP.C_NOT_SELECTED='';
            addToggles(container, {
                C_TOGGLE:'toggle',
                C_SELECTED:'',
                C_EXCLUSIVE:'exclusive'
            });

            btn = container.one('#b');
            A.isNull(group.get(SELECTED), 'Nothing is selected');
            A.isFalse(btn.get(SELECTED), 'button b should not be selected');
            btn = container.one('#a');
            A.isFalse(btn.get(SELECTED), 'button a should not be selected');

            btn.simulate('click');
            A.isTrue(btn.get(SELECTED), 'button a should not be selected');
            A.areSame(btn, group.get(SELECTED), 'now, button a should be selected');
            A.isFalse(container.one('#b').get(SELECTED), 'button b should not be selected');
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
        },
        'check it does not interfere with dropdowns': function () {
            container.setHTML(
                '<select id="sel">' +
                    '<option value="1">1</option>' +
                    '<option value="2" selected>2</option>' +
                    '<option value="3">3</option>' +
                '</select>'
            );
            addToggles();
            var el = container.one('#sel');
            A.areEqual('2', el.get('value'), 'item with value="2" should be selected');
            A.areEqual(1,el.get('selectedIndex'), ' should have index 2');
            el.set('selectedIndex',2);
            A.areEqual('3', el.get('value'), 'now item with value="3" should be selected');
            el.one('option').set('selected', true);
            A.areEqual('1', el.get('value'), 'now item with value="1" should be selected');

        }
    }));
	Y.Test.Runner.add(suite);

},'', { requires: ['gallery-button-plugin', 'test', 'base-build', 'node-event-simulate' ] });

YUI().use('gallery-icello-button', 'node-event-simulate', function (Y) {
    'use strict';

    var CSS = {
            DISABLED: 'yui3-icello-button-disabled',
            VIEW_TYPES: {
                ICON_ONLY: 'yui3-icello-button-icononly',
                LABEL_ONLY: 'yui3-icello-button-labelonly',
                ICON_WITH_LABEL: 'yui3-icello-button-iconwithlabel'
            }
        },
        Button = Y.Icello.Button;

    Y.on('domready', function (e) {
        Y.log('', 'info', 'domready');

        module('getNode tests');
        test('no icon and text should throw an exception', 3, function () {
            var btn = null;

            try {
                step(1, 'step 1: call "getNode" with no "icon" nor "label" set');
                btn = Button.getNode({});
            } catch (e) {
                step(2, 'step 2: catch exception and confirm "IconOrLabelNotDefinedButtonException"');
                equal(e.name, 'IconAndLabelNotDefinedButtonException', '"e.name" should equal "IconOrLabelNotDefinedButtonException"');
            }

        });
        test('no icon and label with only spaces should throw an exception', 3, function () {
            var btn = null;

            try {
                step(1, 'step 1: call "getNode" with no "icon" and "label" with only spaces');
                btn = Button.getNode({ label: '  ' });
            } catch (e) {
                step(2, 'step 2: catch exception and confirm "IconOrLabelNotDefinedButtonException"');
                equal(e.name, 'IconAndLabelNotDefinedButtonException', '"e.name" should equal "IconOrLabelNotDefinedButtonException"');
            }
        });
        test('"click" event should only fire when button is enabled', 4, function () {
            var btn = Button.getNode({ label: 'Test Disabled Change', disabled: true });
            btn.on('click', function (e) {
                e.preventDefault();
                step(4, 'step 4: custom click handler that should only be called if button is enabled');
                btn.destroy();
            });

            step(1, 'step 1: simulate clicking button while it is disabled');
            btn.simulate('click');

            step(2, 'step 2: call "enable()"');
            btn.enable();

            step(3, 'step 3: simulate clicking button while it is enabled');
            btn.simulate('click');
        });
        test('icon property only set should have icon only in node', 3, function () {
            step(1, 'step 1: get node with icon only');
            var btn = Button.getNode({ icon: Button.ICONS.ALERT });

            step(2, 'step 2: confirm that "icon only"css class is in node');
            ok(btn.hasClass(CSS.VIEW_TYPES.ICON_ONLY), '"CSS.VIEW_TYPES.ICON_ONLY" should be in btn');

            btn.destroy();
        });
        test('label property only set should have label only in node', 3, function () {
            step(1, 'step 1: get node with label only');
            var btn = Button.getNode({ label: 'Label Only' });

            step(2, 'step 2: confirm that "CSS.VIEW_TYPES.LABEL_ONLY" css class is in node');
            ok(btn.hasClass(CSS.VIEW_TYPES.LABEL_ONLY), '"CSS.VIEW_TYPES.LABEL_ONLY" should be in btn');

            btn.destroy();
        });
        test('icon with label set should have icon with label in node', 3, function () {
            step(1, 'step 1: get node with icon and label');
            var btn = Button.getNode({icon: Button.ICONS.ALERT, label: 'icon with label' });

            step(2, 'step 2: confirm that "CSS.VIEW_TYPES.ICON_WITH_LABEL" css class is in node');
            ok(btn.hasClass(CSS.VIEW_TYPES.ICON_WITH_LABEL), '"CSS.VIEW_TYPES.ICON_WITH_LABEL" should be in btn');

            btn.destroy();
        });
        test('calling "enable" "disable" should affect node', 8, function () {
            var node = Button.getNode({ label: 'Search', title: 'Search Rows' });

            equal(node.get('disabled'), false, '"node" should start off "disabled" "false"');
            ok(!node.hasClass(CSS.DISABLED), '"node" should start off not having css disabled');

            step(1, 'step 1: call "disable()"');
            node.disable();

            equal(node.get('disabled'), true, '"node" should now have "disabled" "true"');
            ok(node.hasClass(CSS.DISABLED), '"node" should now have css disabled');

            step(2, 'step 2: call "enable()"');
            node.enable();

            equal(node.get('disabled'), false, '"node" should now have "disabled" "false"');
            ok(!node.hasClass(CSS.DISABLED), '"node" should now not have css disabled');

            node.destroy();
        });
        test('passing "disabled" "true" should make node disabled', 2, function () {
            var node = Button.getNode({ label: 'Search', title: 'Search Rows', disabled: true });

            equal(node.get('disabled'), true, '"node" should have "disabled" "true"');
            ok(node.hasClass(CSS.DISABLED), '"node" should have css disabled');

            node.destroy();
        });
        test('with "id" should have "id" attribute', 1, function () {
            var node = Button.getNode({ label: 'Btn with id', id: 'btnSubmit' });

            equal(node.get('id'), 'btnSubmit', '"id" should equal "btnSubmit"');

            node.destroy();
        });
        test('button in memory node with label should only render label span', 2, function () {
            var btn = Button.getNode({ label: 'Button label only' }),
                spans = btn.all('span'),
                span = spans.item(0);

            equal(spans.size(), 1, '"spans.size()" should only equal 1');
            equal(span.getContent(), 'Button label only', '"span" "content" should equal "Button label only"');

            btn.destroy();
        });
        test('btnIconOnlyAlert in memory node should have 1 icon span with alert and 1 empty label span', 3, function () {
            var btn = Button.getNode({icon: 'alert'}),
                spans = btn.all('span'),
                spanIcon = spans.item(0),
                spanLabel = spans.item(1);

            equal(spans.size(), 2, '"spans.size()" should only equal 2');
            equal(spanIcon.getAttribute('class'), 'yui3-icello-button-icon yui3-icello-button-icon-alert', '"spanIcon" should have "icon" and "alert" css classes');
            equal(spanLabel.getContent(), '&nbsp;', '"spanLabel.getContent()" should equal "&nbsp;"');

            btn.destroy();
        });
        test('btnIconWithLabelCancel in memory node should have 1 icon span with cancel and 1 "Cancel" label span', 3, function () {
            var btn = Button.getNode({icon: 'cancel', label: 'Cancel'}),
                spans = btn.all('span'),
                spanIcon = spans.item(0),
                spanLabel = spans.item(1);

            equal(spans.size(), 2, '"spans.size()" should only equal 2');
            equal(spanIcon.getAttribute('class'), 'yui3-icello-button-icon yui3-icello-button-icon-cancel', '"spanIcon" should have "icon" and "cancel" css classes');
            equal(spanLabel.getContent(), 'Cancel', '"spanLabel.getContent()" should equal "Cancel"');

            btn.destroy();
        });
        test('cfg icon and label not altered', 2, function () {
            var cfg = {icon: 'alert', label: ' '},
                btn = Button.getNode(cfg);

            equal(cfg.icon, 'alert', '"cfg.icon" should remain equal to "alert"');
            equal(cfg.label, ' ', '"cfg.label" should remain equal to " "');

            btn.destroy();
        });

        module('renderNode tests');
        test('disabled button in html should be disabled in node attribute', 1, function () {
            var btn = Button.renderNode('#btnDisabled');

            equal(btn.get('disabled'), true, '"disabled" attribute should be true');

            btn.destroy();
        });
        test('button with html title should show up in node', 1, function () {
            var btn = Button.renderNode('#btnWithTitle');

            equal(btn.get('title'), 'My Title', '"btn" "title" should equal "My Title"');

            btn.destroy();
        });
        test('button with no attributes defined should not have attributes set in node', 3, function () {
            var btn = Button.renderNode(Y.one('.btn-with-no-attrs'));

            equal(btn.hasAttribute('id'), false, '"btn" should not have "id" attr');
            equal(btn.hasAttribute('title'), false, '"btn" should not have "title" attr');
            equal(btn.get('disabled'), false, '"btn" should not be disabled');

            btn.destroy();
        });
        test('button with label should only render label span', 2, function () {
            var btn = Button.renderNode('#btnLabelOnly'),
                spans = btn.all('span'),
                span = spans.item(0);

            equal(spans.size(), 1, '"spans.size()" should only equal 1');
            equal(span.getContent(), 'Button label only', '"span" "content" should equal "Button label only"');

            btn.destroy();
        });
        test('btnIconOnlyAlert should have 1 icon span with alert and 1 empty label span', 3, function () {
            var btn = Button.renderNode('#btnIconOnlyAlert'),
                spans = btn.all('span'),
                spanIcon = spans.item(0),
                spanLabel = spans.item(1);

            equal(spans.size(), 2, '"spans.size()" should only equal 2');
            equal(spanIcon.getAttribute('class'), 'yui3-icello-button-icon yui3-icello-button-icon-alert', '"spanIcon" should have "icon" and "alert" css classes');
            equal(spanLabel.getContent(), '&nbsp;', '"spanLabel.getContent()" should equal "&nbsp;"');

            btn.destroy();
        });
        test('btnIconWithLabelCancel should have 1 icon span with cancel and 1 "Cancel" label span', 3, function () {
            var btn = Button.renderNode('#btnIconWithLabelCancel'),
                spans = btn.all('span'),
                spanIcon = spans.item(0),
                spanLabel = spans.item(1);

            equal(spans.size(), 2, '"spans.size()" should only equal 2');
            equal(spanIcon.getAttribute('class'), 'yui3-icello-button-icon yui3-icello-button-icon-cancel', '"spanIcon" should have "icon" and "cancel" css classes');
            equal(spanLabel.getContent(), 'Cancel', '"spanLabel.getContent()" should equal "Cancel"');

            btn.destroy();
        });
    });
});
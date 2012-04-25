YUI().use('gallery-icello-button', 'node-event-simulate', function (Y) {
    Y.on('domready', function (e) {
        Y.log('', 'info', 'domready');
        
        var Button = Y.Icello.Button,
            hasClassIcon = function (btn, cssName) {
                var cb = btn.get('contentBox');
                var spanL = cb.all('span');
                var item = spanL.item(0);
                return item.hasClass(cssName);
            },
            hasClassCB = function (btn, cssName) {
                var cb = btn.get('contentBox');
                return cb.hasClass(cssName);
            };
        
        module('render tests');
        test('change "icon" property and calling "syncUI" should change dom icon', 6, function () {
            var btn = new Button({ icon: Button.ICONS.PLUS });
            btn.render('#mybox');

            step(1, 'step 1: change icon from "PLUS" to "MINUS"');
            btn.set('icon', Button.ICONS.MINUS);

            step(2, 'step 2: confirm that icon in dom is still "PLUS"');
            ok(hasClassIcon(btn, Button.ICONS.PLUS), 'before "syncUI" icon should be "PLUS"');

            step(3, 'step 3: call "syncUI"');
            btn.syncUI();

            step(4, 'step 4: confirm that icon in dom is now "MINUS"');
            ok(hasClassIcon(btn, Button.ICONS.MINUS), 'after "syncUI" icon should be "MINUS"');


            btn.destroy();
        });
		test('constructor only "label" should set "title" with same value', 1, function () {
			var btn = new Button({label: 'my label and title'});
			btn.render('#mybox');
			
			equal(btn.get('title'), btn.get('label'), 'when no title is explicitly set, the it should get the label value'); 
			
			btn.destroy();
		});
		test('constructor "title" and "label" differently should set them differently', 2, function () {
			var btn = new Button({label: 'my label', title: 'my title'});
			btn.render('#mybox');
			
			equal(btn.get('title'), 'my title', 'title should be "my title"'); 
			equal(btn.get('label'), 'my label', 'label should be "my label"'); 
			
			btn.destroy();
		});
        test('no icon and text should throw an exception', 3, function () {
            var btn = new Button({});

            try {
                step(1, 'step 1: call render with no "icon" nor "label" set');
                btn.render('#mybox');
            }
            catch (e) {
                step(2, 'step 2: catch exception and confirm "IconOrLabelNotDefinedButtonException"');
                equal(e.name, 'IconAndLabelNotDefinedButtonException', '"e.name" should equal "IconOrLabelNotDefinedButtonException"');

                btn.destroy();
            }

        });
        test('no icon and label with only spaces should throw an exception', 3, function () {
            var btn = new Button({ label: '  ' });

            try {
                step(1, 'step 1: call render with no "icon" and "label" with only spaces');
                btn.render('#mybox');
            }
            catch (e) {
                step(2, 'step 2: catch exception and confirm "IconOrLabelNotDefinedButtonException"');
                equal(e.name, 'IconAndLabelNotDefinedButtonException', '"e.name" should equal "IconOrLabelNotDefinedButtonException"');

                btn.destroy();
            }
        });
        test('"click" event should only fire when button is enabled - with "disabled" property', 4, function () {
            var btn = new Button({ label: 'Test Disabled Change', disabled: true });
            btn.on('click', function (e) {
                step(4, 'step 4: custom click handler that should only be called if button is enabled');
                btn.destroy();
            });
            btn.render('#mybox');

            step(1, 'step 1: simulate clicking button while it is disabled');
            btn.get('contentBox').simulate('click');

            step(2, 'step 2: set "disabled" to false');
            btn.set('disabled', false);

            step(3, 'step 3: simulate clicking button while it is enabled');
            btn.get('contentBox').simulate('click');

        });
         test('"click" event should only fire when button is enabled - with methods "disable()" and "enable()"', 5, function () {
            var btn = new Button({ label: 'Disable() and Enable() calls' });
            btn.on('click', function () {
                step(5, 'step 5: custom click handler that should only be called if button is enabled');
                btn.destroy();
            });
            btn.render('#mybox');

            step(1, 'step 1: call "disable()"');
            btn.disable();

            step(2, 'step 2: simulate clicking button while it is disabled');
            btn.get('contentBox').simulate('click');

            step(3, 'step 3: call "enable()"');
            btn.enable();

            step(4, 'step 4: simulate clicking button while it is enabled');
            btn.get('contentBox').simulate('click');

        });
        test('icon property only set should have icon only in DOM', 3, function () {
            var btn = new Button({ icon: Button.ICONS.ALERT });

            step(1, 'step 1: render with icon only');
            btn.render('#mybox');

            step(2, 'step 2: confirm that "CSS_NAMES.ICON_ONLY" css class is in contentBox');
            ok(hasClassCB(btn, Button.CSS_NAMES.ICON_ONLY), '"Button.CSS_NAMES.ICON_ONLY" should be in btn contentBox');

            btn.destroy();
        });
        test('label property only set should have label only in DOM', 3, function () {
            var btn = new Button({ label: 'Label Only' });

            step(1, 'step 1: render with label only');
            btn.render('#mybox');

            step(2, 'step 2: confirm that "CSS_NAMES.LABEL_ONLY" css class is in contentBox');
            ok(hasClassCB(btn, Button.CSS_NAMES.LABEL_ONLY), '"Button.CSS_NAMES.LABEL_ONLY" should be in btn contentBox');

            btn.destroy();
        });
        test('icon with label set should have icon with label in DOM', 3, function () {
            var btn = new Button({icon: Button.ICONS.ALERT, label: 'icon with label' });

            step(1, 'step 1: render with icon and label');
            btn.render('#mybox');

            step(2, 'step 2: confirm that "CSS_NAMES.ICON_WITH_LABEL" css class is in contentBox');
            ok(hasClassCB(btn, Button.CSS_NAMES.ICON_WITH_LABEL), '"Button.CSS_NAMES.ICON_WITH_LABEL" should be in btn contentBox');

            btn.destroy();
        });
    });
});
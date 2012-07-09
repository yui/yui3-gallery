var main = null;

YUI().use('gallery-icello-button', 'selector-css3', 'node-event-simulate', function (Y) {
    'use strict';

    var Button = Y.Icello.Button,
        appendOption = function (ddl, item) {
			var option_str = Y.Lang.sub('<option value="{value}">{text}</option>', item),
				option = Y.Node.create(option_str);

			if (item.selected) {
				option.set('selected', true);
			}

			ddl.append(option);
		};

    Y.on('domready', function (e) {
        Y.log('', 'info', 'domready');

        function Main() {
            Y.log('', 'info', 'Main');
            this.buttonsBoxDefaultMsg = null;

            this.input = {
                allButtons: [],
                allButtonsDsp: Y.one('#allButtonsDsp'),
                btnSave: null,
                btnSearch: null,
                buttonsBox: Y.one('#buttonsBox'),
                ddlCssIcons: Y.one('#ddlCssIcons')
            };
        }
        Main.prototype = {
            onAllButtonsDspClick: function (e) {
                Y.log('', 'info', 'Main onAllButtonsDspClick');
                var btn = e.currentTarget,
                    data = btn.getData(),
                    newBtn = null;

                if (data.label === '') {
                    data.label = data.icon;
                } else {
                    data.label = '';
                }

                newBtn = Button.getNode(data);
                newBtn.setData(data);

                this.input.allButtons[data.index] = newBtn;
                btn.replace(newBtn);
            },
            onBtnSaveClick: function (e) {
                Y.log('', 'info', 'Main onBtnSaveClick');
                e.preventDefault();
            },
            onBtnSearchClick: function (e) {
                Y.log('', 'info', 'Main onBtnSearchClick');
                e.preventDefault();
            },
            onDdlCssIconsChange: function (e) {
                var option = e.target.one('option:checked'),
                    v = option.get('value'),
                    t = option.getContent(),
                    btn = null;

                Y.log(t, 'info', 'Main onDdlCssIconsChange');
                Y.log(v, 'info', 'Main onDdlCssIconsChange');

                this.input.buttonsBox.empty(true);

                if (v === '') {
                    this.input.btnSave.disable();

                    this.input.buttonsBox.setContent(this.buttonsBoxDefaultMsg);
                    return;
                }

                this.input.btnSave.enable();

                btn = Button.getNode({ label: t, icon: v, title: t});
                this.input.buttonsBox.append(btn);
            },
            loadIconKeys: function () {
                Y.log('', 'info', 'Main loadIconKeys');

                var ddl = this.input.ddlCssIcons,
                    allButtonsDsp = this.input.allButtonsDsp,
                    allButtonsTbl = Y.Node.create('<table></table>'),
                    allButtonsTblBody = Y.Node.create('<tbody></tbody>'),
                    allButtons = this.input.allButtons,
                    allButtonsTr = null,
                    i = 1;


                allButtonsDsp.append(allButtonsTbl);
                allButtonsTbl.append(allButtonsTblBody);

                appendOption(ddl, {text: 'Please Select', value: ''});

                Y.Object.each(Button.ICONS, function (value, name) {
                    var btn = null,
                        td = null;

                    appendOption(ddl, {text: name, value: value});

                    btn = Button.getNode({ icon: value, title: name });
                    btn.setData({icon: name, index: i, label: '', title: name});

                    td = Y.Node.create('<td></td>');

                    if (i % 25 === 1) {
                        allButtonsTr = Y.Node.create('<tr></tr>');
                        allButtonsTblBody.append(allButtonsTr);
                    }

                    allButtonsTr.append(td);
                    td.append(btn);

                    allButtons.push(btn);

                    i += 1;
                });
            },
            init: function () {
                Y.log('', 'info', 'Main init');

                var input = this.input;

                this.loadIconKeys();

                this.buttonsBoxDefaultMsg = this.input.buttonsBox.getContent();

                input.ddlCssIcons.on('change', Y.bind(this.onDdlCssIconsChange, this));

                input.allButtonsDsp.delegate('click', Y.bind(this.onAllButtonsDspClick, this), 'button');

                input.btnSave = Button.renderNode('#btnSave');
                input.btnSearch = Button.renderNode('#btnSearch');

                input.btnSave.on('click', Y.bind(this.onBtnSaveClick, this));
                input.btnSearch.on('click', Y.bind(this.onBtnSearchClick, this));
            }
        };

        main = new Main();
        main.init();

    });
});
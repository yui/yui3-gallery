YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-itsaformelement'),
        body = Y.one('body'),
        node;

    suite.add(new Y.Test.Case({
        name: 'Creating ITSACheckbox',
        setUp : function () {
            this.formElement = Y.ITSAFormElement.getElement(Y.ITSACheckbox, {
                name: 'propertyname',
                label: 'this is the label',
                data: 'data-someinfo="somedata"',
                initialfocus: true,
                classname: 'yui3-element-class',
                labelClassname: 'yui3-label-class',
                focusable: true,
                tooltip: 'here is some tooltipinfo',
                widgetconfig: {
                    checked: true,
                    optionon: 'power on',
                    optionoff: 'power off'
                }
            });
            body.append(this.formElement.html);
            this.node = Y.one('#'+this.formElement.nodeid);
            this.labelnode = Y.one('label[for="'+this.formElement.nodeid+'"]');
        },
        tearDown : function () {
            var widgetInstance = this.formElement.widget;
            if (widgetInstance) {
                widgetInstance.destroy();
            }
            delete this.formElement;
            this.node.remove(true);
            this.labelnode && this.labelnode.remove(true);
        },
        'availablility node': function() {
            Y.Assert.isNotNull(this.node, 'ITSACheckbox - formelement not created');
        },
        'availablility labelnode': function() {
            Y.Assert.isNotNull(this.labelnode, 'ITSACheckbox - formelement\'s labelnode is not created');
        },
        'creation tagName': function() {
            Y.Assert.areEqual('DIV', this.node.get('tagName'), 'ITSACheckbox - Wrong tag created');
        },
        'check widget classname': function() {
            Y.Assert.isTrue(this.node.hasClass('itsa-widget-parent'), 'ITSACheckbox - Wrong value for widget\'s parent classname created');
        },
        'check value': function() {
            Y.Assert.isTrue(this.formElement.widget.get('checked'), 'ITSACheckbox - Wrong value created');
        },
        'check name': function() {
            Y.Assert.areEqual('propertyname', this.node.getAttribute('name'), 'ITSACheckbox - Wrong name created');
        },
        'check data': function() {
            Y.Assert.areEqual('somedata', this.node.getAttribute('data-someinfo'), 'ITSACheckbox - Wrong data created');
        },
        'check initialfocus': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-initialfocus'), 'ITSACheckbox - Wrong value for initialfocus created');
        },
        'check classname': function() {
            Y.Assert.isTrue(this.node.hasClass('yui3-element-class'), 'ITSACheckbox - Wrong value for classname created');
        },
        'check labelClassname': function() {
            Y.Assert.isTrue(this.labelnode.hasClass('yui3-label-class'), 'ITSACheckbox - Wrong value for classname created');
        },
        'check focusable': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-focusable'), 'ITSACheckbox - Wrong value for focusable created');
        },
        'check tooltip': function() {
            Y.Assert.areEqual('here is some tooltipinfo', this.node.getAttribute('data-content'), 'ITSACheckbox - Wrong value for tooltip created');
        },
        'check labelcontent': function() {
            Y.Assert.areEqual('this is the label', this.labelnode.get('text'), 'ITSACheckbox - Wrong labelvalue created');
        },
        'check optionon': function() {
            Y.Assert.areEqual('power on', this.formElement.widget.get('optionon'), 'ITSACheckbox - Wrong value for widget-attribute optionon');
        },
        'check data formelement': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-formelement'), 'ITSACheckbox - Wrong value for formelement created');
        },
        'check optionoff': function() {
            Y.Assert.areEqual('power off', this.formElement.widget.get('optionoff'), 'ITSACheckbox - Wrong value for widget-attribute optionoff');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Creating text-element',
        setUp : function () {
            this.formElement = Y.ITSAFormElement.getElement('text', {
                value: 'current value',
                name: 'propertyname',
                label: 'this is the label',
                data: 'data-someinfo="somedata"',
                placeholder: 'placeholderText',
                required: true,
                disabled: true,
                hidden: true,
                fullselect: true,
                initialfocus: true,
                pattern: '[A-Za-z]{3}',
                classname: 'yui3-element-class',
                labelClassname: 'yui3-label-class',
                focusable: true,
                checked: true,
                readonly: true,
                spinbusy: true,
                tooltip: 'here is some tooltipinfo'
            });
            body.append(this.formElement.html);
            this.node = Y.one('#'+this.formElement.nodeid);
            this.labelnode = Y.one('label[for="'+this.formElement.nodeid+'"]');
        },
        tearDown : function () {
            delete this.formElement;
            this.node.remove(true);
            this.labelnode && this.labelnode.remove(true);
        },
        'availablility node': function() {
            Y.Assert.isNotNull(this.node, 'text - formelement not created');
        },
        'availablility labelnode': function() {
            Y.Assert.isNotNull(this.labelnode, 'text - formelement\'s labelnode is not created');
        },
        'creation tagName': function() {
            Y.Assert.areEqual('INPUT', this.node.get('tagName'), 'text - Wrong tag created');
        },
        'check type': function() {
            Y.Assert.areEqual('text', this.node.getAttribute('type'), 'text - Wrong type created');
        },
        'check checked': function() {
            Y.Assert.areEqual('', this.node.getAttribute('checked'), 'text - Wrong checked-attribute created');
        },
        'check value': function() {
            Y.Assert.areEqual('current value', this.node.getAttribute('value'), 'text - Wrong value created');
        },
        'check name': function() {
            Y.Assert.areEqual('propertyname', this.node.getAttribute('name'), 'text - Wrong name created');
        },
        'check data': function() {
            Y.Assert.areEqual('somedata', this.node.getAttribute('data-someinfo'), 'text - Wrong data created');
        },
        'check placeholder': function() {
            Y.Assert.areEqual('placeholderText', this.node.getAttribute('placeholder'), 'text - Wrong placeholder created');
        },
        'check required': function() {
            Y.Assert.areEqual('required', this.node.getAttribute('required'), 'text - Wrong value for required created');
        },
        'check disabled': function() {
            Y.Assert.areEqual('disabled', this.node.getAttribute('disabled'), 'text - Wrong value for disabled created');
        },
        'check hidden': function() {
            Y.Assert.areEqual('hidden', this.node.getAttribute('hidden'), 'text - Wrong value for hidden created');
        },
        'check spinbusy': function() {
            Y.Assert.areEqual('', this.node.getAttribute('data-spinbusy'), 'text - Wrong value for spinbusy created');
        },
        'check fullselect': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-fullselect'), 'text - Wrong value for fullselect created');
        },
        'check initialfocus': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-initialfocus'), 'text - Wrong value for initialfocus created');
        },
        'check pattern': function() {
            Y.Assert.areEqual('[A-Za-z]{3}', this.node.getAttribute('pattern'), 'text - Wrong value for pattern created');
        },
        'check classname': function() {
            Y.Assert.isTrue(this.node.hasClass('yui3-element-class'), 'text - Wrong value for classname created');
        },
        'check labelClassname': function() {
            Y.Assert.isTrue(this.labelnode.hasClass('yui3-label-class'), 'text - Wrong value for classname created');
        },
        'check focusable': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-focusable'), 'text - Wrong value for focusable created');
        },
        'check tooltip': function() {
            Y.Assert.areEqual('here is some tooltipinfo', this.node.getAttribute('data-content'), 'text - Wrong value for tooltip created');
        },
        'check data formelement': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-formelement'), 'text - Wrong value for formelement created');
        },
        'check labelcontent': function() {
            Y.Assert.areEqual('this is the label', this.labelnode.get('text'), 'text - Wrong labelvalue created');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Creating number-element',
        setUp : function () {
            this.formElement = Y.ITSAFormElement.getElement('number', {
                value: 'current value',
                name: 'propertyname',
                label: 'this is the label',
                data: 'data-someinfo="somedata"',
                placeholder: 'placeholderText',
                required: true,
                disabled: true,
                hidden: true,
                fullselect: true,
                initialfocus: true,
                classname: 'yui3-element-class',
                labelClassname: 'yui3-label-class',
                focusable: true,
                checked: true,
                readonly: true,
                tooltip: 'here is some tooltipinfo'
            });
            body.append(this.formElement.html);
            this.node = Y.one('#'+this.formElement.nodeid);
            this.labelnode = Y.one('label[for="'+this.formElement.nodeid+'"]');
        },
        tearDown : function () {
            delete this.formElement;
            this.node.remove(true);
            this.labelnode && this.labelnode.remove(true);
        },
        'availablility node': function() {
            Y.Assert.isNotNull(this.node, 'number- formelement not created');
        },
        'availablility labelnode': function() {
            Y.Assert.isNotNull(this.labelnode, 'number- formelement\'s labelnode is not created');
        },
        'creation tagName': function() {
            Y.Assert.areEqual('INPUT', this.node.get('tagName'), 'number- Wrong tag created');
        },
        'check type': function() {
            Y.Assert.areEqual('text', this.node.getAttribute('type'), 'number- Wrong type created');
        },
        'check value': function() {
            Y.Assert.areEqual('current value', this.node.getAttribute('value'), 'number- Wrong value created');
        },
        'check checked': function() {
            Y.Assert.areEqual('', this.node.getAttribute('checked'), 'number- Wrong checked-attribute created');
        },
        'check name': function() {
            Y.Assert.areEqual('propertyname', this.node.getAttribute('name'), 'number- Wrong name created');
        },
        'check data': function() {
            Y.Assert.areEqual('somedata', this.node.getAttribute('data-someinfo'), 'number- Wrong data created');
        },
        'check placeholder': function() {
            Y.Assert.areEqual('placeholderText', this.node.getAttribute('placeholder'), 'number- Wrong placeholder created');
        },
        'check required': function() {
            Y.Assert.areEqual('required', this.node.getAttribute('required'), 'number- Wrong value for required created');
        },
        'check disabled': function() {
            Y.Assert.areEqual('disabled', this.node.getAttribute('disabled'), 'number- Wrong value for disabled created');
        },
        'check hidden': function() {
            Y.Assert.areEqual('hidden', this.node.getAttribute('hidden'), 'number- Wrong value for hidden created');
        },
        'check fullselect': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-fullselect'), 'number- Wrong value for fullselect created');
        },
        'check initialfocus': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-initialfocus'), 'number- Wrong value for initialfocus created');
        },
        'check pattern': function() {
            Y.Assert.areEqual('^(([-]?[1-9][0-9]*)|0)$', this.node.getAttribute('pattern'), 'number- Wrong value for pattern created');
        },
        'check classname': function() {
            Y.Assert.isTrue(this.node.hasClass('yui3-element-class'), 'number- Wrong value for classname created');
        },
        'check labelClassname': function() {
            Y.Assert.isTrue(this.labelnode.hasClass('yui3-label-class'), 'number- Wrong value for classname created');
        },
        'check focusable': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-focusable'), 'number- Wrong value for focusable created');
        },
        'check tooltip': function() {
            Y.Assert.areEqual('here is some tooltipinfo', this.node.getAttribute('data-content'), 'number- Wrong value for tooltip created');
        },
        'check data formelement': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-formelement'), 'number- Wrong value for formelement created');
        },
        'check labelcontent': function() {
            Y.Assert.areEqual('this is the label', this.labelnode.get('text'), 'number- Wrong labelvalue created');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Creating number-element with digits',
        setUp : function () {
            this.formElement = Y.ITSAFormElement.getElement('number', {
                digits: true
            });
            body.append(this.formElement.html);
            this.node = Y.one('#'+this.formElement.nodeid);
            this.labelnode = Y.one('label[for="'+this.formElement.nodeid+'"]');
        },
        tearDown : function () {
            delete this.formElement;
            this.node.remove(true);
            this.labelnode && this.labelnode.remove(true);
        },
        'check pattern': function() {
            Y.Assert.areEqual('^[-]?(([1-9][0-9]*)|0)(\\.[0-9]+)?$', this.node.getAttribute('pattern'), 'number with digits - Wrong value for pattern created');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Creating password-element',
        setUp : function () {
            this.formElement = Y.ITSAFormElement.getElement('password', {
                value: 'current value',
                name: 'propertyname',
                label: 'this is the label',
                data: 'data-someinfo="somedata"',
                placeholder: 'placeholderText',
                required: true,
                disabled: true,
                hidden: true,
                fullselect: true,
                initialfocus: true,
                pattern: '[A-Za-z]{3}',
                classname: 'yui3-element-class',
                labelClassname: 'yui3-label-class',
                focusable: true,
                checked: true,
                readonly: true,
                tooltip: 'here is some tooltipinfo'
            });
            body.append(this.formElement.html);
            this.node = Y.one('#'+this.formElement.nodeid);
            this.labelnode = Y.one('label[for="'+this.formElement.nodeid+'"]');
        },
        tearDown : function () {
            delete this.formElement;
            this.node.remove(true);
            this.labelnode && this.labelnode.remove(true);
        },
        'availablility node': function() {
            Y.Assert.isNotNull(this.node, 'password - formelement not created');
        },
        'availablility labelnode': function() {
            Y.Assert.isNotNull(this.labelnode, 'password - formelement\'s labelnode is not created');
        },
        'creation tagName': function() {
            Y.Assert.areEqual('INPUT', this.node.get('tagName'), 'password - Wrong tag created');
        },
        'check type': function() {
            Y.Assert.areEqual('password', this.node.getAttribute('type'), 'password - Wrong type created');
        },
        'check value': function() {
            Y.Assert.areEqual('current value', this.node.getAttribute('value'), 'password - Wrong value created');
        },
        'check checked': function() {
            Y.Assert.areEqual('', this.node.getAttribute('checked'), 'password - Wrong checked-attribute created');
        },
        'check name': function() {
            Y.Assert.areEqual('propertyname', this.node.getAttribute('name'), 'password - Wrong name created');
        },
        'check data': function() {
            Y.Assert.areEqual('somedata', this.node.getAttribute('data-someinfo'), 'password - Wrong data created');
        },
        'check placeholder': function() {
            Y.Assert.areEqual('placeholderText', this.node.getAttribute('placeholder'), 'password - Wrong placeholder created');
        },
        'check required': function() {
            Y.Assert.areEqual('required', this.node.getAttribute('required'), 'password - Wrong value for required created');
        },
        'check disabled': function() {
            Y.Assert.areEqual('disabled', this.node.getAttribute('disabled'), 'password - Wrong value for disabled created');
        },
        'check hidden': function() {
            Y.Assert.areEqual('hidden', this.node.getAttribute('hidden'), 'password - Wrong value for hidden created');
        },
        'check fullselect': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-fullselect'), 'password - Wrong value for fullselect created');
        },
        'check initialfocus': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-initialfocus'), 'password - Wrong value for initialfocus created');
        },
        'check pattern': function() {
            Y.Assert.areEqual('[A-Za-z]{3}', this.node.getAttribute('pattern'), 'password - Wrong value for pattern created');
        },
        'check classname': function() {
            Y.Assert.isTrue(this.node.hasClass('yui3-element-class'), 'password - Wrong value for classname created');
        },
        'check labelClassname': function() {
            Y.Assert.isTrue(this.labelnode.hasClass('yui3-label-class'), 'password - Wrong value for classname created');
        },
        'check focusable': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-focusable'), 'password - Wrong value for focusable created');
        },
        'check tooltip': function() {
            Y.Assert.areEqual('here is some tooltipinfo', this.node.getAttribute('data-content'), 'password - Wrong value for tooltip created');
        },
        'check data formelement': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-formelement'), 'password - Wrong value for formelement created');
        },
        'check labelcontent': function() {
            Y.Assert.areEqual('this is the label', this.labelnode.get('text'), 'password - Wrong labelvalue created');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Creating email-element',
        setUp : function () {
            this.formElement = Y.ITSAFormElement.getElement('email', {
                value: 'current value',
                name: 'propertyname',
                label: 'this is the label',
                data: 'data-someinfo="somedata"',
                placeholder: 'placeholderText',
                required: true,
                disabled: true,
                hidden: true,
                fullselect: true,
                initialfocus: true,
                pattern: '[A-Za-z]{3}',
                classname: 'yui3-element-class',
                labelClassname: 'yui3-label-class',
                focusable: true,
                checked: true,
                readonly: true,
                tooltip: 'here is some tooltipinfo'
            });
            body.append(this.formElement.html);
            this.node = Y.one('#'+this.formElement.nodeid);
            this.labelnode = Y.one('label[for="'+this.formElement.nodeid+'"]');
        },
        tearDown : function () {
            delete this.formElement;
            this.node.remove(true);
            this.labelnode && this.labelnode.remove(true);
        },
        'availablility node': function() {
            Y.Assert.isNotNull(this.node, 'email - formelement not created');
        },
        'availablility labelnode': function() {
            Y.Assert.isNotNull(this.labelnode, 'email - formelement\'s labelnode is not created');
        },
        'creation tagName': function() {
            Y.Assert.areEqual('INPUT', this.node.get('tagName'), 'email - Wrong tag created');
        },
        'check type': function() {
            Y.Assert.areEqual('text', this.node.getAttribute('type'), 'email - Wrong type created');
        },
        'check value': function() {
            Y.Assert.areEqual('current value', this.node.getAttribute('value'), 'email - Wrong value created');
        },
        'check checked': function() {
            Y.Assert.areEqual('', this.node.getAttribute('checked'), 'email - Wrong checked-attribute created');
        },
        'check name': function() {
            Y.Assert.areEqual('propertyname', this.node.getAttribute('name'), 'email - Wrong name created');
        },
        'check data': function() {
            Y.Assert.areEqual('somedata', this.node.getAttribute('data-someinfo'), 'email - Wrong data created');
        },
        'check placeholder': function() {
            Y.Assert.areEqual('placeholderText', this.node.getAttribute('placeholder'), 'email - Wrong placeholder created');
        },
        'check required': function() {
            Y.Assert.areEqual('required', this.node.getAttribute('required'), 'email - Wrong value for required created');
        },
        'check disabled': function() {
            Y.Assert.areEqual('disabled', this.node.getAttribute('disabled'), 'email - Wrong value for disabled created');
        },
        'check hidden': function() {
            Y.Assert.areEqual('hidden', this.node.getAttribute('hidden'), 'email - Wrong value for hidden created');
        },
        'check fullselect': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-fullselect'), 'email - Wrong value for fullselect created');
        },
        'check initialfocus': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-initialfocus'), 'email - Wrong value for initialfocus created');
        },
        'check pattern': function() {
            Y.Assert.areEqual('^[\\w!#$%&\'*+/=?`{|}~^-]+(?:\\.[\\w!#$%&\'*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}$', this.node.getAttribute('pattern'), 'email - Wrong value for pattern created');
        },
        'check classname': function() {
            Y.Assert.isTrue(this.node.hasClass('yui3-element-class'), 'email - Wrong value for classname created');
        },
        'check labelClassname': function() {
            Y.Assert.isTrue(this.labelnode.hasClass('yui3-label-class'), 'email - Wrong value for classname created');
        },
        'check focusable': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-focusable'), 'email - Wrong value for focusable created');
        },
        'check tooltip': function() {
            Y.Assert.areEqual('here is some tooltipinfo', this.node.getAttribute('data-content'), 'email - Wrong value for tooltip created');
        },
        'check data formelement': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-formelement'), 'email - Wrong value for formelement created');
        },
        'check labelcontent': function() {
            Y.Assert.areEqual('this is the label', this.labelnode.get('text'), 'email - Wrong labelvalue created');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Creating url-element',
        setUp : function () {
            this.formElement = Y.ITSAFormElement.getElement('url', {
                value: 'current value',
                name: 'propertyname',
                label: 'this is the label',
                data: 'data-someinfo="somedata"',
                placeholder: 'placeholderText',
                required: true,
                disabled: true,
                hidden: true,
                fullselect: true,
                initialfocus: true,
                pattern: '[A-Za-z]{3}',
                classname: 'yui3-element-class',
                labelClassname: 'yui3-label-class',
                focusable: true,
                checked: true,
                readonly: true,
                tooltip: 'here is some tooltipinfo'
            });
            body.append(this.formElement.html);
            this.node = Y.one('#'+this.formElement.nodeid);
            this.labelnode = Y.one('label[for="'+this.formElement.nodeid+'"]');
        },
        tearDown : function () {
            delete this.formElement;
            this.node.remove(true);
            this.labelnode && this.labelnode.remove(true);
        },
        'availablility node': function() {
            Y.Assert.isNotNull(this.node, 'url - formelement not created');
        },
        'availablility labelnode': function() {
            Y.Assert.isNotNull(this.labelnode, 'url - formelement\'s labelnode is not created');
        },
        'creation tagName': function() {
            Y.Assert.areEqual('INPUT', this.node.get('tagName'), 'url - Wrong tag created');
        },
        'check type': function() {
            Y.Assert.areEqual('text', this.node.getAttribute('type'), 'url - Wrong type created');
        },
        'check value': function() {
            Y.Assert.areEqual('current value', this.node.getAttribute('value'), 'url - Wrong value created');
        },
        'check checked': function() {
            Y.Assert.areEqual('', this.node.getAttribute('checked'), 'url - Wrong checked-attribute created');
        },
        'check name': function() {
            Y.Assert.areEqual('propertyname', this.node.getAttribute('name'), 'url - Wrong name created');
        },
        'check data': function() {
            Y.Assert.areEqual('somedata', this.node.getAttribute('data-someinfo'), 'url - Wrong data created');
        },
        'check placeholder': function() {
            Y.Assert.areEqual('placeholderText', this.node.getAttribute('placeholder'), 'url - Wrong placeholder created');
        },
        'check required': function() {
            Y.Assert.areEqual('required', this.node.getAttribute('required'), 'url - Wrong value for required created');
        },
        'check disabled': function() {
            Y.Assert.areEqual('disabled', this.node.getAttribute('disabled'), 'url - Wrong value for disabled created');
        },
        'check hidden': function() {
            Y.Assert.areEqual('hidden', this.node.getAttribute('hidden'), 'url - Wrong value for hidden created');
        },
        'check fullselect': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-fullselect'), 'url - Wrong value for fullselect created');
        },
        'check initialfocus': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-initialfocus'), 'url - Wrong value for initialfocus created');
        },
        'check pattern': function() {
            Y.Assert.areEqual('^(https?://)?[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)+(/[\\w-]+)*', this.node.getAttribute('pattern'), 'url - Wrong value for pattern created');
        },
        'check classname': function() {
            Y.Assert.isTrue(this.node.hasClass('yui3-element-class'), 'url - Wrong value for classname created');
        },
        'check labelClassname': function() {
            Y.Assert.isTrue(this.labelnode.hasClass('yui3-label-class'), 'url - Wrong value for classname created');
        },
        'check focusable': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-focusable'), 'url - Wrong value for focusable created');
        },
        'check tooltip': function() {
            Y.Assert.areEqual('here is some tooltipinfo', this.node.getAttribute('data-content'), 'url - Wrong value for tooltip created');
        },
        'check data formelement': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-formelement'), 'url - Wrong value for formelement created');
        },
        'check labelcontent': function() {
            Y.Assert.areEqual('this is the label', this.labelnode.get('text'), 'url - Wrong labelvalue created');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Creating url-element onlyssl',
        setUp : function () {
            this.formElement = Y.ITSAFormElement.getElement('url', {
                onlyssl: true
            });
            body.append(this.formElement.html);
            this.node = Y.one('#'+this.formElement.nodeid);
            this.labelnode = Y.one('label[for="'+this.formElement.nodeid+'"]');
        },
        tearDown : function () {
            delete this.formElement;
            this.node.remove(true);
            this.labelnode && this.labelnode.remove(true);
        },
        'check pattern': function() {
            Y.Assert.areEqual('^https://[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)+(/[\\w-]+)*', this.node.getAttribute('pattern'), 'url with onlyssl - Wrong value for pattern created');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Creating url-element nossl',
        setUp : function () {
            this.formElement = Y.ITSAFormElement.getElement('url', {
                nossl: true
            });
            body.append(this.formElement.html);
            this.node = Y.one('#'+this.formElement.nodeid);
            this.labelnode = Y.one('label[for="'+this.formElement.nodeid+'"]');
        },
        tearDown : function () {
            delete this.formElement;
            this.node.remove(true);
            this.labelnode && this.labelnode.remove(true);
        },
        'check pattern': function() {
            Y.Assert.areEqual('^(http://)?[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)+(/[\\w-]+)*', this.node.getAttribute('pattern'), 'url with nossl - Wrong value for pattern created');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Creating textarea-element',
        setUp : function () {
            this.formElement = Y.ITSAFormElement.getElement('textarea', {
                value: 'current value',
                name: 'propertyname',
                label: 'this is the label',
                data: 'data-someinfo="somedata"',
                placeholder: 'placeholderText',
                required: true,
                disabled: true,
                hidden: true,
                fullselect: true,
                initialfocus: true,
                pattern: '[A-Za-z]{3}',
                classname: 'yui3-element-class',
                labelClassname: 'yui3-label-class',
                focusable: true,
                checked: true,
                readonly: true,
                tooltip: 'here is some tooltipinfo'
            });
            body.append(this.formElement.html);
            this.node = Y.one('#'+this.formElement.nodeid);
            this.labelnode = Y.one('label[for="'+this.formElement.nodeid+'"]');
        },
        tearDown : function () {
            delete this.formElement;
            this.node.remove(true);
            this.labelnode && this.labelnode.remove(true);
        },
        'availablility node': function() {
            Y.Assert.isNotNull(this.node, 'textarea - formelement not created');
        },
        'availablility labelnode': function() {
            Y.Assert.isNotNull(this.labelnode, 'textarea - formelement\'s labelnode is not created');
        },
        'creation tagName': function() {
            Y.Assert.areEqual('TEXTAREA', this.node.get('tagName'), 'textarea - Wrong tag created');
        },
        'check value1': function() {
            Y.Assert.areEqual('', this.node.getAttribute('value'), 'textarea - Value created as node-attribute');
        },
        'check value2': function() {
            Y.Assert.areEqual('current value', this.node.get('text'), 'textarea - Wrong value created');
        },
        'check checked': function() {
            Y.Assert.areEqual('', this.node.getAttribute('checked'), 'textarea - Wrong checked-attribute created');
        },
        'check name': function() {
            Y.Assert.areEqual('propertyname', this.node.getAttribute('name'), 'textarea - Wrong name created');
        },
        'check data': function() {
            Y.Assert.areEqual('somedata', this.node.getAttribute('data-someinfo'), 'textarea - Wrong data created');
        },
        'check placeholder': function() {
            Y.Assert.areEqual('placeholderText', this.node.getAttribute('placeholder'), 'textarea - Wrong placeholder created');
        },
        'check required': function() {
            Y.Assert.areEqual('required', this.node.getAttribute('required'), 'textarea - Wrong value for required created');
        },
        'check disabled': function() {
            Y.Assert.areEqual('disabled', this.node.getAttribute('disabled'), 'textarea - Wrong value for disabled created');
        },
        'check hidden': function() {
            Y.Assert.areEqual('hidden', this.node.getAttribute('hidden'), 'textarea - Wrong value for hidden created');
        },
        'check fullselect': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-fullselect'), 'textarea - Wrong value for fullselect created');
        },
        'check initialfocus': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-initialfocus'), 'textarea - Wrong value for initialfocus created');
        },
        'check pattern': function() {
            Y.Assert.areEqual('', this.node.getAttribute('pattern'), 'textarea - Wrong value for pattern created');
        },
        'check classname': function() {
            Y.Assert.isTrue(this.node.hasClass('yui3-element-class'), 'textarea - Wrong value for classname created');
        },
        'check labelClassname': function() {
            Y.Assert.isTrue(this.labelnode.hasClass('yui3-label-class'), 'textarea - Wrong value for classname created');
        },
        'check focusable': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-focusable'), 'textarea - Wrong value for focusable created');
        },
        'check tooltip': function() {
            Y.Assert.areEqual('here is some tooltipinfo', this.node.getAttribute('data-content'), 'textarea - Wrong value for tooltip created');
        },
        'check data formelement': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-formelement'), 'textarea - Wrong value for formelement created');
        },
        'check labelcontent': function() {
            Y.Assert.areEqual('this is the label', this.labelnode.get('text'), 'textarea - Wrong labelvalue created');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Creating checkbox',
        setUp : function () {
            this.formElement = Y.ITSAFormElement.getElement('checkbox', {
                value: 'current value',
                name: 'propertyname',
                label: 'this is the label',
                data: 'data-someinfo="somedata"',
                placeholder: 'placeholderText',
                required: true,
                disabled: true,
                hidden: true,
                fullselect: true,
                initialfocus: true,
                pattern: '[A-Za-z]{3}',
                classname: 'yui3-element-class',
                labelClassname: 'yui3-label-class',
                focusable: true,
                checked: true,
                readonly: true,
                tooltip: 'here is some tooltipinfo'
            });
            body.append(this.formElement.html);
            this.node = Y.one('#'+this.formElement.nodeid);
            this.labelnode = Y.one('label[for="'+this.formElement.nodeid+'"]');
        },
        tearDown : function () {
            delete this.formElement;
            this.node.remove(true);
            this.labelnode && this.labelnode.remove(true);
        },
        'availablility node': function() {
            Y.Assert.isNotNull(this.node, 'checkbox - formelement not created');
        },
        'availablility labelnode': function() {
            Y.Assert.isNotNull(this.labelnode, 'checkbox - formelement\'s labelnode is not created');
        },
        'creation tagName': function() {
            Y.Assert.areEqual('INPUT', this.node.get('tagName'), 'checkbox - Wrong tag created');
        },
        'check type': function() {
            Y.Assert.areEqual('checkbox', this.node.getAttribute('type'), 'checkbox - Wrong type created');
        },
        'check value': function() {
            Y.Assert.areEqual('current value', this.node.getAttribute('value'), 'checkbox - Wrong value created');
        },
        'check checked': function() {
            Y.Assert.areEqual('checked', this.node.getAttribute('checked'), 'checkbox - Wrong checked-attribute created');
        },
        'check name': function() {
            Y.Assert.areEqual('propertyname', this.node.getAttribute('name'), 'checkbox - Wrong name created');
        },
        'check data': function() {
            Y.Assert.areEqual('somedata', this.node.getAttribute('data-someinfo'), 'checkbox - Wrong data created');
        },
        'check placeholder': function() {
            Y.Assert.areEqual('', this.node.getAttribute('placeholder'), 'checkbox - Wrong placeholder created');
        },
        'check required': function() {
            Y.Assert.areEqual('', this.node.getAttribute('required'), 'checkbox - Wrong value for required created');
        },
        'check disabled': function() {
            Y.Assert.areEqual('disabled', this.node.getAttribute('disabled'), 'checkbox - Wrong value for disabled created');
        },
        'check hidden': function() {
            Y.Assert.areEqual('hidden', this.node.getAttribute('hidden'), 'checkbox - Wrong value for hidden created');
        },
        'check fullselect': function() {
            Y.Assert.areEqual('', this.node.getAttribute('data-fullselect'), 'checkbox - Wrong value for fullselect created');
        },
        'check initialfocus': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-initialfocus'), 'checkbox - Wrong value for initialfocus created');
        },
        'check pattern': function() {
            Y.Assert.areEqual('', this.node.getAttribute('pattern'), 'checkbox - Wrong value for pattern created');
        },
        'check classname': function() {
            Y.Assert.isTrue(this.node.hasClass('yui3-element-class'), 'checkbox - Wrong value for classname created');
        },
        'check labelClassname': function() {
            Y.Assert.isTrue(this.labelnode.hasClass('yui3-label-class'), 'checkbox - Wrong value for classname created');
        },
        'check focusable': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-focusable'), 'checkbox - Wrong value for focusable created');
        },
        'check tooltip': function() {
            Y.Assert.areEqual('here is some tooltipinfo', this.node.getAttribute('data-content'), 'checkbox - Wrong value for tooltip created');
        },
        'check data formelement': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-formelement'), 'checkbox - Wrong value for formelement created');
        },
        'check labelcontent': function() {
            Y.Assert.areEqual('this is the label', this.labelnode.get('text'), 'checkbox - Wrong labelvalue created');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Creating radio-element',
        setUp : function () {
            this.formElement = Y.ITSAFormElement.getElement('radio', {
                value: 'current value',
                name: 'propertyname',
                label: 'this is the label',
                data: 'data-someinfo="somedata"',
                placeholder: 'placeholderText',
                required: true,
                disabled: true,
                hidden: true,
                fullselect: true,
                initialfocus: true,
                pattern: '[A-Za-z]{3}',
                classname: 'yui3-element-class',
                labelClassname: 'yui3-label-class',
                focusable: true,
                checked: true,
                readonly: true,
                tooltip: 'here is some tooltipinfo'
            });
            body.append(this.formElement.html);
            this.node = Y.one('#'+this.formElement.nodeid);
            this.labelnode = Y.one('label[for="'+this.formElement.nodeid+'"]');
        },
        tearDown : function () {
            delete this.formElement;
            this.node.remove(true);
            this.labelnode && this.labelnode.remove(true);
        },
        'availablility node': function() {
            Y.Assert.isNotNull(this.node, 'radio - formelement not created');
        },
        'availablility labelnode': function() {
            Y.Assert.isNotNull(this.labelnode, 'radio - formelement\'s labelnode is not created');
        },
        'creation tagName': function() {
            Y.Assert.areEqual('INPUT', this.node.get('tagName'), 'radio - Wrong tag created');
        },
        'check type': function() {
            Y.Assert.areEqual('radio', this.node.getAttribute('type'), 'radio - Wrong type created');
        },
        'check value': function() {
            Y.Assert.areEqual('current value', this.node.getAttribute('value'), 'radio - Wrong value created');
        },
        'check checked': function() {
            Y.Assert.areEqual('checked', this.node.getAttribute('checked'), 'radio - Wrong checked-attribute created');
        },
        'check name': function() {
            Y.Assert.areEqual('propertyname', this.node.getAttribute('name'), 'radio - Wrong name created');
        },
        'check data': function() {
            Y.Assert.areEqual('somedata', this.node.getAttribute('data-someinfo'), 'radio - Wrong data created');
        },
        'check placeholder': function() {
            Y.Assert.areEqual('', this.node.getAttribute('placeholder'), 'radio - Wrong placeholder created');
        },
        'check required': function() {
            Y.Assert.areEqual('', this.node.getAttribute('required'), 'radio - Wrong value for required created');
        },
        'check disabled': function() {
            Y.Assert.areEqual('disabled', this.node.getAttribute('disabled'), 'radio - Wrong value for disabled created');
        },
        'check hidden': function() {
            Y.Assert.areEqual('hidden', this.node.getAttribute('hidden'), 'radio - Wrong value for hidden created');
        },
        'check fullselect': function() {
            Y.Assert.areEqual('', this.node.getAttribute('data-fullselect'), 'radio - Wrong value for fullselect created');
        },
        'check initialfocus': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-initialfocus'), 'radio - Wrong value for initialfocus created');
        },
        'check pattern': function() {
            Y.Assert.areEqual('', this.node.getAttribute('pattern'), 'radio - Wrong value for pattern created');
        },
        'check classname': function() {
            Y.Assert.isTrue(this.node.hasClass('yui3-element-class'), 'radio - Wrong value for classname created');
        },
        'check labelClassname': function() {
            Y.Assert.isTrue(this.labelnode.hasClass('yui3-label-class'), 'radio - Wrong value for classname created');
        },
        'check focusable': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-focusable'), 'radio - Wrong value for focusable created');
        },
        'check tooltip': function() {
            Y.Assert.areEqual('here is some tooltipinfo', this.node.getAttribute('data-content'), 'radio - Wrong value for tooltip created');
        },
        'check data formelement': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-formelement'), 'radio - Wrong value for formelement created');
        },
        'check labelcontent': function() {
            Y.Assert.areEqual('this is the label', this.labelnode.get('text'), 'radio - Wrong labelvalue created');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Creating date-element',
        setUp : function () {
            this.formElement = Y.ITSAFormElement.getElement('date', {
                value: new Date(2013, 0, 1, 12, 0, 0, 0),
                name: 'propertyname',
                label: 'this is the label',
                data: 'data-someinfo="somedata"',
                placeholder: 'placeholderText',
                required: true,
                disabled: true,
                hidden: true,
                fullselect: true,
                initialfocus: true,
                pattern: '[A-Za-z]{3}',
                classname: 'yui3-element-class',
                labelClassname: 'yui3-label-class',
                focusable: true,
                checked: true,
                readonly: true,
                format: '%Y-%m-%d',
                primary: true,
                tooltip: 'here is some tooltipinfo'
            });
            body.append(this.formElement.html);
            this.node = Y.one('#'+this.formElement.nodeid);
            this.timenode = Y.one('span[data-for="'+this.formElement.nodeid+'"]');
            this.labelnode = this.timenode.previous();
        },
        tearDown : function () {
            delete this.formElement;
            this.node.remove(true);
            this.labelnode && this.labelnode.remove(true);
            Y.all('.formatvalue').remove(true);
            delete this.timenode;
        },
        'availablility node': function() {
            Y.Assert.isNotNull(this.node, 'date - formelement not created');
        },
        'availablility labelnode': function() {
            Y.Assert.isNotNull(this.labelnode, 'date - formelement\'s labelnode is not created');
        },
        'availablility timenode': function() {
            Y.Assert.isNotNull(this.timenode, 'date - formelement\'s timenode is not created');
        },
        'creation tagName': function() {
            Y.Assert.areEqual('BUTTON', this.node.get('tagName'), 'date - Wrong tag created');
        },
        'check type': function() {
            Y.Assert.areEqual('button', this.node.getAttribute('type'), 'date - Wrong type created');
        },
        'check checked': function() {
            Y.Assert.areEqual('', this.node.getAttribute('checked'), 'date - Wrong checked-attribute created');
        },
        'check name': function() {
            Y.Assert.areEqual('propertyname', this.node.getAttribute('name'), 'date - Wrong name created');
        },
        'check data': function() {
            Y.Assert.areEqual('somedata', this.node.getAttribute('data-someinfo'), 'date - Wrong data created');
        },
        'check placeholder': function() {
            Y.Assert.areEqual('', this.node.getAttribute('placeholder'), 'date - Wrong placeholder created');
        },
        'check required': function() {
            Y.Assert.areEqual('required', this.node.getAttribute('required'), 'date - Wrong value for required created');
        },
        'check disabled': function() {
            Y.Assert.isTrue(this.node.hasClass('pure-button-disabled'), 'date - Disabled didn\'t render the right classname');
        },
        'check primary': function() {
            Y.Assert.isFalse(this.node.hasClass('pure-button-primary'), 'date - Primary-button didn\'t render the right classname');
        },
        'check hidden': function() {
            Y.Assert.areEqual('hidden', this.labelnode.getAttribute('hidden'), 'date - Wrong value for label-hidden created');
        },
        'check hidden timenode': function() {
            Y.Assert.areEqual('hidden', this.timenode.getAttribute('hidden'), 'date - Wrong value for timenode-hidden created');
        },
        'check hidden buttonnode': function() {
            Y.Assert.areEqual('hidden', this.node.getAttribute('hidden'), 'date - Wrong value for buttonnode-hidden created');
        },
        'check fullselect': function() {
            Y.Assert.areEqual('', this.node.getAttribute('data-fullselect'), 'date - Wrong value for fullselect created');
        },
        'check initialfocus': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-initialfocus'), 'date - Wrong value for initialfocus created');
        },
        'check pattern': function() {
            Y.Assert.areEqual('', this.node.getAttribute('pattern'), 'date - Wrong value for pattern created');
        },
        'check classname': function() {
            Y.Assert.isTrue(this.timenode.hasClass('yui3-element-class'), 'date - Wrong value for element-classname created '+this.timenode.getAttribute('class'));
        },
        'check labelClassname': function() {
            Y.Assert.isTrue(this.labelnode.hasClass('yui3-label-class'), 'date - Wrong value for label-classname created');
        },
        'check focusable': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-focusable'), 'date - Wrong value for focusable created');
        },
        'check labelcontent': function() {
            Y.Assert.areEqual('this is the label', this.labelnode.get('text'), 'date - Wrong labelvalue created');
        },
        'check time': function() {
            Y.Assert.areEqual('2013-01-01', this.timenode.get('text'), 'date - Wrong timevalue created');
        },
        'check data formelement': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-formelement'), 'date - Wrong value for formelement created');
        },
        'check icon': function() {
            Y.Assert.areEqual('<i class="itsaicon-datetime-date"></i>', this.node.getHTML(), 'date - Wrong icon created');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Creating time-element',
        setUp : function () {
            this.formElement = Y.ITSAFormElement.getElement('time', {
                value: new Date(2013, 0, 1, 12, 30, 0, 0),
                name: 'propertyname',
                label: 'this is the label',
                data: 'data-someinfo="somedata"',
                placeholder: 'placeholderText',
                required: true,
                disabled: true,
                hidden: true,
                fullselect: true,
                initialfocus: true,
                pattern: '[A-Za-z]{3}',
                classname: 'yui3-element-class',
                labelClassname: 'yui3-label-class',
                focusable: true,
                checked: true,
                readonly: true,
                format: '%M:%S', // on purpose no hours to eliminate timezone differences
                primary: true,
                tooltip: 'here is some tooltipinfo'
            });
            body.append(this.formElement.html);
            this.node = Y.one('#'+this.formElement.nodeid);
            this.timenode = Y.one('span[data-for="'+this.formElement.nodeid+'"]');
            this.labelnode = this.timenode.previous();
        },
        tearDown : function () {
            delete this.formElement;
            this.node.remove(true);
            this.labelnode && this.labelnode.remove(true);
            Y.all('.formatvalue').remove(true);
            delete this.timenode;
        },
        'availablility node': function() {
            Y.Assert.isNotNull(this.node, 'time - formelement not created');
        },
        'availablility labelnode': function() {
            Y.Assert.isNotNull(this.labelnode, 'time - formelement\'s labelnode is not created');
        },
        'availablility timenode': function() {
            Y.Assert.isNotNull(this.timenode, 'time - formelement\'s timenode is not created');
        },
        'creation tagName': function() {
            Y.Assert.areEqual('BUTTON', this.node.get('tagName'), 'time - Wrong tag created');
        },
        'check type': function() {
            Y.Assert.areEqual('button', this.node.getAttribute('type'), 'time - Wrong type created');
        },
        'check checked': function() {
            Y.Assert.areEqual('', this.node.getAttribute('checked'), 'time - Wrong checked-attribute created');
        },
        'check name': function() {
            Y.Assert.areEqual('propertyname', this.node.getAttribute('name'), 'time - Wrong name created');
        },
        'check data': function() {
            Y.Assert.areEqual('somedata', this.node.getAttribute('data-someinfo'), 'time - Wrong data created');
        },
        'check placeholder': function() {
            Y.Assert.areEqual('', this.node.getAttribute('placeholder'), 'time - Wrong placeholder created');
        },
        'check required': function() {
            Y.Assert.areEqual('required', this.node.getAttribute('required'), 'time - Wrong value for required created');
        },
        'check disabled': function() {
            Y.Assert.isTrue(this.node.hasClass('pure-button-disabled'), 'time - Disabled didn\'t render the right classname');
        },
        'check primary': function() {
            Y.Assert.isFalse(this.node.hasClass('pure-button-primary'), 'time - Primary-button didn\'t render the right classname');
        },
        'check hidden': function() {
            Y.Assert.areEqual('hidden', this.labelnode.getAttribute('hidden'), 'date - Wrong value for label-hidden created');
        },
        'check hidden timenode': function() {
            Y.Assert.areEqual('hidden', this.timenode.getAttribute('hidden'), 'date - Wrong value for timenode-hidden created');
        },
        'check hidden buttonnode': function() {
            Y.Assert.areEqual('hidden', this.node.getAttribute('hidden'), 'date - Wrong value for buttonnode-hidden created');
        },
        'check fullselect': function() {
            Y.Assert.areEqual('', this.node.getAttribute('data-fullselect'), 'time - Wrong value for fullselect created');
        },
        'check initialfocus': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-initialfocus'), 'time - Wrong value for initialfocus created');
        },
        'check pattern': function() {
            Y.Assert.areEqual('', this.node.getAttribute('pattern'), 'time - Wrong value for pattern created');
        },
        'check classname': function() {
            Y.Assert.isTrue(this.timenode.hasClass('yui3-element-class'), 'time - Wrong value for element-classname created');
        },
        'check labelClassname': function() {
            Y.Assert.isTrue(this.labelnode.hasClass('yui3-label-class'), 'time - Wrong value for label-classname created');
        },
        'check focusable': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-focusable'), 'time - Wrong value for focusable created');
        },
        'check labelcontent': function() {
            Y.Assert.areEqual('this is the label', this.labelnode.get('text'), 'time - Wrong labelvalue created');
        },
        'check time': function() {
            Y.Assert.areEqual('30:00', this.timenode.get('text'), 'time - Wrong timevalue created');
        },
        'check data formelement': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-formelement'), 'time - Wrong value for formelement created');
        },
        'check icon': function() {
            Y.Assert.areEqual('<i class="itsaicon-datetime-time"></i>', this.node.getHTML(), 'time - Wrong icon created');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Creating date-element',
        setUp : function () {
            this.formElement = Y.ITSAFormElement.getElement('datetime', {
                value: new Date(2013, 0, 1, 12, 30, 0, 0),
                name: 'propertyname',
                label: 'this is the label',
                data: 'data-someinfo="somedata"',
                placeholder: 'placeholderText',
                required: true,
                disabled: true,
                hidden: true,
                fullselect: true,
                initialfocus: true,
                pattern: '[A-Za-z]{3}',
                classname: 'yui3-element-class',
                labelClassname: 'yui3-label-class',
                focusable: true,
                checked: true,
                readonly: true,
                format: '%Y-%m-%d %M:%S', // on purpose no hours to eliminate timezone differences
                primary: true,
                tooltip: 'here is some tooltipinfo'
            });
            body.append(this.formElement.html);
            this.node = Y.one('#'+this.formElement.nodeid);
            this.timenode = Y.one('span[data-for="'+this.formElement.nodeid+'"]');
            this.labelnode = this.timenode.previous();
        },
        tearDown : function () {
            delete this.formElement;
            this.node.remove(true);
            this.labelnode && this.labelnode.remove(true);
            Y.all('.formatvalue').remove(true);
            delete this.timenode;
        },
        'availablility node': function() {
            Y.Assert.isNotNull(this.node, 'datetime - formelement not created');
        },
        'availablility labelnode': function() {
            Y.Assert.isNotNull(this.labelnode, 'datetime - formelement\'s labelnode is not created');
        },
        'availablility timenode': function() {
            Y.Assert.isNotNull(this.timenode, 'datetime - formelement\'s timenode is not created');
        },
        'creation tagName': function() {
            Y.Assert.areEqual('BUTTON', this.node.get('tagName'), 'datetime - Wrong tag created');
        },
        'check type': function() {
            Y.Assert.areEqual('button', this.node.getAttribute('type'), 'datetime - Wrong type created');
        },
        'check checked': function() {
            Y.Assert.areEqual('', this.node.getAttribute('checked'), 'datetime - Wrong checked-attribute created');
        },
        'check name': function() {
            Y.Assert.areEqual('propertyname', this.node.getAttribute('name'), 'datetime - Wrong name created');
        },
        'check data': function() {
            Y.Assert.areEqual('somedata', this.node.getAttribute('data-someinfo'), 'datetime - Wrong data created');
        },
        'check placeholder': function() {
            Y.Assert.areEqual('', this.node.getAttribute('placeholder'), 'datetime - Wrong placeholder created');
        },
        'check required': function() {
            Y.Assert.areEqual('required', this.node.getAttribute('required'), 'datetime - Wrong value for required created');
        },
        'check disabled': function() {
            Y.Assert.isTrue(this.node.hasClass('pure-button-disabled'), 'datetime - Disabled didn\'t render the right classname');
        },
        'check primary': function() {
            Y.Assert.isFalse(this.node.hasClass('pure-button-primary'), 'datetime - Primary-button didn\'t render the right classname');
        },
        'check hidden': function() {
            Y.Assert.areEqual('hidden', this.labelnode.getAttribute('hidden'), 'date - Wrong value for label-hidden created');
        },
        'check hidden timenode': function() {
            Y.Assert.areEqual('hidden', this.timenode.getAttribute('hidden'), 'date - Wrong value for timenode-hidden created');
        },
        'check hidden buttonnode': function() {
            Y.Assert.areEqual('hidden', this.node.getAttribute('hidden'), 'date - Wrong value for buttonnode-hidden created');
        },
        'check fullselect': function() {
            Y.Assert.areEqual('', this.node.getAttribute('data-fullselect'), 'datetime - Wrong value for fullselect created');
        },
        'check initialfocus': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-initialfocus'), 'datetime - Wrong value for initialfocus created');
        },
        'check pattern': function() {
            Y.Assert.areEqual('', this.node.getAttribute('pattern'), 'datetime - Wrong value for pattern created');
        },
        'check classname': function() {
            Y.Assert.isTrue(this.timenode.hasClass('yui3-element-class'), 'datetime - Wrong value for element-classname created');
        },
        'check labelClassname': function() {
            Y.Assert.isTrue(this.labelnode.hasClass('yui3-label-class'), 'datetime - Wrong value for label=classname created');
        },
        'check focusable': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-focusable'), 'datetime - Wrong value for focusable created');
        },
        'check labelcontent': function() {
            Y.Assert.areEqual('this is the label', this.labelnode.get('text'), 'datetime - Wrong labelvalue created');
        },
        'check time': function() {
            Y.Assert.areEqual('2013-01-01 30:00', this.timenode.get('text'), 'datetime - Wrong timevalue created');
        },
        'check data formelement': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-formelement'), 'datetime - Wrong value for formelement created');
        },
        'check icon': function() {
            Y.Assert.areEqual('<i class="itsaicon-datetime-datetime"></i>', this.node.getHTML(), 'datetime - Wrong icon created');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Creating submitbutton',
        setUp : function () {
            this.formElement = Y.ITSAFormElement.getElement('submit', {
                value: 'current value',
                name: 'propertyname',
                label: 'this is the label',
                data: 'data-someinfo="somedata"',
                placeholder: 'placeholderText',
                required: true,
                disabled: true,
                hidden: true,
                fullselect: true,
                initialfocus: true,
                pattern: '[A-Za-z]{3}',
                classname: 'yui3-element-class',
                labelClassname: 'yui3-label-class',
                focusable: true,
                checked: true,
                readonly: true,
                format: '%Y-%M-%d',
                primary: true,
                spinbusy: true,
                labelHTML: 'press on this button',
                tooltip: 'here is some tooltipinfo'
            });
            body.append(this.formElement.html);
            this.node = Y.one('#'+this.formElement.nodeid);
            this.labelnode = Y.one('label[for="'+this.formElement.nodeid+'"]');
        },
        tearDown : function () {
            delete this.formElement;
            this.node.remove(true);
            this.labelnode && this.labelnode.remove(true);
            Y.all('.formatvalue').remove(true);
        },
        'availablility node': function() {
            Y.Assert.isNotNull(this.node, 'submit - formelement not created');
        },
        'availablility labelnode': function() {
            Y.Assert.isNull(this.labelnode, 'submit - formelement\'s labelnode is not created');
        },
        'creation tagName': function() {
            Y.Assert.areEqual('BUTTON', this.node.get('tagName'), 'submit - Wrong tag created');
        },
        'check type': function() {
            Y.Assert.areEqual('submit', this.node.getAttribute('type'), 'submit - Wrong type created');
        },
        'check subtype': function() {
            Y.Assert.areEqual('submit', this.node.getAttribute('data-buttontype'), 'submit - Wrong button subtype created');
        },
        'check value': function() {
            Y.Assert.areEqual('current value', this.node.getAttribute('value'), 'submit - Wrong value created');
        },
        'check checked': function() {
            Y.Assert.areEqual('', this.node.getAttribute('checked'), 'submit - Wrong checked-attribute created');
        },
        'check name': function() {
            Y.Assert.areEqual('propertyname', this.node.getAttribute('name'), 'submit - Wrong name created');
        },
        'check data': function() {
            Y.Assert.areEqual('somedata', this.node.getAttribute('data-someinfo'), 'submit - Wrong data created');
        },
        'check placeholder': function() {
            Y.Assert.areEqual('', this.node.getAttribute('placeholder'), 'submit - Wrong placeholder created');
        },
        'check required': function() {
            Y.Assert.areEqual('', this.node.getAttribute('required'), 'submit - Wrong value for required created');
        },
        'check disabled': function() {
            Y.Assert.isTrue(this.node.hasClass('pure-button-disabled'), 'submit - Disabled didn\'t render the right classname');
        },
        'check primary': function() {
            Y.Assert.isTrue(this.node.hasClass('pure-button-primary'), 'submit - Primary-button didn\'t render the right classname');
        },
        'check spinbusy': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-spinbusy'), 'submit - Wrong value for spinbusy created');
        },
        'check hidden': function() {
            Y.Assert.areEqual('hidden', this.node.getAttribute('hidden'), 'submit - Wrong value for hidden created');
        },
        'check fullselect': function() {
            Y.Assert.areEqual('', this.node.getAttribute('data-fullselect'), 'submit - Wrong value for fullselect created');
        },
        'check initialfocus': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-initialfocus'), 'submit - Wrong value for initialfocus created');
        },
        'check pattern': function() {
            Y.Assert.areEqual('', this.node.getAttribute('pattern'), 'submit - Wrong value for pattern created');
        },
        'check classname': function() {
            Y.Assert.isTrue(this.node.hasClass('yui3-element-class'), 'submit - Wrong value for classname created');
        },
        'check focusable': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-focusable'), 'submit - Wrong value for focusable created');
        },
        'check data formelement': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-formelement'), 'submit - Wrong value for formelement created');
        },
        'check tooltip': function() {
            Y.Assert.areEqual('here is some tooltipinfo', this.node.getAttribute('data-content'), 'submit - Wrong value for tooltip created');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Creating button',
        setUp : function () {
            this.formElement = Y.ITSAFormElement.getElement('button', {
                value: 'current value',
                name: 'propertyname',
                label: 'this is the label',
                data: 'data-someinfo="somedata"',
                placeholder: 'placeholderText',
                required: true,
                disabled: true,
                hidden: true,
                fullselect: true,
                initialfocus: true,
                pattern: '[A-Za-z]{3}',
                classname: 'yui3-element-class',
                labelClassname: 'yui3-label-class',
                focusable: true,
                checked: true,
                readonly: true,
                format: '%Y-%M-%d',
                primary: true,
                labelHTML: 'press on this button',
                tooltip: 'here is some tooltipinfo'
            });
            body.append(this.formElement.html);
            this.node = Y.one('#'+this.formElement.nodeid);
            this.labelnode = Y.one('label[for="'+this.formElement.nodeid+'"]');
        },
        tearDown : function () {
            delete this.formElement;
            this.node.remove(true);
            this.labelnode && this.labelnode.remove(true);
            Y.all('.formatvalue').remove(true);
        },
        'availablility node': function() {
            Y.Assert.isNotNull(this.node, 'button - formelement not created');
        },
        'availablility labelnode': function() {
            Y.Assert.isNull(this.labelnode, 'button - formelement\'s labelnode is not created');
        },
        'creation tagName': function() {
            Y.Assert.areEqual('BUTTON', this.node.get('tagName'), 'button - Wrong tag created');
        },
        'check type': function() {
            Y.Assert.areEqual('button', this.node.getAttribute('type'), 'button - Wrong type created');
        },
        'check subtype': function() {
            Y.Assert.areEqual('button', this.node.getAttribute('data-buttontype'), 'button - Wrong button subtype created');
        },
        'check value': function() {
            Y.Assert.areEqual('current value', this.node.getAttribute('value'), 'button - Wrong value created');
        },
        'check checked': function() {
            Y.Assert.areEqual('', this.node.getAttribute('checked'), 'button - Wrong checked-attribute created');
        },
        'check name': function() {
            Y.Assert.areEqual('propertyname', this.node.getAttribute('name'), 'button - Wrong name created');
        },
        'check data': function() {
            Y.Assert.areEqual('somedata', this.node.getAttribute('data-someinfo'), 'button - Wrong data created');
        },
        'check placeholder': function() {
            Y.Assert.areEqual('', this.node.getAttribute('placeholder'), 'button - Wrong placeholder created');
        },
        'check required': function() {
            Y.Assert.areEqual('', this.node.getAttribute('required'), 'button - Wrong value for required created');
        },
        'check disabled': function() {
            Y.Assert.isTrue(this.node.hasClass('pure-button-disabled'), 'button - Disabled didn\'t render the right classname');
        },
        'check primary': function() {
            Y.Assert.isTrue(this.node.hasClass('pure-button-primary'), 'button - Primary-button didn\'t render the right classname');
        },
        'check spinbusy': function() {
            Y.Assert.areEqual('', this.node.getAttribute('data-spinbusy'), 'button - Wrong value for spinbusy created');
        },
        'check hidden': function() {
            Y.Assert.areEqual('hidden', this.node.getAttribute('hidden'), 'button - Wrong value for hidden created');
        },
        'check fullselect': function() {
            Y.Assert.areEqual('', this.node.getAttribute('data-fullselect'), 'button - Wrong value for fullselect created');
        },
        'check initialfocus': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-initialfocus'), 'button - Wrong value for initialfocus created');
        },
        'check pattern': function() {
            Y.Assert.areEqual('', this.node.getAttribute('pattern'), 'button - Wrong value for pattern created');
        },
        'check classname': function() {
            Y.Assert.isTrue(this.node.hasClass('yui3-element-class'), 'button - Wrong value for classname created');
        },
        'check focusable': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-focusable'), 'button - Wrong value for focusable created');
        },
        'check data formelement': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-formelement'), 'button - Wrong value for formelement created');
        },
        'check tooltip': function() {
            Y.Assert.areEqual('here is some tooltipinfo', this.node.getAttribute('data-content'), 'button - Wrong value for tooltip created');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Creating submitbutton',
        setUp : function () {
            this.formElement = Y.ITSAFormElement.getElement('reset', {
                value: 'current value',
                name: 'propertyname',
                label: 'this is the label',
                data: 'data-someinfo="somedata"',
                placeholder: 'placeholderText',
                required: true,
                disabled: true,
                hidden: true,
                fullselect: true,
                initialfocus: true,
                spinbusy: false,
                pattern: '[A-Za-z]{3}',
                classname: 'yui3-element-class',
                labelClassname: 'yui3-label-class',
                focusable: true,
                checked: true,
                readonly: true,
                format: '%Y-%M-%d',
                primary: true,
                labelHTML: 'press on this button',
                tooltip: 'here is some tooltipinfo'
            });
            body.append(this.formElement.html);
            this.node = Y.one('#'+this.formElement.nodeid);
            this.labelnode = Y.one('label[for="'+this.formElement.nodeid+'"]');
        },
        tearDown : function () {
            delete this.formElement;
            this.node.remove(true);
            this.labelnode && this.labelnode.remove(true);
            Y.all('.formatvalue').remove(true);
        },
        'availablility node': function() {
            Y.Assert.isNotNull(this.node, 'reset - formelement not created');
        },
        'availablility labelnode': function() {
            Y.Assert.isNull(this.labelnode, 'reset - formelement\'s labelnode is not created');
        },
        'creation tagName': function() {
            Y.Assert.areEqual('BUTTON', this.node.get('tagName'), 'reset - Wrong tag created');
        },
        'check type': function() {
            Y.Assert.areEqual('reset', this.node.getAttribute('type'), 'reset - Wrong type created');
        },
        'check subtype': function() {
            Y.Assert.areEqual('reset', this.node.getAttribute('data-buttontype'), 'reset - Wrong button subtype created');
        },
        'check value': function() {
            Y.Assert.areEqual('current value', this.node.getAttribute('value'), 'reset - Wrong value created');
        },
        'check checked': function() {
            Y.Assert.areEqual('', this.node.getAttribute('checked'), 'reset - Wrong checked-attribute created');
        },
        'check name': function() {
            Y.Assert.areEqual('propertyname', this.node.getAttribute('name'), 'reset - Wrong name created');
        },
        'check data': function() {
            Y.Assert.areEqual('somedata', this.node.getAttribute('data-someinfo'), 'reset - Wrong data created');
        },
        'check placeholder': function() {
            Y.Assert.areEqual('', this.node.getAttribute('placeholder'), 'reset - Wrong placeholder created');
        },
        'check required': function() {
            Y.Assert.areEqual('', this.node.getAttribute('required'), 'reset - Wrong value for required created');
        },
        'check disabled': function() {
            Y.Assert.isTrue(this.node.hasClass('pure-button-disabled'), 'reset - Disabled didn\'t render the right classname');
        },
        'check primary': function() {
            Y.Assert.isTrue(this.node.hasClass('pure-button-primary'), 'reset - Primary-button didn\'t render the right classname');
        },
        'check hidden': function() {
            Y.Assert.areEqual('hidden', this.node.getAttribute('hidden'), 'reset - Wrong value for hidden created');
        },
        'check fullselect': function() {
            Y.Assert.areEqual('', this.node.getAttribute('data-fullselect'), 'reset - Wrong value for fullselect created');
        },
        'check spinbusy': function() {
            Y.Assert.areEqual('', this.node.getAttribute('data-spinbusy'), 'reset - Wrong value for spinbusy created');
        },
        'check initialfocus': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-initialfocus'), 'reset - Wrong value for initialfocus created');
        },
        'check pattern': function() {
            Y.Assert.areEqual('', this.node.getAttribute('pattern'), 'reset - Wrong value for pattern created');
        },
        'check classname': function() {
            Y.Assert.isTrue(this.node.hasClass('yui3-element-class'), 'reset - Wrong value for classname created');
        },
        'check focusable': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-focusable'), 'reset - Wrong value for focusable created');
        },
        'check data formelement': function() {
            Y.Assert.areEqual('true', this.node.getAttribute('data-formelement'), 'reset - Wrong value for formelement created');
        },
        'check tooltip': function() {
            Y.Assert.areEqual('here is some tooltipinfo', this.node.getAttribute('data-content'), 'reset - Wrong value for tooltip created');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Check label left',
        setUp : function () {
            this.formElement = Y.ITSAFormElement.getElement('text', {
                label: 'some label'
            });
            body.append(this.formElement.html);
            this.node = Y.one('#'+this.formElement.nodeid);
            this.labelnode = Y.one('label[for="'+this.formElement.nodeid+'"]');
        },
        tearDown : function () {
            delete this.formElement;
            this.node.remove(true);
            this.labelnode && this.labelnode.remove(true);
            Y.all('.formatvalue').remove(true);
        },
        'check pattern': function() {
            Y.Assert.areEqual(this.node.previous(), this.labelnode, 'Labelnode not found on the left side of the element');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Check label right',
        setUp : function () {
            this.formElement = Y.ITSAFormElement.getElement('text', {
                label: 'some label',
                switchlabel: true
            });
            body.append(this.formElement.html);
            this.node = Y.one('#'+this.formElement.nodeid);
            this.labelnode = Y.one('label[for="'+this.formElement.nodeid+'"]');
        },
        tearDown : function () {
            delete this.formElement;
            this.node.remove(true);
            this.labelnode && this.labelnode.remove(true);
            Y.all('.formatvalue').remove(true);
        },
        'check pattern': function() {
            Y.Assert.areEqual(this.node.next(), this.labelnode, 'Labelnode not found on the left side of the element');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Check valueposition before',
        setUp : function () {
            this.formElement = Y.ITSAFormElement.getElement('date', {
                label: 'some label',
                format: '%Y'
            });
            body.append(this.formElement.html);
            this.node = Y.one('#'+this.formElement.nodeid);
            this.labelnode = Y.one('label[for="'+this.formElement.nodeid+'"][data-labeldatetime="true"]');
            this.timenode = Y.one('span[data-for="'+this.formElement.nodeid+'"]');
        },
        tearDown : function () {
            delete this.formElement;
            this.node.remove(true);
            this.labelnode && this.labelnode.remove(true);
            Y.all('.formatvalue').remove(true);
            this.timenode.remove(true);
        },
        'check pattern': function() {
            Y.Assert.areEqual(this.node.previous(), this.timenode, 'Timenode not found on the left side of the dateelement');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Check valueposition before',
        setUp : function () {
            this.formElement = Y.ITSAFormElement.getElement('date', {
                label: 'some label',
                format: '%Y',
                switchvalue: true
            });
            body.append(this.formElement.html);
            this.node = Y.one('#'+this.formElement.nodeid);
            this.labelnode = Y.one('label[for="'+this.formElement.nodeid+'"][data-labeldatetime="true"]');
            this.timenode = Y.one('span[data-for="'+this.formElement.nodeid+'"]');
        },
        tearDown : function () {
            delete this.formElement;
            this.node.remove(true);
            this.labelnode && this.labelnode.remove(true);
            Y.all('.formatvalue').remove(true);
            this.timenode.remove(true);
        },
        'check pattern': function() {
            Y.Assert.areEqual(this.node.next(), this.timenode, 'Timenode not found on the left side of the dateelement');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Creating ITSACheckbox reacting on valuechange',
        setUp : function () {
            this.formElement = Y.ITSAFormElement.getElement(Y.ITSACheckbox, {
                widgetconfig: {
                    checked: true
                }
            });
            body.append(this.formElement.html);
            this.node = Y.one('#'+this.formElement.nodeid);
            this.labelnode = Y.one('label[for="'+this.formElement.nodeid+'"]');
            this.formElement.widget.set('checked', false);
        },
        tearDown : function () {
            var widgetInstance = this.formElement.widget;
            if (widgetInstance) {
                widgetInstance.destroy();
            }
            delete this.formElement;
            this.node.remove(true);
            this.labelnode && this.labelnode.remove(true);
        },
        'check value': function() {
            Y.Assert.isFalse(this.formElement.widget.get('checked'), 'ITSACheckbox - didn\'t get a falsy checked state when changed by JS');
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test', 'gallery-itsaformelement', 'gallery-itsacheckbox', 'gallery-itsadatetimepicker', 'panel' ] });

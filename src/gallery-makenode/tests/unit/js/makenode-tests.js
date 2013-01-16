YUI.add('makenode-tests', function(Y) {	Y.Test.Runner.add(suite);
    var A = Y.Assert,
        FORM = 'form',
        INPUT = 'input',
        BUTTON = 'button',
        VALUE = 'value',
        CBX = 'contentBox',
        testNode = Y.one('#test'),
        MN = null,
        mn = null;


    var suite = new Y.Test.Suite("TestSuite Name");

    suite.add(new Y.Test.Case({
        name: "tests template processor",
        setUp : function () {
            MN = Y.Base.create(
                'MakeNodeTest',
                Y.Widget,
                [Y.MakeNode],
                {
                    renderUI: function () {
                        this.get(CBX).append(this._makeNode());
                    }
                },
                {
                }
            );
        },

        tearDown : function () {
            mn.destroy();
            testNode.setContent('');
            MN = mn = null;
        },
        testConstants : function () {
            MN._TEMPLATE = '==={LBRACE}p prop{RBRACE}===';
            mn = new MN();
            mn.prop = 42;
            mn.render(testNode);
            A.areEqual('==={p prop}===',mn.get(CBX).getContent());
        },
        testP : function () {
            MN._TEMPLATE = '==={p prop}===';
            mn = new MN();
            mn.prop = 42;
            mn.render(testNode);
            A.areEqual('===42===',mn.get(CBX).getContent());
        },
        testM: function () {
            MN._TEMPLATE = '==={m method 3.14 null true false "this is a \\"test\\""}===';
            mn = new MN();
            mn.method = function (pi, n, t, f, s) {
                A.isNumber(pi);
                A.isNull(n);
                A.isTrue(t);
                A.isFalse(f);
                A.isString(s);
                return Y.Array(arguments).join(',');
            };
            mn.render(testNode);
            A.areEqual('===3.14,,true,false,this is a \"test\"===',mn.get(CBX).getContent());
        },
        testUnquotedString: function () {
            MN._TEMPLATE = '==={m method 3.14 null true false this is a "test"}===';
            mn = new MN();
            mn.method = function (pi, n, t, f, s) {
                A.isNumber(pi);
                A.isNull(n);
                A.isTrue(t);
                A.isFalse(f);
                A.isString(s);
                return Y.Array(arguments).join(',');
            };
            mn.render(testNode);
            A.areEqual('===3.14,,true,false,test===',mn.get(CBX).getContent());
        },
        testAt : function () {
            MN._TEMPLATE = '==={@ value}===';
            MN.ATTRS = {
                value: {
                    value: 'att value'
                }
            };
            mn = new MN();
            mn.render(testNode);
            A.areEqual('===att value===',mn.get(CBX).getContent());
            delete MN.ATTRS;
        },
        testC : function () {
            MN._TEMPLATE = '==={c input}===';
            MN._CLASS_NAMES = [INPUT];
            mn = new MN();
            mn.render(testNode);
            A.areEqual('===yui3-makenodetest-input===',mn.get(CBX).getContent());
            delete MN._CLASS_NAMES;
        },
        testS : function () {
            MN._TEMPLATE = '==={s text}===';
            MN.ATTRS = {
                strings: {
                    value: {
                        text: 'this is a test'
                    }
                }
            };
            mn = new MN();
            mn.render(testNode);
            A.areEqual('===this is a test===',mn.get(CBX).getContent());
            delete MN.ATTRS;
        },
        testSNested: function ()  {
            MN._TEMPLATE = '==={s text}===';
            MN.ATTRS = {
                strings: {
                    value: {
                        text: 'My favorite number is {p prop}, the answer to all'
                    }
                }
            };
            mn = new MN();
            mn.prop = 42;
            mn.render(testNode);
            A.areEqual('===My favorite number is 42, the answer to all===',mn.get(CBX).getContent());
            delete MN.ATTRS;
        },
        testWithIntl: function () {

            Y.use('intl', function (Y) {
                if (Y.Intl.add) {
                    Y.Intl.add('someModule','es_ES',{
                        text:'algún texto 1'
                    });
                    Y.Intl.setLang('someModule','es_ES');
                }

                MN._TEMPLATE = '==={s text}===';
                MN.ATTRS = {
                    strings: {
                        value: {
                            text: 'this is a test'
                        }
                    }
                };
                mn = new MN({
                    strings: Y.Intl.get('someModule')
                });
                mn.render(testNode);
                A.areEqual('===algún texto 1===',mn.get(CBX).getContent());
                delete MN.ATTRS;
            });
        },
        testTrue : function () {
            MN._TEMPLATE = '==={? {p prop} "true" "false"}===';
            mn = new MN();
            mn.prop = true;
            mn.render(testNode);
            A.areEqual('===true===',mn.get(CBX).getContent());
        },
        testFalse : function () {
            MN._TEMPLATE = '==={? {p prop} "true" "false"}===';
            mn = new MN();
            mn.prop = false;
            mn.render(testNode);
            A.areEqual('===false===',mn.get(CBX).getContent());
        },
        test1nested : function () {
            MN._TEMPLATE = '==={1 {p prop} "one" "many"}===';
            mn = new MN();
            mn.prop = 1;
            mn.render(testNode);
            A.areEqual('===one===',mn.get(CBX).getContent());
        },
        test12nested : function () {
            MN._TEMPLATE = '==={1 {p prop} "one" "many"}===';
            mn = new MN();
            mn.prop = 12;
            mn.render(testNode);
            A.areEqual('===many===',mn.get(CBX).getContent());
        }
    }));


    suite.add(new Y.Test.Case({
        name: "tests _classNames and _locateNodes",
        tearDown : function () {
            mn.destroy();
            testNode.setContent('');
            MN = mn = null;
        },
        testNodesGetTheirClasses : function () {
            MN = new Y.Base.create(
                'MakeNodeTest',
                Y.Widget,
                [Y.MakeNode],
                {
                    renderUI: function () {
                        this.get(CBX).append(this._makeNode());
                        this._locateNodes();
                    },
                    value: 5
                },
                {
                    _CLASS_NAMES: [INPUT, FORM, 'hyphe-nated'],
                    _TEMPLATE: '<form class="{c form}"><input class="{c input}" value="{p value}" /><input class="{c hyphe-nated}" /><\/form>'
                }
            );
            mn = new MN();
            mn.render(testNode);
            A.areEqual('yui3-makenodetest-input',mn._classNames[INPUT]);
            A.areEqual('yui3-makenodetest-form',mn._classNames[FORM]);
            A.areEqual('yui3-makenodetest-hyphe-nated',mn._classNames['hyphe-nated']);
            A.isTrue(mn._inputNode.hasClass('yui3-makenodetest-input'));
            A.isTrue(mn._formNode.hasClass('yui3-makenodetest-form'));
            A.isTrue(mn._hypheNatedNode.hasClass('yui3-makenodetest-hyphe-nated'));
            A.areEqual(5,mn._inputNode.get(VALUE));
        },
        testStdModGetTheirClasses : function () {
            MN = new Y.Base.create(
                'MakeNodeTest',
                Y.Widget,
                [Y.MakeNode, Y.WidgetStdMod],
                {
                    renderUI: function () {
                        this.set('bodyContent', this._makeNode());
                        this._locateNodes();
                    },
                    value: 5
                },
                {
                    _CLASS_NAMES: [INPUT, FORM, 'hyphe-nated'],
                    _TEMPLATE: '<form class="{c form}"><input class="{c input}" value="{p value}" /><input class="{c hyphe-nated}" /><\/form>'
                }
            );
            mn = new MN();
            mn.render(testNode);
            A.areEqual('yui3-makenodetest-input',mn._classNames[INPUT]);
            A.areEqual('yui3-makenodetest-form',mn._classNames[FORM]);
            A.areEqual('yui3-makenodetest-hyphe-nated',mn._classNames['hyphe-nated']);
            A.areEqual('yui3-widget-bd',mn._classNames['BODY']);
            A.isTrue(mn._inputNode.hasClass('yui3-makenodetest-input'));
            A.isTrue(mn._formNode.hasClass('yui3-makenodetest-form'));
            A.isTrue(mn._hypheNatedNode.hasClass('yui3-makenodetest-hyphe-nated'));
            A.areSame(mn._BODYNode, mn.getStdModNode('body'));
            A.areSame(mn._BODYNode.one('.' + mn._classNames[FORM]), mn._formNode );
            A.areEqual(5,mn._inputNode.get(VALUE));
        },
        testLocateOnlySomeNodes : function () {
            MN = Y.Base.create(
                'MakeNodeTest',
                Y.Widget,
                [Y.MakeNode],
                {
                    renderUI: function () {
                        this.get(CBX).append(this._makeNode());
                        this._locateNodes(INPUT);
                    },
                    value: 5
                },
                {
                    _CLASS_NAMES: [INPUT, FORM, 'hyphe-nated'],
                    _TEMPLATE: '<form class="{c form}"><input class="{c input}" value="{p value}" /><input class="{c hyphe-nated}" /><\/form>'
                }
            );
            mn = new MN();
            mn.render(testNode);
            A.areEqual('yui3-makenodetest-input',mn._classNames[INPUT]);
            A.areEqual('yui3-makenodetest-form',mn._classNames[FORM]);
            A.areEqual('yui3-makenodetest-hyphe-nated',mn._classNames['hyphe-nated']);
            A.isTrue(mn._inputNode.hasClass('yui3-makenodetest-input'));
            A.isUndefined(mn._formNode);
            A.areEqual(5,mn._inputNode.get(VALUE));
        }
    }));

    suite.add(new Y.Test.Case({
        name: "tests _Events",
        setUp : function () {
            MN = Y.Base.create(
                'MakeNodeTest',
                Y.Widget,
                [Y.MakeNode],
                {
                    renderUI: function () {
                        this.get(CBX).append(this._makeNode());
                        this._locateNodes();
                    },
                    value: 5,

                    inputChanged: false,
                    buttonClicked: false,
                    inputValueChanged: false,
                    delegatedButtonClick: false,
                    onDirectionKey: false,
                    _afterInputChange: function (ev) {
                        this.inputChanged = true;
                    },
                    _afterClick: function (ev) {
                        this.buttonClicked = true;
                    },
                    _afterInputValueChange: function (ev) {
                        this.inputValueChanged = true;
                    },
                    _delegateButtonClick: function (ev) {
                        this.delegatedButtonClick = true;
                    },
                    _onDirectionKey: function (ev) {
                        this.onDirectionKey = true;
                    }
                },
                {
                    _CLASS_NAMES: [INPUT, FORM, BUTTON],
                    _TEMPLATE: '<input class="{c input}" value="{p value}" /><button class="{c button}">Ok<\/button>',
                    _EVENTS: {
                        input: [
                            'change',
                            'valueChange',
                            {
                                type: 'key',
                                fn:'_onDirectionKey',
                                args:"38, 40, 33, 34"
                            }
                        ],
                        button: [
                            {type: 'click', fn: '_afterClick'},
                            {type: 'click', when: 'delegate'}
                        ]
                    }

                }
            );
        },

        tearDown : function () {
            mn.destroy();
            testNode.setContent('');
            MN = mn = null;
        },
        testEventsGetFired : function () {
            mn = new MN();
            mn.render(testNode);
            mn._inputNode.simulate('change');
            mn._buttonNode.simulate('click');
            mn._inputNode.simulate("keypress", { keyCode: 38 });
            A.isTrue(mn.inputChanged, 'inputChanged');
            A.isTrue(mn.buttonClicked, 'buttonClicked');
            A.isTrue(mn.delegatedButtonClick, 'delegatedButtonClick');
            A.isTrue(mn.onDirectionKey, 'onDirectionKey');
            mn._inputNode.focus();
            mn._inputNode.focus();
            mn._inputNode.set('value','whatever');
            this.wait(function () {
                A.isTrue(mn.inputValueChanged, 'inputValueChanged');
            },200);
        }

    }));


    suite.add(new Y.Test.Case({
        name: "tests _uiSetXxxx",
        setUp : function () {
            MN = Y.Base.create(
                'MakeNodeTest',
                Y.Widget,
                [Y.MakeNode],
                {
                    renderUI: function () {
                        this.get(CBX).append(this._makeNode());
                        this._locateNodes();
                    },
                    _uiSetValue: function (value) {
                        this._inputNode.set(VALUE, value);
                    }
                },
                {
                    _CLASS_NAMES: [INPUT, FORM],
                    _TEMPLATE: '<form class="{c form}"><input class="{c input}" value="{@ value}" /><\/form>',
                    ATTRS: {
                        value: {
                            value: 5
                        }
                    }
                }
            );
        },

        tearDown : function () {
            mn.destroy();
            testNode.setContent('');
            MN = mn = null;
        },
        testValueThroughTemplate : function () {
            mn = new MN();
            mn.render(testNode);

            A.areEqual(5, mn._inputNode.get(VALUE));
            mn.set(VALUE, 3);
            A.areEqual(5, mn._inputNode.get(VALUE)); // should not change
        },
        testValueThroughSync : function () {
            MN._ATTRS_2_UI = {
                SYNC: VALUE
            };
            MN._TEMPLATE = '<form class="{c form}"><input class="{c input}" /><\/form>';
            mn = new MN();
            mn.render(testNode);

            A.areEqual(5, mn._inputNode.get(VALUE));
            mn.set(VALUE, 3);
            A.areEqual(5, mn._inputNode.get(VALUE)); // should not change
        },
        testValueBound : function () {
            MN._ATTRS_2_UI = {
                SYNC: VALUE,
                BIND: VALUE
            };
            MN._TEMPLATE = '<form class="{c form}"><input class="{c input}" /><\/form>';
            mn = new MN();
            mn.render(testNode);

            A.areEqual(5, mn._inputNode.get(VALUE));
            mn.set(VALUE, 3);
            A.areEqual(3, mn._inputNode.get(VALUE));
        }


    }));

    var MNChild, mnChild;
    suite.add(new Y.Test.Case({
        name: "tests inheritance",
        setUp : function () {
            MN = Y.Base.create(
                'MakeNodeTest',
                Y.Widget,
                [Y.MakeNode],
                {
                    renderUI: function () {
                        this.get(CBX).append(this._makeNode());
                        this._locateNodes();
                    },
                    value: 5
                },
                {
                    _CLASS_NAMES: [INPUT, FORM],
                    _TEMPLATE: '<form class="{c form}"><input class="{c input}" value="{p value}" /><\/form>'
                }
            );
            MNChild = Y.Base.create(
                'MakeNodeTestChild',
                MN,
                {
                },
                {
                }
            );
        },

        tearDown : function () {
            mnChild.destroy();
            if (mnChild) {
                mnChild.destroy();
            }
            if (mn) {
                mn.destroy();
            }
            testNode.setContent('');
            MN = mn = MNChild = mnChild = null;
        },
        testNodesKeepTheirClassNames : function () {
            mnChild = new MNChild();
            mnChild.render(testNode);
            A.areEqual('yui3-makenodetest-input',mnChild._classNames[INPUT]);
            A.areEqual('yui3-makenodetest-form',mnChild._classNames[FORM]);
            A.isTrue(mnChild._inputNode.hasClass('yui3-makenodetest-input'));
            A.isTrue(mnChild._formNode.hasClass('yui3-makenodetest-form'));
            A.areEqual(5,mnChild._inputNode.get(VALUE));
        },
        testNodesGetTheRightClasses : function () {
            MNChild._CLASS_NAMES = [BUTTON];
            MNChild._TEMPLATE = '<form class="{c form}"><input class="{c input}" value="{p value}" /><button class="{c button}">Ok<\/button><\/form>';
            mnChild = new MNChild();
            mnChild.render(testNode);
            A.areEqual('yui3-makenodetest-input',mnChild._classNames[INPUT]);
            A.areEqual('yui3-makenodetest-form',mnChild._classNames[FORM]);
            A.areEqual('yui3-makenodetestchild-button',mnChild._classNames[BUTTON]);
            A.isTrue(mnChild._inputNode.hasClass('yui3-makenodetest-input'));
            A.isTrue(mnChild._formNode.hasClass('yui3-makenodetest-form'));
            A.isTrue(mnChild._buttonNode.hasClass('yui3-makenodetestchild-button'));
            A.areEqual(5,mnChild._inputNode.get(VALUE));

        }
    }));
    suite.add(new Y.Test.Case({
        name: "tests after attribute change",
        setUp : function () {
            MN = Y.Base.create(
                'MakeNodeTest',
                Y.Widget,
                [Y.MakeNode],
                {
                    _afterThisValueChange: function (ev) {
                        this.actualValue = ev.newVal;
                    }
                },
                {
                    _TEMPLATE: '<input class="{c input}">',
                    _CLASS_NAMES: [INPUT],
                    _EVENTS: {
                        THIS: 'valueChange'
                    },
                    ATTRS: {
                        value: {
                            value: 5
                        }
                    }
                }
            );
        },
        tearDown : function () {
            if (mn) {
                mn.destroy();
            }
            testNode.setContent('');
            MN = mn = null;
        },
        testOnInit: function () {
            mn = new MN({value:42}).render(testNode);
            A.isUndefined(mn.actualValue,'value should remain undefined');
        },
        testSetLater: function () {
            mn = new MN().render(testNode);
            mn.set('value',42);
            A.areEqual(42,mn.actualValue,'value should have changed to 42');
        },
        testSetPrevented : function () {
            MN._EVENTS.THIS = [MN._EVENTS.THIS, {type:'valueChange',when:'before'}];
            MN.prototype._beforeThisValueChange =  function (ev) {
                this.beforeValueChanged = true;
                ev.halt(true);
            };
            mn = new MN().render(testNode);
            mn.set('value',42);
            A.isTrue(mn.beforeValueChanged, 'beforeValueChanged');
            A.isUndefined(mn.actualValue,'actualValue should remain undefined');
            A.areEqual(5,mn.get('value'),'value should have remained at 5');
        }
    }));

    suite.add(new Y.Test.Case({
        setUp : function () {
            MN = Y.Base.create(
                'AfterAttributeChange',
                Y.Base,
                [],
                {
                    initializer: function () {
                        this.after('valueChange',this._afterValueChange, this);
                    },
                    _afterValueChange: function (ev) {
                        this.actualValue = ev.newVal;
                    }
                },
                {
                    _TEMPLATE: '<input class="{c input}">',
                    _CLASS_NAMES: [INPUT],
                    ATTRS: {
                        value: {
                            value: 5
                        }
                    }
                }
            );
        },
        tearDown : function () {
            mn.destroy();
            MN = mn = null;
        },
        testOnInit: function () {
            mn = new MN({value:42});
            A.isUndefined(mn.actualValue,'value will remain undefined, but shouldn\'t');
        },
        testSetLater: function () {
            mn = new MN();
            mn.set('value',42);
            A.areEqual(42,mn.actualValue,'value should have changed to 42');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Auto renderUI',
        tearDown : function () {
            mn.destroy();
            MN = mn = null;
        },
        testAutoRenderUI: function () {
            MN = Y.Base.create(
                'MakeNodeTest',
                Y.Widget,
                [Y.MakeNode],
                {
                },
                {
                    _TEMPLATE: '<input class="{c input}">',
                    _CLASS_NAMES: [INPUT]
                }
            );
            mn = new MN().render(testNode);
            A.areSame(testNode.one(INPUT), mn._inputNode);
            A.isTrue(mn._inputNode.hasClass(mn._classNames[INPUT]));
        },
        testNoAutoRenderUI: function () {
            MN = Y.Base.create(
                'MakeNodeTest',
                Y.Widget,
                [Y.MakeNode],
                {
                    renderUI: function () {
                        this.get('contentBox').append(this._makeNode('<label class="pepe" />'));
                    }
                },
                {
                }
            );
            MNChild = Y.Base.create(
                'MakeNodeTestChild',
                MN,
                [],
                {
                },
                {
                    _TEMPLATE: '<input class="{c input}">',
                    _CLASS_NAMES: [INPUT]
                }
            );
            mn = new MNChild().render(testNode);
            A.isTrue(testNode.one('label').hasClass('pepe'));
            A.isUndefined(mn._inputNode);
        }
    }));
    suite.add(new Y.Test.Case({
        name: 'Nested objects',
        testNestedObjects: function () {
            MN = Y.Base.create(
                'MakeNodeTest',
                Y.Widget,
                [Y.MakeNode],
                {
                    prop: null
                },
                {
                    _TEMPLATE: '{n p prop @ attr}'
                }
            );
            var MNOther = Y.Base.create(
                'other',
                Y.Base,
                [],
                {
                },
                {
                    ATTRS: {
                        attr: {
                            value: 'works'
                        }
                    }
                }
            );
            var mnOther = new MNOther();
            mn = new MN();
            mn.prop = mnOther;
            mn.render(testNode);
            A.areEqual('works', testNode.one('.' + mn._classNames['content']).get('innerHTML'));
            mnOther.destroy();
            mn.destroy();
            mn = MN = MNOther = null;
        },
        testBadlyNestedObjects: function () {
            MN = Y.Base.create(
                'MakeNodeTest',
                Y.Widget,
                [Y.MakeNode],
                {
                    prop: null
                },
                {
                    _TEMPLATE: '{n p prop @ attr x}'
                }
            );
            var MNOther = Y.Base.create(
                'other',
                Y.Base,
                [],
                {
                },
                {
                    ATTRS: {
                        attr: {
                            value: 'works'
                        }
                    }
                }
            );
            var mnOther = new MNOther();
            mn = new MN();
            mn.prop = mnOther;
            mn.render(testNode);
            A.areEqual('{n p prop @ attr x}', testNode.one('.' + mn._classNames['content']).get('innerHTML'));
            mnOther.destroy();
            mn.destroy();
            mn = MN = MNOther = null;
        }
    }));
    suite.add(new Y.Test.Case({
        name: 'test _PUBLISH',
        testPublish: function () {
            var count = 0;
            MN = Y.Base.create(
                'MakeNodeTest',
                Y.Widget,
                [Y.MakeNode],
                {
                    worked: false,
                    _defSomeEventFn: function () {
                        this.worked = true;
                    }
                },
                {
                    _TEMPLATE: '  ',
                    _PUBLISH: {
                        someEvent: {
                            defaultFn: '_defSomeEventFn',
                            fireOnce:true
                        }
                    }
                }
            );
            mn = new MN();
            mn.render(testNode);
            mn.after('someEvent', function (ev) {
                A.areEqual('MakeNodeTest:someEvent', ev.type);
                count++;
            });
            A.isFalse(mn.worked);
            A.areEqual(0, count);
            mn.fire('someEvent');
            A.isTrue(mn.worked);
            A.areEqual(1, count);
            mn.fire('someEvent');
            A.areEqual(1, count);
        }
    }));




    Y.Test.Runner.add(suite);

},'', { requires: ['node','base', 'widget', 'gallery-makenode','test', 'console','node-event-simulate', 'event-valuechange', 'widget-stdmod', 'event-key' ] });

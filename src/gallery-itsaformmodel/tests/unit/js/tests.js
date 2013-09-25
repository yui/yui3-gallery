YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-itsaformmodel'),
        body = Y.one('body'),
        model, model2, model3;

    Y.MyFormModel = Y.Base.create('formmodel', Y.ITSAFormModel, [], {}, {
        ATTRS: {
            text: {
                value: 'Marco Asbreuk',
                formtype: 'text'
            },
            text1: {
                value: 'Marco Asbreuk',
                formtype: 'text'
            },
            text2: {
                value: 'Marco Asbreuk',
                formtype: 'text'
            },
            text3: {
                value: 'Marco Asbreuk',
                formtype: 'text'
            },
            text4: {
                value: 'Marco Asbreuk',
                formtype: 'text'
            },
            text5: {
                value: 'Marco Asbreuk',
                formtype: 'text'
            },
            text6: {
                value: 'Marco Asbreuk',
                formtype: 'text'
            },
            slider: {
                value: 10,
                formtype: Y.Slider
            },
            slider2: {
                value: 10,
                formtype: Y.Slider
            },
            slider3: {
                value: 10,
                formtype: Y.Slider
            }
        }
    });
    model = new Y.MyFormModel();
    model2 = new Y.MyFormModel();
    model3 = new Y.MyFormModel();
    model.setLifeUpdate(true);

    suite.add(new Y.Test.Case({
        name: 'Attributes to UI',
        setUp : function () {
            body.append(model.renderFormElement('text'));
            body.append(model.renderFormElement('slider'));
        },
        tearDown : function () {
            var formelementsText = model.getCurrentFormElements('text'),
                firstelementText = formelementsText && formelementsText[0],
                nodetext = firstelementText && firstelementText.node,
                formelementsSlider = model.getCurrentFormElements('slider'),
                firstelementSlider = formelementsSlider && formelementsSlider[0],
                nodeslider = firstelementSlider && firstelementSlider.node;
            if (nodetext) {
                nodetext.remove(true);
            }
            if (nodeslider) {
                nodeslider.remove(true);
            }
        },
        'text going into elements': function() {
            Y.Assert.areEqual('Marco Asbreuk', model.getUI('text'), 'text-attribute value did not get into a UI with the right value');
        },
        'Y.Slider going into elements': function() {
            var formelementsSlider = model.getCurrentFormElements('slider'),
                firstelementSlider = formelementsSlider && formelementsSlider[0],
                slider = firstelementSlider && firstelementSlider.widget;
            slider.renderPromise().then(
                function() {
                    Y.Assert.areEqual(10, model.getUI('slider'), 'Slider-attributes value did not get into a UI with the right value');
                },
                function(e) {
                    Y.fail('Slider-attributes value did not get into a UI with the right value '+e);
                }
            );
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Attributes to UI when changed intermediate',
        setUp : function () {
            var text4 = model.renderFormElement('text4'),
                slider3 = model.renderFormElement('slider3');
            model.set('text4', 'Its Asbreuk', {silent: true}); // silent, to suppress itsadialog
            model.set('slider3', 15, {silent: true}); // silent, to suppress itsadialog
            body.append(text4);
            body.append(slider3);
        },
        tearDown : function () {
            var formelementsText = model.getCurrentFormElements('text4'),
                firstelementText = formelementsText && formelementsText[0],
                nodetext = firstelementText && firstelementText.node,
                formelementsSlider = model.getCurrentFormElements('slider3'),
                firstelementSlider = formelementsSlider && formelementsSlider[0],
                nodeslider = firstelementSlider && firstelementSlider.node;
            if (nodetext) {
                nodetext.remove(true);
            }
            if (nodeslider) {
                nodeslider.remove(true);
            }
        },
        'text going into elements': function() {
            this.wait(function() {
                Y.Assert.areEqual('Its Asbreuk', model.getUI('text4'), 'text-attribute value did not get into a UI with the right value when attribute changed before UI was rendered');
            }, 1000);
        },
        'Y.Slider going into elements': function() {
            this.wait(function() {
                var formelementsSlider = model.getCurrentFormElements('slider3'),
                    firstelementSlider = formelementsSlider && formelementsSlider[0],
                    slider = firstelementSlider && firstelementSlider.widget;
                slider.renderPromise().then(
                    function() {
                        Y.Assert.areEqual(15, model.getUI('slider'), 'Slider-attributes value did not get into a UI with the right value when attribute changed before UI was rendered');
                    },
                    function(e) {
                        Y.fail('Slider-attributes value did not get into a UI with the right value '+e);
                    }
                );
            }, 1000);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'UI to model',
        setUp : function () {
            body.append(model.renderFormElement('text2'));
            body.append(model.renderFormElement('slider2'));
            var formelementsText = model.getCurrentFormElements('text2'),
                firstelementText = formelementsText && formelementsText[0],
                nodetext2 = firstelementText && firstelementText.node,
                formelementsSlider = model.getCurrentFormElements('slider2'),
                firstelementSlider = formelementsSlider && formelementsSlider[0],
                slider2 = firstelementSlider && firstelementSlider.widget;
            nodetext2.set('value', 'Its Asbreuk');
            model.UIToModel(); // even if setLifeUpdate===true, it wasn't triggered by just set('value')
        },
        tearDown : function () {
            var formelementsText = model.getCurrentFormElements('text2'),
                firstelementText = formelementsText && formelementsText[0],
                nodetext = firstelementText && firstelementText.node,
                formelementsSlider = model.getCurrentFormElements('slider2'),
                firstelementSlider = formelementsSlider && formelementsSlider[0],
                nodeslider = firstelementSlider && firstelementSlider.node;
            if (nodetext) {
                nodetext.remove(true);
            }
            if (nodeslider) {
                nodeslider.remove(true);
            }
        },
        'UI-text going into model': function() {
            Y.Assert.areEqual('Its Asbreuk', model.get('text2'), 'UI-text value did not get into the model-attribute with the right value');
        },
        'UI-Y.Slider going into model': function() {
            var formelementsSlider = model.getCurrentFormElements('slider2'),
                firstelementSlider = formelementsSlider && formelementsSlider[0],
                slider2 = firstelementSlider && firstelementSlider.widget;
            slider2.renderPromise().then(
                function() {
                    slider2.set('value', 15);
                    Y.Assert.areEqual(15, model.getUI('slider2'), 'Slider-value did not get into the model-attribute with the right value');
                },
                function(e) {
                    Y.fail('Slider-value did not get into the model-attribute with the right value '+e);
                }
            );
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'UI to model by button',
        setUp : function () {
            body.append(model.renderFormElement('text3'));
            body.append(model.renderSubmitBtn(null, {name: 'submitbtn'}));
        },
        tearDown : function () {
            var formelementsText = model.getCurrentFormElements('text3'),
                firstelementText = formelementsText && formelementsText[0],
                nodetext = firstelementText && firstelementText.node,
                formelementsSubmit = model.getCurrentFormElements('submitbtn'),
                firstelementSubmit = formelementsSubmit && formelementsSubmit[0],
                nodesubmit = firstelementSubmit && firstelementSubmit.node;
            if (nodetext) {
                nodetext.remove(true);
            }
            if (nodesubmit) {
                nodesubmit.remove(true);
            }
        },
        'UI-text going into model by pressing submit': function() {
            var instance = this,
                formelementsText = model.getCurrentFormElements('text3'),
                firstelementText = formelementsText && formelementsText[0],
                nodetext3 = firstelementText && firstelementText.node,
                formelementsSubmit = model.getCurrentFormElements('submitbtn');
                firstelementSubmit = formelementsSubmit && formelementsSubmit[0];
                nodesubmit = firstelementSubmit && firstelementSubmit.node;
            // wait 1 second, for Y.Node.availablePromise() will reset the value once inserted in the dom
            Y.later(1000, null, function() {
                nodetext3.set('value', 'Its Asbreuk');
            });
            model.after('submit', function() {
                instance.resume(function(){
                    // delay to make sure submit finished its asynchroinious action
                    instance.wait(function() {
                       Y.Assert.areEqual('Its Asbreuk', model.get('text3'), 'UI-text value did not get into the model-attribute with the right value by pressing submit');
                    }, 1000);
                });
            });
            if (nodesubmit) {
                Y.later(1500, null, function() {
                    nodesubmit.simulate('click'); // even if setLifeUpdate===true, it wasn't triggered by just set('value')
                });
            }
            instance.wait(4000);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Check size internal hashes growing',
        setUp : function () {
            body.append(model2.renderFormElement('text'));
            body.append(model2.renderFormElement('text'));
            body.append(model2.renderFormElement('text'));
            body.append(model2.renderSubmitBtn(null, {name: 'submitbtn'}));
        },
        tearDown : function () {
            var formelementsText = model2.getCurrentFormElements('text');
            Y.Array.each(
                formelementsText,
                function(formelementText) {
                    nodetext = formelementText.node;
                    if (nodetext) {
                        nodetext.remove(true);
                    }
                }
            );
            var formelementsSubmit = model2.getCurrentFormElements('submitbtn'),
                firstelementSubmit = formelementsSubmit && formelementsSubmit[0],
                nodesubmit = firstelementSubmit && firstelementSubmit.node;
            if (nodesubmit) {
                nodesubmit.remove(true);
            }
        },
        'size instance._FORM_elements formmodel._FORM_elements': function() {
            Y.Assert.areEqual(4, Y.Object.size(model2._FORM_elements), 'formmodel._FORM_elements has the wrong object-size');
        },
        'size instance._FORM_elements formmodel._ATTRS_nodes': function() {
            Y.Assert.areEqual(1, Y.Object.size(model2._ATTRS_nodes), 'formmodel._ATTRS_nodes has the wrong object-size');
        },
        'size instance._FORM_elements formmodel._ATTRS_nodes one element': function() {
            Y.Assert.areEqual(9, model2._ATTRS_nodes['text'].length, 'formmodel._ATTRS_nodes[attribute] has the wrong arraysize');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Check size internal hashes when deleting',
        setUp : function () {
            body.append(model3.renderFormElement('text1'));
            body.append(model3.renderFormElement('text1'));
            body.append(model3.renderFormElement('text1'));
            body.append(model3.renderSubmitBtn(null, {name: 'submitbtn'}));
            var formelementsText = model3.getCurrentFormElements('text1'),
                promisehash = [],
                nodetext;
            Y.Array.each(
                formelementsText,
                function(formelementText) {
                    nodetext = formelementText.node;
                    if (nodetext) {
                        promisehash.push(Y.Node.unavailablePromise('#'+formelementText.nodeid));
                        nodetext.remove(true);
                    }
                }
            );
            var formelementsSubmit = model3.getCurrentFormElements('submitbtn'),
                firstelementSubmit = formelementsSubmit && formelementsSubmit[0],
                nodesubmit = firstelementSubmit && firstelementSubmit.node;
            if (nodesubmit) {
                promisehash.push(Y.Node.unavailablePromise('#'+firstelementSubmit.nodeid));
                nodesubmit.remove(true);
            }
            this.allNodesRemovedPromise = Y.batch.apply(Y, promisehash);
        },
        'size instance._FORM_elements - after cleaning up': function() {
            var instance = this;
            this.allNodesRemovedPromise.then(
                function() {
                    instance.resume(function(){
                        Y.Assert.areEqual(4, Y.Object.size(model3._FORM_elements), 'formmodel._FORM_elements has the wrong object-size - after cleaning up');
                    });
                },
                function(reason) {
                    instance.resume(function(){
                        Y.Assert.fail('formmodel._FORM_elements has the wrong object-size - after cleaning up '+reason);
                    });
                }
            );
            instance.wait(2000);
        },
        'size instance._ATTRS_nodes - after cleaning up': function() {
            var instance = this;
            this.allNodesRemovedPromise.then(
                function() {
                    instance.resume(function(){
                        Y.Assert.areEqual(1, Y.Object.size(model3._ATTRS_nodes), 'formmodel._ATTRS_nodes has the wrong object-size - after cleaning up');
                    });
                },
                function(reason) {
                    instance.resume(function(){
                        Y.Assert.fail('formmodel._ATTRS_nodes has the wrong object-size - after cleaning up '+reason);
                    });
                }
            );
            instance.wait(2000);
        },
        'size instance._ATTRS_nodes - after cleaning up - one attribute': function() {
            var instance = this;
            this.allNodesRemovedPromise.then(
                function() {
                    instance.resume(function(){
                        Y.Assert.areEqual(9, model3._ATTRS_nodes['text1'].length, 'formmodel._ATTRS_nodes[attribute] has the wrong arraysize - after cleaning up');
                    });
                },
                function(reason) {
                    instance.resume(function(){
                        Y.Assert.fail('formmodel._ATTRS_nodes[attribute] has the wrong arraysize - after cleaning up '+reason);
                    });
                }
            );
            instance.wait(2000);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'setResetAttrs test 1',
        setUp : function () {
            body.append(model.renderFormElement('text5'));
            model.set('text5', 'Its Asbreuk', {silent: true}); // silent, to suppress itsadialog
            model.reset();
        },
        tearDown : function () {
            var formelementsText = model.getCurrentFormElements('text5'),
                firstelementText = formelementsText && formelementsText[0],
                nodetext = firstelementText && firstelementText.node;
            if (nodetext) {
                nodetext.remove(true);
            }
        },
        'reset test': function() {
            Y.Assert.areEqual('Marco Asbreuk', model.getUI('text5'), 'text-attribute value did not reset');
        },
    }));

    suite.add(new Y.Test.Case({
        name: 'setResetAttrs test 2',
        setUp : function () {
            body.append(model.renderFormElement('text6'));
            model.set('text6', 'Its Asbreuk', {silent: true}); // silent, to suppress itsadialog
            model.setResetAttrs();
            model.set('text6', 'Something else', {silent: true}); // silent, to suppress itsadialog
            model.reset();
        },
        tearDown : function () {
            var formelementsText = model.getCurrentFormElements('text6'),
                firstelementText = formelementsText && formelementsText[0],
                nodetext = firstelementText && firstelementText.node;
            if (nodetext) {
                nodetext.remove(true);
            }
        },
        'setResetAttrs test': function() {
            Y.Assert.areEqual('Its Asbreuk', model.getUI('text6'), 'text-attribute value did not reset well after setResetAttrs()');
        },
    }));

    suite.add(new Y.Test.Case({
        name: 'buttonvalues and labels',
        setUp : function () {
            body.append('<div id="buttoncheck">'+model.renderSubmitBtn('<i>mylabel</i>')+'</div>');
        },
        'checkValue test': function() {
            var btn = Y.one('#buttoncheck button');
            Y.Assert.areEqual('submit', btn && btn.get('value'), 'button\'s value is not set right');
        },
        'checkLabel test': function() {
            var btn = Y.one('#buttoncheck button');
            Y.Assert.areEqual('<i>mylabel</i>', btn && btn.getHTML(), 'button\'s value is not set right');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'buttonvalues and labels when customized',
        setUp : function () {
            body.append('<div id="buttoncheck2">'+model.renderSubmitBtn('<i>mylabel</i>', {value: 'othervalue'})+'</div>');
        },
        'checkValue test 2': function() {
            var btn = Y.one('#buttoncheck2 button');
            Y.Assert.areEqual('othervalue', btn && btn.get('value'), 'button\'s value is not set right when used customized value');
        },
        'checkLabel test 2': function() {
            var btn = Y.one('#buttoncheck button');
            Y.Assert.areEqual('<i>mylabel</i>', btn && btn.getHTML(), 'button\'s value is not set right when used customized value');
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test', 'gallery-itsaformmodel', 'base-build', 'slider', 'gallery-itsanodepromise', 'gallery-itsawidgetrenderpromise', 'node-event-simulate', 'promise' ] });

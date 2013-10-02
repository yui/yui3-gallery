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

    Y.CountryModel = Y.Base.create('countryModel', Y.ITSAFormModel, [], {
        sync: function (action, options, callback) {
            var data;
            switch (action) {
              case 'submit':
                Y.later(600, null, function() {
                    data = {Country: "The Netherlands", extrafield: "Its Asbreuk"};
                    callback(null, Y.JSON.stringify(data));
                });
                return;
              default:
                callback('Invalid action');
            }
        }
    });

    Y.CountryModelError = Y.Base.create('countryModel', Y.ITSAFormModel, [], {
        sync: function (action, options, callback) {
            var instance = this,
                data;
            switch (action) {
              case 'submit':
                Y.later(600, null, function() {
                    callback('Error during submit');
                });
                return;
              default:
                callback('Invalid action');
            }
        }
    });

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

    //=== testing submit NEW model
    suite.add(new Y.Test.Case({
        name: 'Check submit new model when sync goes well',
        setUp : function () {
            this.mycountrymodel = new Y.CountryModel({Country: 'The Netherlands'});
        },
        tearDown : function () {
            this.mycountrymodel.destroy({remove: false});
        },
        '29. On-event in time': function() {
            var test = this;
            test.mycountrymodel.on('submit', function() {
                test.resume(function(){
                    Y.Assert.pass();
                });
            });
            test.mycountrymodel.submit();
            this.wait(200);
        },
        '30. After-event not too early': function() {
            var test = this,
                delayed = false;
            Y.later(400, null, function() {
                delayed = true;
            });
            test.mycountrymodel.after('submit', function() {
                test.resume(function(){
                    Y.Assert.isTrue(delayed, 'Model\'s after-submit is executed before the synclayer started');
                });
            });
            test.mycountrymodel.submit();
            this.wait(800);
        },
        '31. value after submit': function() {
            var test = this;
            test.mycountrymodel.after('submit', function() {
                test.resume(function(){
                    Y.Assert.areSame('Its Asbreuk', test.mycountrymodel.get('extrafield'), 'Model submitd wrong value');
                });
            });
            test.mycountrymodel.submit();
            this.wait(800);
        },
        '32. DefaultFn not executed when prevented': function() {
            var test = this;
            test.mycountrymodel.on('submit', function(e) {
                e.preventDefault();
            });
            test.mycountrymodel.submit();
            this.wait(function(){
                Y.Assert.areNotSame('Its Asbreuk', test.mycountrymodel.get('extrafield'), 'Model submitd but shouldn\'t have');
            }, 800);
        },
        '33. After-event not executed when prevented': function() {
            var test = this,
                afterevent = false;
            test.mycountrymodel.on('submit', function(e) {
                e.preventDefault();
            });
            test.mycountrymodel.after('submit', function() {
                afterevent = true;
            });
            test.mycountrymodel.submit();
            this.wait(function(){
                Y.Assert.isFalse(afterevent, 'Model\'s after-submit is executed even if event was prevented');
            }, 800);
        },
        '34. check promise': function() {
            var startdelayed = false,
                test = this;
            Y.later(400, null, function() {
                startdelayed = true;
            });
            test.mycountrymodel.submitPromise().then(
                function() {
                    test.resume(function(){
                        Y.Assert.isTrue(startdelayed, 'submitPromise is fulfilled before the synclayer is finished');
                    });
                },
                function() {
                    test.resume(function(){
                        Y.Assert.fail('submitPromise is rejected while it should have been fulfilled');
                    });
                }
            );
            this.wait(800);
        },
        '35. check error-event': function() {
            var test = this,
                errorevent = false;
            test.mycountrymodel.on('error', function() {
                errorevent = true;
            });
            test.mycountrymodel.submit();
            this.wait(function(){
                Y.Assert.isFalse(errorevent, 'error event occured while the sync should be ok');
            }, 800);
        },
        '36. check non destruction with positive id': function() {
            var test = this;
            test.mycountrymodel.after('submit', function() {
                test.resume(function(){
                    Y.Assert.isFalse(test.mycountrymodel.get('destroyed'), 'model gets destroyed even with positive id');
                });
            });
            test.mycountrymodel.submit();
            this.wait(800);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Check submit new model when sync has error',
        setUp : function () {
            this.mycountrymodel = new Y.CountryModelError({Country: 'The Netherlands'});
        },
        tearDown : function () {
            this.mycountrymodel.destroy();
        },
        '38. On-event in time': function() {
            var test = this;
            test.mycountrymodel.on('submit', function() {
                test.resume(function(){
                    Y.Assert.pass();
                });
            });
            test.mycountrymodel.submit();
            this.wait(200);
        },
        '39. After-event not too early': function() {
            var test = this,
                delayed = false;
            Y.later(400, null, function() {
                delayed = true;
            });
            test.mycountrymodel.after('error', function() {
                test.resume(function(){
                    Y.Assert.isTrue(delayed, 'Model\'s after-submit is executed before the synclayer started');
                });
            });
            test.mycountrymodel.submit();
            this.wait(800);
        },
        '40. After syncing with failure instance should not get value': function() {
            var test = this;
            test.mycountrymodel.after('error', function() {
                test.resume(function(){
                    Y.Assert.areNotSame('Its Asbreuk', test.mycountrymodel.get('extrafield'), 'Model submitd wrong value');
                });
            });
            test.mycountrymodel.submit();
            this.wait(800);
        },
        '41. DefaultFn not executed when prevented': function() {
            var test = this;
            test.mycountrymodel.on('submit', function(e) {
                e.preventDefault();
            });
            test.mycountrymodel.submit();
            this.wait(function(){
                Y.Assert.areNotSame('Its Asbreuk', test.mycountrymodel.get('extrafield'), 'Model submitd wrong value');
            }, 800);
        },
        '42. After-event not executed when prevented': function() {
            var test = this,
                afterevent = false;
            test.mycountrymodel.on('submit', function(e) {
                e.preventDefault();
            });
            test.mycountrymodel.after('error', function() {
                afterevent = true;
            });
            test.mycountrymodel.submit();
            this.wait(function(){
                Y.Assert.isFalse(afterevent, 'Model\'s after-submit is executed even if event was prevented');
            }, 800);
        },
        '43. check promise': function() {
            var startdelayed = false,
                test = this;
            Y.later(400, null, function() {
                startdelayed = true;
            });
            test.mycountrymodel.submitPromise().then(
                function() {
                    if (startdelayed) {
                        test.resume(function(){
                            Y.Assert.fail('syncing with error: submitPromise is fulfilled even if syncing gave an error');
                       });
                    }
                    else {
                        test.resume(function(){
                            Y.Assert.fail('syncing with error: submitPromise is fulfilled even if syncing gave an error');
                        });
                    }
                },
                function(reason) {
                    test.resume(function(){
                       Y.Assert.areSame('Error during submit', reason.message, 'syncing with error: submitPromise is rejected as should be, but the error is different');
                    });
                }
            );
            this.wait(800);
        },
        '44. check error-event': function() {
            var test = this,
                errorevent = false;
            test.mycountrymodel.on('error', function() {
                errorevent = true;
            });
            test.mycountrymodel.submit();
            this.wait(function(){
                Y.Assert.isTrue(errorevent, 'error event did not occur while the sync returned an error');
            }, 800);
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test', 'gallery-itsaformmodel', 'base-build', 'slider', 'gallery-itsanodepromise', 'gallery-itsawidgetrenderpromise', 'node-event-simulate', 'promise' ] });

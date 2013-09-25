YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-itsamodelsyncpromise');
    Y.CountryModel = Y.Base.create('countryModel', Y.Model, [], {
        sync: function (action, options, callback) {
            var instance = this,
                data;
            switch (action) {
              case 'create':
                Y.later(750, null, function() {
                    data = {id: 1, Country: "The Netherlands", extrafield: "Its Asbreuk"};
                    callback(null, Y.JSON.stringify(data));
                });
                return;
              case 'update':
                Y.later(750, null, function() {
                    data = {Country: "The Netherlands", extrafield: "Its Asbreuk"};
                    callback(null, Y.JSON.stringify(data));
                });
                return;
              case 'delete':
                Y.later(750, null, function() {
                    callback();
                });
                return;
              case 'read':
                Y.later(750, null, function() {
                    data = {Country: "The Netherlands"};
                    callback(null, Y.JSON.stringify(data));
                });
                return;
              default:
                callback('Invalid action');
            }
        }
    });

    Y.CountryModelError = Y.Base.create('countryModel', Y.Model, [], {
        sync: function (action, options, callback) {
            var instance = this,
                data;
            switch (action) {
              case 'create':
                Y.later(750, null, function() {
                    callback('Error during create');
                });
                return;
              case 'update':
                Y.later(750, null, function() {
                    callback('Error during update');
                });
                return;
              case 'delete':
                Y.later(750, null, function() {
                    callback('Error during delete');
                });
                return;
              case 'read':
                Y.later(750, null, function() {
                    callback('Error during loading');
                });
                return;
              default:
                callback('Invalid action');
            }
        }
    });

    Y.CountryModelServerDeleted = Y.Base.create('countryModel', Y.Model, [], {
        sync: function (action, options, callback) {
            var instance = this,
                data;
            switch (action) {
              case 'create':
                Y.later(750, null, function() {
                    data = {id: -1};
                    callback(null, Y.JSON.stringify(data));
                });
                return;
              case 'update':
                Y.later(750, null, function() {
                    data = {id: -1};
                    callback(null, Y.JSON.stringify(data));
                });
                return;
              default:
                callback('Invalid action');
            }
        }
    });

    suite.add(new Y.Test.Case({
        name: 'Check destroy when sync goes well',
        setUp : function () {
//            mycountrymodel = new Y.CountryModel({id: 1});
        },
        tearDown : function () {
//            mycountrymodel.destroy({remove: true});
        },
        '1. On-event in time': function() {
            var test = this,
                mycountrymodel = new Y.CountryModel({id: 1});
            mycountrymodel.on('destroy', function() {
                test.resume(function(){
                    Y.Assert.pass();
                });
            });
            mycountrymodel.destroy();
            this.wait(250);
        },
        '2. After-event not too early': function() {
            var test = this,
                delayed = false,
                mycountrymodel = new Y.CountryModel({id: 1});
            Y.later(500, null, function() {
                delayed = true;
            });
            mycountrymodel.after('destroy', function() {
                test.resume(function(){
                    Y.Assert.isTrue(delayed, 'Model\'s after-destroy is executed before the synclayer started');
                });
            });
            mycountrymodel.destroy({remove: true});
            this.wait(1000);
        },
        '3. After-event after syncing': function() {
            var test = this,
                delayed = false,
                mycountrymodel = new Y.CountryModel({id: 1});
            mycountrymodel.after('destroy', function() {
                test.resume(function(){
                    Y.Assert.isTrue(mycountrymodel.get('destroyed'), 'Model\'s after-destroy is executed before the synclayer started');
                });
            });
            mycountrymodel.destroy({remove: true});
            this.wait(1000);
        },
        '4. DefaultFn not executed when prevented': function() {
            var test = this,
                mycountrymodel = new Y.CountryModel({id: 1});
            mycountrymodel.on('destroy', function() {
                e.preventDefault();
            });
            mycountrymodel.destroy({remove: true});
            this.wait(function(){
                Y.Assert.isFalse(mycountrymodel.get('destroyed'), 'Model\'s defaultFn is not prevented: model is still destroyed');
            }, 500);
        },
        '5. After-event not executed when prevented': function() {
            var test = this,
                afterevent = false,
                mycountrymodel = new Y.CountryModel({id: 1});
            mycountrymodel.on('destroy', function() {
                e.preventDefault();
            });
            mycountrymodel.after('destroy', function() {
                afterevent = true;
            });
            mycountrymodel.destroy({remove: true});
            this.wait(function(){
                Y.Assert.isFalse(afterevent, 'Model\'s after-destroy is executed even if event was prevented');
            }, 1000);
        },
        '6. check promise': function() {
            var startdelayed = false,
                test = this,
                mycountrymodel = new Y.CountryModel({id: 1});
            Y.later(500, null, function() {
                startdelayed = true;
            });
            mycountrymodel.destroyPromise({remove: true}).then(
                function() {
                    test.resume(function(){
                        Y.Assert.isTrue(startdelayed, 'Destroypromise is fulfilled before the synclayer is finished');
                    });
                },
                function() {
                    test.resume(function(){
                        Y.Assert.fail('Destroypromise is rejected while it should have been fulfilled');
                    });
                }
            );
            this.wait(1000);
        },
        '7. check error-event': function() {
            var test = this,
                errorevent = false,
                mycountrymodel = new Y.CountryModel({id: 1});
            mycountrymodel.on('error', function() {
                errorevent = true;
            });
            mycountrymodel.destroy({remove: true});
            this.wait(function(){
                Y.Assert.isFalse(errorevent, 'error event occured while the sync should be ok');
            }, 1000);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Check destroy when sync has error',
        setUp : function () {

        },
        tearDown : function () {
//            mycountrymodel.destroy({remove: true});
        },
        '8. On-event in time': function() {
            var test = this,
                mycountrymodel = new Y.CountryModelError({id: 1});
            mycountrymodel.on('destroy', function() {
                test.resume(function(){
                    Y.Assert.pass();
                });
            });
            mycountrymodel.destroy();
            this.wait(250);
        },
        '9. After-event not too early': function() {
            var test = this,
                delayed = false,
                mycountrymodel = new Y.CountryModelError({id: 1});
            Y.later(500, null, function() {
                delayed = true;
            });
            mycountrymodel.after('error', function() {
                test.resume(function(){
                    Y.Assert.isTrue(delayed, 'Model\'s after-destroy is executed before the synclayer started');
                });
            });
            mycountrymodel.destroy({remove: true});
            this.wait(1000);
        },
        '10. After syncing with failure instance should not be destroyed': function() {
            var test = this,
                delayed = false,
                mycountrymodel = new Y.CountryModelError({id: 1});
            mycountrymodel.after('error', function() {
                test.resume(function(){
                    Y.Assert.isFalse(mycountrymodel.get('destroyed'), 'Model\'s is destroyed even when synclayer errored');
                });
            });
            mycountrymodel.destroy({remove: true});
            this.wait(1000);
        },
        '11. DefaultFn not executed when prevented': function() {
            var test = this,
                mycountrymodel = new Y.CountryModelError({id: 1});
            mycountrymodel.on('destroy', function() {
                e.preventDefault();
            });
            mycountrymodel.destroy({remove: true});
            this.wait(function(){
                Y.Assert.isFalse(mycountrymodel.get('destroyed'), 'Model\'s defaultFn is not prevented: model is still destroyed');
            }, 500);
        },
        '12. After-event not executed when prevented': function() {
            var test = this,
                afterevent = false,
                mycountrymodel = new Y.CountryModelError({id: 1});
            mycountrymodel.on('destroy', function() {
                e.preventDefault();
            });
            mycountrymodel.after('error', function() {
                afterevent = true;
            });
            mycountrymodel.destroy({remove: true});
            this.wait(function(){
                Y.Assert.isFalse(afterevent, 'Model\'s after-destroy is executed even if event was prevented');
            }, 1000);
        },
        '13. check promise': function() {
            var startdelayed = false,
                test = this,
                mycountrymodel = new Y.CountryModelError({id: 1});
            Y.later(500, null, function() {
                startdelayed = true;
            });
            mycountrymodel.destroyPromise({remove: true}).then(
                function() {
                    if (startdelayed) {
                        test.resume(function(){
                            Y.Assert.fail('syncing with error: Destroypromise is fulfilled even if syncing gave an error');
                       });
                    }
                    else {
                        test.resume(function(){
                            Y.Assert.fail('syncing with error: Destroypromise is fulfilled even if syncing gave an error');
                        });
                    }
                },
                function(reason) {
                    test.resume(function(){
                       Y.Assert.areSame('Error during delete', reason.message, 'syncing with error: Destroypromise is rejected as should be, but the error is different');
                    });
                }
            );
            this.wait(1000);
        },
        '14. check error-event': function() {
            var test = this,
                errorevent = false,
                mycountrymodel = new Y.CountryModelError({id: 1});
            mycountrymodel.on('error', function() {
                errorevent = true;
            });
            mycountrymodel.destroy({remove: true});
            this.wait(function(){
                Y.Assert.isTrue(errorevent, 'error event did not occur while the sync returned an error');
            }, 1000);
        }
    }));

    //=== testing load
    suite.add(new Y.Test.Case({
        name: 'Check load when sync goes well',
        setUp : function () {
            this.mycountrymodel = new Y.CountryModel({id: 1});
        },
        tearDown : function () {
            this.mycountrymodel.destroy({remove: false});
        },
        '15. On-event in time': function() {
            var test = this;
            test.mycountrymodel.on('load', function() {
                test.resume(function(){
                    Y.Assert.pass();
                });
            });
            test.mycountrymodel.load();
            this.wait(250);
        },
        '16. After-event not too early': function() {
            var test = this,
                delayed = false;
            Y.later(500, null, function() {
                delayed = true;
            });
            test.mycountrymodel.after('load', function() {
                test.resume(function(){
                    Y.Assert.isTrue(delayed, 'Model\'s after-load is executed before the synclayer started');
                });
            });
            test.mycountrymodel.load();
            this.wait(1000);
        },
        '17. value after load': function() {
            var test = this,
                delayed = false;
            test.mycountrymodel.after('load', function() {
                test.resume(function(){
                    Y.Assert.areSame('The Netherlands', test.mycountrymodel.get('Country'), 'Model loaded wrong value');
                });
            });
            test.mycountrymodel.load();
            this.wait(1000);
        },
        '18. DefaultFn not executed when prevented': function() {
            var test = this;
            test.mycountrymodel.on('load', function() {
                e.preventDefault();
            });
            test.mycountrymodel.load();
            this.wait(function(){
                Y.Assert.areNotSame('The Netherlands', test.mycountrymodel.get('Country'), 'Model loaded but shouldn\'t have');
            }, 1000);
        },
        '19. After-event not executed when prevented': function() {
            var test = this,
                afterevent = false;
            test.mycountrymodel.on('load', function() {
                e.preventDefault();
            });
            test.mycountrymodel.after('load', function() {
                afterevent = true;
            });
            test.mycountrymodel.load();
            this.wait(function(){
                Y.Assert.isFalse(afterevent, 'Model\'s after-load is executed even if event was prevented');
            }, 1000);
        },
        '20. check promise': function() {
            var startdelayed = false,
                test = this;
            Y.later(500, null, function() {
                startdelayed = true;
            });
            test.mycountrymodel.loadPromise().then(
                function() {
                    test.resume(function(){
                        Y.Assert.isTrue(startdelayed, 'loadPromise is fulfilled before the synclayer is finished');
                    });
                },
                function() {
                    test.resume(function(){
                        Y.Assert.fail('loadPromise is rejected while it should have been fulfilled');
                    });
                }
            );
            this.wait(1000);
        },
        '21. check error-event': function() {
            var test = this,
                errorevent = false;
            test.mycountrymodel.on('error', function() {
                errorevent = true;
            });
            test.mycountrymodel.load();
            this.wait(function(){
                Y.Assert.isFalse(errorevent, 'error event occured while the sync should be ok');
            }, 1000);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Check load when sync has error',
        setUp : function () {
            this.mycountrymodel = new Y.CountryModelError({id: 1});
        },
        tearDown : function () {
            this.mycountrymodel.destroy();
        },
        '22. On-event in time': function() {
            var test = this;
            test.mycountrymodel.on('load', function() {
                test.resume(function(){
                    Y.Assert.pass();
                });
            });
            test.mycountrymodel.load();
            this.wait(250);
        },
        '23. After-event not too early': function() {
            var test = this,
                delayed = false;
            Y.later(500, null, function() {
                delayed = true;
            });
            test.mycountrymodel.after('error', function() {
                test.resume(function(){
                    Y.Assert.isTrue(delayed, 'Model\'s after-load is executed before the synclayer started');
                });
            });
            test.mycountrymodel.load();
            this.wait(1000);
        },
        '24. After syncing with failure instance should not get value': function() {
            var test = this,
                delayed = false;
            test.mycountrymodel.after('error', function() {
                test.resume(function(){
                    Y.Assert.areNotSame('The Netherlands', test.mycountrymodel.get('Country'), 'Model loaded wrong value');
                });
            });
            test.mycountrymodel.load();
            this.wait(1000);
        },
        '25. DefaultFn not executed when prevented': function() {
            var test = this;
            test.mycountrymodel.on('load', function() {
                e.preventDefault();
            });
            test.mycountrymodel.load();
            this.wait(function(){
                Y.Assert.areNotSame('The Netherlands', test.mycountrymodel.get('Country'), 'Model loaded wrong value');
            }, 1000);
        },
        '26. After-event not executed when prevented': function() {
            var test = this,
                afterevent = false;
            test.mycountrymodel.on('load', function() {
                e.preventDefault();
            });
            test.mycountrymodel.after('error', function() {
                afterevent = true;
            });
            test.mycountrymodel.load();
            this.wait(function(){
                Y.Assert.isFalse(afterevent, 'Model\'s after-dload is executed even if event was prevented');
            }, 1000);
        },
        '27. check promise': function() {
            var startdelayed = false,
                test = this;
            Y.later(500, null, function() {
                startdelayed = true;
            });
            test.mycountrymodel.loadPromise().then(
                function() {
                    if (startdelayed) {
                        test.resume(function(){
                            Y.Assert.fail('syncing with error: loadPromise is fulfilled even if syncing gave an error');
                       });
                    }
                    else {
                        test.resume(function(){
                            Y.Assert.fail('syncing with error: loadPromise is fulfilled even if syncing gave an error');
                        });
                    }
                },
                function(reason) {
                    test.resume(function(){
                       Y.Assert.areSame('Error during loading', reason.message, 'syncing with error: loadPromise is rejected as should be, but the error is different');
                    });
                }
            );
            this.wait(1000);
        },
        '28. check error-event': function() {
            var test = this,
                errorevent = false;
            test.mycountrymodel.on('error', function() {
                errorevent = true;
            });
            test.mycountrymodel.load();
            this.wait(function(){
                Y.Assert.isTrue(errorevent, 'error event did not occur while the sync returned an error');
            }, 1000);
        }
    }));

    //=== testing save NEW model
    suite.add(new Y.Test.Case({
        name: 'Check save new model when sync goes well',
        setUp : function () {
            this.mycountrymodel = new Y.CountryModel({Country: 'The Netherlands'});
        },
        tearDown : function () {
            this.mycountrymodel.destroy({remove: false});
        },
        '29. On-event in time': function() {
            var test = this;
            test.mycountrymodel.on('save', function() {
                test.resume(function(){
                    Y.Assert.pass();
                });
            });
            test.mycountrymodel.save();
            this.wait(250);
        },
        '30. After-event not too early': function() {
            var test = this,
                delayed = false;
            Y.later(500, null, function() {
                delayed = true;
            });
            test.mycountrymodel.after('save', function() {
                test.resume(function(){
                    Y.Assert.isTrue(delayed, 'Model\'s after-save is executed before the synclayer started');
                });
            });
            test.mycountrymodel.save();
            this.wait(1000);
        },
        '31. value after save': function() {
            var test = this,
                delayed = false;
            test.mycountrymodel.after('save', function() {
                test.resume(function(){
                    Y.Assert.areSame('Its Asbreuk', test.mycountrymodel.get('extrafield'), 'Model saved wrong value');
                });
            });
            test.mycountrymodel.save();
            this.wait(1000);
        },
        '32. DefaultFn not executed when prevented': function() {
            var test = this;
            test.mycountrymodel.on('save', function() {
                e.preventDefault();
            });
            test.mycountrymodel.save();
            this.wait(function(){
                Y.Assert.areNotSame('Its Asbreuk', test.mycountrymodel.get('extrafield'), 'Model saved but shouldn\'t have');
            }, 1000);
        },
        '33. After-event not executed when prevented': function() {
            var test = this,
                afterevent = false;
            test.mycountrymodel.on('save', function() {
                e.preventDefault();
            });
            test.mycountrymodel.after('save', function() {
                afterevent = true;
            });
            test.mycountrymodel.save();
            this.wait(function(){
                Y.Assert.isFalse(afterevent, 'Model\'s after-save is executed even if event was prevented');
            }, 1000);
        },
        '34. check promise': function() {
            var startdelayed = false,
                test = this;
            Y.later(500, null, function() {
                startdelayed = true;
            });
            test.mycountrymodel.savePromise().then(
                function() {
                    test.resume(function(){
                        Y.Assert.isTrue(startdelayed, 'savePromise is fulfilled before the synclayer is finished');
                    });
                },
                function() {
                    test.resume(function(){
                        Y.Assert.fail('savePromise is rejected while it should have been fulfilled');
                    });
                }
            );
            this.wait(1000);
        },
        '35. check error-event': function() {
            var test = this,
                errorevent = false;
            test.mycountrymodel.on('error', function() {
                errorevent = true;
            });
            test.mycountrymodel.save();
            this.wait(function(){
                Y.Assert.isFalse(errorevent, 'error event occured while the sync should be ok');
            }, 1000);
        },
        '36. check non destruction with positive id': function() {
            var test = this;
            test.mycountrymodel.after('save', function() {
                test.resume(function(){
                    Y.Assert.isFalse(test.mycountrymodel.get('destroyed'), 'model gets destroyed even with positive id');
                });
            });
            test.mycountrymodel.save();
            this.wait(1000);
        },
        '37. check destuction with id-1': function() {
            var test = this,
                deletedModel = new Y.CountryModelServerDeleted({Country: 'The Netherlands'});
            deletedModel.after('save', function() {
                test.resume(function(){
                    Y.Assert.isTrue(deletedModel.get('destroyed'), 'model did not get destroyed even with id=-1');
                    deletedModel.destroy();
                });
            });
            deletedModel.save();
            this.wait(1000);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Check save new model when sync has error',
        setUp : function () {
            this.mycountrymodel = new Y.CountryModelError({Country: 'The Netherlands'});
        },
        tearDown : function () {
            this.mycountrymodel.destroy();
        },
        '38. On-event in time': function() {
            var test = this;
            test.mycountrymodel.on('save', function() {
                test.resume(function(){
                    Y.Assert.pass();
                });
            });
            test.mycountrymodel.save();
            this.wait(250);
        },
        '39. After-event not too early': function() {
            var test = this,
                delayed = false;
            Y.later(500, null, function() {
                delayed = true;
            });
            test.mycountrymodel.after('error', function() {
                test.resume(function(){
                    Y.Assert.isTrue(delayed, 'Model\'s after-save is executed before the synclayer started');
                });
            });
            test.mycountrymodel.save();
            this.wait(1000);
        },
        '40. After syncing with failure instance should not get value': function() {
            var test = this,
                delayed = false;
            test.mycountrymodel.after('error', function() {
                test.resume(function(){
                    Y.Assert.areNotSame('Its Asbreuk', test.mycountrymodel.get('extrafield'), 'Model saved wrong value');
                });
            });
            test.mycountrymodel.save();
            this.wait(1000);
        },
        '41. DefaultFn not executed when prevented': function() {
            var test = this;
            test.mycountrymodel.on('save', function() {
                e.preventDefault();
            });
            test.mycountrymodel.save();
            this.wait(function(){
                Y.Assert.areNotSame('Its Asbreuk', test.mycountrymodel.get('extrafield'), 'Model saved wrong value');
            }, 1000);
        },
        '42. After-event not executed when prevented': function() {
            var test = this,
                afterevent = false;
            test.mycountrymodel.on('save', function() {
                e.preventDefault();
            });
            test.mycountrymodel.after('error', function() {
                afterevent = true;
            });
            test.mycountrymodel.save();
            this.wait(function(){
                Y.Assert.isFalse(afterevent, 'Model\'s after-save is executed even if event was prevented');
            }, 1000);
        },
        '43. check promise': function() {
            var startdelayed = false,
                test = this;
            Y.later(500, null, function() {
                startdelayed = true;
            });
            test.mycountrymodel.savePromise().then(
                function() {
                    if (startdelayed) {
                        test.resume(function(){
                            Y.Assert.fail('syncing with error: savePromise is fulfilled even if syncing gave an error');
                       });
                    }
                    else {
                        test.resume(function(){
                            Y.Assert.fail('syncing with error: savePromise is fulfilled even if syncing gave an error');
                        });
                    }
                },
                function(reason) {
                    test.resume(function(){
                       Y.Assert.areSame('Error during create', reason.message, 'syncing with error: savePromise is rejected as should be, but the error is different');
                    });
                }
            );
            this.wait(1000);
        },
        '44. check error-event': function() {
            var test = this,
                errorevent = false;
            test.mycountrymodel.on('error', function() {
                errorevent = true;
            });
            test.mycountrymodel.save();
            this.wait(function(){
                Y.Assert.isTrue(errorevent, 'error event did not occur while the sync returned an error');
            }, 1000);
        }
    }));

    //=== testing save existing model
    suite.add(new Y.Test.Case({
        name: 'Check save new model when sync goes well',
        setUp : function () {
            this.mycountrymodel = new Y.CountryModel({id: 2, Country: 'The Netherlands'});
        },
        tearDown : function () {
            this.mycountrymodel.destroy({remove: false});
        },
        '45. On-event in time': function() {
            var test = this;
            test.mycountrymodel.on('save', function() {
                test.resume(function(){
                    Y.Assert.pass();
                });
            });
            test.mycountrymodel.save();
            this.wait(250);
        },
        '46. After-event not too early': function() {
            var test = this,
                delayed = false;
            Y.later(500, null, function() {
                delayed = true;
            });
            test.mycountrymodel.after('save', function() {
                test.resume(function(){
                    Y.Assert.isTrue(delayed, 'Model\'s after-save is executed before the synclayer started');
                });
            });
            test.mycountrymodel.save();
            this.wait(1000);
        },
        '47. value after save': function() {
            var test = this,
                delayed = false;
            test.mycountrymodel.after('save', function() {
                test.resume(function(){
                    Y.Assert.areSame('Its Asbreuk', test.mycountrymodel.get('extrafield'), 'Model saved wrong value');
                });
            });
            test.mycountrymodel.save();
            this.wait(1000);
        },
        '48. DefaultFn not executed when prevented': function() {
            var test = this;
            test.mycountrymodel.on('save', function() {
                e.preventDefault();
            });
            test.mycountrymodel.save();
            this.wait(function(){
                Y.Assert.areNotSame('Its Asbreuk', test.mycountrymodel.get('extrafield'), 'Model saved but shouldn\'t have');
            }, 1000);
        },
        '49. After-event not executed when prevented': function() {
            var test = this,
                afterevent = false;
            test.mycountrymodel.on('save', function() {
                e.preventDefault();
            });
            test.mycountrymodel.after('save', function() {
                afterevent = true;
            });
            test.mycountrymodel.save();
            this.wait(function(){
                Y.Assert.isFalse(afterevent, 'Model\'s after-save is executed even if event was prevented');
            }, 1000);
        },
        '50. check promise': function() {
            var startdelayed = false,
                test = this;
            Y.later(500, null, function() {
                startdelayed = true;
            });
            test.mycountrymodel.savePromise().then(
                function() {
                    test.resume(function(){
                        Y.Assert.isTrue(startdelayed, 'savePromise is fulfilled before the synclayer is finished');
                    });
                },
                function() {
                    test.resume(function(){
                        Y.Assert.fail('savePromise is rejected while it should have been fulfilled');
                    });
                }
            );
            this.wait(1000);
        },
        '51. check error-event': function() {
            var test = this,
                errorevent = false;
            test.mycountrymodel.on('error', function() {
                errorevent = true;
            });
            test.mycountrymodel.save();
            this.wait(function(){
                Y.Assert.isFalse(errorevent, 'error event occured while the sync should be ok');
            }, 1000);
        },
        '52. check non destruction with positive id': function() {
            var test = this;
            test.mycountrymodel.after('save', function() {
                test.resume(function(){
                    Y.Assert.isFalse(test.mycountrymodel.get('destroyed'), 'model gets destroyed even with positive id');
                });
            });
            test.mycountrymodel.save();
            this.wait(1000);
        },
        '53. check destuction with id-1': function() {
            var test = this,
                deletedModel = new Y.CountryModelServerDeleted({id: 2, Country: 'The Netherlands'});
            deletedModel.after('save', function() {
                test.resume(function(){
                    Y.Assert.isTrue(deletedModel.get('destroyed'), 'model did not get destroyed even with id=-1');
                    deletedModel.destroy();
                });
            });
            deletedModel.save();
            this.wait(1000);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Check save new model when sync has error',
        setUp : function () {
            this.mycountrymodel = new Y.CountryModelError({id: 2, Country: 'The Netherlands'});
        },
        tearDown : function () {
            this.mycountrymodel.destroy();
        },
        '54. On-event in time': function() {
            var test = this;
            test.mycountrymodel.on('save', function() {
                test.resume(function(){
                    Y.Assert.pass();
                });
            });
            test.mycountrymodel.save();
            this.wait(250);
        },
        '55. After-event not too early': function() {
            var test = this,
                delayed = false;
            Y.later(500, null, function() {
                delayed = true;
            });
            test.mycountrymodel.after('error', function() {
                test.resume(function(){
                    Y.Assert.isTrue(delayed, 'Model\'s after-save is executed before the synclayer started');
                });
            });
            test.mycountrymodel.save();
            this.wait(1000);
        },
        '56. After syncing with failure instance should not get value': function() {
            var test = this,
                delayed = false;
            test.mycountrymodel.after('error', function() {
                test.resume(function(){
                    Y.Assert.areNotSame('Its Asbreuk', test.mycountrymodel.get('extrafield'), 'Model saved wrong value');
                });
            });
            test.mycountrymodel.save();
            this.wait(1000);
        },
        '57. DefaultFn not executed when prevented': function() {
            var test = this;
            test.mycountrymodel.on('save', function() {
                e.preventDefault();
            });
            test.mycountrymodel.save();
            this.wait(function(){
                Y.Assert.areNotSame('Its Asbreuk', test.mycountrymodel.get('extrafield'), 'Model saved wrong value');
            }, 1000);
        },
        '58. After-event not executed when prevented': function() {
            var test = this,
                afterevent = false;
            test.mycountrymodel.on('save', function() {
                e.preventDefault();
            });
            test.mycountrymodel.after('error', function() {
                afterevent = true;
            });
            test.mycountrymodel.save();
            this.wait(function(){
                Y.Assert.isFalse(afterevent, 'Model\'s after-save is executed even if event was prevented');
            }, 1000);
        },
        '59. check promise': function() {
            var startdelayed = false,
                test = this;
            Y.later(500, null, function() {
                startdelayed = true;
            });
            test.mycountrymodel.savePromise().then(
                function() {
                    if (startdelayed) {
                        test.resume(function(){
                            Y.Assert.fail('syncing with error: savePromise is fulfilled even if syncing gave an error');
                       });
                    }
                    else {
                        test.resume(function(){
                            Y.Assert.fail('syncing with error: savePromise is fulfilled even if syncing gave an error');
                        });
                    }
                },
                function(reason) {
                    test.resume(function(){
                       Y.Assert.areSame('Error during update', reason.message, 'syncing with error: savePromise is rejected as should be, but the error is different');
                    });
                }
            );
            this.wait(1000);
        },
        '60. check error-event': function() {
            var test = this,
                errorevent = false;
            test.mycountrymodel.on('error', function() {
                errorevent = true;
            });
            test.mycountrymodel.save();
            this.wait(function(){
                Y.Assert.isTrue(errorevent, 'error event did not occur while the sync returned an error');
            }, 1000);
        }
    }));

    Y.Test.Runner.add(suite);

},'', { requires: [ 'test', 'gallery-itsamodelsyncpromise' ] });

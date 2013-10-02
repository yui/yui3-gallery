YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-itsamodellistsyncpromise');
    Y.CountryModel = Y.Base.create('countryModel', Y.ITSAFormModel, [], {
        sync: function (action, options, callback) {
            var data;
            switch (action) {
              case 'create':
                Y.later(600, null, function() {
                    data = {id: 1, Country: "The Netherlands", extrafield: "Its Asbreuk"};
                    callback(null, Y.JSON.stringify(data));
                });
                return;
              case 'update':
                Y.later(600, null, function() {
                    data = {Country: "The Netherlands", extrafield: "Its Asbreuk"};
                    callback(null, Y.JSON.stringify(data));
                });
                return;
              case 'submit':
                Y.later(600, null, function() {
                    data = {Country: "The Netherlands", extrafield: "Its Asbreuk"};
                    callback(null, Y.JSON.stringify(data));
                });
                return;
              case 'delete':
                Y.later(600, null, function() {
                    callback();
                });
                return;
              case 'read':
                Y.later(600, null, function() {
                    data = {Country: "The Netherlands"};
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
              case 'create':
                Y.later(600, null, function() {
                    instance._afterload = true;
                    callback('Error during create');
                });
                return;
              case 'update':
                Y.later(600, null, function() {
                    callback('Error during update');
                });
                return;
              case 'submit':
                Y.later(600, null, function() {
                    callback('Error during submit');
                });
                return;
              case 'delete':
                Y.later(600, null, function() {
                    callback('Error during delete');
                });
                return;
              case 'read':
                Y.later(600, null, function() {
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
            var data;
            switch (action) {
              case 'create':
                Y.later(600, null, function() {
                    data = {id: -1};
                    callback(null, Y.JSON.stringify(data));
                });
                return;
              case 'update':
                Y.later(600, null, function() {
                    data = {id: -1};
                    callback(null, Y.JSON.stringify(data));
                });
                return;
              default:
                callback('Invalid action');
            }
        }
    });

    Y.Countries = Y.Base.create('countries', Y.ModelList, [], {
        model: Y.CountryModel,
        sync: function (action, options, callback) {
            var instance = this,
                data;
            switch (action) {
              case 'read':
                Y.later(600, null, function() {
                    data = [
                        {Country: "The Netherlands"},
                        {Country: "USA"},
                        {Country: "United Kingdom"}
                    ]
                    callback(null, Y.JSON.stringify(data));
                });
              case 'readappend':
                Y.later(600, null, function() {
                    data = [
                        {Country: "The Netherlands"},
                        {Country: "USA"},
                        {Country: "United Kingdom"}
                    ]
                    callback(null, Y.JSON.stringify(data));
                });
                return;
              default:
                callback('Invalid action');
            }
        }
    });

    Y.CountriesError = Y.Base.create('countries', Y.ModelList, [], {
        model: Y.CountryModel,
        sync: function (action, options, callback) {
            var instance = this,
                data;
            switch (action) {
              case 'read':
                Y.later(600, null, function() {
                     callback('Server time-out (simulated)');
                });
              case 'readappend':
                Y.later(600, null, function() {
                     callback('Server time-out (simulated)');
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
            this.countries = new Y.Countries();
        },
        tearDown : function () {
            this.countries.destroy();
        },
        '1. On-event in time': function() {
            var test = this,
                mycountrymodel = new Y.CountryModel({id: 1});
            this.countries.on('destroymodels', function() {
                test.resume(function(){
                    Y.Assert.pass();
                });
            });
            this.countries.add(mycountrymodel);
            this.countries.destroymodels();
            this.wait(200);
        },
        '2. After-event not too early': function() {
            var test = this,
                delayed = false,
                mycountrymodel = new Y.CountryModel({id: 1});
            Y.later(400, null, function() {
                delayed = true;
            });
            this.countries.after('destroymodels', function() {
                test.resume(function(){
                    Y.Assert.isTrue(delayed, 'Model\'s after-destroy is executed before the synclayer started');
                });
            });
            this.countries.add(mycountrymodel);
            this.countries.destroymodels({remove: true});
            this.wait(800);
        },
        '3. After-event after syncing': function() {
            var test = this,
                mycountrymodel = new Y.CountryModel({id: 1});
            this.countries.after('destroymodels', function() {
                test.resume(function(){
                    Y.Assert.isTrue(mycountrymodel.get('destroyed'), 'Model\'s after-destroy is executed before the synclayer started');
                });
            });
            this.countries.add(mycountrymodel);
            this.countries.destroymodels({remove: true});
            this.wait(800);
        },
        '4. DefaultFn not executed when prevented': function() {
            var test = this,
                mycountrymodel = new Y.CountryModel({id: 1});
            this.countries.on('destroymodels', function(e) {
                e.preventDefault();
            });
            this.countries.add(mycountrymodel);
            this.countries.destroymodels({remove: true});
            this.wait(function(){
                Y.Assert.isFalse(mycountrymodel.get('destroyed'), 'Model\'s defaultFn is not prevented: model is still destroyed');
            }, 400);
        },
        '5. After-event not executed when prevented': function() {
            var test = this,
                afterevent = false,
                mycountrymodel = new Y.CountryModel({id: 1});
            this.countries.on('destroymodels', function(e) {
                e.preventDefault();
            });
            this.countries.after('destroymodels', function() {
                afterevent = true;
            });
            this.countries.add(mycountrymodel);
            this.countries.destroymodels({remove: true});
            this.wait(function(){
                Y.Assert.isFalse(afterevent, 'Model\'s after-destroy is executed even if event was prevented');
            }, 800);
        },
        '6. check promise': function() {
            var startdelayed = false,
                test = this,
                mycountrymodel = new Y.CountryModel({id: 1});
            Y.later(400, null, function() {
                startdelayed = true;
            });
            this.countries.add(mycountrymodel);
            this.countries.destroymodelsPromise({remove: true}).then(
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
            this.wait(800);
        },
        '7. check error-event': function() {
            var test = this,
                errorevent = false,
                mycountrymodel = new Y.CountryModel({id: 1});
            mycountrymodel.on('error', function() {
                errorevent = true;
            });
            this.countries.add(mycountrymodel);
            this.countries.destroymodels({remove: true});
            this.wait(function(){
                Y.Assert.isFalse(errorevent, 'error event occured while the sync should be ok');
            }, 800);
        },
        '7b. After delete should be zero items': function() {
            var test = this,
                mycountrymodel = new Y.CountryModel({id: 1});
            this.countries.after('destroymodels', function() {
                test.resume(function(){
                    Y.Assert.areSame(0, this.countries.size(), 'Number of items is not right after Model is destroyed from modellist');
                });
            });
            this.countries.add(mycountrymodel);
            this.countries.destroymodels({remove: true});
            this.wait(800);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Check destroy when sync has error',
        setUp : function () {
            this.countries = new Y.CountriesError();
        },
        tearDown : function () {
            this.countries.destroy();
        },
        '8. On-event in time': function() {
            var test = this,
                mycountrymodel = new Y.CountryModelError({id: 1});
            this.countries.on('destroymodels', function() {
                test.resume(function(){
                    Y.Assert.pass();
                });
            });
            this.countries.add(mycountrymodel);
            this.countries.destroymodels();
            this.wait(200);
        },
        '9. After-event not too early': function() {
            var test = this,
                delayed = false,
                mycountrymodel = new Y.CountryModelError({id: 1});
            Y.later(400, null, function() {
                delayed = true;
            });
            mycountrymodel.after('error', function() {
                test.resume(function(){
                    Y.Assert.isTrue(delayed, 'Model\'s after-destroy is executed before the synclayer started');
                });
            });
            this.countries.add(mycountrymodel);
            this.countries.destroymodels({remove: true});
            this.wait(800);
        },
        '10. After syncing with failure instance should not be destroyed': function() {
            var test = this,
                mycountrymodel = new Y.CountryModelError({id: 1});
            mycountrymodel.after('error', function() {
                test.resume(function(){
                    Y.Assert.isFalse(mycountrymodel.get('destroyed'), 'Model\'s is destroyed even when synclayer errored');
                });
            });
            this.countries.add(mycountrymodel);
            this.countries.destroymodels({remove: true});
            this.wait(800);
        },
        '11. DefaultFn not executed when prevented': function() {
            var test = this,
                mycountrymodel = new Y.CountryModelError({id: 1});
            this.countries.on('destroymodels', function(e) {
                e.preventDefault();
            });
            this.countries.add(mycountrymodel);
            this.countries.destroymodels({remove: true});
            this.wait(function(){
                Y.Assert.isFalse(mycountrymodel.get('destroyed'), 'Model\'s defaultFn is not prevented: model is still destroyed');
            }, 400);
        },
        '12. After-event not executed when prevented': function() {
            var test = this,
                afterevent = false,
                mycountrymodel = new Y.CountryModelError({id: 1});
            this.countries.on('destroymodels', function(e) {
                e.preventDefault();
            });
            mycountrymodel.after('error', function() {
                afterevent = true;
            });
            this.countries.add(mycountrymodel);
            this.countries.destroymodels({remove: true});
            this.wait(function(){
                Y.Assert.isFalse(afterevent, 'Model\'s after-destroy is executed even if event was prevented');
            }, 800);
        },
        '13. check promise': function() {
            var startdelayed = false,
                test = this,
                mycountrymodel = new Y.CountryModelError({id: 1});
            Y.later(400, null, function() {
                startdelayed = true;
            });
            this.countries.add(mycountrymodel);
            this.countries.destroymodelsPromise({remove: true}).then(
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
                       Y.Assert.areSame('Error: Error during delete', reason.message, 'syncing with error: Destroypromise is rejected as should be, but the error is different');
                    });
                }
            );
            this.wait(800);
        },
        '14. check error-event': function() {
            var test = this,
                errorevent = false,
                mycountrymodel = new Y.CountryModelError({id: 1});
            mycountrymodel.on('error', function() {
                errorevent = true;
            });
            this.countries.add(mycountrymodel);
            this.countries.destroymodels({remove: true});
            this.wait(function(){
                Y.Assert.isTrue(errorevent, 'error event did not occur while the sync returned an error');
            }, 800);
        },
        '14b. After delete should be one item': function() {
            var test = this,
                mycountrymodel = new Y.CountryModelError({id: 1});
            this.countries.add(mycountrymodel);
            this.countries.destroymodelsPromise({remove: true}).then(
                null,
                function() {
                    test.resume(function(){
                        Y.Assert.areSame(1, this.countries.size(), 'Number of items is not right after Model is destroyed from modellist');
                    });
                }
            );
            this.wait(800);
        }
    }));

    //=== testing load
    suite.add(new Y.Test.Case({
        name: 'Check load when sync goes well',
        setUp : function () {
            this.countries = new Y.Countries();
        },
        tearDown : function () {
            this.countries.destroymodels({remove: false, fromInternal: true});
            this.countries.destroy();
        },
        '15. On-event in time': function() {
            var test = this;
            test.countries.on('load', function() {
                test.resume(function(){
                    Y.Assert.pass();
                });
            });
            test.countries.load();
            this.wait(200);
        },
        '16. After-event not too early': function() {
            var test = this,
                delayed = false;
            Y.later(400, null, function() {
                delayed = true;
            });
            test.countries.after('load', function() {
                test.resume(function(){
                    Y.Assert.isTrue(delayed, 'Model\'s after-load is executed before the synclayer started');
                });
            });
            test.countries.load();
            this.wait(800);
        },
        '17. value after load': function() {
            var test = this;
            test.countries.after('load', function() {
                test.resume(function(){
                    Y.Assert.areSame('The Netherlands', test.countries.item(0).get('Country'), 'Model loaded wrong value');
                });
            });
            test.countries.load();
            this.wait(800);
        },
        '18. DefaultFn not executed when prevented': function() {
            var test = this;
            test.countries.on('load', function(e) {
                e.preventDefault();
            });
            test.countries.load();
            this.wait(function(){
                Y.Assert.areSame(0, test.countries.size(), 'Model loaded but shouldn\'t have');
            }, 800);
        },
        '19. After-event not executed when prevented': function() {
            var test = this,
                afterevent = false;
            test.countries.on('load', function(e) {
                e.preventDefault();
            });
            test.countries.after('load', function() {
                afterevent = true;
            });
            test.countries.load();
            this.wait(function(){
                Y.Assert.isFalse(afterevent, 'Model\'s after-load is executed even if event was prevented');
            }, 800);
        },
        '20. check promise': function() {
            var startdelayed = false,
                test = this;
            Y.later(400, null, function() {
                startdelayed = true;
            });
            test.countries.loadPromise().then(
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
            this.wait(800);
        },
        '21. check error-event': function() {
            var test = this,
                errorevent = false;
            test.countries.on('error', function() {
                errorevent = true;
            });
            test.countries.load();
            this.wait(function(){
                Y.Assert.isFalse(errorevent, 'error event occured while the sync should be ok');
            }, 800);
        },
        '21b. size modellist': function() {
            var test = this,
                delayed = false;
            Y.later(400, null, function() {
                delayed = true;
            });
            test.countries.after('load', function() {
                test.resume(function(){
                    Y.Assert.areEqual(3, test.countries.size(), 'ModelList does not have the right number of items');
                });
            });
            test.countries.load();
            this.wait(800);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Check load when sync has error',
        setUp : function () {
            this.countries = new Y.CountriesError();
        },
        tearDown : function () {
            this.countries.destroymodels({remove: false, fromInternal: true});
            this.countries.destroy();
        },
        '22. On-event in time': function() {
            var test = this;
            test.countries.on('load', function() {
                test.resume(function(){
                    Y.Assert.pass();
                });
            });
            test.countries.load();
            this.wait(200);
        },
        '23. After-event not too early': function() {
            var test = this,
                delayed = false;
            Y.later(400, null, function() {
                delayed = true;
            });
            test.countries.after('error', function() {
                test.resume(function(){
                    Y.Assert.isTrue(delayed, 'Model\'s after-load is executed before the synclayer started');
                });
            });
            test.countries.load();
            this.wait(800);
        },
        '24. After syncing with failure instance should not get value': function() {
            var test = this,
                delayed = false;
            test.countries.after('error', function() {
                test.resume(function(){
                    Y.Assert.areSame(0, test.countries.size(), 'Model loaded wrong value');
                });
            });
            test.countries.load();
            this.wait(800);
        },
        '25. DefaultFn not executed when prevented': function() {
            var test = this;
            test.countries.on('load', function(e) {
                e.preventDefault();
            });
            test.countries.load();
            this.wait(function(){
                Y.Assert.areSame(0, test.countries.size(), 'Model loaded wrong value');
            }, 800);
        },
        '26. After-event not executed when prevented': function() {
            var test = this,
                afterevent = false;
            test.countries.on('load', function(e) {
                e.preventDefault();
            });
            test.countries.after('error', function() {
                afterevent = true;
            });
            test.countries.load();
            this.wait(function(){
                Y.Assert.isFalse(afterevent, 'Model\'s after-dload is executed even if event was prevented');
            }, 800);
        },
        '27. check promise': function() {
            var startdelayed = false,
                test = this;
            Y.later(400, null, function() {
                startdelayed = true;
            });
            test.countries.loadPromise().then(
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
                       Y.Assert.areSame('Server time-out (simulated)', reason.message, 'syncing with error: loadPromise is rejected as should be, but the error is different');
                    });
                }
            );
            this.wait(800);
        },
        '28. check error-event': function() {
            var test = this,
                errorevent = false;
            test.countries.on('error', function() {
                errorevent = true;
            });
            test.countries.load();
            this.wait(function(){
                Y.Assert.isTrue(errorevent, 'error event did not occur while the sync returned an error');
            }, 800);
        },
        '28b. size modellist when error': function() {
            var test = this;
            test.countries.loadPromise().then(
                null,
                function(reason) {
                    test.resume(function(){
                       Y.Assert.areSame(0, test.countries.size(), 'Modellist does not have the right number of items');
                    });
                }
            );
            this.wait(800);
        }
    }));

    //=== testing loadappend
    suite.add(new Y.Test.Case({
        name: 'Check load when sync goes well',
        setUp : function () {
            this.countries = new Y.Countries();
        },
        tearDown : function () {
            this.countries.destroymodels({remove: false, fromInternal: true});
            this.countries.destroy();
        },
        'LA15. On-event in time': function() {
            var test = this,
                secondtime = false;
            test.countries.on('loadappend', function() {
                if (secondtime) {
                    test.resume(function(){
                        Y.Assert.pass();
                    });
                }
                else {
                    secondtime = true;
                }
            });
            test.countries.loadappendPromise().then(function() {test.countries.loadappend();});
            this.wait(800);
        },
        'LA16. After-event not too early': function() {
            var test = this,
                delayed = false,
                secondtime = false;
            Y.later(1200, null, function() {
                delayed = true;
            });
            test.countries.after('loadappend', function() {
                if (secondtime) {
                    test.resume(function(){
                        Y.Assert.isTrue(delayed, 'Model\'s after-load is executed before the synclayer started');
                    });
                }
                else {
                    secondtime = true;
                }
            });
            test.countries.loadappendPromise().then(function() {test.countries.loadappend()});
            this.wait(1400);
        },
        'LA17. value after load': function() {
            var test = this,
                secondtime = false;
            test.countries.after('loadappend', function() {
                if (secondtime) {
                    test.resume(function(){
                        Y.Assert.areSame('The Netherlands', test.countries.item(3).get('Country'), 'Model loaded wrong value');
                    });
                }
                else {
                    secondtime = true;
                }
            });
            test.countries.loadappendPromise().then(function() {test.countries.loadappend();});
            this.wait(1400);
        },
        'LA18. DefaultFn not executed when prevented': function() {
            var test = this;
            test.countries.on('loadappend', function(e) {
                e.preventDefault();
            });
            test.countries.loadappendPromise().then(function() {test.countries.loadappend();});
            this.wait(function(){
                Y.Assert.areSame(0, test.countries.size(), 'Model loaded but shouldn\'t have');
            }, 1400);
        },
        'LA19. After-event not executed when prevented': function() {
            var test = this,
                afterevent = false;
            test.countries.on('loadappend', function(e) {
                e.preventDefault();
            });
            test.countries.after('loadappend', function() {
                afterevent = true;
            });
            test.countries.loadappendPromise().then(function() {test.countries.loadappend();});
            this.wait(function(){
                Y.Assert.isFalse(afterevent, 'Model\'s after-load is executed even if event was prevented');
            }, 1400);
        },
        'LA20. check promise': function() {
            var startdelayed = false,
                test = this;
            Y.later(1200, null, function() {
                startdelayed = true;
            });
            test.countries.loadappendPromise().then(function() {
                test.countries.loadPromise().then(
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
            });
            this.wait(1400);
        },
        'LA21. check error-event': function() {
            var test = this,
                errorevent = false;
            test.countries.on('error', function() {
                errorevent = true;
            });
            test.countries.loadappendPromise().then(function() {test.countries.loadappend();});
            this.wait(function(){
                Y.Assert.isFalse(errorevent, 'error event occured while the sync should be ok');
            }, 1400);
        },
        'LA21b. size modellist': function() {
            var test = this,
                secondtime = false;
            test.countries.after('loadappend', function() {
                if (secondtime) {
                    test.resume(function(){
                        Y.Assert.areEqual(6, test.countries.size(), 'ModelList does not have the right number of items');
                    });
                }
                else {
                    secondtime = true;
                }
            });
            test.countries.loadappendPromise().then(function() {test.countries.loadappend();});
            this.wait(1400);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Check load when sync has error',
        setUp : function () {
            this.countries = new Y.CountriesError();
        },
        tearDown : function () {
            this.countries.destroymodels({remove: false, fromInternal: true});
            this.countries.destroy();
        },
        'LA22. On-event in time': function() {
            var test = this,
                secondtime = false;
            test.countries.on('loadappend', function() {
                if (secondtime) {
                    test.resume(function(){
                        Y.Assert.pass();
                    });
                }
                else {
                    secondtime = true;
                }
            });
            test.countries.loadappendPromise().then(
                function() {
                    test.resume(function(){
                        Y.Assert.fail('syncing with error: loadPromise is fulfilled on first append even if syncing gave an error');
                    });
                },
                function() {test.countries.loadappendPromise();}
            );
            this.wait(1400);
        },
        'LA23. After-event not too early': function() {
            var test = this,
                secondtime = false,
                delayed = false;
            Y.later(1200, null, function() {
                delayed = true;
            });
            test.countries.after('error', function() {
                if (secondtime) {
                    test.resume(function(){
                        Y.Assert.isTrue(delayed, 'Model\'s after-load is executed before the synclayer started');
                    });
                }
                else {
                    secondtime = true;
                }
            });
            test.countries.loadappendPromise().then(
                function() {
                    test.resume(function(){
                        Y.Assert.fail('syncing with error: loadPromise is fulfilled on first append even if syncing gave an error');
                    });
                },
                function() {test.countries.loadappend();}
            );
            this.wait(1400);
        },
        'LA24. After syncing with failure instance should not get value': function() {
            var test = this,
                secondtime = false,
                delayed = false;
            test.countries.after('error', function() {
                if (secondtime) {
                    test.resume(function(){
                        Y.Assert.areSame(0, test.countries.size(), 'Model loaded wrong value');
                    });
                }
                else {
                    secondtime = true;
                }
            });
            test.countries.loadappendPromise().then(
                function() {
                    test.resume(function(){
                        Y.Assert.fail('syncing with error: loadPromise is fulfilled on first append even if syncing gave an error');
                    });
                },
                function() {test.countries.loadappend();}
            );
            this.wait(1400);
        },
        'LA25. DefaultFn not executed when prevented': function() {
            var test = this;
            test.countries.on('loadappend', function(e) {
                e.preventDefault();
            });
            test.countries.loadappendPromise().then(
                function() {
                    test.resume(function(){
                        Y.Assert.fail('syncing with error: loadPromise is fulfilled on first append even if syncing gave an error');
                    });
                },
                function() {test.countries.loadappend();}
            );
            this.wait(function(){
                Y.Assert.areSame(0, test.countries.size(), 'Model loaded wrong value');
            }, 1400);
        },
        'LA26. After-event not executed when prevented': function() {
            var test = this,
                afterevent = false;
            test.countries.on('loadappend', function(e) {
                e.preventDefault();
            });
            test.countries.after('error', function() {
                afterevent = true;
            });
            test.countries.loadappendPromise().then(
                function() {
                    test.resume(function(){
                        Y.Assert.fail('syncing with error: loadPromise is fulfilled on first append even if syncing gave an error');
                    });
                },
                function() {test.countries.loadappend();}
            );
            this.wait(function(){
                Y.Assert.isFalse(afterevent, 'Model\'s after-dload is executed even if event was prevented');
            }, 1400);
        },
        'LA27. check promise': function() {
            var startdelayed = false,
                test = this;
            Y.later(1000, null, function() {
                startdelayed = true;
            });
            test.countries.loadappendPromise().then(
                function() {
                    test.resume(function(){
                        Y.Assert.fail('syncing with error: loadPromise is fulfilled on first append even if syncing gave an error');
                    });
                },
                function() {
                test.countries.loadPromise().then(
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
                           Y.Assert.areSame('Server time-out (simulated)', reason.message, 'syncing with error: loadPromise is rejected as should be, but the error is different');
                        });
                    }
                );
            });
            this.wait(1400);
        },
        'LA28. check error-event': function() {
            var test = this,
                errorevent = false;
            test.countries.on('error', function() {
                errorevent = true;
            });
            test.countries.loadappendPromise().then(
                function() {
                    test.resume(function(){
                        Y.Assert.fail('syncing with error: loadPromise is fulfilled on first append even if syncing gave an error');
                    });
                },
                function() {test.countries.loadappend();}
            );
            this.wait(function(){
                Y.Assert.isTrue(errorevent, 'error event did not occur while the sync returned an error');
            }, 1400);
        },
        'LA28b. size modellist when error': function() {
            var test = this;
            test.countries.loadappendPromise().then(
                function() {
                    test.resume(function(){
                        Y.Assert.fail('syncing with error: loadPromise is fulfilled on first append even if syncing gave an error');
                    });
                },
                function() {
                test.countries.loadappendPromise().then(
                    function() {
                        test.resume(function(){
                            Y.Assert.fail('syncing with error: loadPromise is fulfilled on first append even if syncing gave an error');
                        });
                    },
                    function(reason) {
                        test.resume(function(){
                           Y.Assert.areSame(0, test.countries.size(), 'Modellist does not have the right number of items');
                        });
                    }
                );
            });
            this.wait(1400);
        }
    }));

    //=== testing save NEW model
    suite.add(new Y.Test.Case({
        name: 'Check save new model when sync goes well',

        setUp : function () {
            this.countries = new Y.Countries();
            this.mycountrymodel1 = new Y.CountryModel({Country: 'The Netherlands'});
            this.mycountrymodel2 = new Y.CountryModel({Country: 'UK'});
            this.countries.add(this.mycountrymodel1);
            this.countries.add(this.mycountrymodel2);
        },
        tearDown : function () {
            this.countries.destroymodels({remove: false, fromInternal: true});
            this.countries.destroy();
        },
        '29. On-event in time': function() {
            var test = this;
            test.countries.on('save', function() {
                test.resume(function(){
                    Y.Assert.pass();
                });
            });
            test.countries.save();
            this.wait(200);
        },
        '30. After-event not too early': function() {
            var test = this,
                delayed = false;
            Y.later(400, null, function() {
                delayed = true;
            });
            test.countries.after('save', function() {
                test.resume(function(){
                    Y.Assert.isTrue(delayed, 'Modellist\'s after-save is executed before the synclayer started');
                });
            });
            test.countries.save();
            this.wait(800);
        },
        '31. value after save': function() {
            var test = this;
            test.countries.after('save', function() {
                test.resume(function(){
                    Y.Assert.areSame('Its Asbreuk', test.mycountrymodel1.get('extrafield'), 'Model saved wrong value');
                });
            });
            test.countries.save();
            this.wait(800);
        },
        '32. DefaultFn not executed when prevented': function() {
            var test = this;
            test.countries.on('save', function(e) {
                e.preventDefault();
            });
            test.countries.save();
            this.wait(function(){
                Y.Assert.areNotSame('Its Asbreuk', test.mycountrymodel1.get('extrafield'), 'Model saved but shouldn\'t have');
            }, 800);
        },
        '33. After-event not executed when prevented': function() {
            var test = this,
                afterevent = false;
            test.countries.on('save', function(e) {
                e.preventDefault();
            });
            test.countries.after('save', function() {
                afterevent = true;
            });
            test.countries.save();
            this.wait(function(){
                Y.Assert.isFalse(afterevent, 'ModelList\'s after-save is executed even if event was prevented');
            }, 800);
        },
        '34. check promise': function() {
            var startdelayed = false,
                test = this;
            Y.later(400, null, function() {
                startdelayed = true;
            });
            test.countries.savePromise().then(
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
            this.wait(800);
        },
        '35. ModelList.save check error-event': function() {
            var test = this,
                errorevent = false;
            test.countries.on('*:error', function() {
                errorevent = true;
            });
            test.countries.save();
            this.wait(function(){
                Y.Assert.isFalse(errorevent, 'error event occured while the sync should be ok');
            }, 800);
        },
        '36. check non destruction with positive id': function() {
            var test = this;
            test.countries.after('save', function() {
                test.resume(function(){
                    Y.Assert.isFalse(test.mycountrymodel1.get('destroyed'), 'modellist gets destroyed even with positive id');
                });
            });
            test.countries.save();
            this.wait(800);
        },
        '37. check destuction with id-1': function() {
            var test = this,
                deletedModel = new Y.CountryModelServerDeleted({Country: 'The Netherlands'});
            this.countries.add(deletedModel);
            deletedModel.after('save', function() {
                test.resume(function(){
                    Y.Assert.isTrue(deletedModel.get('destroyed'), 'model did not get destroyed even with id=-1');
                    deletedModel.destroy();
                });
            });
            this.countries.save();
            this.wait(800);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Check save new model when sync has error',
        setUp : function () {
            this.countries = new Y.CountriesError();
            this.mycountrymodel1 = new Y.CountryModelError({Country: 'The Netherlands'});
            this.mycountrymodel2 = new Y.CountryModelError({Country: 'UK'});
            this.countries.add(this.mycountrymodel1);
            this.countries.add(this.mycountrymodel2);
        },
        tearDown : function () {
            this.countries.destroymodels({remove: false, fromInternal: true});
            this.countries.destroy();
        },
        '38. On-event in time': function() {
            var test = this;
            test.countries.on('save', function() {
                test.resume(function(){
                    Y.Assert.pass();
                });
            });
            test.countries.save();
            this.wait(200);
        },
        '39. After-event not too early': function() {
            var test = this,
                delayed = false;
            Y.later(400, null, function() {
                delayed = true;
            });
            test.countries.after('*:error', function() {
                test.resume(function(){
                    Y.Assert.isTrue(delayed, 'ModelList\'s after-save is executed before the synclayer started');
                });
            });
            test.countries.save();
            this.wait(800);
        },
        '40. After syncing with failure instance should not get value': function() {
            var test = this;
            test.countries.after('*:error', function() {
                test.resume(function(){
                    Y.Assert.areNotSame('Its Asbreuk', test.mycountrymodel1.get('extrafield'), 'Model saved wrong value');
                });
            });
            test.countries.save();
            this.wait(800);
        },
        '41. DefaultFn not executed when prevented': function() {
            var test = this;
            test.countries.on('save', function(e) {
                e.preventDefault();
            });
            test.countries.save();
            this.wait(function(){
                Y.Assert.areNotSame('Its Asbreuk', test.mycountrymodel1.get('extrafield'), 'Model saved wrong value');
            }, 800);
        },
        '42. After-event not executed when prevented': function() {
            var test = this,
                afterevent = false;
            test.countries.on('save', function(e) {
                e.preventDefault();
            });
            test.countries.after('*:error', function() {
                afterevent = true;
            });
            test.countries.save();
            this.wait(function(){
                Y.Assert.isFalse(afterevent, 'ModelList\'s after-save is executed even if event was prevented');
            }, 800);
        },
        '43. check promise': function() {
            var startdelayed = false,
                test = this;
            Y.later(400, null, function() {
                startdelayed = true;
            });
            test.countries.savePromise().then(
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
                       Y.Assert.areSame('Error: Error during create', reason.message, 'syncing with error: savePromise is rejected as should be, but the error is different');
                    });
                }
            );
            this.wait(800);
        },
        '44. ModelList.savecheck error-event': function() {
            var test = this,
                errorevent = false;
            test.countries.on('*:error', function() {
                errorevent = true;
            });
            test.countries.save();
            this.wait(function(){
                Y.Assert.isTrue(errorevent, 'error event did not occur while the sync returned an error');
            }, 800);
        }
    }));

    //=== testing save existing model
    suite.add(new Y.Test.Case({
        name: 'Check save new model when sync goes well',
        setUp : function () {
            this.countries = new Y.Countries();
            this.mycountrymodel1 = new Y.CountryModel({id: 2});
            this.mycountrymodel2 = new Y.CountryModel({id: 3});
            this.mycountrymodel1.set('Country', 'The Netherlands', {fromInternal: true});
            this.mycountrymodel2.set('Country', 'UK', {fromInternal: true});
            this.countries.add(this.mycountrymodel1);
            this.countries.add(this.mycountrymodel2);
        },
        tearDown : function () {
            this.countries.destroymodels({remove: false, fromInternal: true});
            this.countries.destroy();
        },
        '45. On-event in time': function() {
            var test = this;
            test.countries.on('save', function() {
                test.resume(function(){
                    Y.Assert.pass();
                });
            });
            test.countries.save();
            this.wait(200);
        },
        '46. After-event not too early': function() {
            var test = this,
                delayed = false;
            Y.later(400, null, function() {
                delayed = true;
            });
            test.countries.after('save', function() {
                test.resume(function(){
                    Y.Assert.isTrue(delayed, 'Model\'s after-save is executed before the synclayer started');
                });
            });
            test.countries.save();
            this.wait(800);
        },
        '47. value after save': function() {
            var test = this;
            test.countries.after('save', function() {
                test.resume(function(){
                    Y.Assert.areSame('Its Asbreuk', test.mycountrymodel1.get('extrafield'), 'Model saved wrong value');
                });
            });
            test.countries.save();
            this.wait(800);
        },
        '48. DefaultFn not executed when prevented': function() {
            var test = this;
            test.countries.on('save', function(e) {
                e.preventDefault();
            });
            test.countries.save();
            this.wait(function(){
                Y.Assert.areNotSame('Its Asbreuk', test.mycountrymodel1.get('extrafield'), 'Model saved but shouldn\'t have');
            }, 800);
        },
        '49. After-event not executed when prevented': function() {
            var test = this,
                afterevent = false;
            test.countries.on('save', function(e) {
                e.preventDefault();
            });
            test.countries.after('save', function() {
                afterevent = true;
            });
            test.countries.save();
            this.wait(function(){
                Y.Assert.isFalse(afterevent, 'Model\'s after-save is executed even if event was prevented');
            }, 800);
        },
        '50. check promise': function() {
            var startdelayed = false,
                test = this;
            Y.later(400, null, function() {
                startdelayed = true;
            });
            test.countries.savePromise().then(
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
            this.wait(800);
        },
        '51. check error-event': function() {
            var test = this,
                errorevent = false;
            test.countries.on('*:error', function() {
                errorevent = true;
            });
            test.countries.save();
            this.wait(function(){
                Y.Assert.isFalse(errorevent, 'error event occured while the sync should be ok');
            }, 800);
        },
        '52. check non destruction with positive id': function() {
            var test = this;
            test.countries.after('save', function() {
                test.resume(function(){
                    Y.Assert.isFalse(test.mycountrymodel1.get('destroyed'), 'model gets destroyed even with positive id');
                });
            });
            test.countries.save();
            this.wait(800);
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
            this.wait(800);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Check save new model when sync has error',
        setUp : function () {
            this.countries = new Y.CountriesError();
            this.mycountrymodel1 = new Y.CountryModelError({id: 2});
            this.mycountrymodel2 = new Y.CountryModelError({id: 3});
            this.mycountrymodel1.set('Country', 'The Netherlands', {fromInternal: true});
            this.mycountrymodel2.set('Country', 'UK', {fromInternal: true});
            this.countries.add(this.mycountrymodel1);
            this.countries.add(this.mycountrymodel2);
        },
        tearDown : function () {
            this.countries.destroymodels({remove: false, fromInternal: true});
            this.countries.destroy();
        },
        '54. On-event in time': function() {
            var test = this;
            test.countries.on('save', function() {
                test.resume(function(){
                    Y.Assert.pass();
                });
            });
            test.countries.save();
            this.wait(200);
        },
        '55. After-event not too early': function() {
            var test = this,
                delayed = false;
            Y.later(400, null, function() {
                delayed = true;
            });
            test.countries.after('*:error', function() {
                test.resume(function(){
                    Y.Assert.isTrue(delayed, 'Model\'s after-save is executed before the synclayer started');
                });
            });
            test.countries.save();
            this.wait(800);
        },
        '56. After syncing with failure instance should not get value': function() {
            var test = this;
            test.countries.after('*:error', function() {
                test.resume(function(){
                    Y.Assert.areNotSame('Its Asbreuk', test.mycountrymodel1.get('extrafield'), 'Model saved wrong value');
                });
            });
            test.countries.save();
            this.wait(800);
        },
        '57. DefaultFn not executed when prevented': function() {
            var test = this;
            test.countries.on('save', function(e) {
                e.preventDefault();
            });
            test.countries.save();
            this.wait(function(){
                Y.Assert.areNotSame('Its Asbreuk', test.mycountrymodel1.get('extrafield'), 'Model saved wrong value');
            }, 800);
        },
        '58. After-event not executed when prevented': function() {
            var test = this,
                afterevent = false;
            test.countries.on('save', function(e) {
                e.preventDefault();
            });
            test.countries.after('*:error', function() {
                afterevent = true;
            });
            test.countries.save();
            this.wait(function(){
                Y.Assert.isFalse(afterevent, 'Model\'s after-save is executed even if event was prevented');
            }, 800);
        },
        '59. check promise': function() {
            var startdelayed = false,
                test = this;
            Y.later(400, null, function() {
                startdelayed = true;
            });
            test.countries.savePromise().then(
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
                       Y.Assert.areSame('Error: Error during update', reason.message, 'syncing with error: savePromise is rejected as should be, but the error is different');
                    });
                }
            );
            this.wait(800);
        },
        '60. check error-event': function() {
            var test = this,
                errorevent = false;
            test.countries.on('*:error', function() {
                errorevent = true;
            });
            test.countries.save();
            this.wait(function(){
                Y.Assert.isTrue(errorevent, 'error event did not occur while the sync returned an error');
            }, 800);
        }
    }));

    //=== testing submit NEW model
    suite.add(new Y.Test.Case({
        name: 'Check submit new model when sync goes well',

        setUp : function () {
            this.countries = new Y.Countries();
            this.mycountrymodel1 = new Y.CountryModel({Country: 'The Netherlands'});
            this.mycountrymodel2 = new Y.CountryModel({Country: 'UK'});
            this.countries.add(this.mycountrymodel1);
            this.countries.add(this.mycountrymodel2);
        },
        tearDown : function () {
            this.countries.destroymodels({remove: false, fromInternal: true});
            this.countries.destroy();
        },
        'SUBMIT29. On-event in time': function() {
            var test = this;
            test.countries.on('submit', function() {
                test.resume(function(){
                    Y.Assert.pass();
                });
            });
            test.countries.submit();
            this.wait(200);
        },
        'SUBMIT30. After-event not too early': function() {
            var test = this,
                delayed = false;
            Y.later(400, null, function() {
                delayed = true;
            });
            test.countries.after('submit', function() {
                test.resume(function(){
                    Y.Assert.isTrue(delayed, 'Modellist\'s after-submit is executed before the synclayer started');
                });
            });
            test.countries.submit();
            this.wait(800);
        },
        'SUBMIT31. value after submit': function() {
            var test = this;
            test.countries.after('submit', function() {
                test.resume(function(){
                    Y.Assert.areSame('Its Asbreuk', test.mycountrymodel1.get('extrafield'), 'Model submitd wrong value');
                });
            });
            test.countries.submit();
            this.wait(800);
        },
        'SUBMIT32. DefaultFn not executed when prevented': function() {
            var test = this;
            test.countries.on('submit', function(e) {
                e.preventDefault();
            });
            test.countries.submit();
            this.wait(function(){
                Y.Assert.areNotSame('Its Asbreuk', test.mycountrymodel1.get('extrafield'), 'Model submitd but shouldn\'t have');
            }, 800);
        },
        'SUBMIT33. After-event not executed when prevented': function() {
            var test = this,
                afterevent = false;
            test.countries.on('submit', function(e) {
                e.preventDefault();
            });
            test.countries.after('submit', function() {
                afterevent = true;
            });
            test.countries.submit();
            this.wait(function(){
                Y.Assert.isFalse(afterevent, 'ModelList\'s after-submit is executed even if event was prevented');
            }, 800);
        },
        'SUBMIT34. check promise': function() {
            var startdelayed = false,
                test = this;
            Y.later(400, null, function() {
                startdelayed = true;
            });
            test.countries.submitPromise().then(
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
        'SUBMIT35. ModelList.submit check error-event': function() {
            var test = this,
                errorevent = false;
            test.countries.on('*:error', function() {
                errorevent = true;
            });
            test.countries.submit();
            this.wait(function(){
                Y.Assert.isFalse(errorevent, 'error event occured while the sync should be ok');
            }, 800);
        },
        'SUBMIT36. check non destruction with positive id': function() {
            var test = this;
            test.countries.after('submit', function() {
                test.resume(function(){
                    Y.Assert.isFalse(test.mycountrymodel1.get('destroyed'), 'modellist gets destroyed even with positive id');
                });
            });
            test.countries.submit();
            this.wait(800);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Check submit new model when sync has error',
        setUp : function () {
            this.countries = new Y.CountriesError();
            this.mycountrymodel1 = new Y.CountryModelError({Country: 'The Netherlands'});
            this.mycountrymodel2 = new Y.CountryModelError({Country: 'UK'});
            this.countries.add(this.mycountrymodel1);
            this.countries.add(this.mycountrymodel2);
        },
        tearDown : function () {
            this.countries.destroymodels({remove: false, fromInternal: true});
            this.countries.destroy();
        },
        'SUBMIT38. On-event in time': function() {
            var test = this;
            test.countries.on('submit', function() {
                test.resume(function(){
                    Y.Assert.pass();
                });
            });
            test.countries.submit();
            this.wait(200);
        },
        'SUBMIT39. After-event not too early': function() {
            var test = this,
                delayed = false;
            Y.later(400, null, function() {
                delayed = true;
            });
            test.countries.after('*:error', function() {
                test.resume(function(){
                    Y.Assert.isTrue(delayed, 'ModelList\'s after-submit is executed before the synclayer started');
                });
            });
            test.countries.submit();
            this.wait(800);
        },
        'SUBMIT40. After syncing with failure instance should not get value': function() {
            var test = this;
            test.countries.after('*:error', function() {
                test.resume(function(){
                    Y.Assert.areNotSame('Its Asbreuk', test.mycountrymodel1.get('extrafield'), 'Model submitd wrong value');
                });
            });
            test.countries.submit();
            this.wait(800);
        },
        'SUBMIT41. DefaultFn not executed when prevented': function() {
            var test = this;
            test.countries.on('submit', function(e) {
                e.preventDefault();
            });
            test.countries.submit();
            this.wait(function(){
                Y.Assert.areNotSame('Its Asbreuk', test.mycountrymodel1.get('extrafield'), 'Model submitd wrong value');
            }, 800);
        },
        'SUBMIT42. After-event not executed when prevented': function() {
            var test = this,
                afterevent = false;
            test.countries.on('submit', function(e) {
                e.preventDefault();
            });
            test.countries.after('*:error', function() {
                afterevent = true;
            });
            test.countries.submit();
            this.wait(function(){
                Y.Assert.isFalse(afterevent, 'ModelList\'s after-submit is executed even if event was prevented');
            }, 800);
        },
        'SUBMIT43. check promise': function() {
            var startdelayed = false,
                test = this;
            Y.later(400, null, function() {
                startdelayed = true;
            });
            test.countries.submitPromise().then(
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
                       Y.Assert.areSame('Error: Error during submit', reason.message, 'syncing with error: submitPromise is rejected as should be, but the error is different');
                    });
                }
            );
            this.wait(800);
        },
        'SUBMIT44. ModelList.submitcheck error-event': function() {
            var test = this,
                errorevent = false;
            test.countries.on('*:error', function() {
                errorevent = true;
            });
            test.countries.submit();
            this.wait(function(){
                Y.Assert.isTrue(errorevent, 'error event did not occur while the sync returned an error');
            }, 800);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Check load when bubbles up',
        setUp : function () {
            this.countries = new Y.Countries();
            this.parentTarget = new Y.EventTarget();
            this.grantparentTarget = new Y.EventTarget();
            this.countries.addTarget(this.parentTarget);
            this.parentTarget.addTarget(this.grantparentTarget);
        },
        tearDown : function () {
            this.countries.removeTarget(this.parentTarget);
            this.parentTarget.removeTarget(this.grantparentTarget);
            this.countries.destroymodels({remove: false, fromInternal: true});
            this.countries.destroy();
        },
        '61. On-event in time at parent': function() {
            var test = this;
            test.parentTarget.on('*:load', function() {
                test.resume(function(){
                    Y.Assert.pass();
                });
            });
            test.countries.load();
            this.wait(200);
        },
        '62. After-event not too early at parent': function() {
            var test = this,
                delayed = false;
            Y.later(400, null, function() {
                delayed = true;
            });
            test.parentTarget.after('*:load', function() {
                test.resume(function(){
                    Y.Assert.isTrue(delayed, 'Model\'s parenttarget\'s after-load is executed before the synclayer started');
                });
            });
            test.countries.load();
            this.wait(800);
        },
        '63. value after load at parent': function() {
            var test = this;
            test.countries.after('load', function() {
                test.resume(function(){
                    Y.Assert.areSame('The Netherlands', test.countries.item(0).get('Country'), 'Model loaded wrong value');
                });
            });
            test.countries.load();
            this.wait(800);

        },
        '64. DefaultFn not executed when prevented': function() {
            var test = this;
            test.parentTarget.on('*:load', function(e) {
                e.preventDefault();
            });
            test.countries.load();
            this.wait(function(){
                Y.Assert.areSame(0, test.countries.size(), 'Model loaded but shouldn\'t have');
            }, 800);
        },
        '65. After-event at parent not executed when prevented': function() {
            var test = this,
                afterevent = false;
            test.parentTarget.on('*:load', function(e) {
                e.preventDefault();
            });
            test.parentTarget.after('*:load', function() {
                afterevent = true;
            });
            test.countries.load();
            this.wait(function(){
                Y.Assert.isFalse(afterevent, 'Model\'s after-load is executed even if event was prevented at parenttarget');
            }, 800);
        },
        '66. On-event in time at grantparent': function() {
            var test = this;
            test.grantparentTarget.on('*:load', function() {
                test.resume(function(){
                    Y.Assert.pass();
                });
            });
            test.countries.load();
            this.wait(200);
        },
        '67. After-event not too early at grantparent': function() {
            var test = this,
                delayed = false;
            Y.later(400, null, function() {
                delayed = true;
            });
            test.grantparentTarget.after('*:load', function() {
                test.resume(function(){
                    Y.Assert.isTrue(delayed, 'Model\'s grantparenttarget\'s after-load is executed before the synclayer started');
                });
            });
            test.countries.load();
            this.wait(800);
        },
        '68. value after load at grantparent': function() {
            var test = this;
            test.grantparentTarget.after('*:load', function() {
                test.resume(function(){
                    Y.Assert.areSame('The Netherlands', test.countries.item(0).get('Country'), 'Model loaded wrong value');
                });
            });
            test.countries.load();
            this.wait(800);
        },
        '69. DefaultFn not executed when prevented': function() {
            var test = this;
            test.grantparentTarget.on('*:load', function(e) {
                e.preventDefault();
            });
            test.countries.load();
            this.wait(function(){
                Y.Assert.areSame(0, test.countries.size(), 'Model loaded but shouldn\'t have');
            }, 800);
        },
        '70. After-event at grantparent not executed when prevented': function() {
            var test = this,
                afterevent = false;
            test.grantparentTarget.on('*:load', function(e) {
                e.preventDefault();
            });
            test.grantparentTarget.after('*:load', function() {
                afterevent = true;
            });
            test.countries.load();
            this.wait(function(){
                Y.Assert.isFalse(afterevent, 'Model\'s after-load is executed even if event was prevented at grantparenttarget');
            }, 800);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Check load when bubbles up',
        setUp : function () {
            this.countries = new Y.CountriesError();
            this.parentTarget = new Y.EventTarget();
            this.grantparentTarget = new Y.EventTarget();
            this.countries.addTarget(this.parentTarget);
            this.parentTarget.addTarget(this.grantparentTarget);
        },
        tearDown : function () {
            this.countries.removeTarget(this.parentTarget);
            this.parentTarget.removeTarget(this.grantparentTarget);
            this.countries.destroymodels({remove: false, fromInternal: true});
            this.countries.destroy();
        },
        '71. On-event in time at parent': function() {
            var test = this;
            test.parentTarget.on('*:load', function() {
                test.resume(function(){
                    Y.Assert.pass();
                });
            });
            test.countries.load();
            this.wait(200);
        },
        '72. value after load at parent': function() {
            var test = this,
                after = false;
            test.parentTarget.after('*:load', function() {
                after = true;
            });
            test.countries.load();
            this.wait(function() {
                Y.Assert.isFalse(after, 'Model\'s parenttarget\'s after-load is executed before the synclayer started');
            }, 800);
        },
        '73. DefaultFn not executed when prevented': function() {
            var test = this;
            test.parentTarget.on('*:load', function(e) {
                e.preventDefault();
            });
            test.countries.load();
            this.wait(function(){
                Y.Assert.areSame(0, test.countries.size(), 'Model loaded but shouldn\'t have');
            }, 800);
        },
        '75. After-event at parent not executed when prevented': function() {
            var test = this,
                afterevent = false;
            test.parentTarget.on('*:load', function(e) {
                e.preventDefault();
            });
            test.parentTarget.after('*:load', function() {
                afterevent = true;
            });
            test.countries.load();
            this.wait(function(){
                Y.Assert.isFalse(afterevent, 'Model\'s after-load is executed even if event was prevented at parenttarget');
            }, 800);
        },
        '76. On-event in time at grantparent': function() {
            var test = this;
            test.grantparentTarget.on('*:load', function() {
                test.resume(function(){
                    Y.Assert.pass();
                });
            });
            test.countries.load();
            this.wait(200);
        },
        '77. value after load at grantparent': function() {
            var test = this,
                after = false;
            test.parentTarget.after('*:load', function() {
                after = true;
            });
            test.countries.load();
            this.wait(function() {
                Y.Assert.isFalse(after, 'Model\'s parenttarget\'s after-load is executed before the synclayer started');
            }, 800);
        },
        '78. DefaultFn not executed when prevented': function() {
            var test = this;
            test.grantparentTarget.on('*:load', function(e) {
                e.preventDefault();
            });
            test.countries.load();
            this.wait(function(){
                Y.Assert.areSame(0, test.countries.size(), 'Model loaded but shouldn\'t have');
            }, 800);
        },
        '80. After-event at grantparent not executed when prevented': function() {
            var test = this,
                afterevent = false;
            test.grantparentTarget.on('*:load', function(e) {
                e.preventDefault();
            });
            test.grantparentTarget.after('*:load', function() {
                afterevent = true;
            });
            test.countries.load();
            this.wait(function(){
                Y.Assert.isFalse(afterevent, 'Model\'s after-load is executed even if event was prevented at grantparenttarget');
            }, 800);
        }
    }));

    Y.Test.Runner.add(suite);

},'', { requires: [ 'test', 'event-custom-base', 'model', 'model-list', 'gallery-itsaformmodel', 'gallery-itsamodellistsyncpromise' ] });

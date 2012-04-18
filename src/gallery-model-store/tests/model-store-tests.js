YUI.add('model-store-tests', function(Y) {
    var ArrayAssert  = Y.ArrayAssert,
        Assert       = Y.Assert,
        ObjectAssert = Y.ObjectAssert,

        storeSuite;

    // -- ModelStore Suite ----------------------------------------------------------
    storeSuite = new Y.Test.Suite('Model Store');

    // -- ModelStore: Object -------------------------------------------------------
    storeSuite.add(new Y.Test.Case({
        name: 'Object',

        _should: {
            error: {
                'Y.ModelStore should be a singleton': true //this test should throw an error
            }
        },

        'Y.ModelStore should be a singleton': function () {
            var store = new Y.ModelStore(); // this should throw an error

            Assert.isObject(Y.ModelStore, 'Y.ModelStore should be an object');
            Assert.isObject(Y.ModelStore.constructor, 'Y.Modelstore constructor should be an object');
        },


        'test methods and properties': function() {
            Assert.isObject(Y.ModelStore._lists, '_lists should be an object');
            Assert.isFunction(Y.ModelStore.registerModel, 'registerModel should be a function');
            Assert.isFunction(Y.ModelStore.unregisterModel, 'unregisterModel should be a function');
            Assert.isFunction(Y.ModelStore.unregisterAll, 'unregisterAll should be a function');
            Assert.isFunction(Y.ModelStore.find, 'find should be a function');
            Assert.isFunction(Y.ModelStore.getList, 'getList should be a function');
            Assert.isFunction(Y.ModelStore._createList, '_createList should be a function');
            Assert.isFunction(Y.ModelStore._getModelCtor, '_getModelCtor should be a function');
            Assert.isFunction(Y.ModelStore._getModelName, '_getModelName should be a function');
        }
    }));

    // -- ModelStore: _getModelCtor -------------------------------------------------------
    storeSuite.add(new Y.Test.Case({
        name: '_getModelCtor',

        setUp: function() {
            Y.TestModel = Y.Base.create('testModel', Y.Model, []);
            Y.TestModel2 = Y.Base.create('testModel2', Y.TestModel, []);
        },

        tearDown: function() {
            delete Y.TestModel;
            delete Y.TestModel2;
        },

        'test constructor': function() {
            var ctor = Y.ModelStore._getModelCtor;

            Assert.isFunction(ctor(Y.Model), 'should be Y.Model');
            Assert.areSame(Y.Model, ctor(Y.Model), 'should be Y.Model');

            Assert.isFunction(ctor(Y.TestModel));
            Assert.areSame(Y.TestModel, ctor(Y.TestModel), 'should be Y.TestModel');

            Assert.isFunction(ctor(Y.TestModel2));
            Assert.areSame(Y.TestModel2, ctor(Y.TestModel2), 'should be Y.TestModel2');

        },

        'test constructor string': function() {
            var ctor = Y.ModelStore._getModelCtor;

            Assert.isFunction(ctor('Model'));
            Assert.areSame(Y.Model, ctor('Model'));

            Assert.isFunction(ctor('TestModel'));
            Assert.areSame(Y.TestModel, ctor('TestModel'));

            Assert.isFunction(ctor('TestModel2'));
            Assert.areSame(Y.TestModel2, ctor('TestModel2'));
        },

        'test instance': function() {
            var ctor = Y.ModelStore._getModelCtor;

            Assert.isFunction(ctor(new Y.Model()));
            Assert.areSame(Y.Model, ctor(new Y.Model()));

            Assert.isFunction(ctor(new Y.TestModel()));
            Assert.areSame(Y.TestModel, ctor(new Y.TestModel()));

            Assert.isFunction(ctor(new Y.TestModel2()));
            Assert.areSame(Y.TestModel2, ctor(new Y.TestModel2()));
        },

        'test invalid': function() {
            var ctor = Y.ModelStore._getModelCtor;

            Assert.isNull(ctor('FooModel'));
            Assert.isNull(ctor(Y.ModelStore));
        }
    }));

    // -- ModelStore: _getModelName -------------------------------------------------------
    storeSuite.add(new Y.Test.Case({
        name: '_getModelName',

        setUp: function() {
            Y.TestModel = Y.Base.create('testModel', Y.Model, []);
        },

        tearDown: function() {
            delete Y.TestModel;
        },

        'test constructor': function() {
            Assert.areSame('model', Y.ModelStore._getModelName(Y.Model));
            Assert.areSame('testModel', Y.ModelStore._getModelName(Y.TestModel));
        },

        'test constructor string': function() {
            Assert.areSame('model', Y.ModelStore._getModelName('Model'));
            Assert.areSame('testModel', Y.ModelStore._getModelName('TestModel'));
        },

        'test instance': function() {
            Assert.areSame('model', Y.ModelStore._getModelName(new Y.Model()));
            Assert.areSame('testModel', Y.ModelStore._getModelName(new Y.TestModel()));
        },

        'test invalid': function() {
            Assert.areSame('unknown', Y.ModelStore._getModelName('FooModel'));
            Assert.areSame('unknown', Y.ModelStore._getModelName(Y.ModelStore));
        }
    }));

    // -- ModelStore: Methods -------------------------------------------------------
    storeSuite.add(new Y.Test.Case({
        name: 'Methods',

        setUp: function() {
            this.TestModel = Y.Base.create('testModel', Y.Model, [], {}, {
                ATTRS: {
                    name: {
                        value: ''
                    }
                }
            });

            this.testModel = new this.TestModel({name: 'TestModel1', id: 1});
        },

        tearDown: function() {
            Y.ModelStore._lists = {};
            delete this.TestModel;
        },

        'test registerModel': function () {
            var list;

            Y.ModelStore.registerModel(this.testModel);

            list = Y.ModelStore._lists[this.TestModel.NAME];

            Assert.isInstanceOf(Y.ModelList, list);
            Assert.areSame(1, list.size());
            Assert.areSame(this.testModel, list.item(0));
        },

        'test unregisterModel': function () {
            var list, m;

            Y.ModelStore.registerModel(this.testModel);

            list = Y.ModelStore._lists[this.TestModel.NAME];

            m = Y.ModelStore.unregisterModel(this.testModel);

            Assert.isInstanceOf(Y.ModelList, list);
            Assert.areSame(0, list.size());
            Assert.areSame(m, this.testModel);
        },

        'test unregisterAll': function () {
            Y.ModelStore.registerModel(this.testModel);

            Y.ModelStore.unregisterAll();

            ArrayAssert.itemsAreEqual(Object.keys({}), Object.keys(Y.ModelStore._lists));
        },

        'test getList': function() {
            var list;

            Y.ModelStore.registerModel(this.testModel);

            list = Y.ModelStore.getList(this.testModel, false);

            Assert.isInstanceOf(Y.ModelList, list);
            Assert.areSame(1, list.size());
            Assert.areSame(this.testModel, list.item(0));
        },

        'test find': function() {
            Y.ModelStore.registerModel(this.testModel);

            Assert.areSame(this.testModel, Y.ModelStore.find(this.TestModel, this.testModel.get('id')));
        }
    }));

    Y.Test.Runner.add(storeSuite);
}, '@VERSION@', {
    requires: [
        'test',
        'model',
        'model-list',
        'gallery-model-store'
    ]
});

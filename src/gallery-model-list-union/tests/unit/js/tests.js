YUI.add('module-tests', function (Y) {
    'use strict';
    
    var suite = new Y.Test.Suite('gallery-model-list-union');

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',
        'test:001-apiExists': function () {
            Y.Assert.isFunction(Y.ModelList, 'Y.ModelList should be a function.');
            Y.Assert.isFunction(Y.ModelList.union, 'Y.ModelList.union should be a function.');
        },
        'test:002-union': function () {
            var model0 = new Y.Model(),
                model1 = new Y.Model(),
                model2 = new Y.Model(),
                model3 = new Y.Model(),
                model4 = new Y.Model(),
                model5 = new Y.Model(),
                model6 = new Y.Model(),
                model7 = new Y.Model(),
                model8 = new Y.Model(),
                model9 = new Y.Model(),
                modelList0 = new Y.ModelList().reset([
                    model0,
                    model1,
                    model2,
                    model3
                ]),
                modelList1 = new Y.ModelList().reset([
                    model2,
                    model3,
                    model4,
                    model5,
                    model6
                ]),
                modelListUnion = Y.ModelList.union(modelList0, modelList1);

            Y.Assert.isInstanceOf(Y.ModelList, modelListUnion, 'modelListUnion should be an instance of Y.ModelList.');

            Y.ArrayAssert.containsItems([
                model0,
                model1,
                model2,
                model3,
                model4,
                model5,
                model6
            ], modelListUnion.toArray(), 'modelListUnion should contain the expected models.');

            modelList0.add([
                model7,
                model8
            ]);

            modelList0.remove([
                model1,
                model2,
                model3
            ]);

            Y.ArrayAssert.containsItems([
                model0,
                model2,
                model3,
                model4,
                model5,
                model6,
                model7,
                model8
            ], modelListUnion.toArray(), 'modelListUnion should contain the expected models after modelList0 changes.');

            modelList1.add(model9);

            modelList1.remove([
                model2,
                model4
            ]);

            Y.ArrayAssert.containsItems([
                model0,
                model3,
                model5,
                model6,
                model7,
                model8,
                model9
            ], modelListUnion.toArray(), 'modelListUnion should contain the expected models after modelList1 changes.');
        },
        'test:003-custom-type': function () {
            Y.NameModel = Y.Base.create('name-model', Y.Model, [], {}, {
                ATTRS: {
                    name: {
                        value: ''
                    }
                }
            });

            Y.NameModelList = Y.Base.create('name-model-list', Y.ModelList, [], {
                comparator: function (model) {
                    return model.get('name');
                },
                model: Y.NameModel
            });

            var nameModelList0 = new Y.NameModelList().reset([{
                    name: 'Jeffrey'
                }, {
                    name: 'Emily'
                }, {
                    name: 'Luke'
                }]),
                nameModelList1 = new Y.NameModelList().reset([{
                    name: 'Kara'
                }, {
                    name: 'Eric'
                }, {
                    name: 'George'
                }]),
                nameModelList2 = new Y.NameModelList().reset([{
                    name: 'Jim'
                }, {
                    name: 'Raymond'
                }, {
                    name: 'Jennifer'
                }]),
                nameModelListUnion = Y.ModelList.union('NameModelList', nameModelList0, nameModelList1, nameModelList2);
            
            Y.Assert.isInstanceOf(Y.NameModelList, nameModelListUnion, 'nameModelListUnion should be an instance of Y.NameModelList.');
            
            Y.ArrayAssert.itemsAreSame([
                'Emily',
                'Eric',
                'George',
                'Jeffrey',
                'Jennifer',
                'Jim',
                'Kara',
                'Luke',
                'Raymond'
            ], nameModelListUnion.get('name'), 'nameModelListUnion should contain the expected name models.');
            
            nameModelList1.add({
                name: 'Sarah'
            });
            
            nameModelList2.add({
                name: 'Matthew'
            });
            
            Y.ArrayAssert.itemsAreSame([
                'Emily',
                'Eric',
                'George',
                'Jeffrey',
                'Jennifer',
                'Jim',
                'Kara',
                'Luke',
                'Matthew',
                'Raymond',
                'Sarah'
            ], nameModelListUnion.get('name'), 'nameModelListUnion should contain the expected name models after nameModelList1 and nameModelList2 change.');
            
            nameModelList0.reset();
            
            Y.ArrayAssert.itemsAreSame([
                'Eric',
                'George',
                'Jennifer',
                'Jim',
                'Kara',
                'Matthew',
                'Raymond',
                'Sarah'
            ], nameModelListUnion.get('name'), 'nameModelListUnion should contain the expected name models after nameModelList0 changes.');
        },
        'test:004-error-when-first-argument-is-not-a-model-list': function () {
            Y.ModelList.union({
                thisIsNot: 'aModelList'
            }, new Y.ModelList(), new Y.ModelList());
        },
        _should: {
            error: {
                'test:004-error-when-first-argument-is-not-a-model-list': true
            }
        }
    }));

    Y.Test.Runner.add(suite);
}, '', {
    requires: [
        'gallery-model-list-union',
        'test'
    ]
});
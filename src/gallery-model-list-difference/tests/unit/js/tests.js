YUI.add('module-tests', function (Y) {
    'use strict';

    var suite = new Y.Test.Suite('gallery-model-list-difference');

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',
        'test:001-apiExists': function () {
            Y.Assert.isFunction(Y.ModelList, 'Y.ModelList should be a function.');
            Y.Assert.isFunction(Y.ModelList.difference, 'Y.ModelList.difference should be a function.');
        },
        'test:002-difference': function () {
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
                    model3,
                    model4,
                    model5,
                    model6,
                    model7
                ]),
                modelList1 = new Y.ModelList().reset([
                    model2,
                    model4,
                    model5,
                    model6
                ]),
                modelListDifference = Y.ModelList.difference(modelList0, modelList1);

            Y.Assert.isInstanceOf(Y.ModelList, modelListDifference, 'modelListDifference should be an instance of Y.ModelList.');

            Y.ArrayAssert.containsItems([
                model0,
                model1,
                model3,
                model7
            ], modelListDifference.toArray(), 'modelListDifference should contain the expected models.');

            modelList0.add([
                model8,
                model9
            ]);

            modelList0.remove([
                model1,
                model2,
                model3
            ]);

            Y.ArrayAssert.containsItems([
                model0,
                model7,
                model8,
                model9
            ], modelListDifference.toArray(), 'modelListDifference should contain the expected models after modelList0 changes.');

            modelList1.add(model8);

            modelList1.remove([
                model2,
                model4
            ]);

            Y.ArrayAssert.containsItems([
                model0,
                model4,
                model7,
                model9
            ], modelListDifference.toArray(), 'modelListDifference should contain the expected models after modelList1 changes.');
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

            var nameModel_Emily = new Y.NameModel({
                    name: 'Emily'
                }),
                nameModel_Eric = new Y.NameModel({
                    name: 'Eric'
                }),
                nameModel_George = new Y.NameModel({
                    name: 'George'
                }),
                nameModel_Jeffrey = new Y.NameModel({
                    name: 'Jeffrey'
                }),
                nameModel_Jennifer = new Y.NameModel({
                    name: 'Jennifer'
                }),
                nameModel_Jim = new Y.NameModel({
                    name: 'Jim'
                }),
                nameModel_Kara = new Y.NameModel({
                    name: 'Kara'
                }),
                nameModel_Luke = new Y.NameModel({
                    name: 'Luke'
                }),
                nameModel_Matthew = new Y.NameModel({
                    name: 'Matthew'
                }),
                nameModel_Raymond = new Y.NameModel({
                    name: 'Raymond'
                }),
                nameModel_Sarah = new Y.NameModel({
                    name: 'Sarah'
                }),
                nameModelList0 = new Y.NameModelList().reset([
                    nameModel_Jeffrey,
                    nameModel_Emily,
                    nameModel_Luke,
                    nameModel_Kara,
                    nameModel_Eric,
                    nameModel_George,
                    nameModel_Jim,
                    nameModel_Raymond
                ]),
                nameModelList1 = new Y.NameModelList().reset([
                    nameModel_Jeffrey,
                    nameModel_Emily,
                    nameModel_Eric,
                    nameModel_Jennifer
                ]),
                nameModelList2 = new Y.NameModelList().reset([
                    nameModel_Jeffrey,
                    nameModel_George,
                    nameModel_Jim
                ]),
                nameModelListDifference = Y.ModelList.difference('NameModelList', nameModelList0, nameModelList1, nameModelList2);

            Y.Assert.isInstanceOf(Y.NameModelList, nameModelListDifference, 'nameModelListDifference should be an instance of Y.NameModelList.');

            Y.ArrayAssert.itemsAreSame([
                nameModel_Kara,
                nameModel_Luke,
                nameModel_Raymond
            ], nameModelListDifference.toArray(), 'nameModelListDifference should contain the expected name models.');

            nameModelList0.add([
                nameModel_Matthew,
                nameModel_Sarah
            ]);

            Y.ArrayAssert.itemsAreSame([
                nameModel_Kara,
                nameModel_Luke,
                nameModel_Matthew,
                nameModel_Raymond,
                nameModel_Sarah
            ], nameModelListDifference.toArray(), 'nameModelListDifference should contain the expected name models after nameModelList0 changes.');

            nameModelList1.add(nameModel_Matthew);

            Y.ArrayAssert.itemsAreSame([
                nameModel_Kara,
                nameModel_Luke,
                nameModel_Raymond,
                nameModel_Sarah
            ], nameModelListDifference.toArray(), 'nameModelListDifference should contain the expected name models after nameModelList1 changes.');

            nameModelList2.reset();

            Y.ArrayAssert.itemsAreSame([
                nameModel_George,
                nameModel_Jim,
                nameModel_Kara,
                nameModel_Luke,
                nameModel_Raymond,
                nameModel_Sarah
            ], nameModelListDifference.toArray(), 'nameModelListDifference should contain the expected name models after nameModelList2 changes.');
        },
        'test:004-error-when-first-argument-is-not-a-model-list': function () {
            Y.ModelList.difference({
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
        'gallery-model-list-difference',
        'test'
    ]
});
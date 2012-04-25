YUI.add('model-relationship-tests', function(Y) {
    var ArrayAssert  = Y.ArrayAssert,
        Assert       = Y.Assert,
        ObjectAssert = Y.ObjectAssert,

        suite,
        oneToManySuite,
        oneToOneSuite,
        relatedModelSuite;

    // -- Global Suite -------------------------------------------------------------
    suite = new Y.Test.Suite('Model Relationships');

    // -- ModelRelation - One to Many Suite ----------------------------------------------------------
    oneToManySuite = new Y.Test.Suite('One to Many Relationship');

    // -- OneToMany: Lifecycle -------------------------------------------------------
    oneToManySuite.add(new Y.Test.Case({
        name: 'Lifecycle',

        setUp: function () {
            this.ParentModel = Y.Base.create('parentModel', Y.Model, [], {
                initializer: function() {
                    Y.ModelStore.registerModel(this);
                }
            });

            this.ChildModel = Y.Base.create('childModel', Y.Model, [], {
                initializer: function() {
                    Y.ModelStore.registerModel(this);
                }
            }, {
                ATTRS: {
                    parentId: {value: null}
                }
            });

            this.parentModel = new this.ParentModel({id: 1});

            this.childList = new Y.ModelList({model: this.ChildModel});

            this.childList.add([
                {id: 1, parentId: 1},
                {id: 2, parentId: 1},
                {id: 3, parentId: 2}
            ]);

            this.config = {
                name: 'children',
                type: Y.ModelRelationship.toMany,
                model: this.parentModel,
                key: 'id',
                relatedModel: this.ChildModel,
                relatedKey: 'parentId'
            };

            this.relation = new Y.ModelRelationship(this.config);
        },

        tearDown: function () {
            Y.ModelStore.unregisterAll();
            delete this.ParentModel;
            delete this.ChildModel;
            delete this.parentModel;
            delete this.childlist;
            delete this.config;
            delete this.relation;
        },

        'Relation should be instance of Relationship': function () {
            Assert.isInstanceOf(Y.ModelRelationship, this.relation);
        },

        'Relation.model should be the parentModel': function () {
            Assert.areSame(this.parentModel, this.relation.model);
        },

        'Relation.key should be id': function () {
            Assert.areSame(this.config.key, this.relation.key);
        },

        'Relation.relatedModel should be the childModel': function () {
            Assert.areSame(this.ChildModel, this.relation.relatedModel);
        },

        'Relation.relatedKey should be parentId': function () {
            Assert.areSame(this.config.relatedKey, this.relation.relatedKey);
        },

        'Relation.type should be toMany': function () {
            Assert.areSame(Y.ModelRelationship.toMany, this.relation.type);
        },

        'Relation.related should be a Y.ModelList': function () {
            Assert.isInstanceOf(Y.ModelList, this.relation.related);
        },

        'Relation.related should contain 2 models with parentId of parentModel': function () {
            var relation = this.relation;

            Assert.areSame(2, relation.related.size());

            relation.related.each(function(model) {
                Assert.areSame(relation.model.get(relation.key), model.get(relation.relatedKey));
            }, this);
        }
    }));


    // -- OneToMany: Events --------------------------------------------------------
    oneToManySuite.add(new Y.Test.Case({
        name: 'Events',

        setUp: function () {
            this.ParentModel = Y.Base.create('parentModel', Y.Model, [], {
                initializer: function() {
                    Y.ModelStore.registerModel(this);
                }
            });

            this.ChildModel = Y.Base.create('childModel', Y.Model, [], {
                initializer: function() {
                    Y.ModelStore.registerModel(this);
                }
            }, {
                ATTRS: {
                    parentId: {value: null}
                }
            });

            this.parentModel = new this.ParentModel({id: 1});

            this.childList = new Y.ModelList({model: this.ChildModel});

            this.childList.add([
                {id: 1, parentId: 1},
                {id: 2, parentId: 1},
                {id: 3, parentId: 2}
            ]);

            this.config = {
                name: 'children',
                type: Y.ModelRelationship.toMany,
                model: this.parentModel,
                key: 'id',
                relatedModel: this.ChildModel,
                relatedKey: 'parentId'
            };

            this.relation = new Y.ModelRelationship(this.config);
        },

        tearDown: function () {
            Y.ModelStore.unregisterAll();
            delete this.ParentModel;
            delete this.ChildModel;
            delete this.parentModel;
            delete this.childlist;
            delete this.config;
            delete this.relation;
        },


        'changing the key of the parent model should refresh the relationship': function () {
            var relation = this.relation;

            this.parentModel.set('id', 2);

            Assert.areSame(1, relation.related.size());

            relation.related.each(function(model) {
                Assert.areSame(relation.model.get(relation.key), model.get(relation.relatedKey));
            }, this);
        },

        'adding a related model to the childList should add it to the relationship': function () {
            var relation = this.relation;

            this.childList.add({
                name: 'childModel4',
                id: 4,
                parentId: 1
            });

            Assert.areSame(3, relation.related.size());

            relation.related.each(function(model) {
                Assert.areSame(relation.model.get(relation.key), model.get(relation.relatedKey));
            }, this);
        },

        'destroying a model in the childList should not remove it from the relationship': function () {
            var relation = this.relation;

            this.childList.getById(1).destroy();

            Assert.areSame(2, relation.related.size());

            relation.related.each(function(model) {
                Assert.areSame(relation.model.get(relation.key), model.get(relation.relatedKey));
            }, this);
        },

        'deleting a model in the childList should remove it from the relationship': function () {
            var relation = this.relation;

            this.childList.getById(1).destroy({'delete': true});

            Assert.areSame(1, relation.related.size());

            relation.related.each(function(model) {
                Assert.areSame(relation.model.get(relation.key), model.get(relation.relatedKey));
            }, this);
        },

        'changing the key on a related model should remove it from the relationship': function () {
            var relation = this.relation;

            this.childList.getById(1).set('parentId', 2);

            Assert.areSame(1, relation.related.size());

            relation.related.each(function(model) {
                Assert.areSame(relation.model.get(relation.key), model.get(relation.relatedKey));
            }, this);
        },

        'changing the key on a non-related model should add it to the relationship': function () {
            var relation = this.relation;

            this.childList.getById(3).set('parentId', 1);

            Assert.areSame(3, relation.related.size());

            relation.related.each(function(model) {
                Assert.areSame(relation.model.get(relation.key), model.get(relation.relatedKey));
            }, this);
        }

    }));

    // -- ModelRelation - One to One Suite ----------------------------------------------------------
    oneToOneSuite = new Y.Test.Suite('One to One Relationship');

    // -- OneToOne: Lifecycle -------------------------------------------------------
    oneToOneSuite.add(new Y.Test.Case({
        name: 'Lifecycle',

        setUp: function () {
            this.ParentModel = Y.Base.create('parentModel', Y.Model, [], {
                initializer: function() {
                    Y.ModelStore.registerModel(this);
                }
            });

            this.ChildModel = Y.Base.create('childModel', Y.Model, [], {
                initializer: function() {
                    Y.ModelStore.registerModel(this);
                }
            }, {
                ATTRS: {
                    parentId: {value: null}
                }
            });

            this.parentModel = new this.ParentModel({id: 1});

            this.childList = new Y.ModelList({model: this.ChildModel});

            this.childList.add([
                {id: 1, parentId: 1},
                {id: 2, parentId: 2},
                {id: 3, parentId: 3}
            ]);

            this.config = {
                name: 'child',
                type: Y.ModelRelationship.toOne,
                model: this.parentModel,
                key: 'id',
                relatedModel: this.ChildModel,
                relatedKey: 'parentId'
            };

            this.relation = new Y.ModelRelationship(this.config);
        },

        tearDown: function () {
            Y.ModelStore.unregisterAll();
            delete this.ParentModel;
            delete this.ChildModel;
            delete this.parentModel;
            delete this.childlist;
            delete this.config;
            delete this.relation;
        },

        'Relation should be instance of Relationship': function () {
            Assert.isInstanceOf(Y.ModelRelationship, this.relation);
        },

        'Relation.model should be the parentModel': function () {
            Assert.areSame(this.parentModel, this.relation.model);
        },

        'Relation.key should be id': function () {
            Assert.areSame(this.config.key, this.relation.key);
        },

        'Relation.relatedModel should be the childModel': function () {
            Assert.areSame(this.ChildModel, this.relation.relatedModel);
        },

        'Relation.relatedKey should be parentId': function () {
            Assert.areSame(this.config.relatedKey, this.relation.relatedKey);
        },

        'Relation.type should be toOne': function () {
            Assert.areSame(Y.ModelRelationship.toOne, this.relation.type);
        },

        'Relation.related should be a Y.Model': function () {
            Assert.isInstanceOf(Y.Model, this.relation.related);
        },

        'Relation.related should be the childModel with parentId = parentModel.id': function () {
            var relation = this.relation;

            Assert.areSame(this.childList.item(0), relation.related);
        }
    }));


    // -- OneToOne: Events --------------------------------------------------------
    oneToOneSuite.add(new Y.Test.Case({
        name: 'Events',

        setUp: function () {
            this.ParentModel = Y.Base.create('parentModel', Y.Model, [], {
                initializer: function() {
                    Y.ModelStore.registerModel(this);
                }
            });

            this.ChildModel = Y.Base.create('childModel', Y.Model, [], {
                initializer: function() {
                    Y.ModelStore.registerModel(this);
                }
            }, {
                ATTRS: {
                    parentId: {value: null}
                }
            });

            this.parentModel = new this.ParentModel({id: 1});

            this.childList = new Y.ModelList({model: this.ChildModel});

            this.childList.add([
                {id: 1, parentId: 1},
                {id: 2, parentId: 2},
                {id: 3, parentId: 3}
            ]);

            this.config = {
                name: 'child',
                type: Y.ModelRelationship.toOne,
                model: this.parentModel,
                key: 'id',
                relatedModel: this.ChildModel,
                relatedKey: 'parentId'
            };

            this.relation = new Y.ModelRelationship(this.config);
        },

        tearDown: function () {
            Y.ModelStore.unregisterAll();
            delete this.ParentModel;
            delete this.ChildModel;
            delete this.parentModel;
            delete this.childlist;
            delete this.config;
            delete this.relation;
        },


        'changing the key of the parent model should refresh the relationship': function () {
            var relation = this.relation;

            this.parentModel.set('id', 2);

            Assert.areSame(this.childList.item(1), relation.related);
        },

        'changing the key on the related model should remove it from the relationship': function () {
            var relation = this.relation;

            this.childList.item(0).set('parentId', 2);

            Assert.isNull(relation.related);
        },

        'changing a key on a related model to match the relationship should add it to the relationship if the relationship doesnt currently have a match': function () {
            var relation = this.relation;

            this.childList.item(0).set('parentId', 2);

            Assert.isNull(relation.related);

            this.childList.item(1).set('parentId', 1);

            Assert.areSame(this.childList.item(1), relation.related);
        }
    }));


    suite.add(oneToManySuite);
    suite.add(oneToOneSuite);

    Y.Test.Runner.add(suite);
}, '@VERSION@', {
    requires: [
        'test',
        'model',
        'model-list',
        'gallery-model-store',
        'gallery-model-relate'
    ]
});

YUI.add('model-relate-tests', function(Y) {
    var ArrayAssert  = Y.ArrayAssert,
        Assert       = Y.Assert,
        ObjectAssert = Y.ObjectAssert,

        suite,
        relatedModelSuite;

    // -- Global Suite -------------------------------------------------------------
    suite = new Y.Test.Suite('Model Relationships');

    // -- RelatedModel Extension ----------------------------------------------------------
    relatedModelSuite = new Y.Test.Suite('RelatedModel extension');

    // -- RelatedModel Extension: Lifecycle -------------------------------------------------------
    relatedModelSuite.add(new Y.Test.Case({
        name: 'Lifecycle',

        setUp: function () {
            Y.ParentModel = Y.Base.create('parentModel', Y.Model, [Y.ModelRelate], {}, {
                ATTRS: {
                    childId: {}
                },

                RELATIONSHIPS: {
                    children: {
                        type: 'toMany',
                        key: 'id',
                        relatedModel: 'ChildModel',
                        relatedKey: 'parentId'
                    }
                }
            });

            Y.ChildModel = Y.Base.create('childModel', Y.Model, [Y.ModelRelate], {}, {
                ATTRS: {
                    parentId: {}
                },

                RELATIONSHIPS: {
                    parents: {
                        type: 'toOne',
                        key: 'parentId',
                        relatedModel: 'ParentModel',
                        relatedKey: 'id'
                    }
                }
            });

            this.parentModel = new Y.ParentModel({id: 1, childId: 1});

            this.childList = new Y.ModelList({model: Y.ChildModel});

            this.childList.add([
                {id: 1, parentId: 1},
                {id: 2, parentId: 2},
                {id: 3, parentId: 3}
            ]);
        },

        tearDown: function () {
            Y.ModelStore.unregisterAll();
            delete Y.ParentModel;
            delete Y.ChildModel;
            delete this.parentModel;
            delete this.childlist;
        },

        'test RelatedModel Methods': function () {
            var pm = this.parentModel,
                cm = this.childList.item(0);

            Assert.isFunction(pm.addRelationship);
            Assert.isFunction(pm.removeRelationship);
            Assert.isFunction(pm.getRelated);
            Assert.isFunction(cm.addRelationship);
            Assert.isFunction(cm.removeRelationship);
            Assert.isFunction(cm.getRelated);
        },

        'test RelatedModel Properties': function () {
            var pm = this.parentModel;

            Assert.areSame(pm._state.get('_rel_children', 'relationships'), 'children');
        },

        'test Destroy Model': function () {
            var pm = this.parentModel.destroy();

            Assert.isUndefined(pm._state.get('_rel_children', 'relationships'));
        },

        'test getAttrs Model': function () {
            var pm = this.parentModel,
                attrs;

            attrs = pm.getAttrs();

            Assert.isUndefined(attrs['_rel_children']);

            pm.set('outputRelationships', true);

            attrs = pm.getAttrs();

            Assert.isObject(attrs['_rel_children']);
        },

        'test toJSON Model': function () {
            var pm = this.parentModel,
                attrs;

            attrs = pm.toJSON();

            Assert.isUndefined(attrs['_rel_children']);

            pm.set('outputRelationships', true);

            attrs = pm.toJSON();

            Assert.isObject(attrs['_rel_children']);
        }

    }));


    // -- RelatedModel Extension: Relationships -------------------------------------------------------
    relatedModelSuite.add(new Y.Test.Case({
        name: 'Relationships',

        setUp: function () {
            Y.ParentModel = Y.Base.create('parentModel', Y.Model, [Y.ModelRelate], {}, {
                ATTRS: {
                    childId: {}
                },

                RELATIONSHIPS: {
                    children: {
                        type: 'toMany',
                        key: 'id',
                        relatedModel: 'ChildModel',
                        relatedKey: 'parentId'
                    }
                }
            });

            Y.ChildModel = Y.Base.create('childModel', Y.Model, [Y.ModelRelate], {}, {
                ATTRS: {
                    parentId: {}
                },

                RELATIONSHIPS: {
                    parent: {
                        type: 'toOne',
                        key: 'parentId',
                        relatedModel: 'ParentModel',
                        relatedKey: 'id'
                    }
                }
            });

            this.parentModel = new Y.ParentModel({id: 1, childId: 1});

            this.childList = new Y.ModelList({model: Y.ChildModel});

            this.childList.add([
                {id: 1, parentId: 1},
                {id: 2, parentId: 2},
                {id: 3, parentId: 3}
            ]);
        },

        tearDown: function () {
            Y.ModelStore.unregisterAll();
            delete Y.ParentModel;
            delete Y.ChildModel;
            delete this.parentModel;
            delete this.childlist;
        },

        'test toMany Relationship at init': function () {
            var children = this.parentModel.getRelated('children');

            Assert.isInstanceOf(Y.ModelList, children);
            Assert.areSame(1, children.size());
            Assert.areSame(this.childList.item(0), children.item(0));
        },

        'test toOne Relationship at init': function () {
            var parent = this.childList.item(0).getRelated('parent');

            Assert.isInstanceOf(Y.ParentModel, parent);
            Assert.areSame(this.parentModel, parent);

            Assert.isNull(this.childList.item(1).getRelated('parent'));
            Assert.isNull(this.childList.item(2).getRelated('parent'));
        },

        'test addRelationship method': function() {
            this.parentModel.addRelationship('child', {
                type: 'toOne',
                key: 'childId',
                relatedModel: 'ChildModel',
                relatedKey: 'id'
            });

            Assert.areSame(this.childList.item(0), this.parentModel.getRelated('child'));
        },

        'test removeRelationship method': function() {
            this.parentModel.removeRelationship('children');

            Assert.isUndefined(this.parentModel.getRelated('children'));
        },

        'test extending relatedModel': function() {
            var Parent2 = Y.Base.create('parent2', Y.ParentModel, [], {}, {
                RELATIONSHIPS: {
                    child: {
                        type: 'toOne',
                        key: 'childId',
                        relatedModel: 'ChildModel',
                        relatedKey: 'id'
                    }
                }
            }),

            parent2 = new Parent2({id: 2, childId: 2});

            Assert.isInstanceOf(Y.ModelRelationship, parent2.getRelationship('children'), 'parent2 should have a children relationship');
            Assert.isInstanceOf(Y.ModelList, parent2.getRelated('children'));
            Assert.isInstanceOf(Y.ModelRelationship, parent2.getRelationship('child'), 'parent2 should have a child relationship');
            Assert.areSame(this.childList.item(1), parent2.getRelated('child'));
        },

        'test adding a related model should add it to a toMany relationship': function () {
            var children = this.parentModel.getRelated('children'),
                child;

            this.childList.add({id: 4, parentId: 1});

            Assert.areSame(2, children.size());
            Assert.areSame(this.childList.item(3), children.item(1));

            child = new Y.ChildModel({id: 5, parentId: 1});

            Assert.areSame(3, children.size());
            Assert.areSame(child, children.item(2));
        },

        'test destroying a related model should not remove it from a toMany relationship': function () {
            var children = this.parentModel.getRelated('children'),
                child = this.childList.item(0);

            child.destroy();

            Assert.areSame(1, children.size());
        },

        'test deleting a related model should remove it from a toMany relationship': function () {
            var children = this.parentModel.getRelated('children'),
                child = this.childList.item(0);

            child.destroy({'delete': true});

            Assert.areSame(0, children.size());
        }
    }));

    suite.add(relatedModelSuite);

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

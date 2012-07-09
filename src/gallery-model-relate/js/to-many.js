/**
An extension for model and a set of classes that allow relationships to be
defined between models

@module ModelRelate
**/

/**
Object that represents a relationship between two models

@class ToManyRelationship
**/
var ToManyRelationship = {
    /**
    @property toMany
    @type {String}
    @private
    **/
    type: 'toMany',


    /**
    Initializes the related property of this model

    @method _initRelated
    @private
    **/
    _initRelated: function() {
        var self = this;

        self.related = new self.listType({model: self.relatedModel});

        self._handles.push(self.related.on('remove', self._onRelatedRemove, self));

        self._refreshRelationship();
    },


    /**
    @method _destroyRelated
    @private
    **/
    _destroyRelated: function() {
        this.related.destroy();
    },


    /**
    Clears out any existing related models and adds the given
    models to the relationship.  Models are not checked to see
    if they match the relationship.

    @method _setRelated
    @param {Array} models
    @private
    **/
    _setRelated: function(models) {
        var related = this.related,
            fn = related.isEmpty() ? 'add' : 'reset';

        related[fn](models);
    },


    /**
    Sets attributes on related models. Primarily called after
    a relationship key has changed on a related model from a
    create sync operation.

    @method _setRelatedAttr
    @param {String} name The name of the attribute to set
    @param {Mixed} value The value to set
    @param {Object} options Any options to pass to the attribute set method
    @private
    **/
    _setRelatedAttr: function(name, value, options) {
        this.related.each(function(m) {
            m.set(name, value, options);
        });
    },


    /**
    After a model is added to the related list, check for any models that
    match the relationship and add them to the relationship modelList

    @method _afterStoreAdd
    @param {EventFacade} e
    @private
    **/
    _afterStoreAdd: function(e) {
        var self = this,
            model = e.model;

        if (self._checkRelationship(model)) {
            Y.log('Updating ' + self.toString() + ' adding ' + model.toString(), 'info', 'model-relationship');
            self.related.add(model, e);
            self.fire('add', e);
        }
    },


    /**
    After a model is removed from the store, remove it from the
    relationship if it exists

    @method _afterStoreRemove
    @param {EventFacade} e
    @private
    **/
    _afterStoreRemove: function(e) {
        var self = this,
            model = e.model;

        if (self.related.indexOf(model) !== -1) {
            Y.log('Updating ' + self.toString() + ' removing ' + model.toString(), 'info', 'model-relationship');
            self.related.remove(model, e);
            self.fire('remove',  e);
        }
    },


    /**
    After a related key has changed on a model in the store,
    we need to determine whether or not it still belongs in
    the list of related models

    @method _afterRelatedKeyChange
    @param {EventFacade} e
    @protected
    @private
    **/
    _afterRelatedKeyChange: function(e) {
        e.model = e.target;

        if (e.src === 'create') {
            // if the key changed as the result of a create, dont
            // do anything
            return;
        } else if (this.related.indexOf(e.model) !== -1) {
            // if the changed model is already in the list
            // we need to remove it
            e.unregister = true;
            this._afterStoreRemove(e);
        } else {
            // otherwise hand off to the add handler to see
            // if the new key matches the relationship
            this._afterStoreAdd(e);
        }
    },


    /**
    If the model is not being deleted, we want to persist the destroyed state in our
    relationship, so prevent the default remove fn from executing

    @method _onRelatedRemove
    @param {EventFacade} e
    @private
    **/
    _onRelatedRemove: function(e) {
        // if we arent unregistering or deleting this model from the persistence
        // layer, dont remove it from the store (the default behavior)
        if (e.unregister || e['delete']) {
            Y.log(this.toString() + ' removing ' + e.model.toString(), 'info', 'model-relationship');
        } else {
            Y.log(this.toString() + ' not removing ' + e.model.toString(), 'info', 'model-relationship');
            e.preventDefault();
        }
    }
};

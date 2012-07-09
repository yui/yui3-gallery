/**
An extension for model and a set of classes that allow relationships to be
defined between models

@module ModelRelate
**/

/**
Object that represents a relationship between two models

@class ToOneRelationship
**/
var ToOneRelationship = {
    type: 'toOne',


    /**
    Initializes the related property of this model

    @method _initRelated
    @private
    **/
    _initRelated: function() {
        this._refreshRelationship();
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
        var self = this,
            m;

        models = Y.Array(models);

        m = models[0] || null;

        if (self.related) {
            this.fire('remove', {model: self.related});
        }

        Y.log('Updating ' + self.toString() + ' to ' + (m ? m.toString() : null), 'info', 'model-relationship');

        self.related = m;

        if (self.related) {
            this.fire('add', {model: self.related});
        }
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
        this.related && this.related.set(name, value, options);
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

        if (!self.related && self._checkRelationship(model)) {
            self._setRelated(model);
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
            m = e.model;

        if (m === self.related) {
            self._refreshRelationship();
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
        } else if (this.related === e.model) {
            // if the changed model is already in the list
            // we need to remove it
            e.unregister = true;
            this._afterStoreRemove(e);
        } else {
            // otherwise hand off to the add handler to see
            // if the new key matches the relationship
            this._afterStoreAdd(e);
        }
    }
};

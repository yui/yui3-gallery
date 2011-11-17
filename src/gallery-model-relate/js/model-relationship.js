/**
An extension for model and a set of classes that allow relationships to be
defined between models

@module ModelRelate
**/
var store = Y.ModelStore;


/**
Object that manages a relationship between two or more models

@class ModelRelationship
@constructor
@uses EventTarget
@param {Object} config Configuration object
**/
function ModelRelationshp(config) {
    var self = this;

    if (!store) {
        Y.error('Cannot create relationship. ModelStore not found.');
    }

    Y.stamp(this);

    self.name = config.name;
    self.model = config.model;
	self.key = config.key || config.model.idAttribute || 'id';
	self.relatedModel = store._getModelCtor(config.relatedModel);
	self.relatedKey = config.relatedKey || self.key;

    if (config.type === 'toMany') {
        self.listType = config.listType || Y.ModelList;
        Y.mix(self, ToManyRelationship, true);
    } else if (config.type === 'toOne') {
        Y.mix(self, ToOneRelationship, true);
    } else {
        Y.error('Cannot create relationship. ' + config.type + ' is not a valid relationship type.');
    }

    self.init();
}


/**
@property toOne
@type {String}
@static
**/
ModelRelationshp.toOne = 'toOne';


/**
@property toMany
@type {String}
@static
**/
ModelRelationshp.toMany = 'toMany';



ModelRelationshp.prototype = {
    /**
    The type of the relationship. Either toOne or toMany

    @property type
    @type String
    **/
    type: null,


    /**
    The related model(s).  A single model for a toOne relationship
    or a modelList for a toMany relationship

    @property related
    @type Mixed
    **/
    related: null,


    /**
    Initializer

    @method init
    @param {Object} config Configuration object
    **/
    init: function(config) {
        var self = this;

        Y.log('Initalizing ' + self.toString(), 'info', 'model-relationship');

        self._handles = [];
        self._storeList = store.getList(self.relatedModel);

        self._initRelated();
        self._initEvents();
    },


    /**
    Destructor

    @method destroy
    **/
    destroy: function() {
        Y.log('Destroying ' + this.toString(), 'info', 'model-relationship');

        this._detachEvents();

        this._storeList = null;

        this._destroyRelated();

        this._related = null;
    },


    /**
    {model.toString} {type} relationship {name} [guid]

    @method toString
    @protected
    **/
    toString: function() {
        var self = this;

        return self.model.toString() + ' ' + self.type + ' relationship ' + self.name + '[' + Y.stamp(this, true) + ']';
    },


    /**
    Returns true if a model matches the primary/related key relationship

    @method _checkRelationship
    @param {Model} model The model to check
    @return {Boolean} true if the model matches the relationship, false if not
    @protected
    **/
    _checkRelationship: function(model) {
        return model.get(this.relatedKey) == this.model.get(this.key);
    },


    /**
    Destroy a related list.  not the models.
    poorly named.  need to fix that.

    @method _destroyRelated
    @protected
    **/
    _destroyRelated: function() {},


    /**
    Detach events from this relationship.

    @method _detachEvents
    @private
    **/
    _detachEvents: function() {
        Y.each(this._handles, function(handle) {
            handle.detach();
        });

        this._handles = [];
    },


    /**
    Returns an array of models that match the primary/related key relationship

    @method _findRelated
    @protected
    **/
    _findRelated: function(models) {
        var self = this;

        return Y.Array.filter(self._storeList._items, self._checkRelationship, self);
    },


    /**
    Initializes any events for this relationship

    @method _initEvents
    @protected
    **/
    _initEvents: function() {
        var self = this,
            h = self._handles,
            cfg = {
                bubbles: true,
                emitFacade: true,
                prefix: 'modelRelationship',
                preventable: false
            };

        /**
        Fired when a model has been added to this relationship

        @event add
        @param {EventFacade} e Event object with a model property
        which refers to the model that was added to the relationship
        **/
        this.publish('add', cfg);

        /**
        Fired when a model has been removed from this relationship

        @event remove
        @param {EventFacade} e Event object with a model property
        which refers to the model that was removed from the relationship
        **/
        this.publish('remove', cfg);

        // if the key on the src changes
        h.push(self.model.on(self.key + 'Change', self._onKeyChange, self));

        // if the key on the src changes, we might need to refresh our relationship
        h.push(self.model.after(self.key + 'Change', self._afterKeyChange, self));

        // after the relatedKey is changed on a related model, remove it from the relationship
        h.push(self._storeList.after('*:' + self.relatedKey + 'Change', self._afterRelatedKeyChange, self));

        h.push(self._storeList.on('error', function(e) {
            Y.log(self.toString() + ' ' + e.src + ' ' + e.model.toString() + ' ' + e.error, 'error', 'model-relationship');
        }));

        // after a related model is added
        h.push(self._storeList.after('add', self._afterStoreAdd, self));

        // after a related model is removed
        h.push(self._storeList.after('remove', self._afterStoreRemove, self));
    },


    /**
    Initializes the related property of this model

    @method _initRelated
    @protected
    **/
    _initRelated: function() {},


    /**
    Clears out the related models and refreshes the related models
    from the store

    @method _refreshRelationship
    @private
    **/
    _refreshRelationship: function(e) {
        this._setRelated(this._findRelated());
    },


    /**
    Clears out any existing related models and adds the given
    models to the relationship.  Models are not checked to see
    if they match the relationship.

    @method _setRelated
    @param {Array} models
    @protected
    **/
    _setRelated: function(models) {},


    /**
    Sets attributes on related models. Primarily called after
    a relationship key has changed on a related model from a
    create sync operation.

    @method _setRelatedAttr
    @param {String} name The name of the attribute to set
    @param {Mixed} value The value to set
    @param {Object} options Any options to pass to the attribute set method
    @protected
    **/
    _setRelatedAttr: function(name, value, options) {},


    /**
    If a key has changed on this model as the result of a sync 'create',
    we need to update any related models with the new key. If the key
    change was not a result of a 'create', refresh the relationship to
    see if there are any models that match the new key

    @method _afterKeyChange
    @param {EventFacade} e
    @private
    **/
    _afterKeyChange: function(e) {
        if (e.src === 'create') {
            // if the src = create we changed the id of this model
            // in response to a save, silently update any related
            // models to the new key
            Y.log('Saved new model ' + e.target.toString() + ' ' + e.prevVal + '->' + e.newVal, 'info', 'model-relationship');
            Y.log('Updating ' + this.toString() + ' related models to ' + e.attrName + '=' + e.newVal, 'info', 'model-relationship');

            this._setRelatedAttr(e.attrName, e.newVal, {src: 'create', silent: true});
        } else {
            this._refreshRelationship();
        }
    },


    /**
    After a model is added to the related list, check for any models that
    match the relationship and add them to the relationship modelList

    @method _afterStoreAdd
    @param {EventFacade} e
    @protected
    **/
    _afterStoreAdd: function(e) {},


    /**
    After a model is removed from the store, remove it from the
    relationship if it exists

    @method _afterStoreRemove
    @param {EventFacade} e
    @protected
    **/
    _afterStoreRemove: function(e) {},


    /**
    After a related key has changed on a model in the store,
    we need to determine whether or not it still belongs in
    the list of related models

    @method _afterRelatedKeyChange
    @param {EventFacade} e
    @protected
    **/
    _afterRelatedKeyChange: function(e) {},


    /**
    Check the state of the model to determine if the key changed as a result
    of a sync 'create'.  If so set the src property of the eventFacade so we
    can propagate that this came from a 'create'.

    @method _onKeyChange
    @param {EventFacade} e
    @private
    **/
    _onKeyChange: function(e) {
        var m = e.target;

        // if this relationship is keyed off the id of model and
        // we changed the id of this model in response to a save,
        // set the src of the event facade to tell the after handler
        if (e.attrName === m.idAttribute && m.isNew()) {
            e.src = 'create';
        }
    }
};

Y.ModelRelationship = Y.augment(ModelRelationshp, Y.EventTarget);
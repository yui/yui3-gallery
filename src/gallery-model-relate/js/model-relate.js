/**
An extension for model and a set of classes that allow relationships to be
defined between models

@module ModelRelate
**/
var RELS = 'relationships',
    REL_PREFIX = '_rel_';


/**
Model extension for defining relationships between models

@class ModelRelate
@example
    Y.Base.create('parentModel', Y.Model, [Y.ModelRelate], {
        // prototype methods
    }, {
        ATTRS: {
            // model attributes
        },
        RELATIONSHIPS: {
            'children': {
                type: 'toMany',
                key: 'id'
                relatedModel: 'childModel',
                relatedKey: 'parentId'
            }
        }
    });
**/
function ModelRelate() {}


ModelRelate.ATTRS = {
    /**
    Overrides default model behavior.
    For models that dont have an explicit id set, use the
    clientId

    @attribute id
    @default clientId
    **/
    id: {
        valueFn : function() {
            return this.get('clientId');
        }
    },


    /**
    Whether relationship attributes should be included
    in the output from getAttrs

    @attribute outputRelationships
    @type {Boolean}
    **/
    outputRelationships: {
        value: false
    }
};


/**
Default set of relationships for this object.  Defined just like the
ATTRS property.  ie. an object literal of relationship configs.  See
the <a href="#method_addRelationship">addRelationship</a> method for the
list of configuration properties

@property RELATIONSHIPS
@static
@type {Object}
@example
    RELATIONSHIPS: {
        Employees: {
            type: 'toMany',
            key: 'id',
            relatedModel: 'EmployeeModel',
            relatedKey: 'companyId'
        },
        Customers: {
            type: 'toMany',
            key: 'id',
            relatedModel: 'CustomerModel',
            relatedKey: 'companyId'
        }
    }
**/


ModelRelate.prototype = {
    /**
    Whether this model is registered with the model store

    @type {Boolean}
    @property registered
    **/
    _registered: false,


    /**
    initializer lifecycle method

    @method initializer
    @protected
    **/
    initializer: function(config) {
        var self = this,
            relationships = self._aggregateRelationships();

        Y.log('Initializing model ' + self.toString(), 'info', 'model-relate');

        config = config || {};

        self._modelRelateHandles = [
            // AOP method for checking to see if we need to unregister the model if its
            // being deleted from the sync layer
            Y.Do.before(self._doBeforeDestroy, self, 'destroy', self),

            // AOP method for removing relationship attributes from getAttrs return value
            Y.Do.after(self._doAfterGetAttrs, self, 'getAttrs', self)
        ];

        // init the relationships
        Y.each(relationships, function(rels) {
            Y.each(rels, self._addRelationshipAttr, self);
        });

        // after we're done initializing, register this model
        self.after('initializedChange', function(e) {
            if (config.register !== false) {
                self.register();
            }
        });
    },


    /**
    destructor lifecycle method

    @method destructor
    @protected
    **/
    destructor: function() {
        var handles = this._modelRelateHandles;

        Y.each(handles, function(handle) {
            handle.detach();
        });

        this._modelRelateHandles = null;

        this._destroyRelationships();
    },


    /**
    Adds a relationship with the given config to this model.

    @method addRelationship
    @param {String} name A name for the relationship
    @param {Object} config Object literal of configuration properties
      @param {String} config.type The type of relationship; toOne or toMany
      @param {String} [config.key] The key on this model to use for the relationship
      @param {String|Function} config.relatedModel The related model type
      @param {String} [config.relatedKey] The key on the related model to use for
        the relationship
      @param {String|Function} [config.listType=ModelList] A custom modelList to use
        for the relationship (toMany relationships only)
    **/
    addRelationship: function(name, config) {
        this._addRelationshipAttr(config, name);

        return this;
    },


    /**
    Gets related models from a relationship

    @method getRelated
    @param {String} name The name of the relationship
    @return {Model|ModelList|null} Models related to this model.
      For toMany relationships this will always be a model-list.
      For toOne relationships, this will be a model instance or
      null if no model matches the relationship.
    **/
    getRelated: function(name) {
        var rel = this.getRelationship(name);

        return rel && rel.related;
    },


    /**
    Gets a relationship by name

    @method getRelationship
    @param {String} name The name of the relationship
    @return {ModelRelationship|null} The relationship of the given name
    **/
    getRelationship: function(name) {
        return this.get(this._relName(name));
    },


    /**
    Overrides the default model implementation.  Newness
    is determined if the models id attribute is the same
    as the clientId attribute

    @method isNew
    @return {Boolean}
    **/
    isNew: function() {
        return this.get('clientId') === this.get('id');
    },


    /**
    Is this model registered with the store

    @method isRegistered
    @return {Boolean}
    **/
    isRegistered: function() {
        return this._registered;
    },


    /**
    Registers this model with the model store
    TODO:  should we have register and unregister events?

    @method register
    @chainable
    **/
    register: function() {
        if (!store) {
            Y.log('Cannot register model. ModelStore not found.', 'warn', 'model-relate');
        } else if (this.isRegistered()) {
            Y.log('Model is already registered.', 'info', 'model-relate');
        } else {
            this._registered = (store.registerModel(this) === this);
        }

        return this;
    },


    /**
    Removes a relationship

    @method removeRelationship
    @param {String} name The name of the relationship
    @chainable
    **/
    removeRelationship: function(name) {
        var self = this,
            rel = self.getRelationship(name),
            relName = self._relName(name);

        if (rel) {
            rel.destroy();
        }

        self.removeAttr(relName);
        self._state.remove(relName, RELS);

        return self;
    },


    /**
    {name} [id:guid]

    @method toString
    @protected
    **/
    toString: function() {
        return this.name + '[' + this.get('id') + ':' + Y.stamp(this, true) + ']';
    },


    /**
    Unregisters this model from the model store
    and destroys all its relationships

    @method unregister
    @chainable
    **/
    unregister: function() {
        if (!store) {
            Y.log('Cannot unregister model. ModelStore not found.', 'warn', 'model-relate');
        } else if (!this.isRegistered()) {
            Y.log('Model not registered.', 'info', 'model-relate');
        } else {
            Y.log('Unregistering model ' + this.toString(), 'info', 'model-relate');
            this._registered = (store.unregisterModel(this) === this);
        }

        this._destroyRelationships();

        return this;
    },


    /**
    Creates an attribute on this object from a relationship config
    literal.  The resulting attribute will be readOnly and lazyLoaded

    @method _addRelationshipAttr
    @param {Object} config Object literal of configuration properties
    @param {String} name A name for the relationship
    @private
    **/
    _addRelationshipAttr: function(config, name) {
        var self = this,
            relName = self._relName(name),
            attrCfg = {};

        attrCfg.readOnly = true;

        // lazyAdd in the config object takes precedence
        attrCfg.lazyAdd = true;

        // by using a setter we can transform the attribute value
        // from a config object to a Model.Relationship instance
        // during the attribute initilization phase therefore not
        // firing any attribute change events.
        attrCfg.setter = function(cfg) {
            return new Y.ModelRelationship(cfg);
        };

        // initially the value is a configuration object literal
        // but when the attribute is initialized, the setter will
        // be executed and the value after initilization will be
        // a Model.Relationship instance.
        attrCfg.value = Y.merge(config, {name: name, model: this});

        // add the relationship as an attribute
        self.addAttr(relName, attrCfg, true);

        // addAttr returns 'this' so we have to check state[ADDED]
        // to see if the attribute added successfully or not
        if (self._state.get(relName, 'added')) {
            // attribute added successfully, add a state entry
            // for this relationship
            self._state.add(relName, RELS, name);
        }
    },


    /**
    Aggregates relationships from the class heirarchy

    @method _aggregateRelationships
    @return {Array} Array of relationship configs
    @private
    **/
    _aggregateRelationships: function() {
        var c = this.constructor,
            relationships = [];

        while (c) {
            // Add to relationships
            if (c.RELATIONSHIPS) {
                relationships[relationships.length] = c.RELATIONSHIPS;
            }

            c = c.superclass ? c.superclass.constructor : null;
        }

        return relationships;
    },


    /**
    AOP method fired after getAttrs that removes
    relationships from the list of attributes returned

    @method _doAfterGetAttrs
    @protected
    **/
    _doAfterGetAttrs: function() {
        var state = this._state,
            retVal = Y.Do.currentRetVal;

        if (!this.get('outputRelationships')) {
            Y.each(retVal, function(val, key, o) {
                if (state.get(key, RELS)) {
                    delete o[key];
                }
            });
        }

        delete retVal.outputRelationships;

        return new Y.Do.AlterReturn('removed relationship meta from getAttrs return', retVal);
    },


    /**
    AOP method fired before destroy that configures relationships
    to be destroyed if the model is being deleted

    @method _doBeforeDestroy
    @protected
    **/
    _doBeforeDestroy: function(options, callback) {
        var newCb;

        Y.log('Destroying ' + this.toString(), 'info', 'model-relate');

        // Allow callback as only arg.
        if (typeof options === 'function') {
            callback = options;
            options  = {};
        }

        if (options && (options.unregister || options['delete'])) {
            this.deleted = true;

            // we are unregistering or deleting this model permanently.
            // need to build a callback function to do the cleanup
            newCb = Y.bind(function(err) {
                if (err) {
                    this.deleted = false;
                } else {
                    // we deleted this model, destroy all its relationships
                    this._destroyRelationships();
                }

                // call the original callback
                callback && callback.apply(null, arguments);
            }, this);

            // alter the arguments to the original destroy method to pass our new callback
            Y.log(this.toString() + ' deleted, modifying callback to destroy model relationships', 'info', 'model-relate');
            return new Y.Do.AlterArgs(this.toString() + ' deleted, modifying callback to destroy model relationships', [options, newCb]);
        }
    },


    /**
    Destroys all relationships on this model

    @method _destroyRelationships
    @private
    **/
    _destroyRelationships: function() {
        var state = this._state.data;
        
        // check each object in the state data for a 
        // relationship property.  if it has one, remove
        // that relationship
        Y.each(state, function(o, n) {
            var relName = o[RELS];
            
            if (relName) {
                this.removeRelationship(relName);
            }

        }, this);
    },


    /**
    Returns the internal relationship name

    @method _relName
    @param {String} name The user provided relationship name
    @return {String} The internal relationship name
    @private
    **/
    _relName: function(name) {
        return REL_PREFIX + name;
    }
};

Y.ModelRelate = ModelRelate;

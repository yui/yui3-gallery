if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["/build/gallery-model-sync-local/gallery-model-sync-local.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-model-sync-local/gallery-model-sync-local.js",
    code: []
};
_yuitest_coverage["/build/gallery-model-sync-local/gallery-model-sync-local.js"].code=["YUI.add('gallery-model-sync-local', function(Y) {","","/**","An extension which provides a sync implementation through locally stored","key value pairs, either through the HTML localStorage API or falling back","onto an in-memory cache, that can be mixed into a Model or ModelList subclass.","","@module gallery-model-sync-local","**/","","/**","An extension which provides a sync implementation through locally stored","key value pairs, either through the HTML localStorage API or falling back","onto an in-memory cache, that can be mixed into a Model or ModelList subclass.","","A group of Models/ModelLists is serialized in localStorage by either its ","class name, or a specified 'root' that is provided. ","","    var User = Y.Base.create('user', Y.Model, [Y.ModelSync.REST], {","        root: 'user'","    });","","    var Users = Y.Base.create('users', Y.ModelList, [Y.ModelSync.REST], {","        model: User,","        root  : 'user'","    });","","@class ModelSync.Local","@extensionfor Model","@extensionfor ModelList","**/","function LocalSync() {}","","/**","Properties that shouldn't be turned into ad-hoc attributes when passed to a","Model or ModelList constructor.","","@property _NON_ATTRS_CFG","@type Array","@default ['root', 'url']","@static","@protected","**/","LocalSync._NON_ATTRS_CFG = ['root'];","","/**","Object of key/value pairs to fall back on when localStorage is not available.","","@property _data","@type Object","@private","**/","LocalSync._data = {};","","LocalSync.prototype = {","","    // -- Public Methods -------------------------------------------------------","    ","    /**","    Root used as the key inside of localStorage and/or the in-memory store.","    ","    @property root","    @type String","    @default \"\"","    **/","    root: '',","","    /**","    Shortcut for access to localStorage.","    ","    @property storage","    @type Storage","    @default null","    **/","    storage: null,","","    // -- Lifecycle Methods -----------------------------------------------------","    initializer: function (config) {","        var store;","","        config || (config = {});","","        if ('root' in config) {","            this.root = config.root || '';","        }","","        try {","            this.storage = Y.config.win.localStorage;","            store = this.storage.getItem(this.root);","        } catch (e) {","        }","        ","        // Pull in existing data from localStorage, if possible","        LocalSync._data[this.root] = (store && Y.JSON.parse(store)) || {};","    },","","    /**","    Generate a random GUID for our Models. This can be overriden if you have","    another method of generating different IDs.","    ","    @method generateID","    @param {String} pre Optional GUID prefix","    **/","    generateID: function (pre) {","        return Y.guid(pre + '_');","    },","    ","    // -- Public Methods -----------------------------------------------------------","    ","    /**","    Creates a synchronization layer with the localStorage API, if available.","    Otherwise, falls back to a in-memory data store.","","    This method is called internally by load(), save(), and destroy().","","    @method sync","    @param {String} action Sync action to perform. May be one of the following:","","      * **create**: Store a newly-created model for the first time.","      * **read**  : Load an existing model.","      * **update**: Update an existing model.","      * **delete**: Delete an existing model.","","    @param {Object} [options] Sync options","    @param {callback} [callback] Called when the sync operation finishes.","      @param {Error|null} callback.err If an error occurred, this parameter will","        contain the error. If the sync operation succeeded, _err_ will be","        falsy.","      @param {Any} [callback.response] The response from our sync. This value will","        be passed to the parse() method, which is expected to parse it and","        return an attribute hash.","    **/","    sync: function (action, options, callback) {","        options || (options = {});","        var response;","","        switch (action) {","            case 'read':","                if (this._isYUIModelList) {","                    response = this._index(options);","                } else {","                    response = this._show(options);","                }","                break;","            case 'create':","                response = this._create(options);","                break;","            case 'update':","                response = this._update(options);","                break;","            case 'delete':","                response = this._destroy(options);","                break;","        }","","        if (response) {","            callback(null, response);","        } else {","            callback('Data not found');","        }","    },","","    // -- Protected Methods ----------------------------------------------------","    ","    /**","    Sync method correlating to the \"read\" operation, for a Model List","    ","    @method _index","    @return {Object[]} Array of objects found for that root key","    @protected","    **/    ","    _index: function (options) {","        return Y.Object.values(LocalSync._data[this.root]);","    },","","    /**","    Sync method correlating to the \"read\" operation, for a Model","    ","    @method _show","    @return {Object} Object found for that root key and model ID","    @protected","    **/ ","    _show: function (options) {","        return LocalSync._data[this.root][this.get('id')];","    },","    ","    /**","    Sync method correlating to the \"create\" operation","    ","    @method _show","    @return {Object} The new object created.","    @protected","    **/ ","    _create: function (options) {","        var hash = this.toJSON();","        hash.id = this.generateID(this.root);","        LocalSync._data[this.root][hash.id] = hash;","","        this._save();","        return hash;","    },","","    /**","    Sync method correlating to the \"update\" operation","    ","    @method _update","    @return {Object} The updated object.","    @protected","    **/ ","    _update: function (options) {","        var hash = Y.merge(this.toJSON(), options);","        LocalSync._data[this.root][this.get('id')] = hash;","        ","        this._save();","        return hash;","    },","","    /**","    Sync method correlating to the \"delete\" operation","    ","    @method _destroy","    @return {Object} The deleted object.","    @protected","    **/ ","    _destroy: function (options) {","        delete LocalSync._data[this.root][this.get('id')];","        this._save();","        return this.toJSON();","    },","    ","    /**","    Saves the current in-memory store into a localStorage key/value pair","    ","    @method _save","    @protected","    **/ ","    _save: function () {","        this.storage && this.storage.setItem(","            this.root,","            Y.JSON.stringify(LocalSync._data[this.root])","        );","    }","};","","// -- Namespace ---------------------------------------------------------------","","Y.namespace('ModelSync').Local = LocalSync;","","","}, 'gallery-2012.08.29-20-10' ,{requires:['model', 'model-list', 'io-base', 'json-stringify'], skinnable:false});"];
_yuitest_coverage["/build/gallery-model-sync-local/gallery-model-sync-local.js"].lines = {"1":0,"32":0,"44":0,"53":0,"55":0,"79":0,"81":0,"83":0,"84":0,"87":0,"88":0,"89":0,"94":0,"105":0,"134":0,"135":0,"137":0,"139":0,"140":0,"142":0,"144":0,"146":0,"147":0,"149":0,"150":0,"152":0,"153":0,"156":0,"157":0,"159":0,"173":0,"184":0,"195":0,"196":0,"197":0,"199":0,"200":0,"211":0,"212":0,"214":0,"215":0,"226":0,"227":0,"228":0,"238":0,"247":0};
_yuitest_coverage["/build/gallery-model-sync-local/gallery-model-sync-local.js"].functions = {"LocalSync:32":0,"initializer:78":0,"generateID:104":0,"sync:133":0,"_index:172":0,"_show:183":0,"_create:194":0,"_update:210":0,"_destroy:225":0,"_save:237":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-model-sync-local/gallery-model-sync-local.js"].coveredLines = 46;
_yuitest_coverage["/build/gallery-model-sync-local/gallery-model-sync-local.js"].coveredFunctions = 11;
_yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 1);
YUI.add('gallery-model-sync-local', function(Y) {

/**
An extension which provides a sync implementation through locally stored
key value pairs, either through the HTML localStorage API or falling back
onto an in-memory cache, that can be mixed into a Model or ModelList subclass.

@module gallery-model-sync-local
**/

/**
An extension which provides a sync implementation through locally stored
key value pairs, either through the HTML localStorage API or falling back
onto an in-memory cache, that can be mixed into a Model or ModelList subclass.

A group of Models/ModelLists is serialized in localStorage by either its 
class name, or a specified 'root' that is provided. 

    var User = Y.Base.create('user', Y.Model, [Y.ModelSync.REST], {
        root: 'user'
    });

    var Users = Y.Base.create('users', Y.ModelList, [Y.ModelSync.REST], {
        model: User,
        root  : 'user'
    });

@class ModelSync.Local
@extensionfor Model
@extensionfor ModelList
**/
_yuitest_coverfunc("/build/gallery-model-sync-local/gallery-model-sync-local.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 32);
function LocalSync() {}

/**
Properties that shouldn't be turned into ad-hoc attributes when passed to a
Model or ModelList constructor.

@property _NON_ATTRS_CFG
@type Array
@default ['root', 'url']
@static
@protected
**/
_yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 44);
LocalSync._NON_ATTRS_CFG = ['root'];

/**
Object of key/value pairs to fall back on when localStorage is not available.

@property _data
@type Object
@private
**/
_yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 53);
LocalSync._data = {};

_yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 55);
LocalSync.prototype = {

    // -- Public Methods -------------------------------------------------------
    
    /**
    Root used as the key inside of localStorage and/or the in-memory store.
    
    @property root
    @type String
    @default ""
    **/
    root: '',

    /**
    Shortcut for access to localStorage.
    
    @property storage
    @type Storage
    @default null
    **/
    storage: null,

    // -- Lifecycle Methods -----------------------------------------------------
    initializer: function (config) {
        _yuitest_coverfunc("/build/gallery-model-sync-local/gallery-model-sync-local.js", "initializer", 78);
_yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 79);
var store;

        _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 81);
config || (config = {});

        _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 83);
if ('root' in config) {
            _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 84);
this.root = config.root || '';
        }

        _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 87);
try {
            _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 88);
this.storage = Y.config.win.localStorage;
            _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 89);
store = this.storage.getItem(this.root);
        } catch (e) {
        }
        
        // Pull in existing data from localStorage, if possible
        _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 94);
LocalSync._data[this.root] = (store && Y.JSON.parse(store)) || {};
    },

    /**
    Generate a random GUID for our Models. This can be overriden if you have
    another method of generating different IDs.
    
    @method generateID
    @param {String} pre Optional GUID prefix
    **/
    generateID: function (pre) {
        _yuitest_coverfunc("/build/gallery-model-sync-local/gallery-model-sync-local.js", "generateID", 104);
_yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 105);
return Y.guid(pre + '_');
    },
    
    // -- Public Methods -----------------------------------------------------------
    
    /**
    Creates a synchronization layer with the localStorage API, if available.
    Otherwise, falls back to a in-memory data store.

    This method is called internally by load(), save(), and destroy().

    @method sync
    @param {String} action Sync action to perform. May be one of the following:

      * **create**: Store a newly-created model for the first time.
      * **read**  : Load an existing model.
      * **update**: Update an existing model.
      * **delete**: Delete an existing model.

    @param {Object} [options] Sync options
    @param {callback} [callback] Called when the sync operation finishes.
      @param {Error|null} callback.err If an error occurred, this parameter will
        contain the error. If the sync operation succeeded, _err_ will be
        falsy.
      @param {Any} [callback.response] The response from our sync. This value will
        be passed to the parse() method, which is expected to parse it and
        return an attribute hash.
    **/
    sync: function (action, options, callback) {
        _yuitest_coverfunc("/build/gallery-model-sync-local/gallery-model-sync-local.js", "sync", 133);
_yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 134);
options || (options = {});
        _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 135);
var response;

        _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 137);
switch (action) {
            case 'read':
                _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 139);
if (this._isYUIModelList) {
                    _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 140);
response = this._index(options);
                } else {
                    _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 142);
response = this._show(options);
                }
                _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 144);
break;
            case 'create':
                _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 146);
response = this._create(options);
                _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 147);
break;
            case 'update':
                _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 149);
response = this._update(options);
                _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 150);
break;
            case 'delete':
                _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 152);
response = this._destroy(options);
                _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 153);
break;
        }

        _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 156);
if (response) {
            _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 157);
callback(null, response);
        } else {
            _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 159);
callback('Data not found');
        }
    },

    // -- Protected Methods ----------------------------------------------------
    
    /**
    Sync method correlating to the "read" operation, for a Model List
    
    @method _index
    @return {Object[]} Array of objects found for that root key
    @protected
    **/    
    _index: function (options) {
        _yuitest_coverfunc("/build/gallery-model-sync-local/gallery-model-sync-local.js", "_index", 172);
_yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 173);
return Y.Object.values(LocalSync._data[this.root]);
    },

    /**
    Sync method correlating to the "read" operation, for a Model
    
    @method _show
    @return {Object} Object found for that root key and model ID
    @protected
    **/ 
    _show: function (options) {
        _yuitest_coverfunc("/build/gallery-model-sync-local/gallery-model-sync-local.js", "_show", 183);
_yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 184);
return LocalSync._data[this.root][this.get('id')];
    },
    
    /**
    Sync method correlating to the "create" operation
    
    @method _show
    @return {Object} The new object created.
    @protected
    **/ 
    _create: function (options) {
        _yuitest_coverfunc("/build/gallery-model-sync-local/gallery-model-sync-local.js", "_create", 194);
_yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 195);
var hash = this.toJSON();
        _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 196);
hash.id = this.generateID(this.root);
        _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 197);
LocalSync._data[this.root][hash.id] = hash;

        _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 199);
this._save();
        _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 200);
return hash;
    },

    /**
    Sync method correlating to the "update" operation
    
    @method _update
    @return {Object} The updated object.
    @protected
    **/ 
    _update: function (options) {
        _yuitest_coverfunc("/build/gallery-model-sync-local/gallery-model-sync-local.js", "_update", 210);
_yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 211);
var hash = Y.merge(this.toJSON(), options);
        _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 212);
LocalSync._data[this.root][this.get('id')] = hash;
        
        _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 214);
this._save();
        _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 215);
return hash;
    },

    /**
    Sync method correlating to the "delete" operation
    
    @method _destroy
    @return {Object} The deleted object.
    @protected
    **/ 
    _destroy: function (options) {
        _yuitest_coverfunc("/build/gallery-model-sync-local/gallery-model-sync-local.js", "_destroy", 225);
_yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 226);
delete LocalSync._data[this.root][this.get('id')];
        _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 227);
this._save();
        _yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 228);
return this.toJSON();
    },
    
    /**
    Saves the current in-memory store into a localStorage key/value pair
    
    @method _save
    @protected
    **/ 
    _save: function () {
        _yuitest_coverfunc("/build/gallery-model-sync-local/gallery-model-sync-local.js", "_save", 237);
_yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 238);
this.storage && this.storage.setItem(
            this.root,
            Y.JSON.stringify(LocalSync._data[this.root])
        );
    }
};

// -- Namespace ---------------------------------------------------------------

_yuitest_coverline("/build/gallery-model-sync-local/gallery-model-sync-local.js", 247);
Y.namespace('ModelSync').Local = LocalSync;


}, 'gallery-2012.08.29-20-10' ,{requires:['model', 'model-list', 'io-base', 'json-stringify'], skinnable:false});

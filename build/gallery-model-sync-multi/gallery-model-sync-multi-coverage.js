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
_yuitest_coverage["/build/gallery-model-sync-multi/gallery-model-sync-multi.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-model-sync-multi/gallery-model-sync-multi.js",
    code: []
};
_yuitest_coverage["/build/gallery-model-sync-multi/gallery-model-sync-multi.js"].code=["YUI.add('gallery-model-sync-multi', function(Y) {","","/**"," * Allows multiple model sync implementations to be used by a single model."," * @module gallery-model-sync-multi"," */","(function (Y) {","    'use strict';","","    /**","     * This is a class extension for Y.Module allowing multiple model sync","     * implementations to be used by a single model.  When a class is created","     * extending Y.Model, this class extension must come after all other class","     * extensions which implement sync.  Model classes using this extension","     * should have a static SYNCS property.  The SYNCS property will be an","     * object of key/value pairs.  There should be a value for each other sync","     * implementation extension.  The keys can be any name you want to give that","     * implementation.  When calling the sync methods such as load or save, the","     * options argument object should be given a sync property which matches the","     * name of one of the SYNCS to use.","     * @class Multi","     * @constructor","     * @namespace ModelSync","     */","    var _class = function () {};","    ","    _class.prototype = {","        /**","         * This sync method passes to one of the other sync methods based on the","         * value of options.sync.  If there is no matching sync method, this","         * does nothing.","         * @method sync","         * @param action","         * @param options","         * @param callbackFunction","         * @protected","         */","        sync: function (action, options) {","            options = options || {};","            ","            var Sync = this.constructor.SYNCS[options.sync];","            ","            return Sync && Sync.prototype.sync.apply(this, arguments);","        }","    };","    ","    Y.namespace('ModelSync').Multi = _class;","}(Y));","","","}, 'gallery-2012.10.10-19-59' ,{requires:['yui-base'], skinnable:false});"];
_yuitest_coverage["/build/gallery-model-sync-multi/gallery-model-sync-multi.js"].lines = {"1":0,"7":0,"8":0,"25":0,"27":0,"39":0,"41":0,"43":0,"47":0};
_yuitest_coverage["/build/gallery-model-sync-multi/gallery-model-sync-multi.js"].functions = {"sync:38":0,"(anonymous 2):7":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-model-sync-multi/gallery-model-sync-multi.js"].coveredLines = 9;
_yuitest_coverage["/build/gallery-model-sync-multi/gallery-model-sync-multi.js"].coveredFunctions = 3;
_yuitest_coverline("/build/gallery-model-sync-multi/gallery-model-sync-multi.js", 1);
YUI.add('gallery-model-sync-multi', function(Y) {

/**
 * Allows multiple model sync implementations to be used by a single model.
 * @module gallery-model-sync-multi
 */
_yuitest_coverfunc("/build/gallery-model-sync-multi/gallery-model-sync-multi.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-model-sync-multi/gallery-model-sync-multi.js", 7);
(function (Y) {
    _yuitest_coverfunc("/build/gallery-model-sync-multi/gallery-model-sync-multi.js", "(anonymous 2)", 7);
_yuitest_coverline("/build/gallery-model-sync-multi/gallery-model-sync-multi.js", 8);
'use strict';

    /**
     * This is a class extension for Y.Module allowing multiple model sync
     * implementations to be used by a single model.  When a class is created
     * extending Y.Model, this class extension must come after all other class
     * extensions which implement sync.  Model classes using this extension
     * should have a static SYNCS property.  The SYNCS property will be an
     * object of key/value pairs.  There should be a value for each other sync
     * implementation extension.  The keys can be any name you want to give that
     * implementation.  When calling the sync methods such as load or save, the
     * options argument object should be given a sync property which matches the
     * name of one of the SYNCS to use.
     * @class Multi
     * @constructor
     * @namespace ModelSync
     */
    _yuitest_coverline("/build/gallery-model-sync-multi/gallery-model-sync-multi.js", 25);
var _class = function () {};
    
    _yuitest_coverline("/build/gallery-model-sync-multi/gallery-model-sync-multi.js", 27);
_class.prototype = {
        /**
         * This sync method passes to one of the other sync methods based on the
         * value of options.sync.  If there is no matching sync method, this
         * does nothing.
         * @method sync
         * @param action
         * @param options
         * @param callbackFunction
         * @protected
         */
        sync: function (action, options) {
            _yuitest_coverfunc("/build/gallery-model-sync-multi/gallery-model-sync-multi.js", "sync", 38);
_yuitest_coverline("/build/gallery-model-sync-multi/gallery-model-sync-multi.js", 39);
options = options || {};
            
            _yuitest_coverline("/build/gallery-model-sync-multi/gallery-model-sync-multi.js", 41);
var Sync = this.constructor.SYNCS[options.sync];
            
            _yuitest_coverline("/build/gallery-model-sync-multi/gallery-model-sync-multi.js", 43);
return Sync && Sync.prototype.sync.apply(this, arguments);
        }
    };
    
    _yuitest_coverline("/build/gallery-model-sync-multi/gallery-model-sync-multi.js", 47);
Y.namespace('ModelSync').Multi = _class;
}(Y));


}, 'gallery-2012.10.10-19-59' ,{requires:['yui-base'], skinnable:false});

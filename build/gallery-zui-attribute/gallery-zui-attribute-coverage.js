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
_yuitest_coverage["/build/gallery-zui-attribute/gallery-zui-attribute.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-zui-attribute/gallery-zui-attribute.js",
    code: []
};
_yuitest_coverage["/build/gallery-zui-attribute/gallery-zui-attribute.js"].code=["YUI.add('gallery-zui-attribute', function(Y) {","","/**"," * The Attribute module provides more methods for Attribute object"," * support for older browsers"," *"," * @module gallery-zui-attribute"," */","","/**"," * A augmentable implementation for Attribute, providing extended"," * methods for Attribute management such as toggle() and set_again()   "," *"," * @class ZAttribute","*/","function ZAttribute() {}","","ZAttribute.prototype = {","    /**","     * toggle the value of an attribute.","     *","     * @method toggle","     * @param name {String} The name of the attribute.","     * @chainable","     */","    toggle: function (name) {","        if (this.set && this.get) {","            this.set(name, this.get(name) ? false : true);","        }","","        return this;","    },","","    /**","     * set the value of an attribute to current value, to trigger setter function or valueChange event.","     *","     * @method set_again","     * @param name {String} The name of the attribute.","     * @chainable","     */","    set_again: function (name) {","        if (this.set && this.get) {","            this.set(name, this.get(name));","        }","        return this;","    },","","    /**","     * set the value of an attribute, this wrapped function help to maintain a value change stack for revert().","     *","     * @method set","     * @param name {String} The name of the attribute.","     * @param value {String} The value of the attribute.","     * @param cfg {Object} Optional event data to be mixed into the event facade passed to subscribers of the attribute's change event.","     * @chainable","     */","    set: function (name, value, cfg) {","       /**","         * When the obejct have _doRevert property , enable the revert() behavior on all properties","         *","         * @property _doRevert","         * @type Boolean","         * @protected","         */  ","        var doRevert = this._doRevert;","","       /**","         * When the obejct have _revertList property , enable the revert() behavior on listed properties","         *","         * @property _revertList","         * @type Object","         * @protected","         */","        if (!doRevert && this._revertList) {","            doRevert = this._revertList[name];","        }","","        if (doRevert) {","           /**","             * Used to keep data stack for revert()","             *","             * @property _revertStack","             * @type Object","             * @protected","             */","            if (!this._revertStack) {","                this._revertStack = {};","            }","            if (!this._revertStack[name]) {","                this._revertStack[name] = [];","            }","            this._revertStack[name].push(value);","        }","","        return this._setAttr(name, value, cfg);","    },","","    /**","     * revert the value of an attribute. If no older value, do nothing.","     *","     * @method revert","     * @param name {String} The name of the attribute.","     * @chainable","     */","    revert: function (name, value) {","        if (!this._revertStack || !this._revertStack[name] || (this._revertStack[name].length < 2)) {","            return this;","        }","","        this._revertStack[name].pop();","","        return this._setAttr(name, this._revertStack[name][this._revertStack[name].length - 1]);","    },","","    /**","     * sync an attribute from other Object when the attribute value of other object changed, everytime.","     *","     * @method sync","     * @param name {String} The name of the attribute.","     * @param source {Attribute} The source Attribute owner Object you want to sync.","     * @param sourceName {String} The source Attribute name. If the source attribute name is same with target, you can omit this parameter.","     * @chainable","     */","    sync: function (name, source, fname) {","        var id = Y.stamp(this),","            sid = Y.stamp(source),","            from = fname || name;","","        if (!this.syncHandlers) {","            this.syncHandlers = {};","        }","","        this.syncHandlers[[name, id, sid, from].join('_')] = source.after(from + 'Change', function (E) {","            this.set(name, E.newVal);","        }, this);","","        this.set(name, source.get(from));","","        return this;","    },","","    /**","     * Stop attribute syncing","     *","     * @method unsync","     * @param name {String} The name of the attribute.","     * @param source {Attribute} The source Attribute owner Object you want to sync.","     * @param sourceName {String} The source Attribute name. If the source attribute name is same with target, you can o","mit this parameter.","     * @chainable","     */","    unsync: function (name, source, fname) {","        var id = Y.stamp(this),","            sid = Y.stamp(source),","            from = fname || name,","            hid = [name, id, sid, from].join('_');","","        if (!this.syncHandlers) {","            this.syncHandlers = {};","        }","","        if (this.syncHandlers[hid]) {","            this.syncHandlers[hid].detach();","            delete this.syncHandlers[hid];","        }","","        return this;","    }","};","","Y.namespace('zui').Attribute = ZAttribute;","","","}, 'gallery-2012.08.29-20-10' ,{requires:['attribute-base'], skinnable:false});"];
_yuitest_coverage["/build/gallery-zui-attribute/gallery-zui-attribute.js"].lines = {"1":0,"16":0,"18":0,"27":0,"28":0,"31":0,"42":0,"43":0,"45":0,"65":0,"74":0,"75":0,"78":0,"86":0,"87":0,"89":0,"90":0,"92":0,"95":0,"106":0,"107":0,"110":0,"112":0,"125":0,"129":0,"130":0,"133":0,"134":0,"137":0,"139":0,"153":0,"158":0,"159":0,"162":0,"163":0,"164":0,"167":0,"171":0};
_yuitest_coverage["/build/gallery-zui-attribute/gallery-zui-attribute.js"].functions = {"ZAttribute:16":0,"toggle:26":0,"set_again:41":0,"set:57":0,"revert:105":0,"(anonymous 2):133":0,"sync:124":0,"unsync:152":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-zui-attribute/gallery-zui-attribute.js"].coveredLines = 38;
_yuitest_coverage["/build/gallery-zui-attribute/gallery-zui-attribute.js"].coveredFunctions = 9;
_yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 1);
YUI.add('gallery-zui-attribute', function(Y) {

/**
 * The Attribute module provides more methods for Attribute object
 * support for older browsers
 *
 * @module gallery-zui-attribute
 */

/**
 * A augmentable implementation for Attribute, providing extended
 * methods for Attribute management such as toggle() and set_again()   
 *
 * @class ZAttribute
*/
_yuitest_coverfunc("/build/gallery-zui-attribute/gallery-zui-attribute.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 16);
function ZAttribute() {}

_yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 18);
ZAttribute.prototype = {
    /**
     * toggle the value of an attribute.
     *
     * @method toggle
     * @param name {String} The name of the attribute.
     * @chainable
     */
    toggle: function (name) {
        _yuitest_coverfunc("/build/gallery-zui-attribute/gallery-zui-attribute.js", "toggle", 26);
_yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 27);
if (this.set && this.get) {
            _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 28);
this.set(name, this.get(name) ? false : true);
        }

        _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 31);
return this;
    },

    /**
     * set the value of an attribute to current value, to trigger setter function or valueChange event.
     *
     * @method set_again
     * @param name {String} The name of the attribute.
     * @chainable
     */
    set_again: function (name) {
        _yuitest_coverfunc("/build/gallery-zui-attribute/gallery-zui-attribute.js", "set_again", 41);
_yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 42);
if (this.set && this.get) {
            _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 43);
this.set(name, this.get(name));
        }
        _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 45);
return this;
    },

    /**
     * set the value of an attribute, this wrapped function help to maintain a value change stack for revert().
     *
     * @method set
     * @param name {String} The name of the attribute.
     * @param value {String} The value of the attribute.
     * @param cfg {Object} Optional event data to be mixed into the event facade passed to subscribers of the attribute's change event.
     * @chainable
     */
    set: function (name, value, cfg) {
       /**
         * When the obejct have _doRevert property , enable the revert() behavior on all properties
         *
         * @property _doRevert
         * @type Boolean
         * @protected
         */  
        _yuitest_coverfunc("/build/gallery-zui-attribute/gallery-zui-attribute.js", "set", 57);
_yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 65);
var doRevert = this._doRevert;

       /**
         * When the obejct have _revertList property , enable the revert() behavior on listed properties
         *
         * @property _revertList
         * @type Object
         * @protected
         */
        _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 74);
if (!doRevert && this._revertList) {
            _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 75);
doRevert = this._revertList[name];
        }

        _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 78);
if (doRevert) {
           /**
             * Used to keep data stack for revert()
             *
             * @property _revertStack
             * @type Object
             * @protected
             */
            _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 86);
if (!this._revertStack) {
                _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 87);
this._revertStack = {};
            }
            _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 89);
if (!this._revertStack[name]) {
                _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 90);
this._revertStack[name] = [];
            }
            _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 92);
this._revertStack[name].push(value);
        }

        _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 95);
return this._setAttr(name, value, cfg);
    },

    /**
     * revert the value of an attribute. If no older value, do nothing.
     *
     * @method revert
     * @param name {String} The name of the attribute.
     * @chainable
     */
    revert: function (name, value) {
        _yuitest_coverfunc("/build/gallery-zui-attribute/gallery-zui-attribute.js", "revert", 105);
_yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 106);
if (!this._revertStack || !this._revertStack[name] || (this._revertStack[name].length < 2)) {
            _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 107);
return this;
        }

        _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 110);
this._revertStack[name].pop();

        _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 112);
return this._setAttr(name, this._revertStack[name][this._revertStack[name].length - 1]);
    },

    /**
     * sync an attribute from other Object when the attribute value of other object changed, everytime.
     *
     * @method sync
     * @param name {String} The name of the attribute.
     * @param source {Attribute} The source Attribute owner Object you want to sync.
     * @param sourceName {String} The source Attribute name. If the source attribute name is same with target, you can omit this parameter.
     * @chainable
     */
    sync: function (name, source, fname) {
        _yuitest_coverfunc("/build/gallery-zui-attribute/gallery-zui-attribute.js", "sync", 124);
_yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 125);
var id = Y.stamp(this),
            sid = Y.stamp(source),
            from = fname || name;

        _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 129);
if (!this.syncHandlers) {
            _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 130);
this.syncHandlers = {};
        }

        _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 133);
this.syncHandlers[[name, id, sid, from].join('_')] = source.after(from + 'Change', function (E) {
            _yuitest_coverfunc("/build/gallery-zui-attribute/gallery-zui-attribute.js", "(anonymous 2)", 133);
_yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 134);
this.set(name, E.newVal);
        }, this);

        _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 137);
this.set(name, source.get(from));

        _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 139);
return this;
    },

    /**
     * Stop attribute syncing
     *
     * @method unsync
     * @param name {String} The name of the attribute.
     * @param source {Attribute} The source Attribute owner Object you want to sync.
     * @param sourceName {String} The source Attribute name. If the source attribute name is same with target, you can o
mit this parameter.
     * @chainable
     */
    unsync: function (name, source, fname) {
        _yuitest_coverfunc("/build/gallery-zui-attribute/gallery-zui-attribute.js", "unsync", 152);
_yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 153);
var id = Y.stamp(this),
            sid = Y.stamp(source),
            from = fname || name,
            hid = [name, id, sid, from].join('_');

        _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 158);
if (!this.syncHandlers) {
            _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 159);
this.syncHandlers = {};
        }

        _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 162);
if (this.syncHandlers[hid]) {
            _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 163);
this.syncHandlers[hid].detach();
            _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 164);
delete this.syncHandlers[hid];
        }

        _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 167);
return this;
    }
};

_yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 171);
Y.namespace('zui').Attribute = ZAttribute;


}, 'gallery-2012.08.29-20-10' ,{requires:['attribute-base'], skinnable:false});

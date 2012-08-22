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
_yuitest_coverage["/build/gallery-zui-attribute/gallery-zui-attribute.js"].code=["YUI.add('gallery-zui-attribute', function(Y) {","","/**"," * The Attribute module provides more methods for Attribute object"," * support for older browsers"," *"," * @module gallery-zui-attribute"," */","","/**"," * A augmentable implementation for Attribute, providing extended"," * methods for Attribute management such as toggle() and set_again()   "," *"," * @class ZAttribute","*/","function ZAttribute() {}","","ZAttribute.prototype = {","    /**","     * toggle the value of an attribute.","     *","     * @method toggle","     * @param name {String} The name of the attribute.","     * @chainable","     */","    toggle: function (name) {","        if (this.set && this.get) {","            this.set(name, this.get(name) ? false : true);","        }","","        return this;","    },","","    /**","     * set the value of an attribute to current value, to trigger setter function or valueChange event.","     *","     * @method set_again","     * @param name {String} The name of the attribute.","     * @chainable","     */","    set_again: function (name) {","        if (this.set && this.get) {","            this.set(name, this.get(name));","        }","        return this;","    },","","    /**","     * set the value of an attribute, this wrapped function help to maintain a value change stack for revert().","     *","     * @method set","     * @param name {String} The name of the attribute.","     * @param value {String} The value of the attribute.","     * @chainable","     */","    set: function (name, value) {","        if (!this.revertStack) {","            this.revertStack = {};","        }","        if (!this.revertStack[name]) {","            this.revertStack[name] = [];","        }","        this.revertStack[name].push(value);","        return this._setAttr(name, value);","    },","","    /**","     * revert the value of an attribute. If no older value, do nothing.","     *","     * @method revert","     * @param name {String} The name of the attribute.","     * @chainable","     */","    revert: function (name, value) {","        if (!this.revertStack[name] || (this.revertStack[name].length < 2)) {","            return this;","        }","","        this.revertStack[name].pop();","","        return this._setAttr(name, this.revertStack[name][this.revertStack[name].length - 1]);","    },","","    /**","     * sync an attribute from other Object when the attribute value of other object changed, everytime.","     *","     * @method sync","     * @param name {String} The name of the attribute.","     * @param source {Attribute} The source Attribute owner Object you want to sync.","     * @param sourceName {String} The source Attribute name. If the source attribute name is same with target, you can omit this parameter.","     * @chainable","     */","    sync: function (name, source, fname) {","        var id = Y.stamp(this),","            sid = Y.stamp(source),","            from = fname || name;","","        if (!this.syncHandlers) {","            this.syncHandlers = {};","        }","","        this.syncHandlers[[name, id, sid, from].join('_')] = source.after(from + 'Change', function (E) {","            this.set(name, E.newVal);","        }, this);","","        this.set(name, source.get(from));","","        return this;","    },","","    /**","     * Stop attribute syncing","     *","     * @method unsync","     * @param name {String} The name of the attribute.","     * @param source {Attribute} The source Attribute owner Object you want to sync.","     * @param sourceName {String} The source Attribute name. If the source attribute name is same with target, you can o","mit this parameter.","     * @chainable","     */","    unsync: function (name, source, fname) {","        var id = Y.stamp(this),","            sid = Y.stamp(source),","            from = fname || name,","            hid = [name, id, sid, from].join('_');","","        if (!this.syncHandlers) {","            this.syncHandlers = {};","        }","","        if (this.syncHandlers[hid]) {","            this.syncHandlers[hid].detach();","            delete this.syncHandlers[hid];","        }","","        return this;","    }","};","","Y.namespace('zui').Attribute = ZAttribute;","","","}, 'gallery-2012.08.22-20-00' ,{requires:['attribute-base'], skinnable:false});"];
_yuitest_coverage["/build/gallery-zui-attribute/gallery-zui-attribute.js"].lines = {"1":0,"16":0,"18":0,"27":0,"28":0,"31":0,"42":0,"43":0,"45":0,"57":0,"58":0,"60":0,"61":0,"63":0,"64":0,"75":0,"76":0,"79":0,"81":0,"94":0,"98":0,"99":0,"102":0,"103":0,"106":0,"108":0,"122":0,"127":0,"128":0,"131":0,"132":0,"133":0,"136":0,"140":0};
_yuitest_coverage["/build/gallery-zui-attribute/gallery-zui-attribute.js"].functions = {"ZAttribute:16":0,"toggle:26":0,"set_again:41":0,"set:56":0,"revert:74":0,"(anonymous 2):102":0,"sync:93":0,"unsync:121":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-zui-attribute/gallery-zui-attribute.js"].coveredLines = 34;
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
     * @chainable
     */
    set: function (name, value) {
        _yuitest_coverfunc("/build/gallery-zui-attribute/gallery-zui-attribute.js", "set", 56);
_yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 57);
if (!this.revertStack) {
            _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 58);
this.revertStack = {};
        }
        _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 60);
if (!this.revertStack[name]) {
            _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 61);
this.revertStack[name] = [];
        }
        _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 63);
this.revertStack[name].push(value);
        _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 64);
return this._setAttr(name, value);
    },

    /**
     * revert the value of an attribute. If no older value, do nothing.
     *
     * @method revert
     * @param name {String} The name of the attribute.
     * @chainable
     */
    revert: function (name, value) {
        _yuitest_coverfunc("/build/gallery-zui-attribute/gallery-zui-attribute.js", "revert", 74);
_yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 75);
if (!this.revertStack[name] || (this.revertStack[name].length < 2)) {
            _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 76);
return this;
        }

        _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 79);
this.revertStack[name].pop();

        _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 81);
return this._setAttr(name, this.revertStack[name][this.revertStack[name].length - 1]);
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
        _yuitest_coverfunc("/build/gallery-zui-attribute/gallery-zui-attribute.js", "sync", 93);
_yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 94);
var id = Y.stamp(this),
            sid = Y.stamp(source),
            from = fname || name;

        _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 98);
if (!this.syncHandlers) {
            _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 99);
this.syncHandlers = {};
        }

        _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 102);
this.syncHandlers[[name, id, sid, from].join('_')] = source.after(from + 'Change', function (E) {
            _yuitest_coverfunc("/build/gallery-zui-attribute/gallery-zui-attribute.js", "(anonymous 2)", 102);
_yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 103);
this.set(name, E.newVal);
        }, this);

        _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 106);
this.set(name, source.get(from));

        _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 108);
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
        _yuitest_coverfunc("/build/gallery-zui-attribute/gallery-zui-attribute.js", "unsync", 121);
_yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 122);
var id = Y.stamp(this),
            sid = Y.stamp(source),
            from = fname || name,
            hid = [name, id, sid, from].join('_');

        _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 127);
if (!this.syncHandlers) {
            _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 128);
this.syncHandlers = {};
        }

        _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 131);
if (this.syncHandlers[hid]) {
            _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 132);
this.syncHandlers[hid].detach();
            _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 133);
delete this.syncHandlers[hid];
        }

        _yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 136);
return this;
    }
};

_yuitest_coverline("/build/gallery-zui-attribute/gallery-zui-attribute.js", 140);
Y.namespace('zui').Attribute = ZAttribute;


}, 'gallery-2012.08.22-20-00' ,{requires:['attribute-base'], skinnable:false});

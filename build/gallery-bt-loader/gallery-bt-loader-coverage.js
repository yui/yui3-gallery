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
_yuitest_coverage["/build/gallery-bt-loader/gallery-bt-loader.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-bt-loader/gallery-bt-loader.js",
    code: []
};
_yuitest_coverage["/build/gallery-bt-loader/gallery-bt-loader.js"].code=["YUI.add('gallery-bt-loader', function(Y) {","","/**"," * Provide Loader class to handle user interaction and ajax loading"," *"," * @module gallery-bt-loader"," * @static"," */","","var PREFIX = 'blo_',","","    CLASSES = {","        ERROR: PREFIX + 'error',","        LOADING: PREFIX + 'loading',","        LOADED: PREFIX + 'loaded'","    },","","    ACTIONS = {","        append: function (C, O, D) {","            O.addClass(CLASSES.LOADED);","            C.append(D);","        },","        insert: function (C, O, D) {","            O.addClass(CLASSES.LOADED);","            C.insert(D, 0);","        },","        refresh: function (C, O, D) {","            O.addClass(CLASSES.LOADED);","            C.insert(D, 'replace');","        },","        replace: function (C, O, D) {","            O.addClass(CLASSES.LOADED).replace(D);","        }","    },","","    PARSERS = {","        json: function (D) {","            try {","                return Y.JSON.parse(D);","            } catch (e) {","                return null;","            }","        },","        none: function (D) {","            return D;","        }","    },","","    SELECTORS = {","        json: function (D, S) {","            var ss = S.split(/\\./),","                I;","","            for (I=0;I<ss.length;I++) {","                D = D[ss[I]];","                if (D === undefined) {","                    return;","                }","            }","            return D;","        },","        none: function (D, S) {","            return (S === '*') ? D : Y.Selector.query(S, Y.DOM.create(D), true);","        }","    },","","    validateAction = function (V) {","        return ACTIONS[V] ? true : false;","    },","","/**"," * Loader is a Widget which can help you to handle user interaction and ajax loading"," *"," * @class Loader"," * @constructor"," * @namespace Bottle"," * @extends Widget"," * @uses Bottle.SyncScroll"," * @param [config] {Object} Object literal with initial attribute values",""," */","Loader = Y.Base.create('btloader', Y.Widget, [Y.Bottle.SyncScroll], {","    initializer: function () {","        var cb = this.get('contentBox');","","        /**","         * internal eventhandlers, keep for destructor","         *","         * @property _bloEventHandlers","         * @type EventHandle","         * @private","         */","        this._bloEventHandlers = new Y.EventHandle([","            cb.delegate('click', this._handleClick, this.get('actionNode'), this)","        ]);","    },","","    destructor: function () {","        this._bloEventHandlers.detach();","        delete this._bloEventHandlers;","    },","","    bindUI: function () {","    },","","    /**","     * handle click action","     *","     * @method _handleClick","     * @protected","     */","    _handleClick: function (E) {","        var O = E.currentTarget;","","        O.removeClass(CLASSES.ERROR).addClass(CLASSES.LOADING);","        E.preventDefault();","","        Y.io(O.getAttribute(this.get('actionAttr')), {","            on: {","                success: this._handleIOSuccess,","                failure: this._handleIOFailure","            },","            context: this,","            arguments: {","                target: O","            }","        });","    },","","    /**","     * handle ajax success response","     *","     * @method _handleIOSuccess","     * @protected","     */","    _handleIOSuccess: function (id, R, cfg) {","        var parser = this.get('parser'),","            data = parser(R.responseText),","            O = cfg.target,","            oa = O.getData('action'),","            action = validateAction(oa) ? oa : this.get('action');","","        O.removeClass(CLASSES.LOADING);","","        if (!data) {","            return this._handleIOFailure(id, R, cfg);","        }","","        if (this._selector) {","            data = this._selector(data, this.get('selector'));","        }","","        ACTIONS[action](this.get('contentBox'), O, data);","        this.syncScroll();","    },","","    /**","     * handle ajax failed response","     *","     * @method _handleIOFailure","     * @protected","     */","    _handleIOFailure: function (id, R, cfg) {","        var O = cfg.target;","","        O.removeClass(CLASSES.LOADING).addClass(CLASSES.ERROR);","    }","}, {","    /**","     * Static property used to define the default attribute configuration.","     *","     * @property ATTRS","     * @type Object","     * @static","     * @protected","     */","    ATTRS: {","        /**","         * Defines which nodes will be monitered. When these node be clicked, do loading task.","         *","         * @attribute actionNode","         * @type String","         * @default 'a'","         */","        actionNode: {","            writeOnce: true,","            validator: Y.Lang.isString","        },","","        /**","         * Defines which attribute will be used to load new data when the node is clicked.","         *","         * @attribute actionAttr","         * @type String","         * @default 'href'","         */","        actionAttr: {","            validator: Y.Lang.isString","        },","","        /**","         * Default action when data loaded, should be one of 'append', 'insert', 'refresh', 'replace'.","         *","         * @attribute action","         * @type String","         * @default 'append'","         */","        action: {","            validator: validateAction","        },","","        /**","         * Default parser for ajax data, should be one of 'json', 'none', or a Function. If data can not be parsed, the ajax will be a 'failed' case.","         *","         * @attribute parser","         * @type String|Function","         * @default 'none'","         */","        parser: {","            validator: function (V) {","                return Y.Lang.isFunction(V) || (PARSERS[V] ? true : false);","            },","            setter: function (V) {","                if (PARSERS[V]) {","                    this._selector = SELECTORS[V];","                }","                return PARSERS[V] || V;","            }","        },","","        /**","         * Default selector string for responsed data. For HTML data, this value should be css selector; For json data, this value should be something like data.hash.value (will return JSONData.data.hash.value). When set to '*', all ajax response will be selected. If can not select anything, the ajax will be a 'failed' case.","         *","         * @attribute selector","         * @type String","         * @default '*'","         */","        selector: {","            validator: Y.Lang.isString","        }","    },","","    /**","     * Static property used to define the default HTML parsing rules","     *","     * @property HTML_PARSER","     * @static","     * @protected","     * @type Object","     */","    HTML_PARSER: {","        actionNode: function (srcNode) {","            return srcNode.getData('action-node') || 'a';","        },","        actionAttr: function (srcNode) {","            return srcNode.getData('action-attr') || 'href';","        },","        action: function (srcNode) {","            return srcNode.getData('action') || 'append';","        },","        parser: function (srcNode) {","            return srcNode.getData('parser') || 'none';","        },","        selector: function (srcNode) {","            return srcNode.getData('selector') || '*';","        }","    }","});","","Y.namespace('Bottle').Loader = Loader;","","","}, '@VERSION@' ,{requires:['gallery-bt-syncscroll', 'io-base', 'json-parse']});"];
_yuitest_coverage["/build/gallery-bt-loader/gallery-bt-loader.js"].lines = {"1":0,"10":0,"20":0,"21":0,"24":0,"25":0,"28":0,"29":0,"32":0,"38":0,"39":0,"41":0,"45":0,"51":0,"54":0,"55":0,"56":0,"57":0,"60":0,"63":0,"68":0,"84":0,"93":0,"99":0,"100":0,"113":0,"115":0,"116":0,"118":0,"137":0,"143":0,"145":0,"146":0,"149":0,"150":0,"153":0,"154":0,"164":0,"166":0,"221":0,"224":0,"225":0,"227":0,"253":0,"256":0,"259":0,"262":0,"265":0,"270":0};
_yuitest_coverage["/build/gallery-bt-loader/gallery-bt-loader.js"].functions = {"append:19":0,"insert:23":0,"refresh:27":0,"replace:31":0,"json:37":0,"none:44":0,"json:50":0,"none:62":0,"validateAction:67":0,"initializer:83":0,"destructor:98":0,"_handleClick:112":0,"_handleIOSuccess:136":0,"_handleIOFailure:163":0,"validator:220":0,"setter:223":0,"actionNode:252":0,"actionAttr:255":0,"action:258":0,"parser:261":0,"selector:264":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bt-loader/gallery-bt-loader.js"].coveredLines = 49;
_yuitest_coverage["/build/gallery-bt-loader/gallery-bt-loader.js"].coveredFunctions = 22;
_yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 1);
YUI.add('gallery-bt-loader', function(Y) {

/**
 * Provide Loader class to handle user interaction and ajax loading
 *
 * @module gallery-bt-loader
 * @static
 */

_yuitest_coverfunc("/build/gallery-bt-loader/gallery-bt-loader.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 10);
var PREFIX = 'blo_',

    CLASSES = {
        ERROR: PREFIX + 'error',
        LOADING: PREFIX + 'loading',
        LOADED: PREFIX + 'loaded'
    },

    ACTIONS = {
        append: function (C, O, D) {
            _yuitest_coverfunc("/build/gallery-bt-loader/gallery-bt-loader.js", "append", 19);
_yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 20);
O.addClass(CLASSES.LOADED);
            _yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 21);
C.append(D);
        },
        insert: function (C, O, D) {
            _yuitest_coverfunc("/build/gallery-bt-loader/gallery-bt-loader.js", "insert", 23);
_yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 24);
O.addClass(CLASSES.LOADED);
            _yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 25);
C.insert(D, 0);
        },
        refresh: function (C, O, D) {
            _yuitest_coverfunc("/build/gallery-bt-loader/gallery-bt-loader.js", "refresh", 27);
_yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 28);
O.addClass(CLASSES.LOADED);
            _yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 29);
C.insert(D, 'replace');
        },
        replace: function (C, O, D) {
            _yuitest_coverfunc("/build/gallery-bt-loader/gallery-bt-loader.js", "replace", 31);
_yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 32);
O.addClass(CLASSES.LOADED).replace(D);
        }
    },

    PARSERS = {
        json: function (D) {
            _yuitest_coverfunc("/build/gallery-bt-loader/gallery-bt-loader.js", "json", 37);
_yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 38);
try {
                _yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 39);
return Y.JSON.parse(D);
            } catch (e) {
                _yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 41);
return null;
            }
        },
        none: function (D) {
            _yuitest_coverfunc("/build/gallery-bt-loader/gallery-bt-loader.js", "none", 44);
_yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 45);
return D;
        }
    },

    SELECTORS = {
        json: function (D, S) {
            _yuitest_coverfunc("/build/gallery-bt-loader/gallery-bt-loader.js", "json", 50);
_yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 51);
var ss = S.split(/\./),
                I;

            _yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 54);
for (I=0;I<ss.length;I++) {
                _yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 55);
D = D[ss[I]];
                _yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 56);
if (D === undefined) {
                    _yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 57);
return;
                }
            }
            _yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 60);
return D;
        },
        none: function (D, S) {
            _yuitest_coverfunc("/build/gallery-bt-loader/gallery-bt-loader.js", "none", 62);
_yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 63);
return (S === '*') ? D : Y.Selector.query(S, Y.DOM.create(D), true);
        }
    },

    validateAction = function (V) {
        _yuitest_coverfunc("/build/gallery-bt-loader/gallery-bt-loader.js", "validateAction", 67);
_yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 68);
return ACTIONS[V] ? true : false;
    },

/**
 * Loader is a Widget which can help you to handle user interaction and ajax loading
 *
 * @class Loader
 * @constructor
 * @namespace Bottle
 * @extends Widget
 * @uses Bottle.SyncScroll
 * @param [config] {Object} Object literal with initial attribute values

 */
Loader = Y.Base.create('btloader', Y.Widget, [Y.Bottle.SyncScroll], {
    initializer: function () {
        _yuitest_coverfunc("/build/gallery-bt-loader/gallery-bt-loader.js", "initializer", 83);
_yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 84);
var cb = this.get('contentBox');

        /**
         * internal eventhandlers, keep for destructor
         *
         * @property _bloEventHandlers
         * @type EventHandle
         * @private
         */
        _yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 93);
this._bloEventHandlers = new Y.EventHandle([
            cb.delegate('click', this._handleClick, this.get('actionNode'), this)
        ]);
    },

    destructor: function () {
        _yuitest_coverfunc("/build/gallery-bt-loader/gallery-bt-loader.js", "destructor", 98);
_yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 99);
this._bloEventHandlers.detach();
        _yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 100);
delete this._bloEventHandlers;
    },

    bindUI: function () {
    },

    /**
     * handle click action
     *
     * @method _handleClick
     * @protected
     */
    _handleClick: function (E) {
        _yuitest_coverfunc("/build/gallery-bt-loader/gallery-bt-loader.js", "_handleClick", 112);
_yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 113);
var O = E.currentTarget;

        _yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 115);
O.removeClass(CLASSES.ERROR).addClass(CLASSES.LOADING);
        _yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 116);
E.preventDefault();

        _yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 118);
Y.io(O.getAttribute(this.get('actionAttr')), {
            on: {
                success: this._handleIOSuccess,
                failure: this._handleIOFailure
            },
            context: this,
            arguments: {
                target: O
            }
        });
    },

    /**
     * handle ajax success response
     *
     * @method _handleIOSuccess
     * @protected
     */
    _handleIOSuccess: function (id, R, cfg) {
        _yuitest_coverfunc("/build/gallery-bt-loader/gallery-bt-loader.js", "_handleIOSuccess", 136);
_yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 137);
var parser = this.get('parser'),
            data = parser(R.responseText),
            O = cfg.target,
            oa = O.getData('action'),
            action = validateAction(oa) ? oa : this.get('action');

        _yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 143);
O.removeClass(CLASSES.LOADING);

        _yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 145);
if (!data) {
            _yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 146);
return this._handleIOFailure(id, R, cfg);
        }

        _yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 149);
if (this._selector) {
            _yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 150);
data = this._selector(data, this.get('selector'));
        }

        _yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 153);
ACTIONS[action](this.get('contentBox'), O, data);
        _yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 154);
this.syncScroll();
    },

    /**
     * handle ajax failed response
     *
     * @method _handleIOFailure
     * @protected
     */
    _handleIOFailure: function (id, R, cfg) {
        _yuitest_coverfunc("/build/gallery-bt-loader/gallery-bt-loader.js", "_handleIOFailure", 163);
_yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 164);
var O = cfg.target;

        _yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 166);
O.removeClass(CLASSES.LOADING).addClass(CLASSES.ERROR);
    }
}, {
    /**
     * Static property used to define the default attribute configuration.
     *
     * @property ATTRS
     * @type Object
     * @static
     * @protected
     */
    ATTRS: {
        /**
         * Defines which nodes will be monitered. When these node be clicked, do loading task.
         *
         * @attribute actionNode
         * @type String
         * @default 'a'
         */
        actionNode: {
            writeOnce: true,
            validator: Y.Lang.isString
        },

        /**
         * Defines which attribute will be used to load new data when the node is clicked.
         *
         * @attribute actionAttr
         * @type String
         * @default 'href'
         */
        actionAttr: {
            validator: Y.Lang.isString
        },

        /**
         * Default action when data loaded, should be one of 'append', 'insert', 'refresh', 'replace'.
         *
         * @attribute action
         * @type String
         * @default 'append'
         */
        action: {
            validator: validateAction
        },

        /**
         * Default parser for ajax data, should be one of 'json', 'none', or a Function. If data can not be parsed, the ajax will be a 'failed' case.
         *
         * @attribute parser
         * @type String|Function
         * @default 'none'
         */
        parser: {
            validator: function (V) {
                _yuitest_coverfunc("/build/gallery-bt-loader/gallery-bt-loader.js", "validator", 220);
_yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 221);
return Y.Lang.isFunction(V) || (PARSERS[V] ? true : false);
            },
            setter: function (V) {
                _yuitest_coverfunc("/build/gallery-bt-loader/gallery-bt-loader.js", "setter", 223);
_yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 224);
if (PARSERS[V]) {
                    _yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 225);
this._selector = SELECTORS[V];
                }
                _yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 227);
return PARSERS[V] || V;
            }
        },

        /**
         * Default selector string for responsed data. For HTML data, this value should be css selector; For json data, this value should be something like data.hash.value (will return JSONData.data.hash.value). When set to '*', all ajax response will be selected. If can not select anything, the ajax will be a 'failed' case.
         *
         * @attribute selector
         * @type String
         * @default '*'
         */
        selector: {
            validator: Y.Lang.isString
        }
    },

    /**
     * Static property used to define the default HTML parsing rules
     *
     * @property HTML_PARSER
     * @static
     * @protected
     * @type Object
     */
    HTML_PARSER: {
        actionNode: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-loader/gallery-bt-loader.js", "actionNode", 252);
_yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 253);
return srcNode.getData('action-node') || 'a';
        },
        actionAttr: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-loader/gallery-bt-loader.js", "actionAttr", 255);
_yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 256);
return srcNode.getData('action-attr') || 'href';
        },
        action: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-loader/gallery-bt-loader.js", "action", 258);
_yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 259);
return srcNode.getData('action') || 'append';
        },
        parser: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-loader/gallery-bt-loader.js", "parser", 261);
_yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 262);
return srcNode.getData('parser') || 'none';
        },
        selector: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-loader/gallery-bt-loader.js", "selector", 264);
_yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 265);
return srcNode.getData('selector') || '*';
        }
    }
});

_yuitest_coverline("/build/gallery-bt-loader/gallery-bt-loader.js", 270);
Y.namespace('Bottle').Loader = Loader;


}, '@VERSION@' ,{requires:['gallery-bt-syncscroll', 'io-base', 'json-parse']});

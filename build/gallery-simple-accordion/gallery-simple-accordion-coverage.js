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
_yuitest_coverage["/build/gallery-simple-accordion/gallery-simple-accordion.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-simple-accordion/gallery-simple-accordion.js",
    code: []
};
_yuitest_coverage["/build/gallery-simple-accordion/gallery-simple-accordion.js"].code=["YUI.add('gallery-simple-accordion', function(Y) {","","/**"," *  Simple accordion using an html list"," *  "," *  @author alejandro soto"," *  "," */","YUI.add('gallery-simple-accordion', function (Y) {","","    function SimpleAccordion(config) {","        SimpleAccordion.superclass.constructor.apply(this, arguments);","    }","","    SimpleAccordion.NAME = 'simple-accordion';","","    SimpleAccordion.ATTRS = {};","","    Y.extend(SimpleAccordion, Y.Base, {","        ","        config: null,","        ","        _ACCORDION_ITEM: '.accordion-item',","        _ACCORDION_ITEM_LINK: '.accordion-item-link',","        _ACCORDION_ITEM_CONTENT: '.accordion-item-content',","        _HIDE: 'hide',","        _SHOW: 'show',","        _SELECTED: 'selected',","        ","        /**","         * This constructor method initializes the object and start rendering the carousel","         * ","         * @param cfg Module external configuration","         */","        initializer: function (cfg) {","            this.config = cfg;","            this._initializesItemClicked();","        },","        ","        /**","         * Initializes the carousel","         * ","         */","        _initializesItemClicked: function() {","            var cfg = this.config;","            var me = this;","            if (me.hasItems()) {","                cfg.mainNode.delegate('click', function(e) {","                    e.preventDefault();","                    me._deselectAllItems();","                    var li = e.target.get('parentNode');","                    var itemContent = li.one(me._ACCORDION_ITEM_CONTENT);","                    li.addClass(me._SELECTED);","                    if (itemContent) {","                        itemContent.removeClass(me._HIDE);","                        itemContent.addClass(me._SHOW);","                    }","                    console.info('event clicked');","                }, me._ACCORDION_ITEM_LINK);","            }","        },","        ","        /**","         * Deselects all the items in the list","         * ","         */","        _deselectAllItems: function() {","            var cfg = this.config;","            cfg.mainNode.all(this._ACCORDION_ITEM).removeClass(this._SELECTED);","            cfg.mainNode.all(this._ACCORDION_ITEM_CONTENT).removeClass(this._SHOW);","            cfg.mainNode.all(this._ACCORDION_ITEM_CONTENT).addClass(this._HIDE);","        },","        ","        /**","         * Validates if the list has items","         * ","         */","        hasItems: function () {","            var cfg = this.config;","            return cfg.mainNode && cfg.mainNode.all(this._ACCORDION_ITEM_LINK).size() > 0;","        },","        ","        /**","         * Destructor","         * ","         */","        destructor: function () {","        ","        }","    });","","    Y.SimpleAccordion = SimpleAccordion;","}, '0.0.1', {","    requires: ['base', 'node', 'node-event-delegate']","});","","","}, 'gallery-2012.09.26-20-36' ,{requires:['base','node','node-event-delegate'], skinnable:true});"];
_yuitest_coverage["/build/gallery-simple-accordion/gallery-simple-accordion.js"].lines = {"1":0,"9":0,"11":0,"12":0,"15":0,"17":0,"19":0,"36":0,"37":0,"45":0,"46":0,"47":0,"48":0,"49":0,"50":0,"51":0,"52":0,"53":0,"54":0,"55":0,"56":0,"58":0,"68":0,"69":0,"70":0,"71":0,"79":0,"80":0,"92":0};
_yuitest_coverage["/build/gallery-simple-accordion/gallery-simple-accordion.js"].functions = {"SimpleAccordion:11":0,"initializer:35":0,"(anonymous 3):48":0,"_initializesItemClicked:44":0,"_deselectAllItems:67":0,"hasItems:78":0,"(anonymous 2):9":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-simple-accordion/gallery-simple-accordion.js"].coveredLines = 29;
_yuitest_coverage["/build/gallery-simple-accordion/gallery-simple-accordion.js"].coveredFunctions = 8;
_yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 1);
YUI.add('gallery-simple-accordion', function(Y) {

/**
 *  Simple accordion using an html list
 *  
 *  @author alejandro soto
 *  
 */
_yuitest_coverfunc("/build/gallery-simple-accordion/gallery-simple-accordion.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 9);
YUI.add('gallery-simple-accordion', function (Y) {

    _yuitest_coverfunc("/build/gallery-simple-accordion/gallery-simple-accordion.js", "(anonymous 2)", 9);
_yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 11);
function SimpleAccordion(config) {
        _yuitest_coverfunc("/build/gallery-simple-accordion/gallery-simple-accordion.js", "SimpleAccordion", 11);
_yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 12);
SimpleAccordion.superclass.constructor.apply(this, arguments);
    }

    _yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 15);
SimpleAccordion.NAME = 'simple-accordion';

    _yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 17);
SimpleAccordion.ATTRS = {};

    _yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 19);
Y.extend(SimpleAccordion, Y.Base, {
        
        config: null,
        
        _ACCORDION_ITEM: '.accordion-item',
        _ACCORDION_ITEM_LINK: '.accordion-item-link',
        _ACCORDION_ITEM_CONTENT: '.accordion-item-content',
        _HIDE: 'hide',
        _SHOW: 'show',
        _SELECTED: 'selected',
        
        /**
         * This constructor method initializes the object and start rendering the carousel
         * 
         * @param cfg Module external configuration
         */
        initializer: function (cfg) {
            _yuitest_coverfunc("/build/gallery-simple-accordion/gallery-simple-accordion.js", "initializer", 35);
_yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 36);
this.config = cfg;
            _yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 37);
this._initializesItemClicked();
        },
        
        /**
         * Initializes the carousel
         * 
         */
        _initializesItemClicked: function() {
            _yuitest_coverfunc("/build/gallery-simple-accordion/gallery-simple-accordion.js", "_initializesItemClicked", 44);
_yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 45);
var cfg = this.config;
            _yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 46);
var me = this;
            _yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 47);
if (me.hasItems()) {
                _yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 48);
cfg.mainNode.delegate('click', function(e) {
                    _yuitest_coverfunc("/build/gallery-simple-accordion/gallery-simple-accordion.js", "(anonymous 3)", 48);
_yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 49);
e.preventDefault();
                    _yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 50);
me._deselectAllItems();
                    _yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 51);
var li = e.target.get('parentNode');
                    _yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 52);
var itemContent = li.one(me._ACCORDION_ITEM_CONTENT);
                    _yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 53);
li.addClass(me._SELECTED);
                    _yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 54);
if (itemContent) {
                        _yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 55);
itemContent.removeClass(me._HIDE);
                        _yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 56);
itemContent.addClass(me._SHOW);
                    }
                    _yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 58);
console.info('event clicked');
                }, me._ACCORDION_ITEM_LINK);
            }
        },
        
        /**
         * Deselects all the items in the list
         * 
         */
        _deselectAllItems: function() {
            _yuitest_coverfunc("/build/gallery-simple-accordion/gallery-simple-accordion.js", "_deselectAllItems", 67);
_yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 68);
var cfg = this.config;
            _yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 69);
cfg.mainNode.all(this._ACCORDION_ITEM).removeClass(this._SELECTED);
            _yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 70);
cfg.mainNode.all(this._ACCORDION_ITEM_CONTENT).removeClass(this._SHOW);
            _yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 71);
cfg.mainNode.all(this._ACCORDION_ITEM_CONTENT).addClass(this._HIDE);
        },
        
        /**
         * Validates if the list has items
         * 
         */
        hasItems: function () {
            _yuitest_coverfunc("/build/gallery-simple-accordion/gallery-simple-accordion.js", "hasItems", 78);
_yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 79);
var cfg = this.config;
            _yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 80);
return cfg.mainNode && cfg.mainNode.all(this._ACCORDION_ITEM_LINK).size() > 0;
        },
        
        /**
         * Destructor
         * 
         */
        destructor: function () {
        
        }
    });

    _yuitest_coverline("/build/gallery-simple-accordion/gallery-simple-accordion.js", 92);
Y.SimpleAccordion = SimpleAccordion;
}, '0.0.1', {
    requires: ['base', 'node', 'node-event-delegate']
});


}, 'gallery-2012.09.26-20-36' ,{requires:['base','node','node-event-delegate'], skinnable:true});

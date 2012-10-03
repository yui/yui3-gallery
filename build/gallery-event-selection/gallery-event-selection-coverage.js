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
_yuitest_coverage["/build/gallery-event-selection/gallery-event-selection.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-event-selection/gallery-event-selection.js",
    code: []
};
_yuitest_coverage["/build/gallery-event-selection/gallery-event-selection.js"].code=["YUI.add('gallery-event-selection', function(Y) {","","/*"," * Cross browser/device text selection events."," *  - selection: Fired when text has been selected."," *  - selectionchange: Fired when text has been selected or deselected."," *"," * Fired events have the following properties:"," *  - selection: Selected text."," *  - pageX/pageY: Best guess on where selection ends."," *"," * Limitations:"," *  - There are a few edge cases where selection events don't work well. Namely,"," *    when selecting text that crosses the boundary of a bounded node or selecting"," *    text with only keyboard selection."," *"," * Notes:"," *  - Polling for selection changes is necessary because iOS doesn't tell us"," *    when the selection region has been updated and desktop browsers can use"," *    keyboard selection."," *  - iOS requires a slight delay when getting selected text."," *"," * event-gesture bugs:"," *  - Can't listen to multiple gesturemove events on the same node."," *  - gesturemoveend doesn't fire without gesturemovestart."," */","    \"use strict\";","    /*global Y:true */","    /*jslint regexp: true*/","    var DELAY = Y.UA.ios ? 400 : 0,","        POLL = 300;","","    function getSelection() {","        var s = '';","        if (Y.config.win.getSelection) {","            s = Y.config.win.getSelection().toString();","        } else if (Y.config.doc.selection) {","            s = Y.config.doc.selection.createRange().text;","        }","        return s;","    }","","    Y.Event.define('selection', {","        on: function (node, sub, notifier, filter) {","            var method = filter ? 'delegate' : 'on';","            sub._notifier = notifier;","            sub._handle = new Y.EventHandle([","                node[method]('gesturemovestart', function (e) {}, filter), // event-gesture bug","                // Checking asynchronously since previously selected text can be reported as selected.","                node[method]('gesturemoveend', Y.bind(function (e) {","                    sub._x = e.pageX;","                    sub._y = e.pageY;","                    Y.later(DELAY, this, this._checkSelection, sub);","                }, this), filter)","            ]);","        },","","        delegate: function () {","            this.on.apply(this, arguments);","        },","","        detach: function (node, sub, notifier) {","            sub._handle.detach();","        },","","        detachDelegate: function () {","            this.detach.apply(this, arguments);","        },","","        _checkSelection: function (sub) {","            var selection = getSelection();","            if (selection !== '') {","                sub._notifier.fire({selection: selection, pageX: sub._x, pageY: sub._y});","            }","        }","    });","","    Y.Event.define('selectionchange', {","        _poll: null, // Keep one poll since there can only ever be one text selection.","","        on: function (node, sub, notifier, filter) {","            var method = filter ? 'delegate' : 'on';","            sub._selection = ''; // Save last selection","            sub._notifier = notifier;","            sub._handle = new Y.EventHandle([","                Y.on('gesturemovestart', Y.bind(function (e) {","                    this._unpoll();","                    if (sub._selection) {","                        Y.later(0, this, this._checkSelectionChange, sub);","                    }","                }, this)),","                node[method]('gesturemovestart', function (e) {}, filter), // event-gesture bug","                // Checking asynchronously since previously selected text can be reported as selected.","                node[method]('gesturemoveend', Y.bind(function (e) {","                    sub._x = e.pageX;","                    sub._y = e.pageY;","                    Y.later(DELAY, this, this._checkSelection, sub);","                }, this), filter)","            ]);","        },","","        delegate: function () {","            this.on.apply(this, arguments);","        },","","        detach: function (node, sub, notifier) {","            this._unpoll();","            sub._handle.detach();","        },","","        detachDelegate: function () {","            this.detach.apply(this, arguments);","        },","","        _checkSelection: function (sub) {","            this._unpoll();","            this._checkSelectionChange(sub);","            this._poll = Y.later(POLL, this, this._checkSelectionChange, sub, true);","        },","","        _checkSelectionChange: function (sub) {","            var selection = getSelection();","            if (selection !== sub._selection) {","                sub._selection = selection;","                sub._notifier.fire({selection: sub._selection, pageX: sub._x, pageY: sub._y});","            }","        },","","        _unpoll: function () {","            if (this._poll) {","                this._poll.cancel();","                this._poll = null;","            }","        }","    });","","","}, 'gallery-2012.10.03-20-02' ,{requires:['event-move'], skinnable:false});"];
_yuitest_coverage["/build/gallery-event-selection/gallery-event-selection.js"].lines = {"1":0,"27":0,"30":0,"33":0,"34":0,"35":0,"36":0,"37":0,"38":0,"40":0,"43":0,"45":0,"46":0,"47":0,"51":0,"52":0,"53":0,"59":0,"63":0,"67":0,"71":0,"72":0,"73":0,"78":0,"82":0,"83":0,"84":0,"85":0,"87":0,"88":0,"89":0,"95":0,"96":0,"97":0,"103":0,"107":0,"108":0,"112":0,"116":0,"117":0,"118":0,"122":0,"123":0,"124":0,"125":0,"130":0,"131":0,"132":0};
_yuitest_coverage["/build/gallery-event-selection/gallery-event-selection.js"].functions = {"getSelection:33":0,"(anonymous 3):50":0,"on:44":0,"delegate:58":0,"detach:62":0,"detachDelegate:66":0,"_checkSelection:70":0,"(anonymous 4):86":0,"(anonymous 6):94":0,"on:81":0,"delegate:102":0,"detach:106":0,"detachDelegate:111":0,"_checkSelection:115":0,"_checkSelectionChange:121":0,"_unpoll:129":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-event-selection/gallery-event-selection.js"].coveredLines = 48;
_yuitest_coverage["/build/gallery-event-selection/gallery-event-selection.js"].coveredFunctions = 17;
_yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 1);
YUI.add('gallery-event-selection', function(Y) {

/*
 * Cross browser/device text selection events.
 *  - selection: Fired when text has been selected.
 *  - selectionchange: Fired when text has been selected or deselected.
 *
 * Fired events have the following properties:
 *  - selection: Selected text.
 *  - pageX/pageY: Best guess on where selection ends.
 *
 * Limitations:
 *  - There are a few edge cases where selection events don't work well. Namely,
 *    when selecting text that crosses the boundary of a bounded node or selecting
 *    text with only keyboard selection.
 *
 * Notes:
 *  - Polling for selection changes is necessary because iOS doesn't tell us
 *    when the selection region has been updated and desktop browsers can use
 *    keyboard selection.
 *  - iOS requires a slight delay when getting selected text.
 *
 * event-gesture bugs:
 *  - Can't listen to multiple gesturemove events on the same node.
 *  - gesturemoveend doesn't fire without gesturemovestart.
 */
    _yuitest_coverfunc("/build/gallery-event-selection/gallery-event-selection.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 27);
"use strict";
    /*global Y:true */
    /*jslint regexp: true*/
    _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 30);
var DELAY = Y.UA.ios ? 400 : 0,
        POLL = 300;

    _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 33);
function getSelection() {
        _yuitest_coverfunc("/build/gallery-event-selection/gallery-event-selection.js", "getSelection", 33);
_yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 34);
var s = '';
        _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 35);
if (Y.config.win.getSelection) {
            _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 36);
s = Y.config.win.getSelection().toString();
        } else {_yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 37);
if (Y.config.doc.selection) {
            _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 38);
s = Y.config.doc.selection.createRange().text;
        }}
        _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 40);
return s;
    }

    _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 43);
Y.Event.define('selection', {
        on: function (node, sub, notifier, filter) {
            _yuitest_coverfunc("/build/gallery-event-selection/gallery-event-selection.js", "on", 44);
_yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 45);
var method = filter ? 'delegate' : 'on';
            _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 46);
sub._notifier = notifier;
            _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 47);
sub._handle = new Y.EventHandle([
                node[method]('gesturemovestart', function (e) {}, filter), // event-gesture bug
                // Checking asynchronously since previously selected text can be reported as selected.
                node[method]('gesturemoveend', Y.bind(function (e) {
                    _yuitest_coverfunc("/build/gallery-event-selection/gallery-event-selection.js", "(anonymous 3)", 50);
_yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 51);
sub._x = e.pageX;
                    _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 52);
sub._y = e.pageY;
                    _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 53);
Y.later(DELAY, this, this._checkSelection, sub);
                }, this), filter)
            ]);
        },

        delegate: function () {
            _yuitest_coverfunc("/build/gallery-event-selection/gallery-event-selection.js", "delegate", 58);
_yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 59);
this.on.apply(this, arguments);
        },

        detach: function (node, sub, notifier) {
            _yuitest_coverfunc("/build/gallery-event-selection/gallery-event-selection.js", "detach", 62);
_yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 63);
sub._handle.detach();
        },

        detachDelegate: function () {
            _yuitest_coverfunc("/build/gallery-event-selection/gallery-event-selection.js", "detachDelegate", 66);
_yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 67);
this.detach.apply(this, arguments);
        },

        _checkSelection: function (sub) {
            _yuitest_coverfunc("/build/gallery-event-selection/gallery-event-selection.js", "_checkSelection", 70);
_yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 71);
var selection = getSelection();
            _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 72);
if (selection !== '') {
                _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 73);
sub._notifier.fire({selection: selection, pageX: sub._x, pageY: sub._y});
            }
        }
    });

    _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 78);
Y.Event.define('selectionchange', {
        _poll: null, // Keep one poll since there can only ever be one text selection.

        on: function (node, sub, notifier, filter) {
            _yuitest_coverfunc("/build/gallery-event-selection/gallery-event-selection.js", "on", 81);
_yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 82);
var method = filter ? 'delegate' : 'on';
            _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 83);
sub._selection = ''; // Save last selection
            _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 84);
sub._notifier = notifier;
            _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 85);
sub._handle = new Y.EventHandle([
                Y.on('gesturemovestart', Y.bind(function (e) {
                    _yuitest_coverfunc("/build/gallery-event-selection/gallery-event-selection.js", "(anonymous 4)", 86);
_yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 87);
this._unpoll();
                    _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 88);
if (sub._selection) {
                        _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 89);
Y.later(0, this, this._checkSelectionChange, sub);
                    }
                }, this)),
                node[method]('gesturemovestart', function (e) {}, filter), // event-gesture bug
                // Checking asynchronously since previously selected text can be reported as selected.
                node[method]('gesturemoveend', Y.bind(function (e) {
                    _yuitest_coverfunc("/build/gallery-event-selection/gallery-event-selection.js", "(anonymous 6)", 94);
_yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 95);
sub._x = e.pageX;
                    _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 96);
sub._y = e.pageY;
                    _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 97);
Y.later(DELAY, this, this._checkSelection, sub);
                }, this), filter)
            ]);
        },

        delegate: function () {
            _yuitest_coverfunc("/build/gallery-event-selection/gallery-event-selection.js", "delegate", 102);
_yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 103);
this.on.apply(this, arguments);
        },

        detach: function (node, sub, notifier) {
            _yuitest_coverfunc("/build/gallery-event-selection/gallery-event-selection.js", "detach", 106);
_yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 107);
this._unpoll();
            _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 108);
sub._handle.detach();
        },

        detachDelegate: function () {
            _yuitest_coverfunc("/build/gallery-event-selection/gallery-event-selection.js", "detachDelegate", 111);
_yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 112);
this.detach.apply(this, arguments);
        },

        _checkSelection: function (sub) {
            _yuitest_coverfunc("/build/gallery-event-selection/gallery-event-selection.js", "_checkSelection", 115);
_yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 116);
this._unpoll();
            _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 117);
this._checkSelectionChange(sub);
            _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 118);
this._poll = Y.later(POLL, this, this._checkSelectionChange, sub, true);
        },

        _checkSelectionChange: function (sub) {
            _yuitest_coverfunc("/build/gallery-event-selection/gallery-event-selection.js", "_checkSelectionChange", 121);
_yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 122);
var selection = getSelection();
            _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 123);
if (selection !== sub._selection) {
                _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 124);
sub._selection = selection;
                _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 125);
sub._notifier.fire({selection: sub._selection, pageX: sub._x, pageY: sub._y});
            }
        },

        _unpoll: function () {
            _yuitest_coverfunc("/build/gallery-event-selection/gallery-event-selection.js", "_unpoll", 129);
_yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 130);
if (this._poll) {
                _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 131);
this._poll.cancel();
                _yuitest_coverline("/build/gallery-event-selection/gallery-event-selection.js", 132);
this._poll = null;
            }
        }
    });


}, 'gallery-2012.10.03-20-02' ,{requires:['event-move'], skinnable:false});

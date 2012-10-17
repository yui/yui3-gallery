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
_yuitest_coverage["/build/gallery-get-selection/gallery-get-selection.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-get-selection/gallery-get-selection.js",
    code: []
};
_yuitest_coverage["/build/gallery-get-selection/gallery-get-selection.js"].code=["YUI.add('gallery-get-selection', function(Y) {","","/**"," * Getting a DOM fragment with the dom structure selected by the user."," * @module gallery-get-selection"," * @requires node"," */","","/**"," * Return a DOM Fragment with the dom structure selected by the user to"," * facilitate the analysis of that fragment."," * E.g., Y.getSelection().all('p').size() will give you the number of paragraphs"," * selected by the user."," * @class getSelection"," * @static"," */","","/*"," * All the credit for Dav Glass (@davglass), since he has provided"," * the whole chunk of code, I just did the monkey work."," */","Y.getSelection = function () {","    var sel,","        winsel,","        frag;","","    if (Y.config.win.getSelection) {","        winsel = Y.config.win.getSelection();","        if (winsel.rangeCount > 0) {","            sel = winsel.getRangeAt(0);","        }","    } else if (Y.config.doc.selection) {","        sel = Y.config.doc.selection.createRange();","    }","","    if (sel && sel.cloneContents) {","        frag = sel.cloneContents();","    } else if (sel && sel.htmlText) {","        frag = Y.Node.create(sel.htmlText);","    }","","    return Y.Node.create('<div></div>').append(frag);","};","","","}, 'gallery-2012.10.17-20-00' ,{requires:['node']});"];
_yuitest_coverage["/build/gallery-get-selection/gallery-get-selection.js"].lines = {"1":0,"22":0,"23":0,"27":0,"28":0,"29":0,"30":0,"32":0,"33":0,"36":0,"37":0,"38":0,"39":0,"42":0};
_yuitest_coverage["/build/gallery-get-selection/gallery-get-selection.js"].functions = {"getSelection:22":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-get-selection/gallery-get-selection.js"].coveredLines = 14;
_yuitest_coverage["/build/gallery-get-selection/gallery-get-selection.js"].coveredFunctions = 2;
_yuitest_coverline("/build/gallery-get-selection/gallery-get-selection.js", 1);
YUI.add('gallery-get-selection', function(Y) {

/**
 * Getting a DOM fragment with the dom structure selected by the user.
 * @module gallery-get-selection
 * @requires node
 */

/**
 * Return a DOM Fragment with the dom structure selected by the user to
 * facilitate the analysis of that fragment.
 * E.g., Y.getSelection().all('p').size() will give you the number of paragraphs
 * selected by the user.
 * @class getSelection
 * @static
 */

/*
 * All the credit for Dav Glass (@davglass), since he has provided
 * the whole chunk of code, I just did the monkey work.
 */
_yuitest_coverfunc("/build/gallery-get-selection/gallery-get-selection.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-get-selection/gallery-get-selection.js", 22);
Y.getSelection = function () {
    _yuitest_coverfunc("/build/gallery-get-selection/gallery-get-selection.js", "getSelection", 22);
_yuitest_coverline("/build/gallery-get-selection/gallery-get-selection.js", 23);
var sel,
        winsel,
        frag;

    _yuitest_coverline("/build/gallery-get-selection/gallery-get-selection.js", 27);
if (Y.config.win.getSelection) {
        _yuitest_coverline("/build/gallery-get-selection/gallery-get-selection.js", 28);
winsel = Y.config.win.getSelection();
        _yuitest_coverline("/build/gallery-get-selection/gallery-get-selection.js", 29);
if (winsel.rangeCount > 0) {
            _yuitest_coverline("/build/gallery-get-selection/gallery-get-selection.js", 30);
sel = winsel.getRangeAt(0);
        }
    } else {_yuitest_coverline("/build/gallery-get-selection/gallery-get-selection.js", 32);
if (Y.config.doc.selection) {
        _yuitest_coverline("/build/gallery-get-selection/gallery-get-selection.js", 33);
sel = Y.config.doc.selection.createRange();
    }}

    _yuitest_coverline("/build/gallery-get-selection/gallery-get-selection.js", 36);
if (sel && sel.cloneContents) {
        _yuitest_coverline("/build/gallery-get-selection/gallery-get-selection.js", 37);
frag = sel.cloneContents();
    } else {_yuitest_coverline("/build/gallery-get-selection/gallery-get-selection.js", 38);
if (sel && sel.htmlText) {
        _yuitest_coverline("/build/gallery-get-selection/gallery-get-selection.js", 39);
frag = Y.Node.create(sel.htmlText);
    }}

    _yuitest_coverline("/build/gallery-get-selection/gallery-get-selection.js", 42);
return Y.Node.create('<div></div>').append(frag);
};


}, 'gallery-2012.10.17-20-00' ,{requires:['node']});

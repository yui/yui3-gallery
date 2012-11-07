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
_yuitest_coverage["/build/gallery-textarea-expander/gallery-textarea-expander.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-textarea-expander/gallery-textarea-expander.js",
    code: []
};
_yuitest_coverage["/build/gallery-textarea-expander/gallery-textarea-expander.js"].code=["YUI.add('gallery-textarea-expander', function(Y) {","","var TextareaExpander = function(cfg) {","    TextareaExpander.superclass.constructor.apply(this, arguments);","};","","TextareaExpander.NAME = \"textareaExpander\";","TextareaExpander.NS = \"textarea-expander\";","","Y.extend(TextareaExpander, Y.Plugin.Base, {","","    initializer : function(cfg) {","		var txt = cfg.host,","		span,","		maxHeight=parseInt(txt.getStyle('maxHeight'),10),","		overflow=false;","		","		txt.wrap('<div class=\"textarea-expander\"></div>');","		txt.ancestor().prepend(\"<pre><span></span><br/></pre>\");","		span = txt.ancestor().one('span');","","		txt.setStyle('height','100%');","		","		if(Y.UA.opera && Y.UA.os === 'macintosh'){","			span.append('<br/>');","		}","		","		this.handle = txt.on(['keyup','scroll'],function(e){","			//We need to prevent the situation that a max-height is set and text starts overflowing.","			//If maxHeight is set, it will be a number","			if(!isNaN(maxHeight)){","				if(!overflow && txt.get('scrollHeight') > maxHeight){","					//Overflow is blocked and we are overflowing. We need to stop textexpansion","					overflow = true;","					txt.setStyle('overflowY','auto');","					//span.setStyle('height',txt.get('height'));","				}else if(overflow && txt.get('scrollHeight') < maxHeight){","					//Overflow is not blocked and we have removed enough text to remove the scrollbar again. We need to restart text expansion","					overflow = false;","					txt.setStyle('overflowY','none');","					//span.setStyle('height','auto');","				}","			}","			","			if(!overflow){","				span.set('text',txt.get('value'));","			}","		});","		","		span.set('text',txt.get('value'));","		","		txt.ancestor().addClass('active');","    },","	destructor:function(){","		this.handle.detach();","	}","});","Y.TextareaExpander = TextareaExpander;","","","}, 'gallery-2012.11.07-21-32' ,{skinnable:true, requires:['plugin','node-style']});"];
_yuitest_coverage["/build/gallery-textarea-expander/gallery-textarea-expander.js"].lines = {"1":0,"3":0,"4":0,"7":0,"8":0,"10":0,"13":0,"18":0,"19":0,"20":0,"22":0,"24":0,"25":0,"28":0,"31":0,"32":0,"34":0,"35":0,"37":0,"39":0,"40":0,"45":0,"46":0,"50":0,"52":0,"55":0,"58":0};
_yuitest_coverage["/build/gallery-textarea-expander/gallery-textarea-expander.js"].functions = {"TextareaExpander:3":0,"(anonymous 2):28":0,"initializer:12":0,"destructor:54":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-textarea-expander/gallery-textarea-expander.js"].coveredLines = 27;
_yuitest_coverage["/build/gallery-textarea-expander/gallery-textarea-expander.js"].coveredFunctions = 5;
_yuitest_coverline("/build/gallery-textarea-expander/gallery-textarea-expander.js", 1);
YUI.add('gallery-textarea-expander', function(Y) {

_yuitest_coverfunc("/build/gallery-textarea-expander/gallery-textarea-expander.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-textarea-expander/gallery-textarea-expander.js", 3);
var TextareaExpander = function(cfg) {
    _yuitest_coverfunc("/build/gallery-textarea-expander/gallery-textarea-expander.js", "TextareaExpander", 3);
_yuitest_coverline("/build/gallery-textarea-expander/gallery-textarea-expander.js", 4);
TextareaExpander.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("/build/gallery-textarea-expander/gallery-textarea-expander.js", 7);
TextareaExpander.NAME = "textareaExpander";
_yuitest_coverline("/build/gallery-textarea-expander/gallery-textarea-expander.js", 8);
TextareaExpander.NS = "textarea-expander";

_yuitest_coverline("/build/gallery-textarea-expander/gallery-textarea-expander.js", 10);
Y.extend(TextareaExpander, Y.Plugin.Base, {

    initializer : function(cfg) {
		_yuitest_coverfunc("/build/gallery-textarea-expander/gallery-textarea-expander.js", "initializer", 12);
_yuitest_coverline("/build/gallery-textarea-expander/gallery-textarea-expander.js", 13);
var txt = cfg.host,
		span,
		maxHeight=parseInt(txt.getStyle('maxHeight'),10),
		overflow=false;
		
		_yuitest_coverline("/build/gallery-textarea-expander/gallery-textarea-expander.js", 18);
txt.wrap('<div class="textarea-expander"></div>');
		_yuitest_coverline("/build/gallery-textarea-expander/gallery-textarea-expander.js", 19);
txt.ancestor().prepend("<pre><span></span><br/></pre>");
		_yuitest_coverline("/build/gallery-textarea-expander/gallery-textarea-expander.js", 20);
span = txt.ancestor().one('span');

		_yuitest_coverline("/build/gallery-textarea-expander/gallery-textarea-expander.js", 22);
txt.setStyle('height','100%');
		
		_yuitest_coverline("/build/gallery-textarea-expander/gallery-textarea-expander.js", 24);
if(Y.UA.opera && Y.UA.os === 'macintosh'){
			_yuitest_coverline("/build/gallery-textarea-expander/gallery-textarea-expander.js", 25);
span.append('<br/>');
		}
		
		_yuitest_coverline("/build/gallery-textarea-expander/gallery-textarea-expander.js", 28);
this.handle = txt.on(['keyup','scroll'],function(e){
			//We need to prevent the situation that a max-height is set and text starts overflowing.
			//If maxHeight is set, it will be a number
			_yuitest_coverfunc("/build/gallery-textarea-expander/gallery-textarea-expander.js", "(anonymous 2)", 28);
_yuitest_coverline("/build/gallery-textarea-expander/gallery-textarea-expander.js", 31);
if(!isNaN(maxHeight)){
				_yuitest_coverline("/build/gallery-textarea-expander/gallery-textarea-expander.js", 32);
if(!overflow && txt.get('scrollHeight') > maxHeight){
					//Overflow is blocked and we are overflowing. We need to stop textexpansion
					_yuitest_coverline("/build/gallery-textarea-expander/gallery-textarea-expander.js", 34);
overflow = true;
					_yuitest_coverline("/build/gallery-textarea-expander/gallery-textarea-expander.js", 35);
txt.setStyle('overflowY','auto');
					//span.setStyle('height',txt.get('height'));
				}else {_yuitest_coverline("/build/gallery-textarea-expander/gallery-textarea-expander.js", 37);
if(overflow && txt.get('scrollHeight') < maxHeight){
					//Overflow is not blocked and we have removed enough text to remove the scrollbar again. We need to restart text expansion
					_yuitest_coverline("/build/gallery-textarea-expander/gallery-textarea-expander.js", 39);
overflow = false;
					_yuitest_coverline("/build/gallery-textarea-expander/gallery-textarea-expander.js", 40);
txt.setStyle('overflowY','none');
					//span.setStyle('height','auto');
				}}
			}
			
			_yuitest_coverline("/build/gallery-textarea-expander/gallery-textarea-expander.js", 45);
if(!overflow){
				_yuitest_coverline("/build/gallery-textarea-expander/gallery-textarea-expander.js", 46);
span.set('text',txt.get('value'));
			}
		});
		
		_yuitest_coverline("/build/gallery-textarea-expander/gallery-textarea-expander.js", 50);
span.set('text',txt.get('value'));
		
		_yuitest_coverline("/build/gallery-textarea-expander/gallery-textarea-expander.js", 52);
txt.ancestor().addClass('active');
    },
	destructor:function(){
		_yuitest_coverfunc("/build/gallery-textarea-expander/gallery-textarea-expander.js", "destructor", 54);
_yuitest_coverline("/build/gallery-textarea-expander/gallery-textarea-expander.js", 55);
this.handle.detach();
	}
});
_yuitest_coverline("/build/gallery-textarea-expander/gallery-textarea-expander.js", 58);
Y.TextareaExpander = TextareaExpander;


}, 'gallery-2012.11.07-21-32' ,{skinnable:true, requires:['plugin','node-style']});

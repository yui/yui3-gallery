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
_yuitest_coverage["/build/gallery-twitter-widget/gallery-twitter-widget.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-twitter-widget/gallery-twitter-widget.js",
    code: []
};
_yuitest_coverage["/build/gallery-twitter-widget/gallery-twitter-widget.js"].code=["YUI.add('gallery-twitter-widget', function(Y) {","","/*"," * Twitter: written by Marc Schipperheyn @orangebits.nl"," * Based on the Twitter-Status by Luke Smith"," */","","var RE_USERNAME = /@(\\w+)/g,","	RE_LINK = /((?:https?|s?ftp|ssh)\\:\\/\\/[^\"\\s<>]*[^.,;'\">\\:\\s<>\\)\\]\\!])/g,","	RE_HASH = /#(\\w+)/g,","	Twitter;","","Twitter = Y.Base.create(\"Twitter\", Y.Widget, [], {","	","	PHOTO_TEMPLATE: '<div class=\"twitter-photo\"><a href=\"{url}\"><img src=\"{profile_image_url}\"></a></div>',","	","	ENTRY_TEMPLATE:","	'<div class=\"twitter-update\">{img}'+","		'<div class=\"twitter-entry\"><div class=\"writer\">{userTplt}</div>{text} {time}</div>'+","	'</div>',","	","	TIME_TEMPLATE: '<span class=\"twitter-timestamp\">{relativeTime}</span>',","","	USER_TEMPLATE: '<a href=\"{url}\" class=\"twitter-username\">{username}</a>',","	","	TITLE_TEMPLATE:","	'<h3 class=\"twitter-title\">{title} {user}</h3>',","	","	interval: null,","","	initializer: function (config) {","		this.publish({","			data:  { defaultFn: this._defDataFn },","			error: { defaultFn: this._defErrorFn }","		});","		","		this._initJSONPRequest();","","		this.after( {","			usernameChange: this._refreshJSONPRequest,","			countChange   : this._refreshJSONPRequest","		} );","	},","","	_initJSONPRequest: function () {","		var un = this.get('key'),","		obj = {","			count: this.get('count'),","			d:(new Date()).getTime(), ","			key:this.get('isQuery')? un : \"from:\" + un","		},","","		url = Y.Lang.sub(Twitter.SEARCH_API_URI,obj).replace('#','%23');","		","		this._jsonpHandle = new Y.JSONPRequest(url, {","			on: {","				success: this._handleJSONPResponse,","				failure: this._defErrorFn","			},","			context: this","		});","	},","","	_refreshJSONPRequest: function () {","		this._initJSONPRequest();","		this.syncUI();","	},","","	renderUI: function () {","		this.get('contentBox').append('<div class=\"yui3-twitter-hdr\"></div><div class=\"yui3-twitter-bdy\"><ul class=\"twitter-updates' + (this.get('showPhoto')? \" photo\" : \"\") + '\"></ul></div><div class=\"yui3-twitter-ftr\"><div class=\"img\">&nbsp;</div></div>');","		if(this.get('hideSkin')){","			this.get('boundingBox').addClass('noskin');","		}","	},","","	bindUI: function () {","		this.after('usernameChange'      , this.syncUI);","		this.after('countChange'         , this.syncUI);","		this.after('stringsChange'       , this.syncUI);","		this.after('refreshSecondsChange', this._updateInterval);","	},","","	syncUI: function () {","		this._uiUpdateTitle();","		this.update();","","		this._updateInterval();","	},","","	_uiUpdateTitle: function () {","		var cb    = this.get('contentBox').one('.yui3-twitter-hdr'),","			title = cb.one('.twitter-status-title'),","			content, un, qry;","","		if (this.get('includeTitle')) {","			un = this.get('key');","			qry=this.get('isQuery');","			","","			content = Y.Lang.sub(this.TITLE_TEMPLATE, {","				title   : this.get('strings.title'),","				user	: Y.Lang.sub(this.USER_TEMPLATE, {","					username: qry? un : '@' + un,","					url     : qry? Twitter.TREND_URL + un.replace('#','%23') : Twitter.PROFILE_URL + un","				})","			});","","","			if (title) {","				title.replace(content);","			} else {","				cb.prepend(content);","			}","		} else if (title) {","			title.remove();","		}","	},","","	update: function () {","		this._jsonpHandle.send();","	},","","	_handleJSONPResponse: function (data) {","		if (Y.Lang.isObject(data)) {","			this.fire('data', { data: data });","		} else {","			this.fire('error');","		}","	},","","	_defDataFn: function (e) {","		this.get('contentBox').removeClass('twitter-error');","","		this._printEntries(e.data);","	},","","	_printEntries: function (data) {","		var cb      = this.get('contentBox'),","			entries = this._createEntries(data);","","		cb.one('.twitter-updates').","			setContent('<li>' + entries.join('</li><li>') + '</li>');","	},","","	_createEntries: function (resp) {","		var entries = [], data = resp.results || resp, i;","","		for (i = data.length - 1; i >= 0; --i) {","			data[i].relativeTime = Y.toRelativeTime(","				// IE's Date.parse can't handle dates formatted as","				// \"Tue Feb 03 23:02:18 +0000 2009\"","				// but it works without the TZ offset","				new Date(Date.parse(data[i].created_at.replace(/\\+\\d+/,''))));","			","				var screenName = resp.results? data[i].from_user : data[i].user.screen_name;","				//data[i].photo = Twitter.API_URI + screenName;","				data[i].url = Twitter.PROFILE_URL + screenName;","				data[i].username = screenName;","","			entries[i] = this._createEntry(data[i]);","		}","","		return entries;","	},","","	_createEntry: function (entry) {","		var tmp = this.get('showTime');","		var res = Y.Lang.sub(this.ENTRY_TEMPLATE, entry)","					.replace(RE_LINK,'<a href=\"$1\">$1</a>')","					.replace(RE_USERNAME,","						'<a class=\"twitter-acct\" href=\"' +","							Twitter.PROFILE_URL +","						'$1\">@$1</a>')","					.replace(RE_HASH, ","						'<a class=\"twitter-hash\" href=\"' +","							Twitter.TREND_URL	+ ","						'%23$1\"/>#$1</a>'),","		time = this.get('showTime')? Y.Lang.sub(this.TIME_TEMPLATE, entry) : \"\",","		user = this.get('showHandle')? Y.Lang.sub(this.USER_TEMPLATE,entry) : \"\",","		img = this.get('showPhoto')? Y.Lang.sub(this.PHOTO_TEMPLATE,entry) : \"\";","		return Y.Lang.sub(res,{","			img:img,","			userTplt:user,","			time:time","		});","	},","","	_defErrorFn: function () {","		this.get('contentBox').one('ul.twitter-updates').","			addClass('twitter-error').","			setContent('<li><em>' + this.get('strings.error') +'</em></li>');","	},","","	_updateInterval: function () {","		if (this.interval) {","			this.interval.cancel();","		}","","		this.interval = Y.later(","			this.get('refreshSeconds') * 1000,","			this, this.update, null, true);","	}","","}, {","	PROFILE_URL: 'https://twitter.com/#!/',","	","	TREND_URL : 'https://twitter.com/#!/search/',","","	SEARCH_API_URI: 'http://search.twitter.com/search.json?q={key}&count={count}&d={d}&callback={callback}',","	","	ATTRS: {","		/*","		 * Use the key to determin what you are searching for. This can be a twitter username, e.g. freelas_net or a query, e.g. #yui","		 */","		key: {},","","		/*","		 * If the key is a query and not a twitter username, set this to true","		 */","		isQuery: {","			value: false,","			validator: Y.Lang.isBoolean","		},","		","		/*","		 * The number of tweets you want to see","		 */","		count: {","			value: 10,","			validator: Y.Lang.isNumber","		},","","		/*","		 * Refresh frequency in seconds","		 */","		refreshSeconds: {","			value: 300, // 5mins","			validator: Y.Lang.isNumber","		},","","		strings: {","			value: {","				title:  'Latest Updates',","				error:  'Oops!  We had some trouble connecting to Twitter :('","			}","		},","		","		/*","		 * Should we display the tweeter photo?","		 */","		showPhoto:{","			value:true,","			validator: Y.Lang.isBoolean","		},","		","		/*","		 * Should we display the tweeter username with every tweet?","		 */","		showHandle:{","			value:true,","			validator: Y.Lang.isBoolean","		},","","		/*","		 * Should we display the title? This will include the title string plus the supplied Key","		 */","		includeTitle: {","			value: true,","			validator: Y.Lang.isBoolean","		},","		","		/*","		 * Should we hide the skin?","		 */","		 hideSkin:{","			value: false,","			validator: Y.Lang.isBoolean","		 },","		 ","		 /*","		 * Should we show the relative time?","		 */","		 showTime:{","			value: true,","			validator: Y.Lang.isBoolean","		 }","	}","});","","Y.namespace('Twitter').Status = Twitter;","","","}, 'gallery-2012.11.07-21-32' ,{requires:['widget-base','substitute', 'gallery-torelativetime', 'jsonp', 'base-build'], skinnable:true});"];
_yuitest_coverage["/build/gallery-twitter-widget/gallery-twitter-widget.js"].lines = {"1":0,"8":0,"13":0,"32":0,"37":0,"39":0,"46":0,"55":0,"65":0,"66":0,"70":0,"71":0,"72":0,"77":0,"78":0,"79":0,"80":0,"84":0,"85":0,"87":0,"91":0,"95":0,"96":0,"97":0,"100":0,"109":0,"110":0,"112":0,"114":0,"115":0,"120":0,"124":0,"125":0,"127":0,"132":0,"134":0,"138":0,"141":0,"146":0,"148":0,"149":0,"155":0,"157":0,"158":0,"160":0,"163":0,"167":0,"168":0,"181":0,"189":0,"195":0,"196":0,"199":0,"290":0};
_yuitest_coverage["/build/gallery-twitter-widget/gallery-twitter-widget.js"].functions = {"initializer:31":0,"_initJSONPRequest:45":0,"_refreshJSONPRequest:64":0,"renderUI:69":0,"bindUI:76":0,"syncUI:83":0,"_uiUpdateTitle:90":0,"update:119":0,"_handleJSONPResponse:123":0,"_defDataFn:131":0,"_printEntries:137":0,"_createEntries:145":0,"_createEntry:166":0,"_defErrorFn:188":0,"_updateInterval:194":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-twitter-widget/gallery-twitter-widget.js"].coveredLines = 54;
_yuitest_coverage["/build/gallery-twitter-widget/gallery-twitter-widget.js"].coveredFunctions = 16;
_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 1);
YUI.add('gallery-twitter-widget', function(Y) {

/*
 * Twitter: written by Marc Schipperheyn @orangebits.nl
 * Based on the Twitter-Status by Luke Smith
 */

_yuitest_coverfunc("/build/gallery-twitter-widget/gallery-twitter-widget.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 8);
var RE_USERNAME = /@(\w+)/g,
	RE_LINK = /((?:https?|s?ftp|ssh)\:\/\/[^"\s<>]*[^.,;'">\:\s<>\)\]\!])/g,
	RE_HASH = /#(\w+)/g,
	Twitter;

_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 13);
Twitter = Y.Base.create("Twitter", Y.Widget, [], {
	
	PHOTO_TEMPLATE: '<div class="twitter-photo"><a href="{url}"><img src="{profile_image_url}"></a></div>',
	
	ENTRY_TEMPLATE:
	'<div class="twitter-update">{img}'+
		'<div class="twitter-entry"><div class="writer">{userTplt}</div>{text} {time}</div>'+
	'</div>',
	
	TIME_TEMPLATE: '<span class="twitter-timestamp">{relativeTime}</span>',

	USER_TEMPLATE: '<a href="{url}" class="twitter-username">{username}</a>',
	
	TITLE_TEMPLATE:
	'<h3 class="twitter-title">{title} {user}</h3>',
	
	interval: null,

	initializer: function (config) {
		_yuitest_coverfunc("/build/gallery-twitter-widget/gallery-twitter-widget.js", "initializer", 31);
_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 32);
this.publish({
			data:  { defaultFn: this._defDataFn },
			error: { defaultFn: this._defErrorFn }
		});
		
		_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 37);
this._initJSONPRequest();

		_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 39);
this.after( {
			usernameChange: this._refreshJSONPRequest,
			countChange   : this._refreshJSONPRequest
		} );
	},

	_initJSONPRequest: function () {
		_yuitest_coverfunc("/build/gallery-twitter-widget/gallery-twitter-widget.js", "_initJSONPRequest", 45);
_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 46);
var un = this.get('key'),
		obj = {
			count: this.get('count'),
			d:(new Date()).getTime(), 
			key:this.get('isQuery')? un : "from:" + un
		},

		url = Y.Lang.sub(Twitter.SEARCH_API_URI,obj).replace('#','%23');
		
		_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 55);
this._jsonpHandle = new Y.JSONPRequest(url, {
			on: {
				success: this._handleJSONPResponse,
				failure: this._defErrorFn
			},
			context: this
		});
	},

	_refreshJSONPRequest: function () {
		_yuitest_coverfunc("/build/gallery-twitter-widget/gallery-twitter-widget.js", "_refreshJSONPRequest", 64);
_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 65);
this._initJSONPRequest();
		_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 66);
this.syncUI();
	},

	renderUI: function () {
		_yuitest_coverfunc("/build/gallery-twitter-widget/gallery-twitter-widget.js", "renderUI", 69);
_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 70);
this.get('contentBox').append('<div class="yui3-twitter-hdr"></div><div class="yui3-twitter-bdy"><ul class="twitter-updates' + (this.get('showPhoto')? " photo" : "") + '"></ul></div><div class="yui3-twitter-ftr"><div class="img">&nbsp;</div></div>');
		_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 71);
if(this.get('hideSkin')){
			_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 72);
this.get('boundingBox').addClass('noskin');
		}
	},

	bindUI: function () {
		_yuitest_coverfunc("/build/gallery-twitter-widget/gallery-twitter-widget.js", "bindUI", 76);
_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 77);
this.after('usernameChange'      , this.syncUI);
		_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 78);
this.after('countChange'         , this.syncUI);
		_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 79);
this.after('stringsChange'       , this.syncUI);
		_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 80);
this.after('refreshSecondsChange', this._updateInterval);
	},

	syncUI: function () {
		_yuitest_coverfunc("/build/gallery-twitter-widget/gallery-twitter-widget.js", "syncUI", 83);
_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 84);
this._uiUpdateTitle();
		_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 85);
this.update();

		_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 87);
this._updateInterval();
	},

	_uiUpdateTitle: function () {
		_yuitest_coverfunc("/build/gallery-twitter-widget/gallery-twitter-widget.js", "_uiUpdateTitle", 90);
_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 91);
var cb    = this.get('contentBox').one('.yui3-twitter-hdr'),
			title = cb.one('.twitter-status-title'),
			content, un, qry;

		_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 95);
if (this.get('includeTitle')) {
			_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 96);
un = this.get('key');
			_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 97);
qry=this.get('isQuery');
			

			_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 100);
content = Y.Lang.sub(this.TITLE_TEMPLATE, {
				title   : this.get('strings.title'),
				user	: Y.Lang.sub(this.USER_TEMPLATE, {
					username: qry? un : '@' + un,
					url     : qry? Twitter.TREND_URL + un.replace('#','%23') : Twitter.PROFILE_URL + un
				})
			});


			_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 109);
if (title) {
				_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 110);
title.replace(content);
			} else {
				_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 112);
cb.prepend(content);
			}
		} else {_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 114);
if (title) {
			_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 115);
title.remove();
		}}
	},

	update: function () {
		_yuitest_coverfunc("/build/gallery-twitter-widget/gallery-twitter-widget.js", "update", 119);
_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 120);
this._jsonpHandle.send();
	},

	_handleJSONPResponse: function (data) {
		_yuitest_coverfunc("/build/gallery-twitter-widget/gallery-twitter-widget.js", "_handleJSONPResponse", 123);
_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 124);
if (Y.Lang.isObject(data)) {
			_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 125);
this.fire('data', { data: data });
		} else {
			_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 127);
this.fire('error');
		}
	},

	_defDataFn: function (e) {
		_yuitest_coverfunc("/build/gallery-twitter-widget/gallery-twitter-widget.js", "_defDataFn", 131);
_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 132);
this.get('contentBox').removeClass('twitter-error');

		_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 134);
this._printEntries(e.data);
	},

	_printEntries: function (data) {
		_yuitest_coverfunc("/build/gallery-twitter-widget/gallery-twitter-widget.js", "_printEntries", 137);
_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 138);
var cb      = this.get('contentBox'),
			entries = this._createEntries(data);

		_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 141);
cb.one('.twitter-updates').
			setContent('<li>' + entries.join('</li><li>') + '</li>');
	},

	_createEntries: function (resp) {
		_yuitest_coverfunc("/build/gallery-twitter-widget/gallery-twitter-widget.js", "_createEntries", 145);
_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 146);
var entries = [], data = resp.results || resp, i;

		_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 148);
for (i = data.length - 1; i >= 0; --i) {
			_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 149);
data[i].relativeTime = Y.toRelativeTime(
				// IE's Date.parse can't handle dates formatted as
				// "Tue Feb 03 23:02:18 +0000 2009"
				// but it works without the TZ offset
				new Date(Date.parse(data[i].created_at.replace(/\+\d+/,''))));
			
				_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 155);
var screenName = resp.results? data[i].from_user : data[i].user.screen_name;
				//data[i].photo = Twitter.API_URI + screenName;
				_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 157);
data[i].url = Twitter.PROFILE_URL + screenName;
				_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 158);
data[i].username = screenName;

			_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 160);
entries[i] = this._createEntry(data[i]);
		}

		_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 163);
return entries;
	},

	_createEntry: function (entry) {
		_yuitest_coverfunc("/build/gallery-twitter-widget/gallery-twitter-widget.js", "_createEntry", 166);
_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 167);
var tmp = this.get('showTime');
		_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 168);
var res = Y.Lang.sub(this.ENTRY_TEMPLATE, entry)
					.replace(RE_LINK,'<a href="$1">$1</a>')
					.replace(RE_USERNAME,
						'<a class="twitter-acct" href="' +
							Twitter.PROFILE_URL +
						'$1">@$1</a>')
					.replace(RE_HASH, 
						'<a class="twitter-hash" href="' +
							Twitter.TREND_URL	+ 
						'%23$1"/>#$1</a>'),
		time = this.get('showTime')? Y.Lang.sub(this.TIME_TEMPLATE, entry) : "",
		user = this.get('showHandle')? Y.Lang.sub(this.USER_TEMPLATE,entry) : "",
		img = this.get('showPhoto')? Y.Lang.sub(this.PHOTO_TEMPLATE,entry) : "";
		_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 181);
return Y.Lang.sub(res,{
			img:img,
			userTplt:user,
			time:time
		});
	},

	_defErrorFn: function () {
		_yuitest_coverfunc("/build/gallery-twitter-widget/gallery-twitter-widget.js", "_defErrorFn", 188);
_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 189);
this.get('contentBox').one('ul.twitter-updates').
			addClass('twitter-error').
			setContent('<li><em>' + this.get('strings.error') +'</em></li>');
	},

	_updateInterval: function () {
		_yuitest_coverfunc("/build/gallery-twitter-widget/gallery-twitter-widget.js", "_updateInterval", 194);
_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 195);
if (this.interval) {
			_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 196);
this.interval.cancel();
		}

		_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 199);
this.interval = Y.later(
			this.get('refreshSeconds') * 1000,
			this, this.update, null, true);
	}

}, {
	PROFILE_URL: 'https://twitter.com/#!/',
	
	TREND_URL : 'https://twitter.com/#!/search/',

	SEARCH_API_URI: 'http://search.twitter.com/search.json?q={key}&count={count}&d={d}&callback={callback}',
	
	ATTRS: {
		/*
		 * Use the key to determin what you are searching for. This can be a twitter username, e.g. freelas_net or a query, e.g. #yui
		 */
		key: {},

		/*
		 * If the key is a query and not a twitter username, set this to true
		 */
		isQuery: {
			value: false,
			validator: Y.Lang.isBoolean
		},
		
		/*
		 * The number of tweets you want to see
		 */
		count: {
			value: 10,
			validator: Y.Lang.isNumber
		},

		/*
		 * Refresh frequency in seconds
		 */
		refreshSeconds: {
			value: 300, // 5mins
			validator: Y.Lang.isNumber
		},

		strings: {
			value: {
				title:  'Latest Updates',
				error:  'Oops!  We had some trouble connecting to Twitter :('
			}
		},
		
		/*
		 * Should we display the tweeter photo?
		 */
		showPhoto:{
			value:true,
			validator: Y.Lang.isBoolean
		},
		
		/*
		 * Should we display the tweeter username with every tweet?
		 */
		showHandle:{
			value:true,
			validator: Y.Lang.isBoolean
		},

		/*
		 * Should we display the title? This will include the title string plus the supplied Key
		 */
		includeTitle: {
			value: true,
			validator: Y.Lang.isBoolean
		},
		
		/*
		 * Should we hide the skin?
		 */
		 hideSkin:{
			value: false,
			validator: Y.Lang.isBoolean
		 },
		 
		 /*
		 * Should we show the relative time?
		 */
		 showTime:{
			value: true,
			validator: Y.Lang.isBoolean
		 }
	}
});

_yuitest_coverline("/build/gallery-twitter-widget/gallery-twitter-widget.js", 290);
Y.namespace('Twitter').Status = Twitter;


}, 'gallery-2012.11.07-21-32' ,{requires:['widget-base','substitute', 'gallery-torelativetime', 'jsonp', 'base-build'], skinnable:true});

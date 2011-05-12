YUI.add('gallery-inline-xhr', function(Y) {

var version = "0.3.0",
	SCRIPT_NAME = "gallery-inline-xhr",
	cfg = {mode: null, url: null, method: "POST"},
	headers = null,
	groups = {},
	clientMethods = {},
	bound = false,
	spinnerCount = 0,
	EXECUTING = "Executing",
	METHOD = "method",
	RESPONSE_TEXT = "ResponseText",
	UNDEFINED = "undefined",
	BLANK = " ",
	IS_EMPTY = "is empty",
	IN = "in",
	ERROR = "error",
	INFO = "info",
	ALERT = "alert",
	NOT_FOUND = "not found",
	HTML = "HTML",
	CURSOR = "cursor",
	JSON_SYNTAX_ERROR = "JSON syntax error in responseText: ",	
	success =  function(ioId, o){
		
		if(o.responseText !== undefined){
			if(o.responseText.length === 0){
				if(ALERT === cfg.mode){
					alert(RESPONSE_TEXT + BLANK + IS_EMPTY + BLANK + IN + BLANK + SCRIPT_NAME);
				}
				return;
			}
			try{
				var newObj = Y.JSON.parse(o.responseText);
				
				if(newObj.c !== 200){
					var eCode = newObj.c,
					eTxt = newObj.t;
					notifyError(eCode, eTxt);
				}else{
					var i;
					for (i in newObj.ff){
						if(newObj.ff.hasOwnProperty(i)){
							var ob = newObj.ff[i],
							execfunc = ob.f,
							args = ob.a;
							if(!tryYmethod(execfunc, args, ioId, o)){
								if(!tryPrivMethod(execfunc, args, ioId, o)){
									if(ALERT === cfg.mode){
										alert(METHOD + " '" + execfunc + "' " + NOT_FOUND + " in Y or " + SCRIPT_NAME);
									}
								}
							}
						}
					}
				}
			}catch(ex){
				if(ALERT === cfg.mode){
					alert(JSON_SYNTAX_ERROR + o.responseText + BLANK + IN + BLANK + SCRIPT_NAME + ' '+ex);
				}
				return;
			}
		}else{
			if(ALERT === cfg.mode){
				alert(RESPONSE_TEXT + BLANK + UNDEFINED + BLANK + IN + BLANK + SCRIPT_NAME);
			}
		}
	},
	tryYmethod = function (execfunc, args, ioId, o) {
		if(Y[execfunc] === undefined){
			return false;
		}else{
			Y[execfunc](args, ioId, o);
			return true;
		}
	},
	tryPrivMethod = function (execfunc, args, ioId, o) {
		if(clientMethods === undefined){
			return false;
		}
		if(clientMethods[execfunc] !== undefined){
			clientMethods[execfunc](args, ioId, o);
			return true;
		}else{
			return false;
		}
	},
	notifyError = function (c,t){
		if(cfg.mode === ALERT){
			alert("Error response received from server: " + c+ ': ' + t);
		}		
	},
	incrSpinnerCount = function () {
		spinnerCount ++;
	},
	decrSpinnerCount = function () {
		spinnerCount --;
	},	
	getSpinnerCount = function () {
		return spinnerCount;
	},
	setSpinner = function () {
		incrSpinnerCount();
		Y.one(HTML).setStyle(CURSOR,'wait');
	},
	resetSpinner = function () {
		decrSpinnerCount();
		if(0 === getSpinnerCount()){
			Y.one(HTML).setStyle(CURSOR,'default');
		}
	},
	failure = function(ioId, o){
		if(cfg.mode === ALERT){
			var s = "Failure for xhr Id: " + ioId + ".\n";
			s += "HTTP status: " + o.status + "\n";
			s += "HTTP headers received: " + o.getAllResponseHeaders() + "\n";
			s += "Status code message: " + o.statusText + ".";
			alert(s);
		}
	},
	load = function (s_group) {
		if (undefined === groups[s_group]){
			groups[s_group] = {};
		}
		//add method request to the group object, from the private methods
		if(undefined === groups[s_group].request){
			groups[s_group].request = request;
		}
		return groups[s_group];
	},
	request = function () {
		var i;
		for (i in this){
			if(this.hasOwnProperty(i) && i !== 'request'){
				this[i]();
			}
		}
	};

InlineXhr = function () {
	InlineXhr.superclass.constructor.apply(this, arguments);
	
}
InlineXhr.NAME = SCRIPT_NAME;

Y.extend(InlineXhr, Y.Base, {	
	
		register : function (s_group, method, data, formId) {
			var groupObj = load(s_group);
			groupObj[method] = function () {
				cfg.url = cfg.url ? cfg.url : document.location.href;
				var found = false,
				form = null;
				
				if(formId !== undefined){
					form = {id: Y.one(formId),
						useDisabled: false
					};
				}				
				var Yrequest = Y.io(cfg.url, {
					method: cfg.method,
					data: data + "&ajaxAction=" + method,
					form: form,
					on: {
						success: success,
						failure: failure,
						start: setSpinner,
						complete:resetSpinner
					}
				});
			};
			return groupObj;			
		},
		header : function (name, header) {
			Y.io.header.apply(Y, arguments);
		},
		usePrivate : function (method, methodName) {
			clientMethods[methodName] = method;
		},
		setConfig : function (config) {
			//var allowed = {url: 'url', mode: 'mode'},
			var i;
			for (i in config){
				if (config.hasOwnProperty(i)){
					if(cfg[i] === undefined){
						if(config.mode === ALERT){
							alert("Wrong configuration parameter passed to xhr object: " + i);
						}
					}
					cfg[i] = config[i];
				}
			}
		},
		startSpinner : function () {		
			Y.one(HTML).setStyle(CURSOR,'wait');
		},
		stopSpinner : function () {
			if(0 === getSpinnerCount()){
				Y.one(HTML).setStyle(CURSOR,'default');
			}
		}
	});
Y.Base.InlineXhr = InlineXhr;


}, 'gallery-2011.05.12-13-26' ,{optional:['io-form'], requires:['json-parse', 'node', 'io-base', 'base']});

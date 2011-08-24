var SCRIPT_NAME = "inlineXHR",
	cfg = {mode: null, url: null, method: "POST"},
	clientMethods = {},
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
	debugLog = function (txt, level) {
		if(level === ERROR && cfg.mode === ALERT){
			window.alert(txt);
		}
		Y.log(txt , level, SCRIPT_NAME);
	},
	tryYmethod = function (execfunc, args, ioId, o) {
		if(Y[execfunc] === undefined){
			return false;
		}else{
			debugLog(EXECUTING + BLANK + METHOD + " of Y : " + execfunc ,  INFO);
			args.push(ioId,o);
			Y[execfunc].apply(Y,args);
			return true;
		}
	},
	tryPrivMethod = function (execfunc, args, ioId, o) {
		if(clientMethods === undefined){
			return false;
		}
		if(clientMethods[execfunc] !== undefined){
			debugLog(EXECUTING + " private" + BLANK + METHOD + " : " + execfunc ,  INFO);
			args.push(ioId,o);
			clientMethods[execfunc].apply(clientMethods,args);
			return true;
		}else{
			return false;
		}
	},
	notifyError = function (c,t){
		debugLog("Error response received from server: " + c + ": " + t, ERROR);		
	},	
	success =  function(ioId, o){
		
		if(o.responseText !== undefined){
			if(o.responseText.length === 0){
				debugLog(RESPONSE_TEXT + BLANK + IS_EMPTY + '.', ERROR);
				return;
			}
			try{
				var newObj = Y.JSON.parse(o.responseText),
					eCode,
					eTxt,
					i,
					ob,
					execfunc,
					args;
				
				if(newObj.c !== 200){
					eCode = newObj.c;
					eTxt = newObj.t;
					notifyError(eCode, eTxt);
				}else{
					for (i in newObj.ff){
						if(newObj.ff.hasOwnProperty(i)){
							ob = newObj.ff[i];
							execfunc = ob.f;
							args = ob.a;
							/* if args is an array, we could run execfunc.apply(this, args)
							  and in this way pass multiple params to a single func, possibly adding more params to the end of it with
							  args.push()
							  
							  Change inlineXHR(php) in such a way that args is always an array (1 or more elements)
							*/
							if(!tryYmethod(execfunc, args, ioId, o)){
								if(!tryPrivMethod(execfunc, args, ioId, o)){
									debugLog(METHOD + " '" + execfunc + "' " + NOT_FOUND + " in Y or " + SCRIPT_NAME, ERROR);
								}
							}
						}
					}
				}
			}catch(ex){
				debugLog(JSON_SYNTAX_ERROR + o.responseText + BLANK + IN + BLANK + SCRIPT_NAME + ' ' + ex, ERROR);
				return;
			}
		}else{
			debugLog(RESPONSE_TEXT + BLANK + UNDEFINED + BLANK + IN + BLANK + SCRIPT_NAME, ERROR);
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
		Y.all('input').each(
		function(n){
			n.setStyle(CURSOR,'wait');
			}
		);
	},
	resetSpinner = function () {
		decrSpinnerCount();
		if(0 === getSpinnerCount()){
			Y.one(HTML).setStyle(CURSOR,'default');
			Y.all('input').each(
			function(n){
				n.setStyle(CURSOR,'default');
				}
			);
		}
	},
	failure = function(ioId, o){
		var s = "Failure for xhr Id: " + ioId + ".\n";
		s += "HTTP status: " + o.status + "\n";
		s += "HTTP headers received: " + o.getAllResponseHeaders() + "\n";
		s += "Status code message: " + o.statusText + ".";
		debugLog(s, ERROR);
	},
	request = function () {
		var i;
		for (i in this){
			if(this.hasOwnProperty(i) && i !== 'request'){
				this[i]();
			}
		}
	},
	load = function (obj) {
		/* testing what happens if s_group is fixed, it should be ok */
		obj = obj || {};

		//add method request to the group object, from the private methods
		if(undefined === obj.request){
			obj.request = request;
		}
		return obj;
	},
	InlineXhr = function () {
		InlineXhr.superclass.constructor.apply(this, arguments);
		
	};

InlineXhr.NAME = SCRIPT_NAME;

Y.extend(InlineXhr, Y.Base, {	
	
		register : function (obj, method, data, formId) {
			obj = load(obj);
			Y.log("obj is now: " + Y.dump(obj));
			obj[method] = function () {
				cfg.url = cfg.url ? cfg.url : document.location.href.replace(document.location.hash,'');
				var form = null,
					Yrequest;
				
				if(formId !== undefined){
					form = {id: Y.one(formId),
						useDisabled: false
					};
				}				
				Yrequest = Y.io(cfg.url, {
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
			Y.log("Returning: " + Y.dump(obj));
			return obj;			
		},
		header : function (name, header) {
			Y.io.header.apply(Y, arguments);
		},
		usePrivate : function (method, methodName) {
			clientMethods[methodName] = method;
			debugLog("Registering for use private func: " + methodName + " on inlinexhr object.", INFO);
		},
		setConfig : function (config) {
			//var allowed = {url: 'url', mode: 'mode'},
			var i;
			for (i in config){
				if (config.hasOwnProperty(i)){
					if(cfg[i] === undefined){
						debugLog("Wrong configuration parameter passed to xhr object: " + i, ERROR);
					}
					debugLog("Setting : '" + i + "' to '" + config[i] + "'", INFO);
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
		},
		/**
		 * Add some of a widget's selected or all public methods to the xhr
		 * clientMethods and bind them to the widget
		 *
		 * @param {list} l_forceMethods optional: a list of methods to bind. Only use this list
		 */
		bind : function (widget, l_forceMethods) {
			Y.log("bind.", INFO, SCRIPT_NAME);
			var methodName,
				i;
			if(l_forceMethods){
				debugLog("Binding selected methods: " + l_forceMethods, INFO);
				for (i=0; i < l_forceMethods.length;  i++){
					methodName= l_forceMethods[i];
					if(Y.Lang.isFunction(widget[methodName])){
						this.usePrivate(Y.bind(widget[methodName],widget), methodName);
					}else{
						debugLog("Wrong argument passed to inlineXHR::bind: " + methodName, ERROR);
					}
				}
			}else{
				for (i in widget){
					if(0 !== i.indexOf('_')){
						this.usePrivate(widget[i], i);
					}
				}
			}
			if(Y.dump){
				debugLog("Dumping clientMethods: " + Y.dump(clientMethods), INFO);
			}
			
		}
	});
Y.Base.InlineXhr = InlineXhr;
YUI.add('gallery-swfplugin', function(Y) {

/**
 * SWFPlugin is a tool for embedding Flash applications in HTML pages. Optionally
 * integrates with Y.SWF for better performance and to better fit in the 
 * YUI development model.
 *
 * Usage:
 *
 * <pre>YUI().use('swfplugin', function (Y) {
 *   Y.one('#node').plug(Y.SWFPlugin, {
 *     url: '/path/to/my.swf',
 *     flashVars: { var1: 'value' },
 *     params: { wmode: 'opaque' }
 *   });
 * });</pre>
 *
 * @module swfplugin
 * @title SWF Plugin
 * @requires event-custom, node, swfdetect, querystring-stringify, base-build, plugin
 * @optional swf
 */
var Y_Node = Y.Node,
	Y_Lang = Y.Lang,
	Y_SWFDetect = Y.SWFDetect,
	Y_SWFDetect_isFlashVersionAtLeast = Y_SWFDetect.isFlashVersionAtLeast,
	Y_SWF = Y.SWF,
	Y_UA = Y.UA,
	Y_QueryString_stringify = Y.QueryString.stringify,
	Y_Array  = Y.Array,
	Y_Object = Y.Object,

	// events
	WRONG_FLASH_VERSION = "wrongflashversion",
	INVALID_EI_METHOD = "invalidexternalinterfacecall",
	SWF_READY = "swfReady",

	// private
	NAME = 'swfplugin',
	SWF_ID = "swfid",
	HOST = "host",
	HUNDRED_PCT = "100%",
	FLASH_CID = "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000",
	FLASH_TYPE = "application/x-shockwave-flash",
	EXPRESS_INSTALL_URL = "http://fpdownload.macromedia.com/pub/flashplayer/update/current/swf/autoUpdater.swf?" + Math.random(),
	EVENT_HANDLER = "SWF.eventHandler",
	POSSIBLE_PARAMS = {align:"", allowFullScreen:"", allowNetworking:"", allowScriptAccess:"", base:"", bgcolor:"", menu:"", name:"", quality:"", salign:"", scale:"", tabindex:"", wmode:"", flashVars: "", movie: ""};

function sanitize(string) {
	return string.replace(/"/g, "&quot;");
}

function setVersionValue(val, index) {
	this[index] = parseInt(val, 10);
}

/**
 * Technique inspired by MIT-licensed swfobject helps close
 * open audio/video streams and NetConnections.
 * http://code.google.com/p/swfobject/source/browse/trunk/swfobject/src/swfobject.js
 */
function readyToDestroy(swf) {
	var key;
	if (Y_Lang.isNull(swf)) {
		return;
	}
	else if (swf.readyState === 4) {
		// Y.Object.each doesn't work on nodes in IE nor does hasOwnProperty
		for (key in swf) {
			if (Y_Lang.isFunction(swf[key])) {
				swf[key] = null;
			}
		}
		if (swf.parentNode) {
			swf.parentNode.removeChild(swf);
		}
	}
	else {
		Y.later(10, null, readyToDestroy, swf);
	}
}

function ieSWFDestructor () {
	var swf = Y_Node.getDOMNode(this._swf);
	swf.style.display = 'none';
	readyToDestroy(swf);
	this._cleanup(this);
} 

function swfDestructor () {
	this._swf.remove(true);
	this._cleanup(this);
}

// Apparently IE doesn't like w3c dom insertion methods
function ieWriteSWFtoPage(host, objstring) {
	var h = Y_Node.getDOMNode(host);
	h.innerHTML = objstring;
	return host.one('*');
}

function writeSWFtoPage(host, objstring) {
	var swf = Y_Node.create(objstring);
	host.append(swf);
	return swf;
}

// If Y.SWF isn't loaded, add in event handling normally handled by Y.SWF
if (Y_Lang.isUndefined(Y_SWF)) {
	Y_SWF = {
		/**
		 * @private
		 * The static collection of all instances of the SWFs on the page.
		 * @property _instances
		 * @type Object
		 */
		_instances: {},
		/**
		 * @private
		 * Handles an event coming from within the SWF and delegate it
		 * to a specific instance of SWF.
		 * @method eventHandler
		 * @param swfid {String} the id of the SWF dispatching the event
		 * @param event {Object} the event being transmitted.
		 */
		eventHandler: function (swfid, event) {
			Y_SWF._instances[swfid]._eventHandler(event);
		}
	};
	Y.SWF = Y_SWF;
}
else {
	/**
	 * Add a destructor to Y.SWF in order to remove chances of
	 * memory leaks.
	 */
	Y.augment(Y_SWF, {
		destroy: Y_UA.ie ? ieSWFDestructor : swfDestructor,
		_cleanup: function () {
			this.detachAll();
			delete this._swf;
			delete Y_SWF._instances[this._id];
		}
	});
}

/**
 * Clean up undestroyed instances before page unload.
 */
Y.once('beforeunload', function (event) {
	Y.Object.each(Y_SWF._instances, function (instance) {
		instance.destroy();
	});
});

/**
 * Plugs a SWF instance into a node
 *
 * @class SWFPlugin
 * @extends Plugin.Base
 */

/**
 * The NAME of the SWFPlugin class. Used to prefix events generated
 * by the plugin class.
 *
 * @property SWFPlugin.NAME
 * @static
 * @type String
 * @default "swfplugin"
 */
Y.SWFPlugin = Y.Base.create(NAME, Y.Plugin.Base, [], {

	/**
	 * Initializes the plugin.
	 *
	 * @method initializer
	 * @param config {Object} A configuration object to override default ATTR values.
	 */
	initializer: function (config) {
		this.publish(WRONG_FLASH_VERSION, {
			fireOnce: true,
			emitFacade: true
		});
		this.publish(INVALID_EI_METHOD, {
			emitFacade: true
		});
		this.publish(SWF_READY, {
			fireOnce: true,
			emitFacade: true
		});
		if (this.get('write')) {
			this.writeSWF(true);
		}
	},
	
	_writeSWFtoPage: Y_UA.ie ? ieWriteSWFtoPage : writeSWFtoPage,

	/**
	 * Writes the swf to the page. Only required if the write
	 * attr is set to false.
	 * @method writeSWF
	 * @param destroy {Boolean} Whether the host's current content should be destroyed.
	 */
	writeSWF: function (destroy) {
		var host = this.get(HOST),
			id = this.get(SWF_ID),
			isFlashVersionRight  = Y_SWFDetect_isFlashVersionAtLeast.apply(null, this.get("minVersion")),
			shouldExpressInstall = (!isFlashVersionRight) && Y_SWFDetect_isFlashVersionAtLeast(8, 0, 0) && this.get('useExpressInstall'),
			flashURL = shouldExpressInstall ? EXPRESS_INSTALL_URL : this.get('url'),
			objstring = '<object class="yui3-' + NAME + '"',
			attributes, params;

		if (!destroy) {
			// save the original content
			this._originalContent = host.get('children');
		}
		host.empty(destroy);

		if ((isFlashVersionRight || shouldExpressInstall) && flashURL) {

			// connet to Y.SWF event bridge
			Y.SWF._instances[id] = this;

			// put together pre-existing attributes 
			attributes = {
				id: id,
				width: HUNDRED_PCT,
				height: HUNDRED_PCT
			};
			params = Y.merge({
				flashVars: Y_QueryString_stringify(Y.merge({
					yId: Y.id,
					YUISwfId: id,
					YUIBridgeCallback: EVENT_HANDLER,
					allowedDomain: document.location.hostname
				}, this.get('flashVars')))
			}, this.get('params'));

			// do a little browser dance
			if (Y_UA.ie) {
				attributes.classid = FLASH_CID;
				params.movie = flashURL;
			}
			else {
				attributes.type = FLASH_TYPE;
				attributes.data = flashURL;
			}

			// generate the HTML string
			Y_Object.each(attributes, function (value, key) {
				objstring += ' ' + sanitize(key) + '="' + sanitize(value) + '"';
			});
			objstring += '>';
			Y_Object.each(params, function (value, key) {
				if (Y_Object.owns(POSSIBLE_PARAMS, key)) {
					objstring += '<param name="' + sanitize(key) + '" value="' + sanitize(value) + '"/>';
				}
			});
			objstring += "</object>";

			// write the string to the DOM
			this._swf = this._writeSWFtoPage(host, objstring);
		}
	    else {
			this.fire(WRONG_FLASH_VERSION, {
				required: this.get('version').join("."),
				actual: Y_SWFDetect.getFlashVersion()
			});
		}
	},

	/**
	 * @private
	 * Propagates a specific event from Flash to JS. Aped from Y.SWF
	 * @method _eventHandler
	 * @param event {Object} The event to be propagated from Flash.
	 */
	_eventHandler: function(event) {
		switch (event.type) {
		case SWF_READY:
			this.fire(SWF_READY, event);
			break;
		case "log":
			break;
		default:
			this.fire(event.type, event);
		}
	},

	/**
	 * Calls a specific function exposed by the SWF's ExternalInterface.
	 * Aped from Y.SWF
	 * @method callSWF
	 * @param sMethod {String} the name of the function to call
	 * @param aArgs {Object} the set of arguments to pass to the function. Optional.
	 * @return {Object} the return value of the External Interface Method.
	 */
	callSWF: function (sMethod, aArgs) {
		var args   = Y_Lang.isArray(aArgs) ? aArgs : [],
			node   = Y_Node.getDOMNode(this._swf),
			method = node[sMethod];

		if (!Y_Lang.isFunction(method)) {
			this.fire(INVALID_EI_METHOD, sMethod);
		}
		
		return method.apply(node, args);
	},

	/**
	 * Remove internal references and event listeners.
	 * if writeSWF() was called with destroy = false, will
	 * replace the SWF with original source content.
	 *
	 * @method destructor
	 */
	destructor: Y_UA.ie ? ieSWFDestructor : swfDestructor,

	/**
	 * Finishes clean up process after IE/NS code fork.
	 * 
	 * @private
	 * @method _cleanup
	 */
	_cleanup: function () {
		delete this._swf;
		delete Y_SWF._instances[this.get(SWF_ID)];
		if (this._originalContent) {
			this.get(HOST).setContent(this._originalContent);
			delete this._originalContent;
		}
	}

}, {
    /**
     * Notification event fired when trying to embed a SWF
	 * when the browser does not have the required Flash version.
     *
     * @event swfplugin:wrongflashversion
     * @preventable false
     * @param {EventFacade} e The Event Facade
     */
	/**
	 * Event constant for wrongflashversion
	 *
	 * @property SWFPlugin.WRONG_FLASH_VERSION
	 * @static
	 * @type String
	 * @default "wrongflashversion"
	 */
	WRONG_FLASH_VERSION: WRONG_FLASH_VERSION,
    /**
     * Notification event fired when trying to embed attempting to
	 * call an external interface method that is not available.
     *
     * @event swfplugin:invalidexternalinterfacecall
     * @preventable false
     * @param {EventFacade} e The Event Facade
     */
	/**
	 * Event constant for invalidexternalinterfacecall
	 *
	 * @property SWFPlugin.INVALID_EI_METHOD
	 * @static
	 * @type String
	 * @default "invalidexternalinterfacecall"
	 */
	INVALID_EI_METHOD: INVALID_EI_METHOD,
    /**
     * Notification event fired when the plugged in swf is embedded
	 * and ready to be interacted with.
     *
     * @event swfplugin:swfReady
     * @preventable false
     * @param {EventFacade} e The Event Facade
     */
	/**
	 * Event constant for swfReady
	 *
	 * @property SWFPlugin.SWF_READY
	 * @static
	 * @type String
	 * @default "swfReady"
	 */
	SWF_READY: SWF_READY,
	/**
	 * The namespace for the plugin. This will be the property on the widget, which will 
	 * reference the plugin instance, when it's plugged in.
	 *
	 * @property SWFPlugin.NS
	 * @static
	 * @type String
	 * @default "swf"
	 */
	NS: 'swf',
	ATTRS: {
		/**
		 * ID for the <code>&lt;object /&gt;</code> element generated by the
		 * plugin.
		 *
		 * @attribute id
		 * @writeOnce
		 * @default Generated using guid()
		 * @type String
		 */
		swfid: {
			valueFn: function () {
				return Y.guid();
			},
			writeOnce: true,
			value: null
		},
		/**
		 * URL for the SWF application to be embedded.
		 *
		 * @attribute url
		 * @default null
		 * @type String
		 */
		url: {
			value: ""
		},
		/**
		 * @attribute write
		 * @writeOnce
		 * @default true
		 * @type boolean
		 */
		write: {
			value: true,
			writeOnce: true
		},
		/**
		 * Whether or not the SWF Plugin should attempt to use
		 * Express Install to update the Flash player if its version
		 * is incompatible.
		 * 
		 * @attribute useExpressInstall
		 * @default false
		 * @type boolean
		 */
		useExpressInstall: {
			value: false
		},
		/**
		 * Minimum Flash version required to view the SWF.
		 * Accept values: "10.0.22", 10.1, [9, 0, 0]
		 * 
		 * @attribute minVersion
		 * @default [10, 0, 22]
		 * @type Array
		 */
		minVersion: {
			value: [10, 0, 22],
			setter: function (value) {
				var aValue = value;

				if (!Y_Lang.isArray(value)) {
					aValue = [0, 0, 0];
					Y_Array.each((value + "").split('.'), setVersionValue, aValue);
				}
				return aValue;
			}
		},
		/**
		 * Values to configure how the SWF renders on the HTML page. Possible values include
		 * <code>align, allowFullScreen, allowNetworking, allowScriptAccess, base,
		 * bgcolor, menu, name, quality, salign, scale, tabindex, wmode</code>.
		 * 
		 * @attribute params
		 * @default { wmode: 'opaque', allowScriptAccess: 'always' }
		 * @type Object
		 */
		params: {
			valueFn: function () {
				return {
					wmode: 'opaque',
					allowScriptAccess: 'always'
				};
			}
		},
		/**
		 * Runtime arguments to supply to the SWF.
		 * 
		 * @attribute flashVars
		 * @default null
		 * @type Object
		 */
		flashVars: {
			value: {}
		}
	}
});


}, '@VERSION@' ,{requires:['event-custom', 'node', 'swfdetect', 'querystring-stringify', 'base-build', 'plugin'], skinnable:false, optional:['swf']});

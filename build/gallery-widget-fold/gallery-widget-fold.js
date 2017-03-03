YUI.add('gallery-widget-fold', function(Y) {


	/**
	 * Y.WidgetFoldPlugin
	 * 
	 * Plug in to an instance of a Widget (or any PluginHost with a
	 * srcNode attr and a render method) to cause it to automatically
	 * render when it's within the viewport.
	 *
	 * Written by Ryan Cannon <http://ryancannon.com/>
	 */
	var YLang = Y.Lang,
	    FOLD_DISTANCE = "foldDistance",
		CACHE_V_POSITION = "cacheVerticalPosition",
		HOST = "host",
		RENDERED = "rendered",
		ATTRS = {};

    /**
     * The distance from the bottom of the viewport before automatically
     * rendering the widget.
     * @config foldDistance
     * @type Number
     */
	ATTRS[FOLD_DISTANCE] = {
		value: -1,
		validator: YLang.isNumber
	};
    /**
     * If true, WidgetFoldPlugin only request the Y position of the
     * widget once, otherwise it will request the value every time
     * the user scrolls (not recommended).
     * @config cacheVerticalPosition
     * @type Boolean
     */
	ATTRS[CACHE_V_POSITION] = {
		value: true
	};

	Y.WidgetFoldPlugin = Y.Base.create("widget-fold", Y.Plugin.Base, [], {
		initializer: function (config) {
			var host = this.get(HOST),
				check = Y.bind("_foldCheck", this);
			
			// only do anything if the host isn't already rendered
			if (! host.get(RENDERED)) {
				this._renderedHandler = host.on(RENDERED + "Change", this.destructor, this);
				this._scrollHandler = Y.on("scroll", check, window);
				this._resizeHandler = Y.on("resize", check, window);
				this._foldCheck();
			}
		},
	    /**
	     * When called, clear the cached vertical position value.
	     * call this is the srcNode's location changes on the page.
	     * @method cacheVerticalPosition
	     * @type Boolean
	     * @chainable
	     */
		clearVerticalPositionCache: function () {
			this._vPos = 0;
			return this;
		},
		_vPos: 0,
		_foldCheck: function () {
			var host = this.get(HOST),
				distance = this.get(FOLD_DISTANCE),
				vBottom = Y.DOM.viewportRegion().bottom,
				vPos;
			
			// if we have a vertical position already and we want to cache it, use that
			if (this._vPos && this.get(CACHE_V_POSITION)) {
				vPos = this._vPos;
			// otherwise get the vPos and cache it
			} else {
				vPos = this._vPos = host.get("srcNode").getY();
			}

			// if the vertical position is less than the fold distance away from the
			// page bottom, render the host
			if (vPos < vBottom + distance) {
				this.destructor();
				host.render();
			}
		},
		destructor: function () {
			this._renderedHandler.detach();
			this._scrollHandler.detach();
			this._resizeHandler.detach();
		}
	}, {
		NS: "foldcheck",
		ATTRS: ATTRS
	});


}, '@VERSION@' ,{requires:['plugin', 'base-build']});

var L = Y.Lang;

Y.Plugin.TransitionOverlay = Y.Base.create("overlayTransitionPlugin", Y.Plugin.Base, [], {

    _showing : false,
    _argsShow : null,
    _argsHide : null,

    initializer : function(config) {
        this.doBefore("_uiSetVisible", this._uiAnimSetVisible); // Override default _uiSetVisible method

        var host = this.get("host"),
            bb = host.get("boundingBox"),
            duration = this.get("duration"),
            easing = this.get("easing");
        
        this.publish("start", { preventable : false });
        this.publish("end",   { preventable : false });
        
        this._argsShow = Y.merge({ duration : duration, easing : easing }, this.get("show"));
        this._argsHide = Y.merge({ duration : duration, easing : easing }, this.get("hide"));
        
        //hack around some limitations in the transition module, also support both 3.2.0pr1 & 3.2.0 events (changed between them)
        bb.on([ "transition:start", "transitionstart" ], Y.bind(function(o) {
            this.fire("start", this._showing);
            
            if(this._showing) {
                this._uiSetVisible(true);
            }
        }, this));

        bb.on([ "transition:end", "transitionend" ], Y.bind(function(o) {
            this.fire("end", this._showing);
            
            if(!this._showing) {
                this._uiSetVisible(false);
            }
        }, this));
        
        //if the first visible change is from hidden to showing, handle that
        if(this.get("styleOverride")) {
            host.once("visibleChange", function(o) {
                if(o.newVal && !o.prevVal) {
                    this._applyDefaultStyle();
                }
            }, this);
        }
    },

    destructor : function() {
        this._argsShow = this._argsHide = null;
    },
    
    _applyDefaultStyle : function() {
        var hide = this.get("hide"),
            host = this.get("host"),
            bbox = host.get("boundingBox");
        
        //apply default hidden style
        if(!host.get("visible")) {
            bbox.setStyles(hide);
        }
    },
    
    _uiAnimSetVisible : function(val) {
        var host = this.get("host");
        
        if (host.get("rendered")) {
            this._showing = val;
            
            host.get("boundingBox").transition((val) ? this._argsShow : this._argsHide);
            
            return new Y.Do.Prevent("AnimPlugin prevented default show/hide");
        }
    },

    /*
     * The original Widget _uiSetVisible implementation
     */
    _uiSetVisible : function(val) {
        var host = this.get("host");
        
        host.get("boundingBox").toggleClass(host.getClassName("hidden"), !val);
    }
}, {
    NS : "transitionPlugin",
    ATTRS : {
        duration : { value : 0.25 },
        easing : { value : "ease-in" },
        
        styleOverride : { 
            value : true,
            validator : L.isBoolean
        },
        
        hide : {
            value : { opacity : 0 },
            setter : function(value) {
                return Y.merge(this.get("duration"), value);
            }
        },

        show : {
            value : { opacity : 1 },
            setter : function(value) {
                return Y.merge(this.get("duration"), value);
            }
        }
    }
});
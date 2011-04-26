YUI.add('gallery-overlay-transition', function(Y) {

YUI.add("gallery-overlay-transition", function(Y) {
    var L = Y.Lang;

    Y.Plugin.TransitionOverlay = Y.Base.create("overlayTransitionPlugin", Y.Plugin.Base, [], {

        _showing : false,
        _styleCache : {},

        initializer : function(config) {
            this.doBefore("_uiSetVisible", this._uiAnimSetVisible); // Override default _uiSetVisible method
            
            this._host = this.get("host");
            this._bb = this._host.get("boundingBox");
            
            this.publish("start", { preventable : false });
            this.publish("end",   { preventable : false });
            
            //if the first visible change is from hidden to showing, handle that
            if(this.get("styleOverride")) {
                this._host.once("visibleChange", function(o) {
                    if(o.newVal && !o.prevVal) {
                        this._applyDefaultStyle();
                    }
                }, this);
            }
        },
        
        destructor : function() {
            this._host = this._bb = null;
        },
        
        _applyDefaultStyle : function() {
            var hide = this.get("hide"),
                bb = this._bb;
            
            //cache the previous versions of our style
            Y.each(hide, Y.bind(function(v, p) {
                this._styleCache[p] = bb.getComputedStyle(p);
            }, this));
            
            //apply default hidden style
            if(!this._host.get("visible")) {
                bb.setStyles(hide);
            }
        },
        
        _uiAnimSetVisible : function(val) {
            var host = this._host,
                showing;
            
            if (host.get("rendered")) {
                this._showing = val;
                
                this.fire("start", val);
                
                if(val) {
                    this._uiSetVisible(true);
                }
                
                this._bb.transition((val) ? this.get("show") : this.get("hide"), Y.bind(function() {
                    this.fire("end", val);
                
                    if(!val) {
                        this._uiSetVisible(false);
                    }
                }, this));
                
                return new Y.Do.Prevent("AnimPlugin prevented default show/hide");
            }
        },

        /*
         * The original Widget _uiSetVisible implementation
         */
        _uiSetVisible : function(val) {
            this._bb.toggleClass(this._host.getClassName("hidden"), !val);
        }
    }, {
        NS : "transitionPlugin",
        ATTRS : {
            duration : { value : 0.25 },
            
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

}, "gallery-2011.03.23-22-20", { requires : [ "base-build", "plugin", "event-custom", "transition" ] });


}, 'gallery-2011.03.23-22-20' ,{requires:['plugin','overlay','event-custom','transition']});

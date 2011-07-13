YUI.add("overlay-transition-tests", function(Y) {

    var plugin = Y.Plugin.TransitionOverlay;

    Y.namespace('Tests').OverlayTransition = new Y.Test.Suite('Overlay Transition Tests').add(
        new Y.Test.Case({
            setUp : function() {
                this.overlay = new Y.Overlay({
                    width : "500px",
                    bodyContent : "Overlay Content",
                    render : true,
                    centered : true,
                    visible : false
                });
            },
            
            tearDown : function() {
                this.overlay.destroy();
                
                this.overlay = null;
                delete this.overlay;
            },
            
            'default should adjust opacity' : function() {
                this.overlay.plug(plugin);
                
                Y.Assert.areEqual(1, this.overlay.transitionPlugin.get("show.opacity"));
                Y.Assert.areEqual(0, this.overlay.transitionPlugin.get("hide.opacity"));
            },
            
            'events should fire as expected' : function() {
                var start = false;
                
                this.overlay.plug(plugin);
                
                this.overlay.transitionPlugin.on("start", function() {
                    start = true;
                });
                
                this.overlay.transitionPlugin.on("end", function() {
                    this.resume(function() {
                        Y.assert(start, "start method didn't fire");
                    });
                }, this);
                
                this.overlay.show();
                
                this.wait(1000);
            },
            
            'other properties should work' : function() {
                this.overlay.plug(plugin, { 
                    show : { 
                        height : "400px" 
                    }, 
                    hide : { 
                        height : 0 
                    } 
                });
                
                Y.Assert.areEqual("400px", this.overlay.transitionPlugin.get("show.height"));
                Y.Assert.areEqual(0, this.overlay.transitionPlugin.get("hide.height"));
            },
            
            'global attributes should be mixed into show/hide properly' : function() {
                this.overlay.plug(plugin, {
                    duration : 1,
                    easing : "ease-out"
                });
                
                Y.Assert.areEqual(1, this.overlay.transitionPlugin.get("show.duration"));
                Y.Assert.areEqual(1, this.overlay.transitionPlugin.get("hide.duration"));
                Y.Assert.areEqual("ease-out", this.overlay.transitionPlugin.get("show.easing"));
                Y.Assert.areEqual("ease-out", this.overlay.transitionPlugin.get("hide.easing"));
            },
            
            'per-transition duration should override global duration' : function() {
                this.overlay.plug(plugin, {
                    show : {
                        opacity : 1,
                        duration : 1
                    }
                });
                
                Y.Assert.areEqual(1, this.overlay.transitionPlugin.get("show.duration"));
            },
            
            'overlay.show() should transition the form' : function() {
                this.overlay.plug(plugin);
                
                this.overlay.show();
                
                this.wait(function() {
                    Y.assert(this.overlay.get("visible"), "Overlay should be visible");
                    Y.assert(this.overlay.get("boundingBox").getComputedStyle("opacity") == 1, "Opacity should be 1");
                    Y.assert(!this.overlay.get("boundingBox").hasClass(this.overlay.getClassName("hidden")), "Overlay shouldn't have hidden class");
                }, 500);
            },
            
            'overlay.hide() should transition the form' : function() {
                this.overlay.plug(plugin, { 
                    show : {
                        duration : 0
                    }
                });
                
                this.overlay.show();
                this.overlay.hide();
                
                this.wait(function() {
                    Y.assert(!this.overlay.get("visible"));
                    Y.assert(this.overlay.get("boundingBox").getComputedStyle("opacity") == 0);
                    Y.assert(this.overlay.get("boundingBox").hasClass(this.overlay.getClassName("hidden")));
                }, 500);
            },
            
            'disabling styleOverride should work' : function() {
                this.overlay.plug(plugin, { styleOverride : false });
                
                this.overlay.show();
                
                this.wait(function() {
                    Y.assert(this.overlay.get("visible"));
                    Y.assert(this.overlay.get("boundingBox").getComputedStyle("opacity") == 1);
                    Y.assert(!this.overlay.get("boundingBox").hasClass(this.overlay.getClassName("hidden")));
                }, 500);
            }
        }));
}, "@VERSION@", { requires : [ 
    "test",
    "overlay",
    "gallery-overlay-transition"
] });
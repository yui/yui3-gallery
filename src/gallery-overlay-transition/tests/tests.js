YUI.add("overlay-transition-tests", function(Y) {

    Y.namespace('Tests').OverlayTransition = new Y.Test.Suite('Overlay Transition Tests').add(
        new Y.Test.Case({
            setUp : function() {
                this.overlay = new Y.Overlay({
                    width : "300px",
                    bodyContent : "Overlay Content",
                    render : true,
                    centered : true,
                    visible : false
                });
            },
            
            tearDown : function() {
                this.overlay.destroy();
                this.overlay = null;
            },
            
            'default should adjust opacity' : function() {
                var test = this;
                
                this.overlay.plug(Y.Plugin.TransitionOverlay);
                this.overlay.show();
                
                //requires nested .wait calls because transitions don't destroy cleanly
                this.wait(function() {
                    var opacity = test.overlay.get("boundingBox").getComputedStyle("opacity");
                    
                    test.wait(function() {
                        Y.assert( opacity < 1 && opacity > 0, "Opacity wasn't within 0-1");
                    }, 300);
                }, 100);
            },
            
            'events should fire as expected' : function() {
                var start = false,
                    test = this;
                
                this.overlay.plug(Y.Plugin.TransitionOverlay);
                
                this.overlay.transitionPlugin.on("start", function() {
                    start = true;
                });
                
                this.overlay.transitionPlugin.on("end", function() {
                    test.resume(function() {
                        Y.assert(start, "start method didn't fire");
                    });
                });
                
                this.overlay.show();
                
                this.wait(1000);
            },
            
            'other properties should work' : function() {
                var test = this;
                
                this.overlay.plug(Y.Plugin.TransitionOverlay, { show : { height : "400px" }, hide : { height : 0 } });
                
                this.overlay.show();
                
                //requires nested .wait calls because transitions don't destroy cleanly
                this.wait(function() {
                    var height = parseInt(test.overlay.get("boundingBox").getComputedStyle("height"), 10);
                    
                    test.wait(function() {
                        Y.assert(height > 0, "Height should be > 0, was " + height);
                        Y.assert(height < 400, "Height should be less than the max, was " + height);
                    }, 300);
                }, 100);
            },
            
            'overlay.show() should work' : function() {
                var test = this;
                
                this.overlay.plug(Y.Plugin.TransitionOverlay);
                
                this.overlay.show();
                
                this.wait(function() {
                    Y.assert(test.overlay.get("visible"), "Overlay should be visible");
                    Y.assert(test.overlay.get("boundingBox").getComputedStyle("opacity") == 1, "Opacity should be 1");
                    Y.assert(!test.overlay.get("boundingBox").hasClass(test.overlay.getClassName("hidden")), "Overlay shouldn't have hidden class");
                }, 300);
            },
            
            'overlay.hide() should work' : function() {
                var test = this;
                
                this.overlay.plug(Y.Plugin.TransitionOverlay);
                
                this.overlay.show();
                this.overlay.hide();
                
                this.wait(function() {
                    Y.assert(!test.overlay.get("visible"), "Overlay should be visible");
                    Y.assert(test.overlay.get("boundingBox").getComputedStyle("opacity") == 0, "Opacity should be 0");
                    Y.assert(test.overlay.get("boundingBox").hasClass(test.overlay.getClassName("hidden")), "Overlay should have hidden class");
                }, 300);
            },
            
            'disabling styleOverride should work' : function() {
                var test = this;
                
                this.overlay.plug(Y.Plugin.TransitionOverlay, { styleOverride : false });
                
                this.overlay.show();
                
                this.wait(function() {
                    Y.assert(test.overlay.get("visible"), "Overlay should be visible");
                    Y.assert(test.overlay.get("boundingBox").getComputedStyle("opacity") == 1, "Opacity should be 1");
                    Y.assert(!test.overlay.get("boundingBox").hasClass(test.overlay.getClassName("hidden")), "Overlay shouldn't have hidden class");
                }, 300);
            },
            
            'specifying a duration should work' : function() {
                var test = this,
                    opacity;
                
                this.overlay.plug(Y.Plugin.TransitionOverlay, { duration : 1 });
                
                this.overlay.show();
                
                Y.later(300, null, function() {
                    opacity = test.overlay.get("boundingBox").getComputedStyle("opacity");
                    
                    Y.assert(test.overlay.get("visible"), "Overlay should be visible");
                    Y.assert(opacity > 0 && opacity < 1, "Opacity shouldn't be 1");
                    Y.assert(!test.overlay.get("boundingBox").hasClass(test.overlay.getClassName("hidden")), "Overlay shouldn't have hidden class");
                });
                
                this.wait(function() {
                    Y.assert(test.overlay.get("boundingBox").getComputedStyle("opacity") == 1, "Opacity shouldn't be 1");
                }, 1100);
            },
            
            'setting the easing attribute should not break things' : function() {
                var test = this,
                    opacity;
                
                this.overlay.plug(Y.Plugin.TransitionOverlay, { easing : "linear" });
                
                this.overlay.show();
                
                Y.later(100, null, function() {
                    opacity = test.overlay.get("boundingBox").getComputedStyle("opacity");
                    
                    Y.assert(opacity > 0 && opacity < 1, "Opacity shouldn't be 1");
                });
                
                Y.later(200, null, function() {
                    opacity = test.overlay.get("boundingBox").getComputedStyle("opacity");
                    
                    Y.assert(opacity > 0 && opacity < 1, "Opacity shouldn't be 1");
                });
                
                //no-op to give transition time to complete
                this.wait(function() { }, 300);
            }
        }));
}, "@VERSION@", { requires : [ "gallery-overlay-transition", "test" ] });
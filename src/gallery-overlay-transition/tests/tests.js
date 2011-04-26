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
                this.overlay.get("boundingBox").setStyle({ opacity : 0 });
                
                this.overlay.plug(Y.Plugin.TransitionOverlay);
                this.overlay.show();
                
                this.wait(function() {
                    var opacity = parseInt(this.overlay.get("boundingBox").getComputedStyle("opacity"), 10);
                    
                    Y.assert( opacity === 1, "Opacity wasn't 1");
                }, 1000);
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
                
                this.wait(function() {
                    var height = parseInt(test.overlay.get("boundingBox").getComputedStyle("height"), 10);
                    
                    Y.assert(height > 0, "Height should be > 0, was " + height);
                    Y.assert(height < 400, "Height should be less than the max, was " + height);
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
            }
        }));
}, "@VERSION@", { requires : [ "gallery-overlay-transition", "test" ] });
YUI.add("generic-anim-tests", function(Y) {
	
    Y.namespace("GenericAnim").Tests = new Y.Test.Case({
		name : "Generic Anim Tests",
		
        // SET UP
		setUp : function() {
            this.anim = new Y.GenericAnim();
        },
        
        tearDown : function() {
            this.anim.destroy();
            this.anim = null;
        },
        
        "'start' event should fire" : function() {
            this.anim.on("start", function() {
                this.resume(function() {
                    Y.assert(true);
                });
            }, this);
            
            this.anim.run();
            
            this.wait(2000);
        },
        
        "'step' event should fire" : function() {
            this.anim.on("step", function() {
                this.resume(function() {
                    Y.assert(true);
                });
            }, this);
            
            this.anim.run();
            
            this.wait(2000);
        },
        
        "'complete' event should fire" : function() {
            this.anim.on("complete", function() {
                this.resume(function() {
                    Y.assert(true);
                });
            }, this);
            
            this.anim.run();
            
            this.wait(2000);
        },
        
        "'end' event should fire" : function() {
            var end;
            
            this.anim.on("end", function() {
                end = true;
            });
            
            this.anim.run();
            
            this.wait(function() {
                Y.assert(end, "End event flag wasn't set");
            }, 700);
        },
        
        "'stopped' event should fire" : function() {
            var stopped;
            
            this.anim.on("stopped", function() {
                stopped = true;
            });
            
            this.anim.run();
            this.anim.stop();
            
            this.wait(function() {
                Y.assert(stopped, "Stopped value wasn't changed");
            }, 100);
        },
        
        "'end' event should fire after calling .stop()" : function() {
            var end;
            
            this.anim.on("end", function() {
                end = true;
            }, this);
            
            this.anim.run();
            this.anim.stop();
            
            this.wait(function() {
                Y.assert(end, "End event flag wasn't set");
            }, 100);
        },
        
        "'step' should fire the expected number of times" : function() {
            var steps = 0;
            
            this.anim.on("step", function() {
                steps++;
            }, this);
            
            this.anim.on("complete", function() {
                this.resume(function() {
                    Y.Assert.areEqual(steps, 10, "Should've seen 10 steps");
                });
            }, this);
            
            this.anim.run();
            
            this.wait(2000);
        },
        
        "run method should start anim execution" : function() {
            this.anim.on("step", function() {
                this.resume(function() {
                    Y.assert(true);
                });
            }, this);
            
            this.anim.run();
            
            this.wait(100);
        },
        
        "stop method should halt anim execution" : function() {
            var steps = 0,
                stopped;
            
            this.anim.on("stopped", function() {
                stopped = true;
            }, this);
            
            this.anim.on("step", function() {
                steps++;
            });
            
            this.anim.run();
            this.anim.stop();
            
            this.wait(function() {
                Y.assert(stopped && steps == 0, "Anim didn't stop or steps weren't zero")
            }, 100);
        },
        
        "anim should finish somewhere near the duration" : function() {
            this.anim.on("complete", function() {
                this.resume(function() {
                    Y.assert(true);
                });
            }, this);
            
            this.anim.run();
            
            this.wait(560);
        }
	
    });
}, "@VERSION@", { requires : [ "gallery-generic-anim", "test", "node-event-simulate" ] });
YUI.add("textshadow-anim-tests", function(Y) {
	
    Y.namespace("TextShadowAnim").Tests = new Y.Test.Case({
		name : "Text Shadow Anim Tests",
		
        // SET UP
		setUp : function() {
            this.text = Y.one("h1");
        },
        
        tearDown : function() {
            this.text.setStyle("textShadow", "none");
            this.text = null;
        },
        
        "text-shadow should animate" : function() {
            var anim = new Y.Anim({
                node : "h1",
                to : { textShadow : "#F00 0 0 20px" },
                duration : 0.5
            });
            
            anim.on("end", function() {
                this.resume(function() {
                    Y.Assert.areEqual("rgb(255, 0, 0) 0px 0px 20px", this.text.getComputedStyle("textShadow"));
                });
            }, this);
            
            
            anim.run();
            
            this.wait(1000);
        }
    });
}, "@VERSION@", { requires : [ "gallery-textshadow-anim", "test" ] });
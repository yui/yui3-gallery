YUI.add('gallery-button-toggle',function(Y){
    
    var Button,
        YL = Y.Lang,
        CLASSES = {
    		ACTIVE : '-active'
    	};
    
    Button = function() {
        Button.superclass.constructor.apply(this, arguments);
    };
    
    Y.extend(Button,Y.Button, {
    	
        initializer : function(config) {
            this.after('activeChange',this._activeChanged, this);
        },
        
        _toggle : function() {
        	var bb = this.get('boundingBox'),
    	    activeClass = this.className + CLASSES.ACTIVE;
        	if(status) {
        		bb.addClass(activeClass);
        		(Y.bind(this.get('callback'),this))();
        	}else{
        		bb.removeClass(activeClass);
        		(Y.bind(this.get('deactivateCallback'),this))();
        	}
        	this.set('active',status);
        },

        _bindClick : function(status) {
        	this.get('boundingBox').on('click',function(e){
        		this.set('active', !this.get('active'));
        	},this);
        },
        
        _deactivateCallbackChange : function(e) {
            this._bindClick();
        },
              
        _activeChanged : function(e) {
        	var bb = this.get('boundingBox'),
    	    activeClass = this.className + CLASSES.ACTIVE;
        	if(e.newVal) {
        		bb.addClass(activeClass);
        		if(this.get('callback')) {
        			(Y.bind(this.get('callback'),this))();
        		}
        	}else{
        		bb.removeClass(activeClass);
        		if(this.get('deactivateCallback')) {
        			(Y.bind(this.get('deactivateCallback'),this))();
        		}
        	}
        }
        
    }, {
        NAME : 'button',
        ATTRS : {
            active : {
            	value : false,
            	validator : YL.isBoolean
            },
            deactivateCallback : {
            	validator : YL.isFunction
            }
        }
    });
    
    Y.ButtonToggle = Button;
        
},'@VERSION@',{requires:['gallery-button']});
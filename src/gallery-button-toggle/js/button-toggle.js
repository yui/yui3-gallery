    var YL = Y.Lang,
        DESELECTED_CALLBACK = 'deselectedCallback';


	Y.ButtonToggle = Y.Base.create('button', Y.Button, [], {
	    
	    initializer : function(config) {
	        this.after('selectedChange',this._selectedChanged, this);
	    },
	    
	    _bindClick : function() {
	    	
	        this.get('boundingBox').after('click',function(e){
		    	var parent = null;
		    	if(!this.isRoot()) {
		    		var parent = this.get('parent'),
		    		    selection = parent.get('selection');
		    		if(
		    		   parent instanceof Y.ButtonGroup && // we are in a button group
		    		   parent.get('alwaysSelected') && // there should always be at least one
		    		   this.get('selected') === 1 && // this is selected
		    		   (
		    		      selection === this || 
		    		      (
		    		         selection instanceof Y.ArrayList && 
		    		         selection.size() === 1 && 
		    		         selection.item(0) === this
		    		      )
		    		   ) // this is the only selected
			    	) {
		    			return;
			    	}
		    	}
	        	this.set('selected', (this.get('selected') === 0) ? 1 : 0);
	        },this);
	    },
	    
	    _selectedChanged : function(e) {
	        if(e.newVal) {
	            if(this.get('callback')) {
	                (Y.bind(this.get('callback'),this))();
	            }
	        }else{
	            if(this.get(DESELECTED_CALLBACK)) {
	                (Y.bind(this.get(DESELECTED_CALLBACK),this))();
	            }
	        }
	    }
	    
	}, {
	    ATTRS : {
	        deselectedCallback : {
	            validator : YL.isFunction
	        }
	    }
	});

YUI.add('gallery-button',function(Y){
    
    var Button,
        YL = Y.Lang,
        EVENTS = {
            DISABLE : 'disable'
        },
        CLASSES = {
    		HOVER    : '-hover',
    		PRESSED  : '-pressed',
    		DEFAULT  : '-default',
    		DISABLED : '-disabled'
    	};
    
    Button = function() {
        Button.superclass.constructor.apply(this, arguments);
    };
    
    Y.extend(Button,Y.Widget, {
        BOUNDING_TEMPLATE : '<button/>',
        CONTENT_TEMPLATE : '<span/>',
        className : '',
        _clickHandle : null,
        _mouseIsDown : false,
        _mouseListener : null,
        
        initializer : function(config) {
            this.className = this.getClassName();
            this.after('typeChange',this._typeChanged, this);
            this.after('defaultChange',this._defaultChanged, this);
            this.after('enabledChange',this._enabledChanged, this);
        },
        
        renderUI : function(){
            this.get('contentBox').set('text',this.get('label'));
        },
        
        bindUI : function(){
            var bb = this.get('boundingBox');
        
            this._bindClick();
        
            this.after('callbackChange',Y.bind(this._callbackChange,this));

            bb.on('mouseup', this._mouseUp, this);
            bb.on('mousedown', this._mouseDown, this);
            bb.on('mouseenter', this._mouseEnter, this);
            bb.on('mouseleave', this._mouseLeave, this);
        },
        
        syncUI : function() {
        	this._updateDefault(this.get('default'));
        	this._updateEnabled(this.get('enabled'));
        	this._updateType(this.get('type'));
        },
        
        disable : function() {
            this.set('disabled',true);
        },
        
        enable : function() {
            this.set('disabled',false);
        },
        
        _bindClick : function() {
            var callback = this.get('callback');
                    
            if(this._clickHandle) {
                this._clickHandle.detach();
            }
 
            if(callback) {
                this._clickHandle = this.on('click',Y.bind(callback,this));
            }
        },
        
        _callbackChange : function(e) {
               this._bindClick();
        },
        
        _mouseUp : function() {
        	this.get('boundingBox').removeClass(this.className + CLASSES.PRESSED);
        	this._mouseIsDown = false;
        },
        _mouseDown : function() {
        	if(this.get('enabled')) {
        		this.get('boundingBox').addClass(this.className + CLASSES.PRESSED);
        		this._mouseIsDown = true;
        	}
        },
        _mouseEnter : function(e) {
        	if(this.get('enabled')) {
        		this.get('boundingBox').addClass(this.className + CLASSES.HOVER);
        		if(this._mouseIsDown) {
        			this.get('boundingBox').addClass(this.className + CLASSES.PRESSED);
        		}
        	}
        },
        _mouseLeave : function() {
        	var bb = this.get('boundingBox'),
        	pressedClass = this.className + CLASSES.PRESSED;
        	bb.removeClass(this.className + CLASSES.HOVER);
        	if(bb.hasClass(pressedClass)) {
            	bb.removeClass(pressedClass);
            	if(this._mouseListener === null) {
            		this._mouseListener = Y.on('mouseup',Y.bind(this._listenForMouseUp,this));
            	}
        	}else{
        		this._mouseIsDown = false;
        	}
        },
        
        _listenForMouseUp : function() {
        	this._mouseIsDown = false;
        	this._mouseListener.detach();
        	this._mouseListener = null;
        },
        
        _updateEnabled : function(status) {
        	var bb = this.get('boundingBox'),
        	disableClass = this.className + CLASSES.DISABLED;
        	if(status) {
        		bb.removeClass(disableClass);
        		bb.set('disabled','');
        	}else{
        		bb.addClass(disableClass);
        		bb.removeClass(this.className + CLASSES.HOVER);
        		bb.removeClass(this.className + CLASSES.PRESSED);
        		bb.set('disabled','disabled');
        	}
        },
        
        _enabledChanged : function(e) {
        	this._updateEnabled(e.newVal);
        },
        
        _updateDefault : function(status) {
            var bb = this.get('boundingBox'),
            defaultClass = this.className + CLASSES.DEFAULT;
	        if(status) {
	            bb.addClass(defaultClass);
	        }else{
	            bb.removeClass(defaultClass);
	        }
        },
        
        _defaultChanged : function(e) {
        	this._updateDefault(e.newVal);
        },
        
        _updateType : function(cur, prev) {
        	var bb = this.get('boundingBox'),
    	    prevClass = this.className + '-' + prev,
    	    curClass = this.className + '-' + cur;
        	if(cur) {
        		bb.replaceClass(prevClass,curClass);
        	}else if(prev){
        		bb.removeClass(prevClass);
        	}
        },
        
        _typeChanged : function(e) {
        	this._updateType(e.newVal, e.prevVal);
        }
    }, {
        NAME : 'button',
        EVENTS : EVENTS,
        ATTRS : {
            label : {
                value : null,
                validator : YL.isString
            },
            callback : {
                validator : YL.isFunction
            },
            enabled : {
                value : true,
                validator : YL.isBoolean
            },
            'default' : {
            	value : false,
            	validator : YL.isBoolean
            },
            type : {
            	validator : YL.isString
            }
        }
    });
    
    Y.Button = Button;
        
},'@VERSION@',{requires:['widget','event-mouseenter']});
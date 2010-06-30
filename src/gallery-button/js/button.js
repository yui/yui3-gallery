    var YL = Y.Lang,
        YCM = Y.ClassNameManager,
        EVENTS = {
            DISABLE : 'disable'
        },
        CLASSES = {
            HOVER    : '-hover',
            PRESSED  : '-pressed',
            DEFAULT  : '-default',
            DISABLED : '-disabled',
            NO_LABEL : 'no-label'
        },
        BOUNDING_BOX = 'boundingBox';
    
    
    Y.Button = Y.Base.create('button',Y.Widget, [Y.WidgetChild], {
        BOUNDING_TEMPLATE : '<button/>',
        CONTENT_TEMPLATE : '<span/>',
        className : '',
        _clickHandle : null,
        _mouseIsDown : false,
        _mouseListener : null,
        
        initializer : function(config) {
            this.className = this.getClassName();
            this.after('defaultChange',this._defaultChanged, this);
            this.after('enabledChange',this._enabledChanged, this);
        },
        
        renderUI : function(){
            this.get('contentBox').set('text',this.get('label'));
        },
        
        bindUI : function(){
            var bb = this.get(BOUNDING_BOX);
        
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
            this.get('icon');
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
            this.get(BOUNDING_BOX).removeClass(this.className + CLASSES.PRESSED);
            this._mouseIsDown = false;
        },
        _mouseDown : function() {
            if(this.get('enabled')) {
                this.get(BOUNDING_BOX).addClass(this.className + CLASSES.PRESSED);
                this._mouseIsDown = true;
            }
        },
        _mouseEnter : function(e) {
            if(this.get('enabled')) {
                this.get(BOUNDING_BOX).addClass(this.className + CLASSES.HOVER);
                if(this._mouseIsDown) {
                    this.get(BOUNDING_BOX).addClass(this.className + CLASSES.PRESSED);
                }
            }
        },
        _mouseLeave : function() {
            var bb = this.get(BOUNDING_BOX),
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
            var bb = this.get(BOUNDING_BOX),
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
            var bb = this.get(BOUNDING_BOX),
            defaultClass = this.className + CLASSES.DEFAULT;
            if(status) {
                bb.addClass(defaultClass);
                bb.setAttribute('default','default');
            }else{
                bb.removeClass(defaultClass);
                bb.set('default','');
            }
        },
        
        _defaultChanged : function(e) {
            this._updateDefault(e.newVal);
        }
        
    }, {
        EVENTS : EVENTS,
        ATTRS : {
            label : {
                value : '',
                validator : YL.isString,
                setter : function(val) {
                    if(!val || val === '') {
                        this.get(BOUNDING_BOX).addClass(this.getClassName(CLASSES.NO_LABEL));
                    }else{
                        this.get(BOUNDING_BOX).removeClass(this.getClassName(CLASSES.NO_LABEL));
                    }
                    this.get('contentBox').set('text', val);
                    this.set('title',val);
                    return val;
                },
                lazyAdd : false
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
            icon : {
                validator : YL.isString,
                setter : function(val) {
                    this.get(BOUNDING_BOX).replaceClass(
                        YCM.getClassName('icon', this.get('icon') || 'default'),
                        YCM.getClassName('icon', val || 'default')
                    );
                    return val;
                }
            },
            title : {
                validator : YL.isString,
                setter : function(val) {
                    this.get('boundingBox').set('title', val);
                    return val;
                }
            }
        }
    });
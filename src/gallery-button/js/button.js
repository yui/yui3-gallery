    var YL = Y.Lang,
        EVENTS = {
            DISABLE : 'disable'
        },
        CLASSES = {
            HOVER    : '-hover',
            PRESSED  : '-pressed',
            DEFAULT  : '-default',
            DISABLED : '-disabled'
        },
        BOUNDING_BOX = 'boundingBox',
        ATTR_DISABLED = 'disabled',
        ATTR_ENABLED = 'enabled',
        ATTR_DEFAULT = 'default';
    
    Y.Button = Y.Base.create('button', Y.Widget, [], {
        BOUNDING_TEMPLATE : '<button/>',
        CONTENT_TEMPLATE : '<span/>',
        className : '',
        _clickHandle : null,
        _mouseIsDown : false,
        _mouseListener : null,
        
        /**
         * Sets className to minimize lookups and binds default and 
         *   enable change callbacks
         * 
         * @param config Object
         * @see _defaultChanged
         * @see _enabledChanged
         */
        initializer : function(config) {
            this.className = this.getClassName();
            this.after('defaultChange',this._defaultChanged, this);
            this.after('enabledChange',this._enabledChanged, this);
        },
        
        /**
         * Adds the predefined label to the content box
         */
        renderUI : function(){
            this.get('contentBox').set('text',this.get('label'));
        },
        
        /**
         * Binds mouse events to the button for up, down, enter, and
         *   leave. Binds the callback change event and attaches the
         *   current callback to the click event.
         * 
         * @see _bindClick
         * @see _callbackChange
         * @see _mouseUp
         * @see _mouseDown
         * @see _mouseEnter
         * @see _mouseLeave
         */
        bindUI : function(){
            var bb = this.get(BOUNDING_BOX);
        
            this._bindClick();
        
            this.after('callbackChange',Y.bind(this._callbackChange,this));

            bb.on('mouseup', this._mouseUp, this);
            bb.on('mousedown', this._mouseDown, this);
            bb.on('mouseenter', this._mouseEnter, this);
            bb.on('mouseleave', this._mouseLeave, this);
        },
        
        /**
         * Updates the default and enables classes on the boundingBox
         *   Registers the type attribute to add the class to the 
         *   boundingBox through the type setter
         * 
         * @see _updateDefault
         * @see _updateEnabled
         */
        syncUI : function() {
            this._updateDefault(this.get(ATTR_DEFAULT));
            this._updateEnabled(this.get(ATTR_ENABLED));
            this.get('type');
        },
        
        /**
         * Sugar method for setting enable false
         * 
         * @return this
         */
        disable : function() {
            this.set(ATTR_ENABLED,false);
            return this;
        },
        
        /**
         * Sugar method for setting enable true
         * 
         * @return this
         */
        enable : function() {
            this.set(ATTR_ENABLED,true);
        },
        
        /**
         * Removes any previously attached callback for the click event
         *   and attaches a new one if one is available
         */
        _bindClick : function() {
            var callback = this.get('callback');
                    
            if(this._clickHandle) {
                this._clickHandle.detach();
            }
 
            if(callback) {
                this._clickHandle = this.on('click',Y.bind(callback,this));
            }
        },
        
        /**
         * Calls _bindClick. Dispatched after the callback is changed
         * 
         * @see _bindClick
         */
        _callbackChange : function(e) {
               this._bindClick();
        },
        
        /**
         * Removes the mouse pressed class and set internal property
         *   _mouseIsDown to false
         */
        _mouseUp : function() {
            this.get(BOUNDING_BOX).removeClass(this.className + CLASSES.PRESSED);
            this._mouseIsDown = false;
        },
        
        /**
         * If enabled, sets the mouse pressed class to the boundingBox
         *   and sets the internal property _mouseIsDown to true
         */
        _mouseDown : function() {
            if(this.get(ATTR_ENABLED)) {
                this.get(BOUNDING_BOX).addClass(this.className + CLASSES.PRESSED);
                this._mouseIsDown = true;
            }
        },
        
        /**
         * If enabled, adds the mouse hover class to the boundingBox
         *   and if the mouse is also down (occurs during a dragOut
         *   and dragOn event sequence) adds the mouse pressed class
         *   back to the boundingBox
         */
        _mouseEnter : function(e) {
            if(this.get(ATTR_ENABLED)) {
                this.get(BOUNDING_BOX).addClass(this.className + CLASSES.HOVER);
                if(this._mouseIsDown) {
                    this.get(BOUNDING_BOX).addClass(this.className + CLASSES.PRESSED);
                }
            }
        },
        
        /**
         * If the mouse is pressed or the button has a mouse pressed 
         *   class, we remove the class and add an event listener for
         *   mouseUp. Otherwise we ensure that _mouseIsDown is false
         *   
         * @see _listenForMouseUp
         */
        _mouseLeave : function() {
            var bb = this.get(BOUNDING_BOX),
            pressedClass = this.className + CLASSES.PRESSED;
            bb.removeClass(this.className + CLASSES.HOVER);
            if(bb.hasClass(pressedClass) || this._mouseIsDown) {
                bb.removeClass(pressedClass);
                if(this._mouseListener === null) {
                    this._mouseListener = Y.on('mouseup',Y.bind(this._listenForMouseUp,this));
                }
            }else{
                this._mouseIsDown = false;
            }
        },
        
        /**
         * Fires after a listened mouseUp event. Sets _mouseIsDown to 
         *   false, detaches and unsets the _mouseListener
         */
        _listenForMouseUp : function() {
            this._mouseIsDown = false;
            this._mouseListener.detach();
            this._mouseListener = null;
        },
        
        /**
         * Adds or removes the enabled class based on the provieded 
         *   status
         * 
         * @param status Boolean
         */
        _updateEnabled : function(status) {
            var bb = this.get(BOUNDING_BOX),
            disableClass = this.className + CLASSES.DISABLED;
            if(status) {
            	Y.log(disableClass);
                bb.removeClass(disableClass);
                bb.removeAttribute(ATTR_DISABLED);
            }else{
                bb.addClass(disableClass);
                bb.removeClass(this.className + CLASSES.HOVER);
                bb.removeClass(this.className + CLASSES.PRESSED);
                bb.setAttribute(ATTR_DISABLED, ATTR_DISABLED);
            }
        },
        
        /**
         * Fires when ever enabled is changed to update the disabled
         *   class on the boundingBox
         * 
         * @param e Event
         * @see _updateEnabled
         */
        _enabledChanged : function(e) {
            this._updateEnabled(e.newVal);
        },
        
        /**
         * Updates the default class on the boundingBox based on the 
         *   provided status
         *   
         * @param status Boolean
         */
        _updateDefault : function(status) {
            var bb = this.get(BOUNDING_BOX),
            defaultClass = this.className + CLASSES.DEFAULT;
            if(status) {
                bb.addClass(defaultClass);
                bb.setAttribute(ATTR_DEFAULT,ATTR_DEFAULT);
            }else{
                bb.removeClass(defaultClass);
                bb.set(ATTR_DEFAULT,'');
            }
        },
        
        /**
         * Fires when the default attribute is changed
         * 
         * @param e Event
         * @see _updateDefault
         */
        _defaultChanged : function(e) {
            this._updateDefault(e.newVal);
        }
        
    }, {
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
                validator : YL.isString,
                setter : function(val) {
                    this.get(BOUNDING_BOX).replaceClass(
                        this.getClassName('type', this.get('type') || ATTR_DEFAULT),
                        this.getClassName('type', val || ATTR_DEFAULT)
                    );
                    return val;
                }
            }
        }
    });

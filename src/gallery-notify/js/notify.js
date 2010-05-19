    /**
     * Local constants
     */
    var EVENTS = {
            INIT    : 'init',
            STARTED : 'started'
        },
        YL = Y.Lang,
        BOUNDING_BOX = 'boundingBox',
        CONTENT_BOX    = 'contentBox',
        ATTR_CLOSE_NODE = 'closeNode',
        ATTR_CLOSABLE = 'closable',
        ATTR_DEFAULT = 'default';

    /**
     * Message is created as a Child Widget
     */
    Y.namespace('Notify').Message = Y.Base.create('notify-message', Y.Widget, [Y.WidgetChild], {
        /**
         * Override default widget templates
         */
        BOUNDING_TEMPLATE : '<li/>',
        CONTENT_TEMPLATE : '<em/>',
        
        /**
         * Create default template for close button
         */
        CLOSE_TEMPLATE : '<span class="{class}">{label}</span>',
        
        /**
         * Internal timer used to pause timeout on mouseenter
         * 
         * @property _timer
         * @protected
         */
        _timer : null,
        
        /**
         * Initializer lifecycle implementation for the Message class.
         * Publishes events and subscribes 
         * to update after the status is changed. Sets the initial state
         * to hidden so the notification can fade in.
         *
         * @method initializer
         * @public
         * @param confit {Object} Configuration object literal for
         *     the Message
         */
        initializer : function(config) {
            this.get(BOUNDING_BOX).setStyle('opacity',0);
        },
        
        /**
         * Creates the message. Appends the close box if is closable
         * 
         * @method renderUI
         * @public
         */
        renderUI : function() {
            var cb = this.get(CONTENT_BOX),
                bb = this.get(BOUNDING_BOX),
                closeNode;
            
            cb.setContent(this.get('message'));
            if(this.get(ATTR_CLOSABLE)) {
                closeNode = Y.Node.create(Y.substitute(this.CLOSE_TEMPLATE,{
                    'class' : this.getClassName('close'),
                    'label' : 'X'
                }));
                this.set(ATTR_CLOSE_NODE,closeNode);
                bb.append(closeNode);
            }
            this.get('flag');
        },
        
        /**
         * Binds the message hover and closable events
         * 
         * @method bindUI
         * @public
         */
        bindUI : function() {
            this._bindHover();
            if(this.get(ATTR_CLOSABLE)) {
                this._bindCloseClick();
            }
        },
        
        /**
         * Creates a new timer to make the message disappear and
         * fades in the message
         * 
         * @method syncUI
         * @public
         */
        syncUI : function() {
            this.timer = new Y.Timer({
                length: this.get('timeout'),
                repeatCount: 1,
                callback: Y.bind(this.close, this)
            });
            this.get(BOUNDING_BOX).appear({
            	afterFinish : Y.bind(function(){
            		this.timer.start();
            	},this)
            });
        },
        
        /**
         * Kills the timeout timer then animates the notification close and
         * removes the widget from the window and parent container
         * 
         * @method close
         * @pubic
         */
        close : function() {
            if(this.timer) {
                this.timer.stop();
            }
            
            this.get(BOUNDING_BOX).fade({
                afterFinish  : Y.bind(function(e){
                    this.destroy();
                },this)
            });
        },
        
        /**
         * Binds the close method to the close node
         * 
         * @method _bindCloseClick
         * @protected
         */
        _bindCloseClick : function() {
            this.get(ATTR_CLOSE_NODE).on('click',Y.bind(this.close, this));
        },
        
        /**
         * Binds mouseenter and mouseleave events to the message.
         * Mouseenter will pause the timeout timer and mouseleave
         * will restart it.
         * 
         * @method _bindHover
         * @protected
         */
        _bindHover : function() {
            var bb = this.get(BOUNDING_BOX);
            bb.on('mouseenter',Y.bind(function(e){
                this.timer.pause();
            },this));
            
            bb.on('mouseleave',Y.bind(function(e){
                this.timer.resume();
            },this));
        }
        
    },{
        /**
         * Static property used to define the default attribute
         * configuration for Message.
         * 
         * @property ATTRS
         * @type Object
         * @static
         */
        ATTRS : {
            /**
             * @description A flag when set to true will allow
             * a close button to be rendered in the message
             * 
             * @attribute closable
             * @type Boolean
             * @default true
             */
            closable : {
                value : true,
                validator : YL.isBoolean
            },
            
            /**
             * @description The callback method that fires when the 
             * timer interval is reached.
             * 
             * @attribute closeNode
             * @type Y.Node
             */
            closeNode : {
                validator : function(val) {
                    return (val instanceof Y.Node);
                }
            },
    
            /**
             * @description String that is to be displayed
             * 
             * @attribute message
             * @type String
             */
            message : {
                validator : YL.isString
            },
            
            /**
             * @description Time in milliseconds before the message goes away
             * 
             * @attribute timeout
             * @type Number
             * @default 8000
             */
            timeout : {
                value : 8000
            },
            
            /**
             * @description Sets the flag of notification for styling
             * 
             * @attribute flag
             * @type String
             * @default notice
             */
            flag : {
                validator : YL.isString,
                setter : function(val) {
                    this.get(BOUNDING_BOX).replaceClass(
                        this.getClassName('flag', this.get('flag') || ATTR_DEFAULT),
                        this.getClassName('flag', val || ATTR_DEFAULT)
                    );
                    return val;
                }
            }
        }
    });

    
    /**
     * Notify is created as a Parent Widget
     */
    Y.Notify = Y.Base.create('notify',Y.Widget,[Y.WidgetParent, Y.EventTarget],{
        /**
         * Override default widget templates
         */
        CONTENT_TEMPLATE : '<ul/>',

        /**
         * Object used to build the child widget when new message are added
         *
         * @method childConfig
         * @protected
         */
        _childConfig : {},
        
        /**
         * Initializer lifecycle implementation for the Notify class.
         * Publishes events and subscribes 
         * to update after the status is changed. Builds initial child
         * widget configuration
         *
         * @method initializer
         * @public
         * @param confit {Object} Configuration object literal for
         *     the Notify
         */
        initializer : function(config) {
            this.publish(EVENTS.INIT,{ broadcast:1 });
            this.publish(EVENTS.STARTED,{ broadcast:1 });
            this.fire(EVENTS.INIT);
            this._buildChildConfig();
        },
        
        /**
         * Fires the 'started' event
         * 
         * @method syncUI
         * @public
         */
        syncUI : function() {
            this.fire(EVENTS.STARTED);
        },
        
        /**
         * Creates a new Message and appends at the specified index
         * 
         * @method addMessage
         * @public
         * @param msg {String} Message to be displayed
         * @param flag {String} Classification of message
         * @param index {Number} Stack order
         */
        addMessage : function(msg, flag, index) {
            flag = flag || ATTR_DEFAULT;
            this._buildChildConfig(msg,flag);

            if(index) {
                return this.add(this._childConfig,index);
            }
            if(this.get('prepend')) {
                return this.add(this._childConfig,0);
            }
            
            return this.add(this._childConfig);
        },
        
        /**
         * Allows for multiple message to be added at one time
         * 
         * @method addMessages
         * @public
         * @param obj
         */
        addMessages : function(obj) {
            for(var o in obj) {
                if(YL.isArray(obj[o])) {
                    for(var i=0, l=obj[o].length; i<l; i++) {
                        this.addMessage(obj[o][i],o);
                    }
                }
            }
        },

        /**
         * Populates the child config for new Message
         * 
         * @method _buildChildConfig
         * @param msg {String} Message to be displayed
         * @param flag {String} Classification of message
         */
        _buildChildConfig : function(msg,flag) {
            this._childConfig = {
                closable : this.get(ATTR_CLOSABLE),
                timeout : this.get('timeout'),
                message : msg,
                flag : flag
            };
        }
        
    },{
        /**
         * Static property used to define the default attribute
         * configuration for the Timer.
         * 
         * @property ATTRS
         * @type Object
         * @static
         */
        ATTRS : {
            /**
             * Specifies if messages attached will have a close button
             * 
             * @attribute closable
             * @type Boolean
             * @default true
             */
            closable : {
                value : true,
                validator : YL.isBoolean
            },
            
            /**
             * Default child used when using builtin add() method
             * 
             * @attribute add
             * @type Y.WidgetChild
             * @default Y.Notify.Message
             */
            defaultChildType : {
                value : Y.Notify.Message
            },
            
            /**
             * Specified if new message should be added to the top of
             * the message stack or the bottom.
             * 
             * @attribute prepend
             * @type Boolean
             * @default false
             */
            prepend : {
                value : false,
                validator : YL.isBoolean
            },
            
            /**
             * Time in milliseconds before new messages go away
             * 
             * @attribute timeout
             * @type Number
             * @default 8000
             */
            timeout : {
                value : 8000
            }
        },
        /**
         * Static property provides public access to registered notify
         * event strings
         * 
         * @property EVENTS
         * @type Object
         * @static
         */
        EVENTS : EVENTS
    });
    var LABEL = {
            CANCEL : 'Cancel',
            OK : 'OK'
        },
        CALLBACK = {
            CANCEL : 'cancel',
            OK : 'ok'
        },
        EMPTY_FN = function(){},
        ATTR_CALLBACKS = 'callbacks',
        ATTR_CENTERED = 'centered',
        ATTR_DEFAULT_BUTTON = 'defaultButton',
        ATTR_DRAGGABLE = 'draggable',
        ATTR_RETURN_VAL = 'returnVal',
        ATTR_TYPE = 'type';
    
    
    Y.Dialog = Y.Base.create('dialog', Y.Overlay, [], {
        
        handleEnter : null,
        
        handleEscape : null,
        
        /**
         * Plugs in Gallery_Overlay_Extras binds hide to the escape key
         * 
         * @param config Object
         * 
         * @see _visibleChanged
         * @see hide
         */
        initializer : function(config) {
            this.plug(Y.Plugin.WidgetAnim);
            this.plug(Y.Plugin.OverlayModal);
            this.plug(Y.Plugin.OverlayKeepaligned);
        },
        
        /**
         * Adds a listener for the contentUpdate to recenter the 
         *   dialog box as opposed to using syncUI
         * 
         * @see _contentUpdated
         */
        bindUI : function() {
            Y.Dialog.superclass.bindUI.apply(this,arguments);
            this.after('contentUpdate', this._contentUpdated, this);
        },
        
        /**
         * Override of default hide(). Hides the widget then fires the
         *   provided callback type with the returVal as the param. If 
         *   none is provided, the cancel callback is fired.
         * 
         * @param callbackType String
         */
        hide : function(callbackType) {
            if(this.handleEscape) {
                this.handleEscape.detach();
                this.handleEscape = null;
            }
            Y.one('body').set('tabIndex',-1).focus();
            
            Y.Dialog.superclass.hide.apply(this,arguments);
            var fn = (callbackType) ? this.getCallback(callbackType) : null;
            if(Y.Lang.isFunction(fn)) {
                (Y.bind(fn,this,this.get(ATTR_RETURN_VAL)))();
                this.set(ATTR_RETURN_VAL,null);
            }else{
                fn = this.getCallback(CALLBACK.CANCEL);
                if(fn) {
                    (fn)();
                }
            }
            
            this.anim.get('animHide').on('end',Y.bind(function(){
                this.purge();
            },this));
        },
        
        /**
         * Override of default show(). Calls syncUI() to maintain 
         *   centering before showing the dialog box. After showing,
         *   focuses on the default button.
         */
        show : function() {
            this.get(ATTR_DRAGGABLE);
            
            this.handleEscape = Y.once('esc',Y.bind(function(){this.hide();},this),Y.config.doc);
            Y.Dialog.superclass.show.apply(this,arguments);
            
            var dBtn = this.get(ATTR_DEFAULT_BUTTON);

            if(dBtn) {
                dBtn.focus();
            }

            this.get('boundingBox').set('tabIndex',-1);
        },
        
        /**
         * Adds content to the header container based on the placement
         * 
         * @param content HTML | Node | String
         * @param placement (Optional)
         * 
         * @see _standardizePlacement
         */
        head : function(content, placement) {
            var p = this._standardizePlacement(placement);
            this.setStdModContent(Y.WidgetStdMod.HEADER,content,p);
        },
        
        /**
         * Adds content to the body container based on the placement
         * 
         * @param content HTML | Node | String
         * @param placement (Optional)
         * 
         * @see _standardizePlacement
         */
        body : function(content, placement) {
            var p = this._standardizePlacement(placement);
            this.setStdModContent(Y.WidgetStdMod.BODY,content,p);
        },
        
        /**
         * Adds content to the footer container based on the placement
         * 
         * @param content HTML | Node | String
         * @param placement (Optional)
         * 
         * @see _standardizePlacement
         */
        foot : function(content, placement) {
            var p = this._standardizePlacement(placement);
            this.setStdModContent(Y.WidgetStdMod.FOOTER,content,p);
        },
        
        /**
         * Builds the dialog box and populates the content areas.
         * 
         * @param header HTML | Node | String
         * @param body HTML | Node | String
         * @param buttons array of Y.Button
         * @return this
         */
        build : function(header, body, buttons) {
        	var i,l,btn;
        	
            this.purge();
            
            this.head(header);
            this.body(body);
            
            for(i=0, l=buttons.length; i<l; i++) {
                
                btn = buttons[i];
                btn.render();
                if(btn.get('default')) {
                    this.set(ATTR_DEFAULT_BUTTON,btn);
                }
                
                this.foot(btn.get('boundingBox'), 'after');
            }
            
            return this;
        },
        
        /**
         * Sugar method to create an alert box
         * 
         * @param msg String
         * @param title String | null
         * @param cancelCallback Function | null
         */
        alert: function(msg, title, callback){
            this.set(ATTR_TYPE,'alert');
            
            this.addCallback(CALLBACK.CANCEL, callback || EMPTY_FN);
            
            var header = title || this._getDefaultTitle(),
                body = msg || null,
                okBtn;
            
            okBtn = new Y.Button({
                label: LABEL.OK,
                callback: Y.bind(function(e){
                    this.hide();
                },this),
                'default': true
            });
            
            this.build(header, body, [okBtn]).addCloseButton().show();
        },
        
        /**
         * Sugar method to create a confirm box
         * 
         * @param msg String
         * @param title String | null
         * @param okCallback Function | null
         * @param cancelCallback Function | null
         */
        confirm: function(msg, title, okCallback, cancelCallback){
            this.set(ATTR_TYPE,'confirm');
            
            this.addCallback(CALLBACK.OK, okCallback || EMPTY_FN);
            this.addCallback(CALLBACK.CANCEL, cancelCallback || EMPTY_FN);
            
            var header = title || this._getDefaultTitle(),
                body = msg || null,
                okBtn,
                cancelBtn;
            
            okBtn = new Y.Button({
                label: LABEL.OK,
                callback: Y.bind(function(e){
                    this.hide(CALLBACK.OK);
                },this),
                'default': true
            });
            
            cancelBtn = new Y.Button({
                label: LABEL.CANCEL,
                callback: Y.bind(function(e){
                    this.hide();
                },this)
            });
            
            
            this.build(header, body, [okBtn,cancelBtn]).addCloseButton().show();
        },
        
        /**
         * Sugar method to create a prompt box. Updates returnVal to
         *   the value of the input box.
         * 
         * @param msg String
         * @param title String | null
         * @param okCallback Function | null
         * @param cancelCallback Function | null
         */
        prompt: function(msg, title, okCallback, cancelCallback){
            this.set(ATTR_TYPE,'prompt');
            
            this.addCallback(CALLBACK.OK, okCallback || EMPTY_FN);
            this.addCallback(CALLBACK.CANCEL, cancelCallback || EMPTY_FN);
            
            var header = title || this._getDefaultTitle(),
                body = msg || null,
                okBtn,
                cancelBtn,
                promptInput;
            
            okBtn = new Y.Button({
                label: LABEL.OK,
                callback: Y.bind(function(e){
                    this.hide(CALLBACK.OK);
                },this),
                'default': true
            });
            
            cancelBtn = new Y.Button({
                label: LABEL.CANCEL,
                callback: Y.bind(function(e){
                    this.hide();
                },this)
            });
            
            this.build(header, body, [okBtn,cancelBtn]);

            // need to build the input box and bind the events to it
            //   then append it to the body
            promptInput = Y.Node.create('<input type="text" style="display: block; margin-top: 0.5em;">');
            if(Y.UA.ie < 8) {
                promptInput.setStyle('width','300px');
            }else{
                promptInput.setStyle('width','100%');
            }
            promptInput.on('keyup',Y.bind(function(e){this.set(ATTR_RETURN_VAL,e.currentTarget.get('value'));},this));
            this.handleEnter = Y.once('enter',Y.bind(function(e){
                var defBtn = this.get(ATTR_DEFAULT_BUTTON);
                if(defBtn) {
                    defBtn.fire('click');
                }
            },this),promptInput);
            
            this.body(promptInput,'after');
            
            this.addCloseButton().show();
        },
        
        /**
         * Returns the callback function based on the type provided
         * 
         * @param type String
         * @return Function | null
         */
        getCallback : function(type) {
            return (this.get(ATTR_CALLBACKS)[type] || null);
        },
        
        /**
         * Sets the callback type to the callbacks array if the
         *   provided function is a valid function
         * 
         * @param type String
         * @param fn Function
         */
        addCallback : function(type, fn) {
            if(Y.Lang.isFunction(fn)) {
                this.get(ATTR_CALLBACKS)[type] = fn;
            }
        },
        
        /**
         * Sets the callback function type to null if found
         * 
         * @param type String
         */
        removeCallback : function(type) {
            if(this.get(ATTR_CALLBACKS)[type]) {
                this.get(ATTR_CALLBACKS)[type] = null;
            }
        },
        
        /**
         * Adds a close button to the header
         * 
         * @returns this
         */
        addCloseButton : function() {
            var btn = new Y.Button({
                label: "X",
                callback: Y.bind(function(e){
                    this.hide();
                },this),
                type: 'close'
            });
            btn.render();
            this.head(btn.get('boundingBox'),'after');
            return this;
        },
        
        /**
         * Removes all elements in the widget
         * 
         * @return this
         */
        purge : function() {
            this.head('');
            this.body('');
            this.foot('');
        },
        
        /**
         * Returns the WidgetStdMod Static values for positions based
         *   off placement given. Accepts prepend, before, append,
         *   after. If not matched will return Y.WidgetStdMod.REPLACE
         * 
         * @param placement Desired placement
         * @retrun string
         */
        _standardizePlacement : function(placement) {
            var p = (Y.Lang.isString(placement)) ? placement.toLowerCase() : null;
            switch (p) {
                case 'prepend' : 
                case 'before' : 
                    return Y.WidgetStdMod.BEFORE; 
                case 'append' : 
                case 'after' : 
                    return Y.WidgetStdMod.AFTER; 
                default: 
                    return Y.WidgetStdMod.REPLACE; 
            }
        },
        
        /**
         * Generates a generic title similar to system dialog boxes
         * 
         * @return String
         */
        _getDefaultTitle : function() {
            return 'The page ' + location.protocol + '//' + location.host  + '/ says:';
        },
        
        /**
         * Plugs in the Drag and DDConstrained to the boundingBox and
         *   makes the header the handle. Fired automatically when
         *   draggable is updated by the setter.
         * 
         * @param drag Boolean
         */
        _updateDraggable : function(drag) {
            var bb = this.get('boundingBox'),
                hd = bb.all('.yui3-widget-hd');
            if(drag) {

                bb.plug(Y.Plugin.Drag,{
                    handle : hd
                }).dd.plug(Y.Plugin.DDConstrained, {
                    constrain2view: true,
                    gutter: '20'
                });
            }else{
                bb.unplug(Y.Plugin.Drag)
                  .unplug(Y.Plugin.DDContrained);
            }
        },
        
        /**
         * Centers dialog box if it should be centered when the 
         *   content is updated
         */
        _contentUpdated : function() {
            if(this.get(ATTR_CENTERED)) {
                this.centered();
            }
        }
    },{
        ATTRS : {
            callbacks : {
                value : {}
            },
            centered : {
                value : true
            },
            constrain : {
                value : true
            },
            defaultButton : {
                validator : function(val) {
                    return (val instanceof Y.Button);
                }
            },
            draggable : {
                value : true,
                validator : Y.Lang.isBoolean,
                setter : function (val) {
                    this._updateDraggable(val);
                    return val;
                }
            },
            render : {
                value : true
            },
            returnVal : {
                value : null
            },
            type : {
                validator : Y.Lang.isString,
                setter : function(val) {
                    this.get('boundingBox').replaceClass(
                        this.getClassName(ATTR_TYPE, this.get(ATTR_TYPE) || 'default'),
                        this.getClassName(ATTR_TYPE, val || 'default')
                    );
                    return val;
                }
            },
            visible : {
                value : false
            },
            zIndex : {
                value : 20000
            }
        }
    });
	/*!
	 * Overlay Modal Plugin
	 * 
	 * Oddnut Software
	 * Copyright (c) 2009-2010 Eric Ferraiuolo - http://eric.ferraiuolo.name
	 * YUI BSD License - http://developer.yahoo.com/yui/license.html
	 */
	
	var OverlayModal,
		OVERLAY_MODAL = 'overlayModal',
		
		HOST = 'host',
		BOUNDING_BOX = 'boundingBox',
		
		OVERLAY = 'overlay',
		MODAL = 'modal',
		MASK = 'mask',
		
		CHANGE = 'Change',
		
		getCN = Y.ClassNameManager.getClassName,
		isBoolean = Y.Lang.isBoolean,
		
		CLASSES = {
			modal	: getCN(OVERLAY, MODAL),
			mask	: getCN(OVERLAY, MASK)
		};
		
	// *** Constructor *** //
	
	OverlayModal = function (config) {
		
		OverlayModal.superclass.constructor.apply(this, arguments);
	};
	
	// *** Static *** //
	
	Y.mix(OverlayModal, {
		
		NAME : OVERLAY_MODAL,
		
		NS : MODAL,
		
		ATTRS : {
			
			mask : {
				value : true,
				validator : isBoolean
			}
			
		},
		
		CLASSES : CLASSES
		
	});
	
	// *** Prototype *** //
	
	Y.extend(OverlayModal, Y.Plugin.Base, {
		
		// *** Instance Members *** //
		
		_maskNode : null,
		_focusHandle : null,
		_clickHandle : null,
		
		// *** Lifecycle Methods *** //
		
		initializer : function (config) {
			
			this.doAfter('renderUI', this.renderUI);
			this.doAfter('bindUI', this.bindUI);
			this.doAfter('syncUI', this.syncUI);
			
			if (this.get(HOST).get('rendered')) {
				this.renderUI();
				this.bindUI();
				this.syncUI();
			}
		},
		
		destructor : function () {
			
			if (this._maskNode) {
				this._maskNode.remove(true);
			}
			
			this._detachFocusHandle();
			this._detachClickHandle();
			
			this.get(HOST).get(BOUNDING_BOX).removeClass(CLASSES.modal);
		},
		
		renderUI : function () {
			
			this._maskNode = Y.Node.create('<div></div>');
			this._maskNode.addClass(CLASSES.mask);
			this._maskNode.setStyles({
				position	: 'fixed',
				width		: '100%',
				height		: '100%',
				top			: '0',
				left		: '0',
				zIndex		: '-1'
			});
			
			this.get(HOST).get(BOUNDING_BOX).addClass(CLASSES.modal);
		},
		
		bindUI : function () {
			
			this.after(MASK+CHANGE, this._afterMaskChange);
			this.get(HOST).after('visibleChange', Y.bind(this._afterHostVisibleChange, this));
		},
		
		syncUI : function () {
			
			this._uiSetHostVisible(this.get(HOST).get('visible'));
			this._uiSetMask(this.get(MASK));
		},
		
		// *** Public Methods *** //
		
		mask : function () {
			
			this.set(MASK, true);
		},
		
		unmask : function () {
			
			this.set(MASK, false);
		},
		
		// *** Private Methods *** //
		
		_focus : function () {
			
			var host = this.get(HOST),
				bb = host.get(BOUNDING_BOX),
				oldTI = bb.get('tabIndex');
				
			bb.set('tabIndex', 0);
			host.focus();
			bb.set('tabIndex', oldTI);
		},
		
		_blur : function () {
			
			this.get(HOST).blur();
		},
		
		_uiSetHostVisible : function (visible) {
			
			if (visible) {
				this._attachFocusHandle();
				this._attachClickHandle();
				this._focus();
			} else {
				this._detachFocusHandle();
				this._detachClickHandle();
				this._blur();
			}
		},
		
		_uiSetMask : function (mask) {
			
			var bb = this.get(HOST).get(BOUNDING_BOX);
			
			if (mask) {
				bb.append(this._maskNode);
			} else if (this._maskNode.get('parentNode') === bb) {
				this._maskNode.remove();
			}
		},
		
		_attachFocusHandle : function () {
			
			if ( ! this._focusHandle) {
				this._focusHandle = Y.one(document).on('focus', Y.bind(function(e){
					if ( ! this.get(HOST).get(BOUNDING_BOX).contains(e.target)) {
						this._focus();
					}
				}, this));
			}
		},
		
		_attachClickHandle : function () {
			
			if ( ! this._clickHandle) {
				var bb = this.get(HOST).get(BOUNDING_BOX);
				this._clickHandle = this._maskNode.on('click', Y.bind(bb.scrollIntoView, bb, false));
			}
		},
		
		_detachFocusHandle : function () {
			
			if (this._focusHandle) {
				this._focusHandle.detach();
				this._focusHandle = null;
			}
		},
		
		_detachClickHandle : function () {
			
			if (this._clickHandle) {
				this._clickHandle.detach();
				this._clickHandle = null;
			}
		},
		
		_afterHostVisibleChange : function (e) {
			
			this._uiSetHostVisible(e.newVal);
		},
		
		_afterMaskChange : function (e) {
			
			this._uiSetMask(e.newVal);
		}
		
	});
	
	Y.namespace('Plugin').OverlayModal = OverlayModal;

YUI.add('gallery-overlay-modal', function(Y) {

	/**
	 * Overlay Modal Plugin
	 * 
	 * Oddnut Software
	 * Copyright (c) 2009 Eric Ferraiuolo - http://eric.ferraiuolo.name
	 * YUI BSD License - http://developer.yahoo.com/yui/license.html
	 */
	
	var OverlayModal,
		OVERLAY_MODAL = 'overlayModal',
		
		OVERLAY = 'overlay',
		MODAL = 'modal',
		MASK = 'mask',
		
		HOST = 'host',
		BOUNDING_BOX = 'boundingBox',
		
		CHANGE = 'Change',
		
		getCN = Y.ClassNameManager.getClassName,
		isBoolean = Y.Lang.isBoolean;
		
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
		
		CLASSES : {
			
			modal : getCN(OVERLAY, MODAL),
			mask : getCN(OVERLAY, MASK)
			
		}
		
	});
	
	// *** Prototype *** //
	
	Y.extend(OverlayModal, Y.Plugin.Base, {
		
		// *** Instance Members *** //
		
		_maskNode : null,
		_focusHandle : null,
		
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
			
			this.get(HOST).get(BOUNDING_BOX).removeClass(OverlayModal.CLASSES.modal);
		},
		
		renderUI : function () {
			
			this._maskNode = Y.Node.create('<div></div>');
			this._maskNode.addClass(OverlayModal.CLASSES.mask);
			this._maskNode.setStyles({
				position	: 'fixed',
				width		: '100%',
				height		: '100%',
				top			: '0',
				left		: '0',
				zIndex		: '-1'
			});
			
			this.get(HOST).get(BOUNDING_BOX).addClass(OverlayModal.CLASSES.modal);
		},
		
		bindUI : function () {
			
			this.after(MASK+CHANGE, this._afterMaskChange);
			
			this.get(HOST).after('visibleChange', Y.bind(this._afterHostVisibleChange, this));
		},
		
		syncUI : function () {
			
			var host = this.get(HOST);
			
			this._uiSetMask(this.get(MASK));
			
			if (host.get('visible') === true) {
				this._attachFocusHandle();
				host.get(BOUNDING_BOX).focus();
			} else {
				this._detachFocusHandle();
			}
		},
		
		// *** Public Methods *** //
		
		mask : function () {
			
			this.set(MASK, true);
		},
		
		unmask : function () {
			
			this.set(MASK, false);
		},
		
		// *** Private Methods *** //
		
		_uiSetMask : function (mask) {
			
			var hostBoundingBox = this.get(HOST).get(BOUNDING_BOX);
			
			if (mask) {
				hostBoundingBox.append(this._maskNode);
			} else if (this._maskNode.get('parentNode') === hostBoundingBox) {
				this._maskNode.remove();
			}
		},
		
		_attachFocusHandle : function () {
			
			this._focusHandle = Y.one('document').on('focus', Y.bind(function(e){
			
				var hostBoundingBox = this.get(HOST).get(BOUNDING_BOX);
				
				if ( ! hostBoundingBox.contains(e.target)) {
					hostBoundingBox.focus();
				}
			
			}, this));
		},
		
		_detachFocusHandle : function () {
			
			if (this._focusHandle) {
				this._focusHandle.detach();
			}
		},
		
		_afterMaskChange : function (e) {
			
			this._uiSetMask(e.newVal);
		},
		
		_afterHostVisibleChange : function (e) {
			
			if (e.newVal === true) {
				this._attachFocusHandle();
				this.get(HOST).get(BOUNDING_BOX).focus();
			} else {
				this._detachFocusHandle();
			}
		}
		
	});
	
	Y.namespace('Plugin').OverlayModal = OverlayModal;


}, 'gallery-2009.12.08-22' ,{requires:['overlay', 'plugin', 'event-focus']});

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
		},
		
		syncUI : function () {
			
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
		
		_uiSetMask : function (mask) {
			
			if (mask) {
				this.get(HOST).get(BOUNDING_BOX).append(this._maskNode);
			} else {
				this._maskNode.remove();
			}
		},
		
		_afterMaskChange : function (e) {
			
			this._uiSetMask(e.newVal);
		}
		
	});
	
	Y.namespace('Plugin').OverlayModal = OverlayModal;

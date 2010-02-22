/**
 * Provides a sliding sidebar widget
 *
 * @module gallery-sliding-sidebar
 *
 */

var Lang = Y.Lang,
	Anim = Y.Anim,
	Easing = Y.Easing,
	Event = Y.Event,
	isBoolean = Y.Lang.isBoolean,
	isNumber = Y.Lang.isNumber,
	contentBox,
	boundingBox,
	toggleButton,
	expanded = false;


/**
 * Create a sliding sidebar that contains updateable content and has
 * positioning and sizing options. This class extends the
 * <code>overlay</code> class.
 *
 * @class gallery-sliding-sidebar
 * @extends Overlay
 * @param config {Object} Configuration object
 * @constructor
 */
function SlidingSideBar(config){
	SlidingSideBar.superclass.constructor.apply(this, arguments);
}

Y.mix(SlidingSideBar, {

	/**
	 * The identity of the widget.
	 *
	 * @property tmpPanel.NAME
	 * @type String
	 * @static
	 */
	NAME:'SlidingSideBar',

	/**
	 * Static property used to define the default attribute configuration of
	 * the Widget.
	 *
	 * @property tmp-panel.ATTRS
	 * @type Object
	 * @protected
	 * @static
	 */
	ATTRS:{

		/**
		 * @attribute collapsed Height
		 * @description Number specifying the collapsed Height of the sidebar
		 *
		 * @default 150
		 * @type Number
		 */
		'collapsedHeight':{
			key:'collapsedHeight',
			value:150,
			validator:isNumber
		},

		/**
		 * @attribute collapsedWidth
		 * @description Number specifying the collapsed Width of the sidebar
		 *
		 * @default 25
		 * @type Number
		 */
		'collapsedWidth':{
			key:'collapsedWidth',
			value:25,
			validator:isNumber
		},

		/**
		 * @attribute expanded Height
		 * @description Number specifying the expanded Height of the sidebar
		 *
		 * @default 300
		 * @type Number
		 */
		'expandedHeight':{
			key:'expandedHeight',
			value:300,
			validator:isNumber
		},

		/**
		 * @attribute expandedWidth
		 * @description Number specifying the expanded Width of the sidebar
		 *
		 * @default 200
		 * @type Number
		 */
		'expandedWidth':{
			key:'expandedWidth',
			value:200,
			validator:isNumber
		},

		/**
		 * @attribute toggle
		 * @description determines if a button is used to toggle the sidbar
		 * in and out
		 *
		 * @default true
		 * @type Boolean
		 */
		'toggle':{
			key:'toggle',
			value:true,
			validator:isBoolean
		},

		/**
		* @attribute animation
		* @description Animation config values, see Y.Animation
		*
		* @default <code> {
		* duration: .3,
		* easing: Easing.easeOutStrong
		* }
		* </code>
		* @type Object
		*/
		animation: {
			value: {
				duration: 0.5,
				easing: Easing.easeOut
			},
			validator: function( value ){
				return Lang.isObject( value ) && Lang.isNumber( value.duration ) &&
					Lang.isFunction( value.easing );
			}
		},

		/**
		 * @attribute content
		 * @description the content you wish to display inside your expanded
		 * sidebar
		 *
		 * @default Null
		 * @type String
		 */
		'content':{
			key:'content',
			value:''
		}
	}
});

/* SlidingSideBar extends Overlay */
Y.extend(SlidingSideBar, Y.Overlay, {
	/**
	 * Initializer lifecycle implementation for the SlidingSideBar class. Publishes events,
	 * initializes internal properties.
	 *
	 * @method initializer
	 * @param config {Object} Configuration object literal for the SlidingSideBar
	 * @protected
	 */
	initalizer:function(config){
		Y.log('initalizer','info','SlidingSideBar');
	},

	/**
	 * Create the DOM structure for the SlidingSideBar.
	 *
	 * @method renderUI
	 * @protected
	 */
	renderUI:function(){
		Y.log('renderUI','info','SlidingSideBar');
		boundingBox = this.get('boundingBox');
		contentBox = this.get('contentBox');

		this.set('width',this.get('collapsedWidth'));
		this.set('height',this.get('collapsedHeight'));

		this._toggleButton_create();/* create close button */
	},

	/**
	 * Bind the events with the interface
	 *
	 * @method bindUI
	 * @protected
	 */
	bindUI:function(){
		Y.log('renderUI','info','SlidingSideBar');
		this.get('contentBox').on('click',this._contentBox_click,this);

	},

	/**
	 * Sync the UI if there are attribute changes
	 *
	 * @method syncUI
	 * @protected
	 */
	syncUI:function(){
		Y.log('syncUI','info','SlidingSideBar');
	},

	/**
	 * Destructor lifecycle implementation for the Accordion class.
	 * Removes and destroys all registered items.
	 *
	 * @method destructor
	 * @protected
	 */
	destructor:function(){
		Y.log('destructor','info','SlidingSideBar');
		this._toggleButton_destroy();/* destoy the toggle button */
		this._title_destroy();/* destroy the title */
	},

	/**
	 * Creates the toggle button
	 *
	 * @method _toggleButton_create
	 * @protected
	 */
	_toggleButton_create:function(){
		Y.log('_toggleButton_create','info','SlidingSideBar');
		var className = this.getClassName('toggle');
		contentBox.append('<a href="#" class="'+className+'">&#160;</a>');
		toggleButton = boundingBox.one('.'+className);
		toggleButton.on('click',this._toggleButton_click,this);
		if(this.get('toggle')===false){
			this._toggleButton_hide();
		}
	},
	/**
	 * Destroys the toggle button
	 *
	 * @method _toggleButton_destroy
	 * @protected
	 */
	_toggleButton_destroy:function(){
		Y.log('_toggleButton_destroy','info','SlidingSideBar');
		Event.purgeElement('#'.toggleButton.getAttribute('id'),true);
		toggleButton.remove();
	},
	/**
	 * Shows the toggle button
	 *
	 * @method _toggleButton_show
	 * @protected
	 */
	_toggleButton_show:function(){
		Y.log('_toggleButton_show','info','SlidingSideBar');
		toggleButton.removeClass(this.getClassName('hidden'));
	},
	/**
	 * Hides the toggle button
	 *
	 * @method _toggleButton_hide
	 * @protected
	 */
	_toggleButton_hide:function(){
		Y.log('_toggleButton_hide','info','SlidingSideBar');
		toggleButton.addClass(this.getClassName('hidden'));
	},
	/**
	 * Toggle button click event
	 *
	 * @method _toggleButton_click
	 * @protected
	 */
	_toggleButton_click:function(){
		Y.log('_toggleButton_click','info','SlidingSideBar');
		this._toggleSidebar();
		return false;
	},
	/**
	 * Toggle button change event
	 *
	 * @method _toggleButton_change
	 * @protected
	 */
	_toggleButton_changed:function(){
		Y.log('_toggleButton_changed: '+(this.get('toggle')?'true':'false'),'info','SlidingSideBar');
		if(this.get('toggle')){
			this._toggleButton_show();
		}else{
			this._toggleButton_hide();
		}
	},

	/**
	 * Header Content Click event
	 *
	 * @method _headerContent_click
	 * @protected
	 */
	 _headerContent_click:function(e){
		Y.log('_headerContent_click ','info','SlidingSideBar');
		this._toggleSidebar();
	 },
	 /**
	 * Header Content Click event
	 *
	 * @method _headerContent_click
	 * @protected
	 */
	_contentBox_click:function(e){
		Y.log('_contentBox_click '+e.target,'info','SlidingSideBar');
		if(e.target.hasClass('yui-widget-hd') || e.target.hasClass(this.getClassName('toggle'))){
			this._toggleSidebar();
			if(contentBox.one('.yui-widget-hd')){/* if the head exist */
				contentBox.one('.yui-widget-hd').on('click',this._headerContent_click,this);
				Y.detach('click',this._contentBox_click,contentBox);
			}
		}
		return false;
	},

	/**
	 * Toggles the sidebar to the open and closed positions
	 *
	 * @method _toggleSidebar
	 * @protected
	 */
	_toggleSidebar:function(){
		Y.log('_toggleSidebar','info','SlidingSideBar');
		if(expanded){
			this._contentSize(this.get('collapsedHeight'),this.get('collapsedWidth'));
			this._hideContent();
			expanded = false;
		}else{
			this._contentSize(this.get('expandedHeight'),this.get('expandedWidth'));
			this._showContent();
			expanded = true;
		}
	},
	/**
	 * Animation adjustment of the content size
	 *
	 * @method _contentSize
	 * @protected
	 */
	_contentSize:function(height,width){
		Y.log('_contentSize','info','SlidingSideBar');
		var animSet = this.get('animation'),
			anim = new Anim({
				node:boundingBox,
				duration:animSet.duration,
				easing:animSet.easing,
				to:{
					height:height,
					width:width
				}
			});
		anim.run();
	},

	/**
	 * Shows the content box
	 *
	 * @method _showContent
	 * @protected
	 */
	_showContent:function(){
		Y.log('_showContent','info','SlidingSideBar');
		if(contentBox.one('.yui-widget-bd')){
			var animSet = this.get('animation'),
				anim = new Anim({
					node:contentBox.one('.yui-widget-bd'),
					duration:animSet.duration,
					easing:animSet.easing,
					to:{
						opacity:1
					}
				});
			anim.run();
			contentBox.one('.yui-widget-bd').setStyle('display','block');
		}
	},
	/**
	 * Hides the content box
	 *
	 * @method _hideContent
	 * @protected
	 */
	_hideContent:function(){
		Y.log('_hideContent','info','SlidingSideBar');
		if(contentBox.one('.yui-widget-bd')){
			var animSet = this.get('animation'),
				anim = new Anim({
					node:contentBox.one('.yui-widget-bd'),
					duration:animSet.duration,
					easing:animSet.easing,
					to:{
						opacity:0
					},
					on:{
						end:function(){
							contentBox.one('.yui-widget-bd').setStyle('display','none');
						}
					}
				});
			anim.run();
		}
	}
	/* @todo Add in code to handle zIndex to properly stack sidebars
	_uiSetFocused: function(val, src) {
		alert('_uiSetFocused ');
	}
	*/
});

Y.SlidingSideBar = SlidingSideBar;

//Inherit and extend slider to add dual slider
YUI.add('dualslider', function(Y) {

	var VALUE = 'value', VALUE2 = 'value2', THUMBSFLIPPED = 'false';
	
	function DualSlider() {		
		DualSlider.superclass.constructor.apply(this, arguments);		
	}
	
	Y.DualSlider = Y.extend(DualSlider, Y.Slider, {		
		
		renderThumb2: function () {
			return this.renderThumb();
		},
		/**
		 * Create the DOM structure for the Slider.
		 *
		 * @method renderUI
		 * @protected
		 */
		renderUI : function () {
			var contentBox = this.get( 'contentBox' );
			
			//Disable clickable rail
			this.set('clickableRail', false)

			/**
			 * The Node instance of the Slider's rail element.  Do not write to
			 * this property.
			 *
			 * @property rail
			 * @type {Node}
			 */
			this.rail = this.renderRail();

			this._uiSetRailLength( this.get( 'length' ) );

			/**
			 * The Node instance of the Slider's thumb element.  Do not write to
			 * this property.
			 *
			 * @property thumb
			 * @type {Node}
			 */
			this.thumb = this.renderThumb();

			this.rail.appendChild( this.thumb );
			
			this.thumb2 = this.renderThumb2();

			this.rail.appendChild( this.thumb2 );	
			
			// @TODO: insert( contentBox, 'replace' ) or setContent?
			contentBox.appendChild( this.rail );

			// <span class="yui3-slider-x">
			contentBox.addClass( this.getClassName( this.axis ) );
			
		},
		 /**
		 * Makes the thumb draggable and constrains it to the rail.
		 *
		 * @method _bindThumbDD
		 * @protected
		 */
		_bindThumbDD: function () {
			//this._bindThumbDD();
			var config = { constrain: this.rail };
			
			// { constrain: rail, stickX: true }
			config[ 'stick' + this.axis.toUpperCase() ] = true;

			/** 
			 * The DD.Drag instance linked to the thumb node.
			 *
			 * @property _dd
			 * @type {DD.Drag}
			 * @protected
			 */
			 this._dd = new Y.DD.Drag( {
				node   : this.thumb,
				bubble : false,
				on     : {
					'drag:start': Y.bind( this._onDragStart, this )
				},
				after  : {
					'drag:drag': Y.bind( this._afterDrag,    this ),
					'drag:end' : Y.bind( this._afterDragEnd, this )
				}
			} );
			this._dd2 = new Y.DD.Drag( {
				node   : this.thumb2,
				bubble : false,
				on     : {
					'drag:start': Y.bind( this._onDragStart, this )
				},
				after  : {
					'drag:drag': Y.bind( this._afterDrag,    this ),
					'drag:end' : Y.bind( this._afterDragEnd, this )
				}
			} );

			// Constrain the thumb to the rail
			this._dd.plug( Y.Plugin.DDConstrained, config );
			this._dd2.plug( Y.Plugin.DDConstrained, config );		
			
		},
		
		/**
         * Override of stub method in SliderBase that is called at the end of
         * its bindUI stage of render().  Subscribes to internal events to
         * trigger UI and related state updates.
         *
         * @method _bindValueLogic
         * @protected
         */
        _bindValueLogic: function () {
            this.after( {
                minChange  : this._afterMinChange,
                maxChange  : this._afterMaxChange,
                valueChange: this._afterValueChange,
				value2Change : this._afterValue2Change
            } );
        },
		
		/**
         * Propagate change to the thumb position unless the change originated
         * from the thumbMove event.
         *
         * @method _afterValue2Change
         * @param e { EventFacade } The <code>valueChange</code> event.
         * @protected
         */
        _afterValue2Change: function ( e ) {
            if ( !e.positioned ) {				
                //this._setPosition( e.newVal );
				var offset =  this._valueToOffset(e.newVal);
				
				if (e.newVal < this.getValue())
					this.set( THUMBSFLIPPED, true);				
			
				if ( this.thumb2 ) {
					this.thumb2.setStyle( this._key.minEdge, offset + 'px' );

					this.fire( 'thumbMove', { offset: offset } );
				}
            }
        },
		
		/**
         * Dispatch the new position of the thumb into the value setting
         * operations.  Updated to prevent thumb crossover.
         *
         * @method _defThumbMoveFn
         * @param e { EventFacade } The host's thumbMove event
         * @protected
         */
        _defThumbMoveFn: function ( e ) {
			
			var previous, value;
			var thumbPos, thumb2Pos;
			var flipped = this.get( THUMBSFLIPPED );
			var imagePadding = -1;
			var thumbWidth = this.thumb.getStyle('width').replace('px', '') - 1, thumb2Width = this.thumb2.getStyle('width').replace('px', '') - 1;
			
			switch (this.axis) {
				case 'x':						
					thumbPos = this.thumb.getX();
					thumb2Pos = this.thumb2.getX();
					break;
				case 'y':
					thumbPos = this.thumb.getY();
					thumb2Pos = this.thumb2.getY();						
					break;
			}	
			
			if (e.ddEvent && e.ddEvent.currentTarget == e.target._dd) {
				previous = this.getValue();
				value    = this._offsetToValue( e.offset );
								
				if (!flipped && thumbPos > thumb2Pos - thumbWidth) 
						imagePadding = -thumbWidth;														
				else if (flipped && thumbPos < thumb2Pos + thumbWidth)
						imagePadding = thumbWidth;
				
				if (imagePadding != -1) {							
					switch (this.axis) {
						case 'x':						
							this.thumb.setX(thumb2Pos + imagePadding);
							break;
						case 'y':
							this.thumb.setY(thumb2Pos + imagePadding);					
							break;
					}								
					e.halt();
				}		
				else if ( previous !== value && value != this.getValue2() )
					this.set( VALUE, value, { positioned: true } );							
			}
			else if (e.ddEvent && e.ddEvent.currentTarget == e.target._dd2) {
				previous = this.getValue2();
				value    = this._offsetToValue( e.offset );
				
				if (!flipped && thumbPos > thumb2Pos - thumb2Width)
					imagePadding = thumb2Width;
				else if (flipped && thumbPos < thumb2Pos + thumb2Width)
					imagePadding = -thumb2Width;
				
				if (imagePadding != -1) {							
					switch (this.axis) {
						case 'x':						
							this.thumb2.setX(thumbPos + imagePadding);
							break;
						case 'y':
							this.thumb2.setY(thumbPos + imagePadding);				
							break;
					}														
					e.halt();
				}				
				else if ( previous !== value && value != this.getValue() )				
					this.set( VALUE2, value, { positioned: true } );								
			}
        },		
		
		/**
         * Returns the current value.  Override this if you want to introduce
         * output formatting. Otherwise equivalent to slider.get( "value" );
         *
         * @method getValue
         * @return {Number}
         */
        getValue2: function () {
            return this.get( VALUE2 );
        },
		
		/**
         * Updates the current value.  Override this if you want to introduce
         * input value parsing or preprocessing.  Otherwise equivalent to
         * slider.set( "value", v );
         *
         * @method setValue
         * @param val {Number} The new value
         * @return {Slider}
         * @chainable
         */
        setValue2: function ( val ) {			
            return this.set( VALUE2, val);
        },
		
		_setThumbsFlipped: function( val ) {
			return this.set( THUMBSFLIPPED, val);
		},
		
		/**
		 * Synchronizes the DOM state with the attribute settings.
		 *
		 * @method syncUI
		 */
		syncUI : function () {
			this._dd.con.resetCache();

			this._syncThumbPosition();
			this._syncThumbPosition2();			
		},
		
		/**
         * Move the thumb to appropriate position if necessary.  Also resets
         * the cached offsets and recalculates the conversion factor to
         * translate position to value.
         *
         * @method _syncThumbPosition
         * @protected
         */
        _syncThumbPosition2: function () {
            this._calculateFactor();

            var offset =  this._valueToOffset(this.get( VALUE2 ));
			
			if ( this.thumb2 ) {
				this.thumb2.setStyle( this._key.minEdge, offset + 'px' );

				this.fire( 'thumbMove', { offset: offset } );
			}
        }
		
	}, {

    // Y.SliderBase static properties

    /**
     * The identity of the widget.
     *
     * @property DualSlider.NAME
     * @type String
     * @default 'dualslider'
     * @readOnly
     * @protected
     * @static
     */
    NAME : 'DualSlider',

    /**
     * Static property used to define the default attribute configuration of
     * the Widget.
     *
     * @property SliderBase.ATTRS
     * @type {Object}
     * @protected
     * @static
     */
    ATTRS : {			
		/**
         * The second value associated with the second thumb's current position on the
         * rail. Defaults to the value inferred from the thumb's current
         * position. Specifying value in the constructor will move the
         * thumb to the position that corresponds to the supplied value.
         *
         * @attribute value2
         * @type { Number }
         * @default (inferred from current thumb position)
         */
        value2: {
            value : 0,
            setter: '_setNewValue'
        },
		/**
		* Used to detect when the value of slider2 > slider1
		*/
		thumbsFlipped : {
			value : 0,
			setter:	'_setThumbsFlipped'
		}		
	}
    });

}, '0.0.0', {
	requires:['widget', 'substitute', 'dd-constrain'], use:['slider-base', 'slider-value-range', 'clickable-rail', 'range-slider']
});
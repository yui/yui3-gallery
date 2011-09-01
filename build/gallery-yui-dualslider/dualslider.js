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
			
			this._uiMoveThumb2(offset);
        },
		/**
		 * Moves the thumb2 to pixel offset position along the rail.
		 *
		 * @method _uiMoveThumb2
		 * @param offset {Number} the pixel offset to set as left or top style
		 * @protected
		 */
		_uiMoveThumb2: function ( offset ) {
			if ( this.thumb2 ) {
				this.thumb2.setStyle( this._key.minEdge, offset + 'px' );

				this.fire( 'thumbMove', { offset: offset } );
			}
		},
		/**
         * Default behavior for the railMouseDown event.  Centers the thumb at
         * the click location and passes control to the DDM to behave as though
         * the thumb itself were clicked in preparation for a drag operation.
         *
         * @method _defRailMouseDownFn
         * @param e {Event} the EventFacade for the railMouseDown custom event
         * @protected
         */
        _defRailMouseDownFn: function (e) {
            e = e.ev;

            // Logic that determines which thumb should be used is abstracted
            // to someday support multi-thumb sliders
            var dd     = this._resolveThumb(e),
                i      = this._key.xyIndex,
                length = parseFloat(this.get('length'), 10),
                thumb,
                thumbSize,
                xy;
                
            if (dd) {
                thumb = dd.get('dragNode');
                thumbSize = parseFloat(thumb.getStyle(this._key.dim), 10);

                // Step 1. Allow for aligning to thumb center or edge, etc
                xy = this._getThumbDestination(e, thumb);

                // Step 2. Remove page offsets to give just top/left style val
                xy = xy[ i ] - this.rail.getXY()[i];

                // Step 3. Constrain within the rail in case of attempt to
                // center the thumb when clicking on the end of the rail
                xy = Math.min(
                        Math.max(xy, 0),
                        (length - thumbSize));

				var newTarget;
				if (this._dd == dd) {
					this._uiMoveThumb(xy);
					newTarget = this.thumb.one('img') || this.thumb;
				}
				else {
					this._uiMoveThumb2(xy);
					newTarget = this.thumb2.one('img') || this.thumb2;
				}					

                // Set e.target for DD's IE9 patch which calls
                // e.target._node.setCapture() to allow imgs to be dragged.
                // Without this, setCapture is called from the rail and rail
                // clicks on other Sliders may have their thumb movements
                // overridden by a different Slider (the thumb on the wrong
                // Slider moves).
                e.target = newTarget;

                // Delegate to DD's natural behavior
                dd._handleMouseDownEvent(e);

                // TODO: this won't trigger a slideEnd if the rail is clicked
                // check if dd._move(e); dd._dragThreshMet = true; dd.start();
                // will do the trick.  Is that even a good idea?
            }
        },
		/**
         * Resolves which thumb to actuate if any.  Override this if you want to
         * support multiple thumbs.  By default, returns the Drag instance for
         * the thumb stored by the Slider.
         *
         * @method _resolveThumb
         * @param e {DOMEvent} the mousedown event object
         * @return {Y.DD.Drag} the Drag instance that should be moved
         * @protected
         */
        _resolveThumb: function (e) {
			//Get distance from thumb
			var distToThumb = e.clientX - this.thumb.getX() , distToThumb2 = e.clientX - this.thumb2.getX();
			
			//Change negative values to positive
			if (distToThumb < 0)
				distToThumb *= -1;
			if (distToThumb2 < 0)
				distToThumb2 *= -1;
				
			if (distToThumb < distToThumb2)
				return this._dd;
			else
				return this._dd2;
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
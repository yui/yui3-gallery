/**
 * A simple YUI3 slideshow kit inspired by the jQuery Cycle plugin.
 * @module gallery-yui-slideshow
 * @requires widget, transition, event-mouseenter
 * @author Josh Lizarraga
 */

	/**
	* @class Slideshow
	* @constructor
	* @param {Object} config Widget configuration object.
	*/
    var Slideshow = function(config){
    	
        Slideshow.superclass.constructor.apply(this, arguments);
        
    };
	
	/**
	* @property NAME
	* @type String
	* @default Slideshow
	*/
	Slideshow.NAME = 'Slideshow';
	
	// Presets:
	
	Slideshow.PRESETS = {
		
		/**
		* Incoming slide fades in.
		* Outgoing slide fades out.
		* @property PRESETS.fade
		* @type Preset Slide Transition
		*/
		fade: {
			slideIn: {
				before: {
					opacity: 0
				},
				transition: {
					opacity: 1
				}
			},
			slideOut: {
				before: {
					opacity: 1
				},
				transition: {
					opacity: 0
				}
			}
		},
		
		/**
		* Both slides slide from top to bottom.
		* @property PRESETS.slideDown
		* @type Preset Slide Transition
		*/
		slideDown: {
			slideIn: {
				before: {
					bottom: 'cH'
				},
				transition: {
					bottom: '0px'
				}
			},
			slideOut: {
				before: {
					bottom: '0px'
				},
				transition: {
					bottom: '-cH'
				}
			}
		},
		
		/**
		* Both slides slide from right to left.
		* @property PRESETS.slideRight
		* @type Preset Slide Transition
		*/
		slideLeft: {
			slideIn: {
				before: {
					right: '-cW'
				},
				transition: {
					right: '0px'
				}
			},
			slideOut: {
				before: {
					right: '0px'
				},
				transition: {
					right: 'cW'
				}
			}
		},
		
		/**
		* Both slides slide from bottom to top.
		* @property PRESETS.slideUp
		* @type Preset Slide Transition
		*/
		slideUp: {
			slideIn: {
				before: {
					top: 'cH'
				},
				transition: {
					top: '0px'
				}
			},
			slideOut: {
				before: {
					top: '0px'
				},
				transition: {
					top: '-cH'
				}
			}
		},
		
		/**
		* Both slides slide from left to right.
		* @property PRESETS.slideRight
		* @type Preset Slide Transition
		*/
		slideRight: {
			slideIn: {
				before: {
					left: '-cW'
				},
				transition: {
					left: '0px'
				}
			},
			slideOut: {
				before: {
					left: '0px'
				},
				transition: {
					left: 'cW'
				}
			}
		}
		
	};
	
	// Attributes:
	
    Slideshow.ATTRS = {
		
		/**
		* Slides NodeList instance.
		* @attribute slides
		* @type NodeList
		* @default null
		*/
		slides: {
			value: null
		},
		
		/**
		* Current slide index.
		* @attribute currentIndex
		* @type Integer
		* @default 0
		*/
		currentIndex: {
			value: 0
		},
		
		/**
		* Previous slide button Node/NodeList/selector string.
		* @attribute previousButton
		* @type Mixed
		* @default null
		*/
		previousButton: {
			value: null
		},
		
		/**
		* Next slide button Node/NodeList/selector string.
		* @attribute nextButton
		* @type Mixed
		* @default null
		*/
		nextButton: {
			value: null
		},
		
		/**
		* Pause button Node/NodeList/selector string.
		* @attribute pauseButton
		* @type Mixed
		* @default null
		*/
		pauseButton: {
			value: null
		},
		
		/**
		* Play button Node/NodeList/selector string.
		* @attribute playButton
		* @type Mixed
		* @default null
		*/
		playButton: {
			value: null
		},
		
		/**
		* Node/selector string for the element whose children correspond to slides.
		* This setting works best with an ordered list of links.
		* @attribute pages
		* @type Mixed
		* @default null
		*/
		pages: {
			value: null
		},
		
		/**
		* Time interval between slide transitions in seconds.
		* @attribute interval
		* @type Float
		* @default 4
		*/
		interval: {
			value: 4
		},
		
		/**
		* Set to false to disable autoplay.
		* @attribute autoplay
		* @type Boolean
		* @default true
		*/
		autoplay: {
			value: true
		},
		
		/**
		* Set to false to continue autoplay when the user changes slides.
		* @attribute pauseOnChange
		* @type Boolean
		* @default true
		*/
		pauseOnChange: {
			value: true
		},
		
		/**
		* Set to false to continue playing when the user hovers over the slideshow.
		* @attribute pauseOnHover
		* @type Boolean
		* @default true
		*/
		pauseOnHover: {
			value: true
		},
		
		/**
		* Default duration for slide transitions.
		* @attribute duration
		* @type Float
		* @default null
		*/
		duration: {
			value: 0.5
		},
		
		/**
		* Default slide transition easing.
		* @attribute easing
		* @type String
		* @default ease-out
		*/
		easing: {
			value: 'ease-out'
		},
		
		/**
		* Default slide transition.
		* @attribute transition
		* @type Slide Transition
		* @default Slideshow.PRESETS.fade
		*/
		transition: {
			value: Slideshow.PRESETS.fade
		},
		
		/**
		* Default transIn (incoming slide) "before" settings. Sets z-index to 1.
		* @attribute transInBefore
		* @type Object
		* @default (See source)
		*/
		transInBefore: {
			value: {
				zIndex: 1
			}
		},
		
		/**
		* Default transIn (incoming slide) "after" settings. Sets z-index to 2.
		* @attribute transInAfter
		* @type Object
		* @default (See source)
		*/
		transInAfter: {
			value: {
				zIndex: 2
			}
		},
		
		/**
		* Default transOut (outgoing slide) "before" settings. Sets z-index to 2.
		* @attribute transOutBefore
		* @type Object
		* @default (See source)
		*/
		transOutBefore: {
			value: {
				zIndex: 2
			}
		},
		
		/**
		* Default transOut (outgoing slide) "after" settings. Sets z-index to -30000.
		* @attribute transOutAfter
		* @type Object
		* @default (See source)
		*/
		transOutAfter: {
			value: {
				zIndex: -30000
			}
		},
		
		/**
		* Changes timer from setInterval to setTimeout. Can be useful for debugging slide transitions.
		* @attribute _debug
		* @protected
		* @type Boolean
		* @default false
		*/
		_debug: {
			value: false
		},
		
		/**
		* The ID returned by autoplay's setInterval call.
		* @attribute _intervalID
		* @protected
		* @type Integer
		* @default null
		*/
		_intervalID: {
			value: null
		},
		
		/**
		* Paused flag.
		* @attribute _isPaused
		* @protected
		* @type Boolean
		* @default true
		*/
		_isPaused: {
			value: true
		}
		
    };
    
    Y.extend(Slideshow, Y.Widget, {
		
		// Public methods:
		
		/**
		* Advances the slideshow by one slide.
		* @method next
		*/
        next: function(){
			
			if( this.get('pauseOnChange') ){
				
				this.pause();
				
			}
			
			this.slide('next');
			
        },
		
		/**
		* Pauses the slideshow.
		* @method pause
		*/
        pause: function(){
			
			if( !this.get('_isPaused') ){
				
				window.clearInterval( this.get('_intervalID') );
				
				this.set('_isPaused', true);
				
			}
			
        },
		
		/**
		* Plays the slideshow.
		* @method play
		*/
        play: function(){
			
			var $that = this,
				$function;
			
			if( this.get('_isPaused') ){
				
				$function = this.get('_debug') ? 'setTimeout' : 'setInterval' ;
				
				this.set( '_intervalID', window[$function](function(){
					
					$that.slide('next');
					
				}, parseInt( this.get('interval') * 1000, 10 )) );
				
				this.set('_isPaused', false);
				
			}
			
        },
		
		/**
		* Reverses the slideshow by one slide.
		* @method previous
		*/
        previous: function(){
			
			if( this.get('pauseOnChange') ){
				
				this.pause();
				
			}
			
			this.slide('previous');
			
        },
		
		/**
		* Advances the slideshow to a given slide.
		* @method slide
		* @param $which {Mixed} The slide to advance to. Can be a slide index, "next", or "previous".
		*/
        slide: function($which){
			
			var $that				= this,
				$currentIndex		= this.get('currentIndex'),
				$slides				= this.get('slides'),
				$slideTransition	= this.get('transition'),
				$outgoingSlide,
				$incomingSlide;
			
			$outgoingSlide = $slides.item($currentIndex);
			
			switch( $which ){
				
				case 'next':
					
					if( $currentIndex + 1 < $slides.size() ){
						
						$currentIndex++;
						
					}
					
					else {
						
						$currentIndex = 0;
						
					}
					
					break;
					
				case 'previous':
					
					if( $currentIndex - 1 > -1 ){
						
						$currentIndex--;
						
					}
					
					else {
						
						$currentIndex = $slides.size() - 1;
						
					}
					
					break;
					
				default:
					
					if( $which == $currentIndex ){
						
						return false;
						
					} else {
						
						$currentIndex = parseInt( $which, 10 );
						
					}
					
					break;
				
			}
			
			this.set('currentIndex', $currentIndex);
			
			$incomingSlide = $slides.item($currentIndex);
			
			// Duraton and easing:
			
			if( Y.Lang.isUndefined($slideTransition.slideOut.transition.duration) ){
				
				$slideTransition.slideOut.transition.duration = this.get('duration');
				
			}
			
			if( Y.Lang.isUndefined($slideTransition.slideOut.transition.easing) ){
				
				$slideTransition.slideOut.transition.easing = this.get('easing');
				
			}
			
			if( Y.Lang.isUndefined($slideTransition.slideIn.transition.duration) ){
				
				$slideTransition.slideIn.transition.duration = this.get('duration');
				
			}
			
			if( Y.Lang.isUndefined($slideTransition.slideIn.transition.easing) ){
				
				$slideTransition.slideIn.transition.easing = this.get('easing');
				
			}
			
			// Default "before" styles:
			
			this._setStyles( $outgoingSlide, this.get('transOutBefore') );
			
			this._setStyles( $incomingSlide, this.get('transInBefore') );
			
			// Transition "before" styles:
			
			if( Y.Lang.isObject($slideTransition.slideOut.before) ){
				
				this._setStyles( $outgoingSlide, $slideTransition.slideOut.before );
				
			}
			
			if( Y.Lang.isObject($slideTransition.slideIn.before) ){
				
				this._setStyles( $incomingSlide, $slideTransition.slideIn.before );
				
			}
			
			// Transitions:
			
			$slideTransition.slideOut.transition = this._checkTransitionValues($outgoingSlide, $slideTransition.slideOut.transition);
			
			$slideTransition.slideIn.transition = this._checkTransitionValues($incomingSlide, $slideTransition.slideIn.transition);
			
			$outgoingSlide.transition($slideTransition.slideOut.transition, function(){
				
				// Default "after" styles:
				
				$that._setStyles( $outgoingSlide, $that.get('transOutAfter') );
				
				// Transition "after" styles:
				
				if( Y.Lang.isObject($slideTransition.slideOut.after) ){
					
					$that._setStyles( $outgoingSlide, $slideTransition.slideOut.after );
					
				}
				
			});
			
			$incomingSlide.transition($slideTransition.slideIn.transition, function(){
				
				// Default "after" styles:
				
				$that._setStyles( $incomingSlide, $that.get('transInAfter') );
				
				// Transition "after" styles:
				
				if( Y.Lang.isObject($slideTransition.slideIn.after) ){
					
					$that._setStyles( $incomingSlide, $slideTransition.slideIn.after );
					
				}
				
			});
			
        },
		
		// Protected methods:
		
		/**
		* Checks CSS values for shortcut keywords.
		* @method _checkCSSValue
		* @protected
		* @param {Node} $node The Node to use if shortcut keywords are found.
		* @param {Mixed} $value The CSS value to check.
		* @return {Mixed} The parsed CSS value.
		*/
        _checkCSSValue: function($node, $value){
			
			switch( $value ){
				
				case 'cW':
				case 'containerWidth':
					
					return parseInt(this.get('contentBox').get('offsetWidth'), 10) + 'px';
					
					break;
					
				case '-cW':
				case '-containerWidth':
					
					return (parseInt(this.get('contentBox').get('offsetWidth'), 10) * -1) + 'px';
					
					break;
					
				case 'cH':
				case 'containerHeight':
					
					return parseInt(this.get('contentBox').get('offsetHeight'), 10) + 'px';
					
					break;
					
				case '-cH':
				case '-containerHeight':
					
					return (parseInt(this.get('contentBox').get('offsetHeight'), 10) * -1) + 'px';
					
					break;
					
				case 'sW':
				case 'slideWidth':
					
					return parseInt($node.get('offsetWidth')) + 'px';
					
					break;
					
				case '-sW':
				case '-slideWidth':
					
					return (parseInt($node.get('offsetWidth')) * -1) + 'px';
					
					break;
					
				case 'sH':
				case 'slideHeight':
					
					return parseInt($node.get('offsetHeight')) + 'px';
					
					break;
					
				case '-sH':
				case '-slideHeight':
					
					return (parseInt($node.get('offsetHeight')) * -1) + 'px';
					
					break;
					
				default:
					
					return $value;
					
					break;
					
			}
			
        },
		
		/**
		* Sanitizes transition values with _checkCSSValue.
		* @method _checkTransitionValues
		* @protected
		* @param {Node} $node The Node to use if shortcut keywords are found.
		* @param {Object} $transition The transition to check.
		* @return {Mixed} The sanitized transition.
		*/
        _checkTransitionValues: function($node, $transition){
			
			var $sanitized = {},
				$i;
			
			for( i in $transition ){
				
				if( i == 'duration' || i == 'easing' || i == 'delay' ){
					
					$sanitized[i] = $transition[i];
					
				} else {
					
					$sanitized[i] = this._checkCSSValue($node, $transition[i]);
					
				}
				
			}
			
			return $sanitized;
			
        },
		
		/**
		* Handles clicks on pagination elements.
		* @method _handlePageClick
		* @protected
		* @param {Event} e The Event object.
		*/
        _handlePageClick: function(e){
			
			if( this.get('pauseOnChange') ){
				
				this.pause();
				
			}
			
			e.target = e.target.ancestor( '.' + this.getClassName('page') );
			
			this.slide( this.get('pages').indexOf(e.target) );
			
        },
		
		/**
		* Sets styles after they are sanitized by _checkCSSValue.
		* @method _setStyles
		* @protected
		* @param {Node} $node The node to style.
		* @param {Object} $styles The styles to set.
		*/
        _setStyles: function($node, $styles){
			
			for( var i in $styles ){
				
				if( $styles.hasOwnProperty(i) ){
					
					$node.setStyle(i, this._checkCSSValue($node, $styles[i]));
					
				}
				
			}
			
        },
		
		// Lifecycle methods:
		
		/**
		* Binds event handlers to previous, next, pause, and play buttons.
		* @method bindUI
		*/
        bindUI: function(){
			
			var $buttons = ['previous', 'next', 'pause', 'play'],
				$pages = this.get('pages'),
				$button,
				$target,
				i;
			
			// Buttons:
			
			for( i = 0; i < $buttons.length; i++ ){
				
				$target = this.get( $buttons[i] + 'Button' );
				
				if( !Y.Lang.isNull($target) ){
					
					Y.on('click', this[$buttons[i]], $target, this);
					
				}
				
			}
			
			// Pages?
			
			if( !Y.Lang.isNull($pages) ){
				
				$pages.on('click', this._handlePageClick, this);
				
			}
			
			// Hover?
			
			if( this.get('pauseOnHover') ){
				
				this.get('contentBox').on('mouseenter', this.pause, this);
				
				this.get('contentBox').on('mouseleave', this.play, this);
				
			}
			
        },
		
		/**
		* Sets initial widget state.
		* @method bindUI
		*/
        syncUI: function(){
			
			var $that = this,
				$pages = this.get('pages'),
				$count = 0;
			
			// Slides:
			
			this.get('slides').each(function( $node ){
				
				$count++;
				
				if( $count > 1 ){
					
					$node.setStyles( $that.get('transOutAfter') );
					
				}
				
			});
			
			// Pages?
			
			if( !Y.Lang.isNull($pages) ){
				
				$pages.addClass( this.getClassName('page') );
				
			}
			
			// Autoplay?
			
			if( this.get('autoplay') ){
				
				this.play();
				
			}
			
        },
        
		/**
		* Initializes the Slideshow.
		* @method initializer
		*/
        initializer: function(){
			
			var $pages = this.get('pages');
			
			// Slides:
			
			this.set('slides', this.get('contentBox').get('children'));
			
			// Pages?
			
			if( Y.Lang.isString($pages) ){
				
				$pages = Y.one($pages);
				
			}
			
			if( !Y.Lang.isNull($pages) ){
				
				$pages = $pages.get('children');
				
			}
			
			this.set('pages', $pages);
			
        }
        
    });
    
	Y.Slideshow = Slideshow;    
    
	// Transitions:
	
	Y.Transitions = {

		none: {},
		staticTL: {
			from: {
				top: 0,
				left: 0
			},
			to: {
				top: 0,
				left: 0
			}
		},
		staticTR: {
			from: {
				top: 0,
				right: 0
			},
			to: {
				top: 0,
				right: 0
			}
		},
		staticBL: {
			from: {
				bottom: 0,
				left: 0
			},
			to: {
				bottom: 0,
				left: 0
			}
		},
		staticBR: {
			from: {
				bottom: 0,
				right: 0
			},
			to: {
				bottom: 0,
				right: 0
			}
		},
		fadeIn: {
			from: {
				opacity: 0
			},
			to: {
				opacity: 1
			}
		},
		fadeOut: {
			from: {
				opacity: 1
			},
			to: {
				opacity: 0
			}
		},
		swipeInLTR: {
			from: {
				left: function(node){
					return parseInt(-(node.get('parentNode').get('offsetWidth')), 10);
				}
			},
			to: {
				left: 0
			}
		},
		swipeOutLTR: {
			from: {
				left: 0
			},
			to: {
				left: function(node){
					return parseInt(node.get('parentNode').get('offsetWidth'), 10);
				}
			}
		},
		swipeInRTL: {
			from: {
				right: function(node){
					return parseInt(-(node.get('parentNode').get('offsetWidth')), 10);
				}
			},
			to: {
				right: 0
			}
		},
		swipeOutRTL: {
			from: {
				right: 0
			},
			to: {
				right: function(node){
					return parseInt(node.get('parentNode').get('offsetWidth'), 10);
				}
			}
		},
		swipeInTTB: {
			from: {
				top: function(node){
					return parseInt(-(node.get('parentNode').get('offsetHeight')), 10);
				}
			},
			to: {
				top: 0
			}
		},
		swipeOutTTB: {
			from: {
				top: 0
			},
			to: {
				top: function(node){
					return parseInt(node.get('parentNode').get('offsetHeight'), 10);
				}
			}
		},
		swipeInBTT: {
			from: {
				bottom: function(node){
					return parseInt(-(node.get('parentNode').get('offsetHeight')), 10);
				}
			},
			to: {
				bottom: 0
			}
		},
		swipeOutBTT: {
			from: {
				bottom: 0
			},
			to: {
				bottom: function(node){
					return parseInt(node.get('parentNode').get('offsetHeight'), 10);
				}
			}
		}

	}; // Y.Transitions
	
	Y.Slideshow = function(pTarget, pConfig){
		
		// Target:
		
		switch(typeof(pTarget)){
			
			case 'string':
			
				this.id = (pTarget.indexOf('#') === 0) ? pTarget : '#' + pTarget;
				this.container = Y.one(this.id);
				break;
				
			case 'object':
			
				if(Y.Lang.isArray(pTarget)){
					
					var oSlideshows = [];
					for(var i=0; i<pTarget.length; i++){
						oSlideshows.push(new Y.Slideshow(pTarget[i], pConfig));
					}
					return oSlideshows;
					
				} else if(!Y.Lang.isUndefined(pTarget._node)){
					
					this.id = (pTarget.get('id') === '') ? Y.guid(): pTarget.get('id');
					pTarget.set('id', this.id);
					this.id = (this.id.indexOf('#') === 0) ? this.id : '#' + this.id;
					this.container = pTarget;
					break;
					
				} else if(!Y.Lang.isUndefined(pTarget.nodeName)){
					
					this.id = (pTarget.id === '') ? Y.guid(): pTarget.id;
					this.id = (this.id.indexOf('#') === 0) ? this.id : '#' + this.id;
					this.container = Y.one(this.id);
					break;
					
				}
				
			default:
			
				return false;
				
		}
		
		// Lazy load?
		
		if(Y.Lang.isObject(pConfig)){
			if(!Y.Lang.isUndefined(pConfig.lazyLoad)){
				this.container.append(pConfig.lazyLoad);
			}
		}
		
		// Properties:
		
		this.slides = this.container.get('children');
		
		this.zIndex = {
			container: 1,
			slides: 2,
			nextSlide: 3,
			currentSlide: 4
		};
		
		this.transIn = Y.Transitions.fadeIn;
		this.transOut = Y.Transitions.fadeOut;
		
		this.easingIn = Y.Easing.easeOut;
		this.easingOut = Y.Easing.easeOut;
		
		this.currentSlide = 0;
		this.interval = 4000;
		this.duration = 0.5;
		
		this.autoplay = true;
		this.debug = false; // Changes autoplay timer from setInterval to setTimeout.
		
		this.loop = false;
		
		this.previousButton = false;
		this.nextButton = false;
		this.playButton = false;
		this.pauseButton = false;
		this.stopOnUser = true;
		
		// Config:
		
		if(Y.Lang.isObject(pConfig)){
			for(var i in pConfig){
				if(pConfig.hasOwnProperty(i)){
					this[i] = pConfig[i];
				}
			}
		}
		
		var that = this;
		
		// Methods:
				
		this.slideChange = function(pWhich){
			
			var oOutAnimObject = { node: this.slides.item(this.currentSlide) };
			
			switch(pWhich){
				case 'next':
					if(this.currentSlide + 1 < this.slides.size()){
						this.currentSlide++;
					} else {
						this.currentSlide = 0;
					}
					break;
				case 'previous':
					if(this.currentSlide - 1 > -1){
						this.currentSlide--;
					} else {
						this.currentSlide = this.slides.size() - 1;
					}
					break;
				default:
					this.currentSlide = parseInt(pWhich, 10);
			}
			
			var oInAnimObject = { node: this.slides.item(this.currentSlide) };
			
			oInAnimObject.node.setStyle('zIndex', this.zIndex.nextSlide);
			
			for(var i in this.transOut){
				if(this.transOut.hasOwnProperty(i)){
					oOutAnimObject[i] = this.transOut[i];
				}
			}
			for(var i in this.transIn){
				if(this.transIn.hasOwnProperty(i)){
					oInAnimObject[i] = this.transIn[i];
				}
			}
			
			var oOutAnim = new Y.Anim(oOutAnimObject);
			var oInAnim = new Y.Anim(oInAnimObject);
			
			if(Y.Lang.isUndefined(oOutAnimObject.duration)){
				oOutAnim.set('duration', this.duration);
			}
			if(Y.Lang.isUndefined(oInAnimObject.duration)){
				oInAnim.set('duration', this.duration);
			}
			if(Y.Lang.isUndefined(oOutAnimObject.easing)){
				oOutAnim.set('easing', this.easingOut);
			}
			if(Y.Lang.isUndefined(oInAnimObject.easing)){
				oInAnim.set('easing', this.easingIn);
			}
			
			oOutAnim.on('end', function(){
				oOutAnimObject.node.setStyle('zIndex', this.zIndex.slides);
			}, this);
			oInAnim.on('end', function(){
				oInAnimObject.node.setStyle('zIndex', this.zIndex.currentSlide);
			}, this);
			
			oOutAnim.run();
			oInAnim.run();
			
		}; // slideChange()
		
		this.startLoop = function(){
			if(this.autoplay === true){
				if(this.debug === false){
					this.loop = setInterval(function(){ that.slideChange('next'); }, this.interval);
				} else if(this.debug === true) {
					this.loop = setTimeout(function(){ that.slideChange('next'); }, this.interval);
				}
			}
		}; // startLoop()
		
		// Init - Set positioning and z-indexes:
				
		this.container.setStyles({
			position: 'relative',
			zIndex: this.zIndex.container
		});
		this.slides.setStyles({
			position: 'absolute',
			zIndex: this.zIndex.slides
		});
		this.slides.item(this.currentSlide).setStyle('zIndex', this.zIndex.currentSlide);
		this.slides.item(this.currentSlide + 1).setStyle('zIndex', this.zIndex.nextSlide);
		
		// Init - Controls:
		
		if(this.previousButton !== false){
			Y.on('click', function(){
				if(this.loop !== false && this.stopOnUser === true){
					clearInterval(this.loop);
					this.loop = false;
				}
				this.slideChange('previous');
			}, this.previousButton, this);
		}
		if(this.nextButton !== false){
			Y.on('click', function(){
				if(this.loop !== false && this.stopOnUser === true){
					clearInterval(this.loop);
					this.loop = false;
				}
				this.slideChange('next');
			}, this.nextButton, this);
		}
		if(this.playButton !== false){
			Y.on('click', function(){
				if(this.loop === false){
					this.startLoop();
				}
			}, this.playButton, this);
		}
		if(this.pauseButton !== false){
			Y.on('click', function(){
				if(this.loop !== false){
					clearInterval(this.loop);
				}
			}, this.pauseButton, this);
		}
		
		// Init - Start loop:
		
		this.startLoop();
		
	}; // Y.Slideshow()
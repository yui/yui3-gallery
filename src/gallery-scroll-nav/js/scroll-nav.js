	var ScrollNav;
	
	ScrollNav = function(config) {
		ScrollNav.superclass.constructor.apply(this, arguments);
	};
	
	Y.extend(ScrollNav, Y.Plugin.Base, {
		initializer : function(config){
			Y.delegate('click', function(e){

				var href = e.currentTarget.getAttribute('href'),
				    targetY, hash, anim;

		        // make sure the link we clicked has a hash and is for this page
		        if('#' !== href.substring(0,1)){
		            return;
		        }
		        
		        // if we made it this far let's prevent the link from firing
		        e.preventDefault();
		        
		        // get the hash from the clicked href
		        hash = href.substring(1);
		        
		        // find the target with the hash
		        if(hash === '') {
		        	targetY = 0;
		        }else{
		        	targetY = Y.one('a[name=' + hash + ']').getY();
		        }

		        if(targetY !== null) {
		        	// pause the animation if it's running,
		        	// stopping causes the scroll bar to jump
		            try {
		            	if(this.anim.get('running')) {
		            		this.anim.pause();
		            	}
		            }catch(e){
		                // no animation to pause
		            }
		
		            // record current window conditions
		            var winH = Y.DOM.winHeight(),
		                docH = Y.DOM.docHeight();
		            
		            // create the animation and run it
			        this.anim = new Y.Anim({
			            node: this.get('scroller'),
			            to: { // can't scoll to target if it's beyond the doc height - window height
			                scroll : [Y.DOM.docScrollX(), Math.min(docH - winH, targetY)]
			            },
			            duration: this.get('duration'),
			            easing: this.get('easing'),
		                on : {
		                    end : function() { location.hash = hash; }
			            }
			        }).run();
		        }
			}, this.get('host'), this.get('selector'), this);
		}
	},{
		NAME : 'scroll-nav',
		NS : 'scrollNav',
		ATTRS : {
			easing : {
				value : Y.Easing.easeOutStrong
	        },
			duration : {
	        	value : 1.5
	        },
	        selector : {
	        	value : 'a'
	        },
	        scroller : {
	        	value : 'window'
	        }
		}
	});
	
	Y.namespace('Plugin').ScrollNav = ScrollNav;

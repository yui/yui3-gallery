YUI.add('gallery-nmresizer', function(Y) {

YUI.add('gallery-nmresizer', function(Y){    
    Y.Nmresizer = Y.Base.create('nmresizer', Y.Widget, [], { 
		initializer : function( config ) {
			
		},
		
		loadAndResize : function(config) {
			// check for required parameters
			if (typeof config.newdiv == "undefined") {
				return;
			}
			else if (typeof config.resizediv == "undefined") {
				return;
			}
			
			if (!config.olddiv.match(/^(#|\.)/)) {
				// CSS class or ID not specified, default to ID
				config.olddiv = '#' + config.olddiv;
			}
			if (!config.newdiv.match(/^(#|\.)/)) {
				// CSS class or ID not specified, default to ID
				config.newdiv = '#' + config.newdiv;
			}
			if (typeof config.animDuration !== "undefined") {
				// use provided animDuration, overriding default
				this.set('animDuration', config.animDuration);
			}
			if (typeof config.maxWidth !== "undefined") {
				this.set('maxWidth', config.maxWidth);
			}
			if (typeof config.maxHeight !== "undefined") {
				this.set('maxHeight', config.maxHeight);
			}
			if (typeof config.offsetWidth !== "undefined") {
				this.set('offsetWidth', config.offsetWidth);
			}
			if (typeof config.offsetHeight !== "undefined") {
				this.set('offsetHeight', config.offsetHeight);
			}
			
			config.resizediv = config.resizediv ? config.resizediv : config.newdiv;
			
			// determine current tab dimensions
			config.oldtabheight = Y.one(config.resizediv).getComputedStyle('height');
			config.oldtabwidth = Y.one(config.resizediv).getComputedStyle('width');
			
			// delay measurement until all images in config.newdiv have been loaded
			if (Y.one(config.newdiv + ' img')) {
				var totalimages = Y.all(config.newdiv + ' img').size();
				var imagesloaded = 0;
				var images = [];
				var nmresizer = this;
				Y.all(config.newdiv + ' img').each(function(o,idx) {
					if (o.get('src') && o.get('src').match(/\.(jpg|jpeg|gif|png)$/i)) {
						images[idx] = new Image();
						images[idx].src = o.get('src');
						images[idx].onload = function() {
							//o.set('src', images[idx].src);
							imagesloaded++;
							if (imagesloaded == totalimages) {
								nmresizer.doLoadAndResize(config);
							}
						};
						images[idx].onerror = function() {
							// image load attempted, record it (perhaps image didn't exist in path)
							imagesloaded++;
							if (imagesloaded == totalimages) {
								nmresizer.doLoadAndResize(config);
							}
						};	
					}
					else {
						totalimages--;
						if (!totalimages) { this.doLoadAndResize(config); }
					}
				}, this);
			}
			else {
				this.doLoadAndResize(config);
			}
		},
		
		doLoadAndResize : function(config) {
			Y.one(config.newdiv).setStyles({
				display:'block',
				position:'absolute',
				left:'-5000px',
				visibility:'hidden'
			});
			Y.one(config.newdiv).removeClass('displaynone');
			
			if (typeof config.noWidthResize == "undefined") {
				// resize width
				config.newtabwidth = Y.one(config.newdiv).get('offsetWidth') + this.get('offsetWidth') + 'px';
				if (this.get('maxWidth') && parseInt(config.newtabwidth, 10) > this.get('maxWidth')) {
					config.newtabwidth = this.get('maxWidth') + 'px';
				}
			}
			
			if (typeof config.noHeightResize == "undefined") {
				// resize height
				config.newtabheight = Y.one(config.newdiv).get('offsetHeight') + this.get('offsetHeight') + 'px';
				if (this.get('maxHeight') && parseInt(config.newtabheight, 10) > this.get('maxHeight')) {
					config.newtabheight = this.get('maxHeight') + 'px';
				}
			}
			
			
			// return newdiv to viewport
			Y.one(config.newdiv).setStyles({
				position:'',
				left:''
			});
			
			Y.one(config.resizediv).setStyles({
				width:config.oldtabwidth,
				height:config.oldtabheight
			});
			
			if (config.onStart) {
				config.onStart(config);
			}

			// hide olddiv
			if (config.olddiv !== config.newdiv) {
				Y.one(config.olddiv).setStyles({
					display:'none',
					width:'',
					height:''
				});	
			}

			// start transition
			if ((config.oldtabheight == config.newtabheight && config.oldtabwidth == config.newtabwidth) || config.olddiv == config.newdiv) {
				// no transition necessary, just show new element
				Y.one(config.newdiv).setStyles({
					display:'block',
					visibility:'visible'
				});
				if (config.resizediv !== config.newdiv) {
					Y.one(config.newdiv).setStyles({
						width:'auto',
						height:'auto'
					});
				}
				if (config.onEnd) {
					config.onEnd(config);
				}
			}
			else {
				var transoptions = {
					easing:'ease-out',
					duration:this.get('animDuration')
				};
				
				if (typeof config.newtabwidth !== "undefined") {
					transoptions.width = config.newtabwidth;
				}
				if (typeof config.newtabheight !== "undefined") {
					transoptions.height = config.newtabheight;
				}
				
				// animate resizediv to fit config.newdiv
				Y.all(config.resizediv).transition(transoptions, function() {
					// release inline dimension restraints
					Y.one(config.resizediv).setStyles({
						width:'',
						height:''
					});
					// reveal contents
					Y.one(config.newdiv).setStyles({
						visibility:'visible'
					});
					if (config.resizediv !== config.newdiv) {
						Y.one(config.newdiv).setStyles({
							width:'auto',
							height:'auto'
						});
					}
					if (config.onEnd) {
						config.onEnd(config);
					}
				});
			}
		}
	}, {
        ATTRS : { 
			animDuration : {
				value : 0.5
			},
			maxHeight : {
				value : 0
			},
			maxWidth : {
				value : 0
			},
			offsetWidth : {
				value : 0
			},
			offsetHeight : {
				value : 0
			}
		}
		
	});
    
}, 'gallery-2012.05.02-20-10', {requires: ['base-build', 'widget', 'node', 'transition']});


}, 'gallery-2012.05.02-20-10' ,{requires:['base-build','widget','event-mouseenter','node','transition']});

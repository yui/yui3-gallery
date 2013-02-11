	/**
	 * @module gallery-editor-ui
	 */
 
	/**
	 * @class EditorImageManage
	 * @description EditorImageManage class
	 * @constructor
	 * @extends Base
	 * @param config {Object} configuration object
	 */	
	function EditorImageManage(config) {
		EditorImageManage.superclass.constructor.apply(this, arguments);
	}
	
	EditorImageManage.NAME = 'EditorImageManage';
	EditorImageManage.ATTRS = {
		/**
		 * The DOM element to render our image in. Can be YUI3 node or selector.
		 * @attribute frameEl
		 * @type Object
		 */
		frameEl: {
			value: null,
			writeOnce:true
		},
		/**
		 * The URL to upload the image to, resize image and return JSON. In the assets folder look at upload.phps for an example.
		 * @attribute uploadToUrl
		 * @type String
		 */
		uploadToUrl: {
			value: '/build/gallery-editor-ui/assets/fake-upload.html',
			validator: Y.Lang.isString,
			writeOnce:true
		},
		/**
		 * Can we adjust the height of the image.
		 * @attribute resizeHeight
		 * @type Boolean
		 */
		resizeHeight: {
			value: true,
			validator: Y.Lang.isBoolean,
			writeOnce:true
		},
		/**
		 * Draw UI buttons in manager
		 * @attribute drawUI
		 * @type Boolean
		 */
		drawUI: {
			value: true	
		},
		/**
		 * Image URL which pre-loads into our manager
		 * @attribute file
		 * @type String
		 */
		file: null,
		/**
		 * The frame's initial size dimentsions (height and width) to hold image in
		 * @attribute cellImageSizes
		 * @type Object
		 */
		cellImageSizes: {
			value: {width: 0, height: 0 },
			setter: function (cellImageSizes) {
				cellImageSizes.height = parseInt(cellImageSizes.height,10);
				cellImageSizes.width = parseInt(cellImageSizes.width,10);
				
				return cellImageSizes;
			}
		},
		/**
		 * The image size dimentsions (height and width)
		 * @attribute canvasImageSizes
		 * @type Object
		 */
		canvasImageSizes: {
			value: {width: 0, height: 0 },
			setter: function (canvasImageSizes) {
				canvasImageSizes.height = parseInt(canvasImageSizes.height,10);
				canvasImageSizes.width = parseInt(canvasImageSizes.width,10);
				
				return canvasImageSizes;
			}
		},
		cell: null,
		top:{
			value: 0
		},
		left:{
			value: 0	
		},
		img: null,
		img_src: null,
		zoom: {
			value: 1
		},
		resize: {
			value: 1
		}
	};
	
	Y.extend(EditorImageManage, Y.Base, {
		
		renderUI : function() {},/* is only for Widget? */
		destructor : function() {},
		
		/**
		 * @method initializer
		 * @description main render method
		 */
		initializer: function() {
			var cellImageSizes = this.get('cellImageSizes'), canvasImageSizes = this.get('canvasImageSizes'), frameEl = this.get("frameEl"), cell;
			
			Y.log(cellImageSizes);
			
			//init vars
			if(frameEl && frameEl._node){
				//ok
			}else if(frameEl && Y.one(frameEl)){//is string
				frameEl = Y.one(this.get("frameEl"));//set frameEl as node
				this.set("frameEl",frameEl);
			}else{
				Y.log('No correct frameEl:');
				Y.log(frameEl);	
				return;
			}

			//events
			this.publish("upload:start");
			this.publish("upload:error");
			this.publish("upload:complete");

			cell = Y.Node.create('<div class="visual"></div>');
			this.set("cell",cell);			
			//cellImageSizes is obligated
			
			
			frameEl.empty().appendChild(cell);//clear and add manage cell
			
			//do all this in a cell
			if(canvasImageSizes.width === 0 && canvasImageSizes.height === 0){
				canvasImageSizes = { width: cellImageSizes.width, height: cellImageSizes.height };
			}
			this.set('canvasImageSizes',canvasImageSizes);
			
			//this.set('cellImageSizes',cellImageSizes);
			cell.setStyle("width",cellImageSizes.width+"px").setStyle("height",cellImageSizes.height+"px");	

			//init upload-to canvas:
			this.uploadCanvas = Y.Node.create('<canvas class="canvas"></canvas>');
			
			//init canvas draw
			this.uploadTo = this.uploadCanvas.invoke('getContext', '2d');//node: _node.getContext("2d");			
			
			//canvas copy (due to crazy sizing issues)
			this.uploadCanvasCopy = Y.Node.create('<canvas class="canvas"></canvas>');
			this.uploadToCopy = this.uploadCanvasCopy.invoke('getContext', '2d');//node: _node.getContext("2d");
					
			//init upload button
			this.uploadButton = Y.Node.create('<input type="file" class="upload" accept="image/*">');//multiple="multiple", size="0"
			cell.appendChild(this.uploadButton);
			cell.appendChild(this.uploadCanvas);
			
			if(this.get("drawUI")){
				//create zoom buttons
				this.zoomBtns = Y.Node.create('<div class="zoom button in" title="Zoom In">+</div> <div class=" zoom button out" title="Zoom Out">-</div>');
				
				this.zoomBtns.one(".in").on("click",Y.bind(function(e){		
					var zoom = parseFloat(this.get("zoom") * 1.05);
					this.set("zoom",zoom);
					Y.log('zoom in to: '+zoom);						
					this.drawCanvas();
					
				},this));
				this.zoomBtns.one(".out").on("click",Y.bind(function(e){		

					var zoom = parseFloat(this.get("zoom") * .95);
					if(zoom > 1){
						Y.log('zoom out to: '+zoom);	
						this.set("zoom", zoom);
					}else{
						Y.log('back to zoom: 1');
						this.set("zoom",1);//reset						
					}
					this.drawCanvas();
					
				},this));
				cell.appendChild(this.zoomBtns);

				//save image button
				this.saveBtn = Y.Node.create('<a class="save button" title="Save image">Save</a>');
				this.saveBtn.on("click",Y.bind(function(e){	
					this.saveImage();
				},this));
				cell.appendChild(this.saveBtn);
								
				//remove image button
				this.clearBtn = Y.Node.create('<a class="delete button" title="Remove image">x</a>');
				this.clearBtn.on("click",Y.bind(function(e){				
					this.get("cell").removeClass("active");
					this.clearCanvas();
				},this));
				cell.appendChild(this.clearBtn);
				
				if(this.get("resizeHeight") === true){
					var heightInpt = Y.Node.create('<input class="heightRow" value="'+cellImageSizes.height+'px">');
					heightInpt.on(["blur","submit"],Y.bind(function(evt){
						var row = evt.currentTarget.get("parentNode");
						var height = parseInt(evt.currentTarget.get("value"),10);
						if(height > 10){/* minimum height */
							this.setHeight(height+6);/* this shouldn't be here +6 */
						}
					},this));
					cell.appendChild(heightInpt);	
				}
			}

			//add resizer of cell
			if(this.get("resizeHeight") === true){

				var resize = new Y.Resize({
					node: frameEl,
					handles: 'b',
					minHeight: 55,
					maxHeight: 600,
					preserveRatio: false
				});

				resize.on('resize:resize', Y.bind(function(event) {
					var cell = event.currentTarget.get("node");				
					var height = parseInt(event.currentTarget.info.offsetHeight,10);
					this.setHeight(height);
					
					cell.all(".heightRow").set("value",(height-6)+"px");/* 6 = handlebar adjust upload.js */
				},this));
			}

			//have a image to fill cell? Load into canvas!
			if(this.get("file")){
				this.set("img",Y.Node.create('<img>'));	
				this.get("img").on("load",Y.bind(this.prepareImg,this));
				this.get("img").on("error",Y.bind(this.errorImg,this));
				
				//only local files can load to crossdomain, else use our proxy to load
				if(this.get("file").indexOf(document.location.hostname) > 0 || this.get("file").substr(0,1) === "/") {
					Y.log(this.get("file")+" is local");
					this.get("img").set('src',this.get("file"));
				}else{
					Y.log(this.get("file")+" is proxied");
					this.get("img").set('src',this.get('uploadToUrl')+'?proxy='+encodeURIComponent(this.get("file")));
				}

				//initial offset
				this.uploadCanvas.setStyle('position','relative');
				this.uploadCanvas.setStyle('top',this.get("top")+'px');
				this.uploadCanvas.setStyle('left',this.get("left")+'px');		
			}
			
			//events
			this.uploadButton.on("change",Y.bind(this.loadLocalImage,this));
			
			//events resize
			Y.on('windowresize', Y.bind(this.contrainMove,this));
		},
		
		/**
		 * Only works for html5 browsers, else fallback to browser upload only?
		 * @method support
		 * @return {Boolean}
		**/			
		support: function(){
			if ( !( window.File && window.FileReader && window.FileList && window.Blob ) ) {	
				return false;	
			}
			return true;
		},
		/**
		 * @method loadLocalImage
		 * @param evt {Event} events
		 * @protected
		**/				
		loadLocalImage: function(evt){	
						
			//clear canvas
			this.clearCanvas();
			
			//create image holder and attach event listener
			this.set("img",Y.Node.create('<img>'));
			this.get("img").detach('load');
			this.get("img").on("load",Y.bind(this.prepareImg,this));

			var files = evt.target.get('files');/* ie10 :( */				
			if (files && files.size() > 0) {
				var file = files._nodes[0];
				//file.name , file.size, file.lastModifiedDate
				if (typeof FileReader !== "undefined" && file.type.indexOf("image") !== -1) {
					var reader = new FileReader();
					//addEventListener doesn't work in Google Chrome for this event
					reader.onload = Y.bind(function (evt) {
						this.get("img").set('src',evt.target.result);//this will call load on prepareImg			
					},this);	
					reader.readAsDataURL(file);//readAsText				
				}
			}
			
			evt.stopPropagation();
			evt.preventDefault();	
		},
		/**
		 * @method prepareImg
		 * @param evt {Event} events
		 * @protected
		**/				
		prepareImg: function(evt){		
			//save local source file
			this.set("img_src",evt.target._node);

			this.uploadCanvasCopy.set("width",evt.target._node.width);
			this.uploadCanvasCopy.set("height",evt.target._node.height);		
			this.uploadToCopy.drawImage(evt.target._node, 0, 0, evt.target._node.width, evt.target._node.height);
			
			this.drawCanvas();
		},
		/**
		 * @method errorImg
		 * @param evt {Event} events
		 * @protected
		**/				
		errorImg: function(evt){		
			Y.log("could not load image into canvas.");
		},
		/**
		 * @method drawCanvas
		 * @protected
		**/				
		drawCanvas: function(){
			var img = this.get("img"),
				img_src = this.get("img_src"),
				canvasImageSizes = this.get("canvasImageSizes"),
				cell = this.get("cell");
			
			//set cell active
			cell.addClass("active");
			
			//to allow moving
			Y.log('found image: '+  img_src.width +'x'+ img_src.height);
			
			//get dimentsions, and set them
			var newDimensions = this.resizeDimensions(img_src,canvasImageSizes);			
			
			img_src.width = newDimensions.width;
			img_src.height = newDimensions.height;
			
			//zoom
			img_src.height = img_src.height * this.get("zoom");
			img_src.width = img_src.width * this.get("zoom");
			
			//do we allow canvas to be < max-width|max-height? -> result is too small image send back 
			this.uploadCanvas.set("width",img_src.width);
			this.uploadCanvas.set("height",img_src.height);

			//calc ratio between our source canvas and and target (preview) canvas
			this.set("resize",(this.uploadCanvasCopy.get("height") / this.uploadCanvas.get("height")));
			
			//support zoom
			Y.log('draw image: '+  img_src.width +'x'+ img_src.height);
			this.uploadTo.drawImage(img_src, 0, 0, img_src.width,img_src.height);
			
			//draggable reset
			this.contrainMove();
		},
		/**
		 * @method resizeDimensions
		 * @protected
		 * @return {Object} Dimensions
		**/			
		resizeDimensions: function(node,minDimensions){
			//get image dimensions
			var ratio = node.height / node.width;
			var newDimensions = {height: node.height, width: node.width, resize: 100};
						
			if(node.width >= minDimensions.width || node.height >= minDimensions.height){
				//start with the shortest target lenght
				if(minDimensions.width <= minDimensions.height && node.height <= node.width && node.height >= minDimensions.height){
					//match up height with max height
					Y.log('Resize scenario #1')
					newDimensions.height = minDimensions.height;
					newDimensions.width = Math.round((minDimensions.height * (1 / ratio)));	
					//newDimensions.resize = (Math.round((newDimensions.width / node.width)*100));				
				}else{
					//match up width with height
					if(node.width >= minDimensions.width){
						Y.log('Resize scenario #2');	
						newDimensions.width = minDimensions.width;
						newDimensions.height = Math.round(minDimensions.width * ratio);	
						//newDimensions.resize = (Math.round((newDimensions.width / node.width)*100));				
					}else{
						//fits within max (too small)
						Y.log('Unknown resize scenario');	
					}
				}
			}else{
				//no resize
				Y.log('Resize scenario #3');
			}	
			return newDimensions;	
		},
		/**
		 * @method contrainMove
		 * @protected
		**/					
		contrainMove: function(){
			var img = this.get("img"),
				cell = this.get("cell");
			
			/* is the canvas already offset */
			var offsetTop = parseInt(this.uploadCanvas.getStyle("top"),10);
			var offsetLeft = parseInt(this.uploadCanvas.getStyle("left"),10);
			
			/* for if image is smaller then canvas */
			if(this.uploadCanvas.get("width") < parseInt(cell.getStyle("width"),10)){
				var fillWidth = parseInt(cell.getStyle("width"),10) - this.uploadCanvas.get("width");
			}else{			
				var fillWidth = 0;
			}

			/* for if image is smaller then canvas */
			if(this.uploadCanvas.get("height") < parseInt(cell.getStyle("height"),10)){
				var fillHeight = parseInt(cell.getStyle("height"),10) - this.uploadCanvas.get("height");
			}else{			
				var fillHeight = 0;
			}
						
			//make draggable in div (set when new image is loaded, unset previous node)
			var location = this.uploadCanvas.getXY();
			
			if(this.drag){ this.drag.destroy(); }//cleanup reset
			
			this.drag = new Y.DD.Drag({
				node: this.uploadCanvas,
			}).plug(Y.Plugin.DDConstrained,{
					constrain: { 
					top: (location[1] - offsetTop - (this.uploadCanvas.get("height") - (this.uploadCanvas.get("height") > parseInt(cell.getStyle("height"),10) ?  parseInt(cell.getStyle("height"),10) : this.uploadCanvas.get("height")))),
					left: (location[0] - offsetLeft - (this.uploadCanvas.get("width") - (this.uploadCanvas.get("width") >  parseInt(cell.getStyle("width"),10) ?  parseInt(cell.getStyle("width"),10) : this.uploadCanvas.get("width")))), 
					right: location[0] + this.uploadCanvas.get("width") + fillWidth - offsetLeft,
					bottom: location[1] + this.uploadCanvas.get("height") + fillHeight - offsetTop }
			});

			this.drag.on("drag:end",Y.bind(function(e){
				this.set("top",parseInt(this.uploadCanvas.getStyle("top"),10));
				this.set("left",parseInt(this.uploadCanvas.getStyle("left"),10));
				
				//and calc new drag area
				this.contrainMove();
			},this));		
		},
		/**
		 * @method clearCanvas
		 * @protected
		**/				
		clearCanvas: function(){
			//reset offset
			this.uploadCanvas.setStyle('top','0px');
			this.uploadCanvas.setStyle('left','0px');
			
			//zoom
			this.set("zoom",1);
			
			//cleanup canvas pixels
			this.uploadTo.clearRect(0, 0, this.uploadCanvas.get("width"), this.uploadCanvas.get("height"));	
		},
		/**
		 * @method convertToBlob
		 * @return {Blob} Blob image data.
		**/		
		convertToBlob: function(dataURI){
			
			//http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
			//https://github.com/josefrichter/resize/blob/master/public/preprocess.js
			var binary = atob(dataURI.split(',')[1]);
			var array = [];
			for(var i = 0; i < binary.length; i++) {
				array.push(binary.charCodeAt(i));
			}
			return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});		
		},
		/**
		 * @method getFile
		 * @return {FileHTML5} Y.FileHTML5 object.
		**/					
		getFile: function(){	
			//var blob = this.uploadCanvas._node.mozGetAsFile("file.jpg");			
			if(this.get("cell").hasClass("active")){
				var blob = this.convertToBlob(this.getImage());
				Y.FileHTML5.prototype._isValidFile = function(){ return true; };//overwrite
				
				return new Y.FileHTML5({file: blob});
			}else{
				return false;	
			}
		},
		/**
		 * Height and width of output cell not actual image!
		 * @method getFileDetails
		 * @return {Object} File dimensions (top, left, zoom, width, height, resize)
		**/		
		getFileDetails: function(){	
			var cellImageSizes = this.get("cellImageSizes");			
			//todo: if cellImageSizes < canvas size, push that out
			return {top: this.get("top"), left: this.get("left"), zoom: this.get("zoom"), width: cellImageSizes.width, height: cellImageSizes.height, resize: this.get("resize") };
		},	
		/**
		 * @method getImage	
		 * @return {String} Base64 binary image data.
		**/				
		getImage: function(){		
			//this string is a file
			return this.uploadCanvasCopy._node.toDataURL("image/jpeg","0.8");//png,jpeg,.8
		},
		/**
		 * @method setHeight		
		**/				
		setHeight: function(pixels){
			Y.log('height set: '+pixels);
			
			var cellImageSizes = this.get('cellImageSizes');
			cellImageSizes.height = pixels - 6; /*6 is so we have an resize handle bar */
			this.set('cellImageSizes',cellImageSizes);
			this.get("cell").setStyle("height",cellImageSizes.height+"px").setStyle("width",cellImageSizes.width+"px");	
			
			this.contrainMove();/* redrawn image */	
		},
		/**
		 * @method saveImage		
		**/			
		saveImage: function(){
			var file = this.getFile();
			if(file){
				var uploader = new Y.UploaderHTML5;
				
				uploader.on("uploadstart",Y.bind(function(event) {
					this.fire("upload:start",event);
				},this));
				uploader.on("uploaderror",Y.bind(function(event) {
					this.fire("upload:error",event);
				},this));
				uploader.on("uploadcomplete",Y.bind(function(event) {
					this.fire("upload:complete",event);
				},this));

				uploader.upload(file, this.get('uploadToUrl'), this.getFileDetails());
			}
			
		},
	});
	
	Y.EditorImageManage = EditorImageManage;
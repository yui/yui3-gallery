
	/**
	* The Editor UI builds on top of YUI's Rich Text Editor base to create a user interface for editting and formatting HTML content.
	* Besides basic formatting support (text style, outlining, lists) it has an easy to use image upload manager and link manager.
	* @module gallery-editor-ui
	* @author Yvo Schaap
	*/

	/**
	 * @class EditorUI
	 * @description EditorUI class
	 * @constructor
	 * @extends Base
	 * @param config {Object} configuration object
	 */		
	function EditorUI(config) {
		EditorUI.superclass.constructor.apply(this, arguments);
	}
	
	EditorUI.NAME = 'editor-ui';
	EditorUI.ATTRS = {
		/**
		 * The DOM element ID to render our editor in.
		 * @attribute textareaEl
		 * @type String
		 */
		textareaEl: {
			value: null,
			validator: Y.Lang.isString,
			writeOnce:true
		},
		/**
		 * The DOM element ID of the FORM to write the WYSIWYG content to the textarea.
		 * @attribute formEl
		 * @type String
		 */
		formEl: {
			value: null,
			validator: Y.Lang.isString,
			writeOnce:true
		},
		/**
		 * Parent class name to refer from in CSS.
		 * @attribute editorClass
		 * @default post
		 * @type String
		 */
		editorClass: {
			value: 'post',
			writeOnce:true
		},
		/**
		 * Content tags formatting.
		 * @attribute editorClass
		 * @default contentStylesheetUrl
		 * @type String
		 */
		contentStylesheetUrl: {
			value: '/build/gallery-editor-ui/assets/gallery-editor-ui-content.css',
			writeOnce:true
		},
		/**
		 * The URL to upload the image to, resize image and return JSON. In the assets folder look at upload.phps for an example. Used by image-manager, only passed along.
		 * @attribute uploadToUrl
		 * @type String
		 */
		uploadToUrl: {
			value: '/build/gallery-editor-ui/assets/fake-upload.html',
			validator: Y.Lang.isString,
			writeOnce:true
		},		
		visualEditMode: {
			value: true	
		},
		editor: null,
		textArea: null,
		baseEditor: null,
		frameInstance: null,

		linkWindow: null,
		mediaWindow: null,
		sizeWindow: null,

		flagPaste: null
	};

	
	Y.extend(EditorUI, Y.Base, {		

		/**
		* @property regexps
		* @type object
		* @protected
		*/		
		regexps: {
			divToPElementsRe:       /<(a|blockquote|dl|div|ol|p|pre|table|ul|img)/i,
			replaceBrsRe:           /(<br[^>]*>[ \n\r\t]*){2,}/gi,
			replaceFontsRe:         /<(\/?)font[^>]*>/gi,
			trimRe:                 /^\s+|\s+$/g,
			normalizeRe:            /\s{2,}/g,
			killBreaksRe:           /(<br\s*\/?>(\s|&nbsp;?)*){1,}/g
		},
		tag2cmd: {
			'b': 'bold',
			'strong': 'bold',
			'i': 'italic',
			'em': 'italic',
			'u': 'underline',
			'blockquote' : 'blockquote',
			'img': 'media',
			'a' : 'link',
			'ul' : 'insertunorderedlist',
			'ol' : 'insertorderedlist',
			'h2' : 'size',
			'h3' : 'size'
		},
		styles: {
			'textDecoration': true,
			'fontWeight': true,
			'fontStyle': true,
			'textAlign': true,
			'color': false,
			'fontSize' : false,
			'fontFamily' : false,
			'backgroundColor': false
		},
		style2tag: {
			'strong': 'strong',
			'italic': 'em',
			'underline': 'em'
		},
		textAreaTextDefault: '<p><br><p>',

		renderUI : function() {},/* is only for Widget? */
		destructor : function() {},
		
		/**
		 * @method initializer
		 * @description main render method
		 */
		initializer: function() {
			var textArea,editor,textFrame,htmlFrame;
			
			if(this.get("textareaEl")){
				textArea = Y.one(this.get("textareaEl"));
				if(textArea){					
					//build html for editor UI
					textArea.addClass("Ak");//styling class
					editor = Y.Node.create('<div style="width: '+textArea.getComputedStyle("width")+'""></div>');//inherit width
					textFrame = Y.Node.create('<div class="f9 Ar" style="display: none"></div>');//todo: allow config option to set initial state
					htmlFrame = Y.Node.create('<div class="f8 Ar"></div>');//height from css
					
					textArea.wrap(textFrame);//textarea gets parent frame
					textFrame.wrap(editor);//frame gets another parent
					editor.appendChild(htmlFrame);//parent gets child
					
					//reference
					this.set("textArea",textArea);
					this.set("editor",editor);
					Y.log('Textarea tranformed OK');
				}else{
					Y.log('No valid textarea element ID');
					return false;	
				}

												
				//for styling of panel (make configurable)
				if(!Y.one("body").hasClass("yui3-skin-sam")){
					Y.one("body").addClass("yui3-skin-sam");
				}
								
				//build toolbar html			
				//this._buildToolbar();
				
				//if we don't get a form ID, find the ancestor and set that one.
				if(this.get("formEl") === null){
					Y.log('Need valid form element ID');
					/*
					var form = editor.ancestor("form");
					if(form){
						this.set("formEl",form);
					}
					*/					
				}
				
				var baseEditor = new Y.EditorBase({
					defaultblock : 'p',
					extracss: 'body {margin: 0; padding: 0; overflow-y: scroll; overflow-x: hidden;} img, iframe, object, embed { -webkit-user-select: none; user-select: none; user-select: none;}',
					linkedcss: this.get('contentStylesheetUrl'),/* external file to load formatting */
					plugins : [
						Y.Plugin.EditorBr,
						Y.Plugin.EditorTab,
						Y.Plugin.EditorLists
					]
				});
				this.set("baseEditor",baseEditor);//set in class	
				
				/* hacky but need object reference from execCommand to close panels and stuff */
				Y.mix(baseEditor, {
					editorUI: this
				});
				
				baseEditor.on('frame:ready', function(){					
					this.set("frameInstance",baseEditor.getInstance());
					
					this.get("frameInstance").one("body").addClass(this.get("editorClass")).addClass('editing');/* our css style holder */
					this.get("frameInstance").on("resizestart",Y.bind(function(){ return false; },this)); //some browsers allow image resizing, we dont. Another option unselectable=on on ellements.
					this._buildToolbar();
					this._registerCommands();
					this._initToolbar();
					this._toggleComposer(true);//init contents		
				},this);
				
				this.set("linkWindow", new Y.Panel({
							modal: true,
							visible: false,
							centered: true,
							zIndex: 150,
							shim: true,
							headerContent: "Add Link",
							bodyContent: '<table class="space"><tr><td>Text to display:</td><td><input id="linkdialog-text" style="width: 300px"></td></tr><tr><td>To what URL should this link go?</td><td><input id="linkdialog-input" type="url" style="width: 300px; margin-right: 5px;"><small><a href="#" id="testLink" target="_blank">test link</a></small></td></tr><tr><td colspan="2"><div class="Kj-JD-Jl"><button name="ok" id="linkSubmitButton">Insert Link</button><button name="cancel" class="linkHideWindow">Cancel</button></div></td></tr></table>',
							render: true
				}));
				this.set("mediaWindow", new Y.Panel({
							modal: true,
							visible: false,
							centered: true,
							zIndex: 150,
							shim: true,
							headerContent: "Add Media",
							bodyContent: '<table class="space"><tr><td colspan="2"><div class="image-upload-frame"></div></td></tr><tr><td>URL:</td><td><input id="mediadialog-source" style="width: 300px" placeholder="http://"></td></tr><tr><td>Title:</td><td><input id="mediadialog-text" style="width: 300px" placeholder=""></td></tr><tr><td colspan="2"><div class="Kj-JD-Jl"><button name="ok" id="mediaSubmitButton">Add Media</button><button name="cancel" class="mediaHideWindow">Cancel</button></div></td></tr></table>',
							render: true
				}));
				this.set("sizeWindow", new Y.Overlay({
							visible: false,
							zIndex: 150,
							shim: true,
							bodyContent: '<div class="J-M"><div class="J-N" role="menuitem" style="font-size: normal;" command="p">Paragraph</div><div class="J-N" role="menuitem" style="font-size: x-large;" command="h2">Header One</div><div class="J-N" role="menuitem" style="font-size: large;" command="h3">Header Two</div><div class="J-N" role="menuitem" style="font-size: 1.2em" command="h3">Header Three</div></div>',
							align: {
    							node:".eY",
								points:[Y.WidgetPositionAlign.TL, Y.WidgetPositionAlign.BL]
							},
							render: true						
				}));
				
				Y.one(".mediaHideWindow").on("click",Y.bind(function(){ this.get("mediaWindow").hide(); },this));
				Y.one(".linkHideWindow").on("click",Y.bind(function(){ this.get("linkWindow").hide(); },this));				
				
				baseEditor.render(htmlFrame);
				
			}else{
				Y.log('Need textarea ID in DOM.');	
			}
			
		},

		/**
		*
		* @method _registerCommands
		* @protected
		*/		
		_registerCommands: function(){
			/* this mixes YUI commands with our commands into one; doesn't link with browsers execCommand */
			/* http://yuilibrary.com/forum/viewtopic.php?p=35065 */
			/* we already try to use html5 tags instead of the browsers */
			Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
				
				bold: function(cmd) {
					var inst = this.get('host').getInstance(), selection = new inst.Selection(), node, text = '', editor = inst.host.editorUI;
					//remove end and start space of selection
					if(selection && selection.anchorNode.get("tagName") === "STRONG"){
						Y.log('unbold');
						if (!selection.isCollapsed) {
							this._command('bold');
						}else{
							//remove node's tag
							this._command('bold');
						}
					}else if(selection && selection.anchorNode.get("tagName") === "BODY"){
						//the top
						return;
					}else if(selection){
						if (!selection.isCollapsed) {
							node = selection.wrapContent('strong');
							selection.focusCursor(true, true);
						} else {
							text = editor._getInnerText(selection.anchorNode);
							if(text.length > 0){
								node = selection.insertContent('<strong>&nbsp;</strong>');
							}else{
								node = selection.insertContent('<strong>&nbsp;</strong><br>');
							}
							selection.focusCursor(true, true);
						}
					}else{
						//this._command('bold');
					}
					
					return node;
				},
				italic: function(cmd) {
					////scope.baseEditor.execCommand('wrap','em');
					var inst = this.get('host').getInstance(), selection = new inst.Selection(), node, text = '', editor = inst.host.editorUI;
					//remove end and start space of selection
					if(selection && selection.anchorNode.get("tagName") === "EM"){
						Y.log('unitalic');
						if (!selection.isCollapsed){
							this._command('italic');
						}else{
							//remove node's tag
							this._command('italic');
						}
					}else if(selection && selection.anchorNode.get("tagName") === "BODY"){
						//the top
						return;
					}else if(selection){
						Y.log(selection.anchorNode.get("tagName"));
						if (!selection.isCollapsed) {
							node = selection.wrapContent('em');
							selection.focusCursor(true, true);
						} else {
							text = editor._getInnerText(selection.anchorNode);
							if(text.length > 0){
								node = selection.insertContent('<em>&nbsp;</em>');	
							}else{
								node = selection.insertContent('<em>&nbsp;</em><br>');	
							}
							selection.focusCursor(true, true);
						}
					}else{
						//this._command('italic');
					}
					
					return node;
				},

				size: function(cmd,node) {
					Y.log('what size selection show');
					var inst = this.get('host').getInstance(), selection = new inst.Selection(), node, text = '', editor = inst.host.editorUI;
					//remove end and start space of selection
					if(selection && selection.isCollapsed){
						//insert new header
					}else if(node && node.get("tagName")){
						//if a click happened on a h3, h2, or ..
					}else if(selection && selection.anchorNode.get("tagName") === "P"){
						//update paragraph to header
					}
					selection.focusCursor(true, true);

					if(editor.get("sizeWindow").get('visible') === true){
						editor.get("sizeWindow").setAttrs({visible: false});
					}else{
						editor.get("sizeWindow").setAttrs({visible: true});
					}
				},
				media: function(cmd,node) {
					Y.log('media modal show');

					var inst = this.get('host').getInstance(), selection = new inst.Selection(), node, grid, text = '', src = 'http://', editor = inst.host.editorUI;

					if(node && node.changedType === "mouseup") {
						if (!selection.isCollapsed) {
							Y.log('no modal on selection');
							return false;
						}
					}
					
					if(selection && selection.anchorNode && selection.anchorNode.get("tagName") === "IMG"){
						node = selection.anchorNode;
						text = node.get("title");
						src = node.get("src");
					}else if(node && node.get("tagName") === "IMG"){
						text = node.get("title");
						src = node.get("src");
					}else if(selection){		
						if (!selection.isCollapsed) {
							text = selection.text;
						}
					}else{
						inst.focus();	
					}
					
					var frame = editor.get("mediaWindow").get("contentBox").one(".image-upload-frame");//where to insert the image manager
					var parent_width = editor.get("editor").get("offsetWidth");/* get textarea width = width image upload max */
					Y.log('Width of image uploader: '+parent_width);
					var cfg = {cellImageSizes: {height: '300px', width: parent_width}, frameEl: frame, resizeHeight: true, uploadToUrl: this.get('uploadToUrl')};
					
					//before rendering overlay, set .image-upload-frame with the correct height and width for centerized to work correctly
					//frame.setStyle("width",cfg.cellImageSizes.width).setStyle("height",cfg.cellImageSizes.height);
					
					if(node){
						Y.log('Width of image uploader from file: '+node.getStyle("width"));
						cfg = Y.mix(cfg,{file: src, cellImageSizes: {width: node.getStyle("width"), height: node.getStyle("height")}},true);//overwrite
					}
					
					var g = new Y.EditorImageManage(cfg);/* mix image data with other cfg */
					//g.support() === true){
						//g.render();
					//}else{
						//Y.log('no html5 browser');
					//}
					g.on("upload:start",Y.bind(function(event){
						//disable save button
					},this));
					g.on("upload:error",Y.bind(function(event){
						//notify user of upload error
					},this));
					g.on("upload:complete",Y.bind(function(event){
						//enable save button
						
						var data = Y.JSON.parse(event.data);//return span with title of image, keep
						if(data && data.status === 1){
							Y.one("#mediadialog-source").set("value",data.file);
						}else{
							Y.log('No image data returned from endpoint');
							//notify user
							Y.log(data);	
						}

					},this));
					
					//Y.one("#mediadialog-data").set("value","");//existing gallery?
					Y.one("#mediadialog-source").set("value",src);
					Y.one("#mediadialog-text").set("value",text);
					
					Y.one("#mediaSubmitButton").destroy();//destroy
					Y.one("#mediaSubmitButton").on("click",Y.bind(function(e){
						e.preventDefault();
						
						if(node){
							//update node src
							node.set("src",Y.one("#mediadialog-source").get("value"));
							node.set("title",Y.one("#mediadialog-text").get("value"));
						}else{
							//else image node
							this.command("insertandfocus",'<img src="'+Y.one("#mediadialog-source").get("value")+'" title="'+Y.one("#mediadialog-text").get("value")+'">'+editor.textAreaTextDefault);
						}
						editor.get("mediaWindow").hide();
					},this));

					editor.get("mediaWindow").setAttrs({visible: true})

				},
				link: function(cmd,node) {
					Y.log('link modal show');
					//http://yuiblog.com/sandbox/yui/3.2.0pr1/api/createlink-base.js.html
					
					var inst = this.get('host').getInstance(), selection = new inst.Selection(), node, text = '',href = 'http://',editor = inst.host.editorUI;

					if(node && node.changedType === "mouseup") {
						if (!selection.isCollapsed) {
							Y.log('no modal on selection');
							return false;
						}
					}
					
					if(selection && selection.anchorNode && selection.anchorNode.get("tagName") === "A"){
						//within link
						node = selection.anchorNode;//selection has link?
						text = node.get("text");
						href = node.get("href");
					}else if(node && node.get("tagName") === "A"){
						//on a link
						text = node.get("text");
						href = node.get("href");						
					}else if(selection){				
						//create link
						if (!selection.isCollapsed) {
							text = selection.text;//text to link (no url available)
						}

					}else{
						inst.focus();		
					}
										
					Y.one("#linkdialog-text").set("value",text);
					Y.one("#linkdialog-input").set("value",href);
					
					//testLink
					Y.one("#testLink").destroy();//destroy
					Y.one("#testLink").on("mousedown",Y.bind(function(e){
						e.preventDefault()
						e.currentTarget.set("href",Y.one("#linkdialog-input").get("value"));
					},this));
											
					Y.one("#linkSubmitButton").destroy();//destroy
					Y.one("#linkSubmitButton").on("click",Y.bind(function(e){
						e.preventDefault();
						var href, text;
						text = Y.one("#linkdialog-text").get("value");
						href = Y.one("#linkdialog-input").get("value");
						if(text.length > 0 && href !== "http://"){
							if(node){
								node.set("href",href);
								node.set("text",text);
							}else{
								this.command("insertandfocus","<a href=\""+href+"\">"+text+"</a>");
							}
						}else{
							//message error no link
							this.command("unlink");
						}
						editor.get("linkWindow").hide();
					},this));
					
					editor.get("linkWindow").setAttrs({visible: true})

				},
				blockquote: function(cmd) {
					Y.log('custom tag');
					////scope.baseEditor.execCommand('wrap','em');
				    var inst = this.get('host').getInstance(), selection = new inst.Selection(), node, text = '',editor = inst.host.editorUI;
					//remove end and start space of selection
					if(selection && selection.anchorNode.get("tagName") === "BLOCKQUOTE"){
						Y.log('unblock');
						if (!selection.isCollapsed){
							this._command('outdent');
						}else{
							//remove node's tag
							this._command('outdent');
						}
						//_getInnerText
					}else if(selection && selection.anchorNode.get("tagName") === "BODY"){
						return
					}else if(selection){
						if (!selection.isCollapsed) {
							node = selection.wrapContent('blockquote');
							selection.focusCursor(true, true);
						} else {
							Y.log('no selection, but cursor');
							//text = editor._getInnerText(selection.anchorNode);
							node = selection.insertContent('<blockquote>&nbsp;</blockquote>');	
							selection.focusCursor(true, true);//selection.selectNode(node., true);
						}
					}else{
						this._command('blockquote');
					}
				},
				clear: function(cmd) {
					Y.log('clear formatting');
					var inst = this.get('host').getInstance(), selection = new inst.Selection(), node;
												
					var answer = confirm('You will lose the html formatting. Are you sure?');	
					if(answer && selection.anchorNode){
						if(selection.anchorNode.get("parentNode").get("tagName") === "BODY"){
							selection.anchorNode.set("outerHTML",'<p>'+selection.anchorNode.get("text")+'<br></p>');//must have paragraphs
						}else{
							selection.anchorNode.set("outerHTML",selection.anchorNode.get("text"));/* selection.getText(selection.anchorNode) */
							selection.focusCursor(true, true);
						}
					}
				}				
			});			
		},
		/**
		*
		* @method _buildToolbar
		* @protected
		*/
		_buildToolbar: function(){
			var editor = this.get("editor"), toolbars = Y.Node.create('<div class="toolbars"></div>'), html_toolbar = Y.Node.create('<div class="html_toolbar"></div>'), plain_toolbar = Y.Node.create('<div class="plain_toolbar" style="display: none"></div>');/* todo: no inline styles */
			
			var toolbar_buttons = [
				{fn: 'bold', cls:'eN'},
				{fn: 'italic', cls:'e3'},
				{fn: 'underline', cls:'fu'},
				{fn: 'size', cls:'eY',desc: 'Format size',arrow: true},
				{fn: 'media', cls:'QT',desc: 'Insert image'},
				{fn: 'link', cls:'e5',desc: 'Insert link'},
				{fn: 'insertorderedlist', cls:'e6',desc: 'Ordered list'},
				{fn: 'insertunorderedlist', cls:'eO',desc: 'Unordered list'},
				{fn: 'outdent', cls:'e8',desc: 'Outdent'},
				{fn: 'indent', cls:'e2',desc: 'Indent'},
				{fn: 'blockquote', cls:'fa',desc: 'Insert blockquote'},
				{fn: 'justifyleft', cls:'e4',desc: 'Align text left'},
				{fn: 'justifycenter', cls:'eP',desc: 'Center text'},
				{fn: 'justifyright', cls:'fc',desc: 'Align text right'},
				{fn: 'justifyfull', cls:'fd',desc: 'Text justified'},
				{fn: 'clear', cls:'fb',desc: 'Clear formatting selection'}	
			];
			
			Y.Object.each(toolbar_buttons, function(button){
				html_toolbar.appendChild(this._createToolbarButton(button));
			},this);
			
			html_toolbar.appendChild(Y.Node.create('<div class="button switch e9">Edit HTML</div>'));

			toolbars.appendChild(html_toolbar);

			plain_toolbar.appendChild(Y.Node.create('<div class="button switch k9">Rich formatting</div>'));
			plain_toolbar.appendChild(this._createToolbarButton({fn: 'format', cls:'u9','desc': 'Format HTML'}));
			
			toolbars.appendChild(plain_toolbar);
			
			editor.insert(toolbars,editor.one("*"));
		},
		/**
		*
		* @method _createToolbarButton
		* @param cfg {Object} Config for button.
		* @protected
		* @return {Object} YUI Node object.
		*/
		_createToolbarButton: function(cfg){
			//todo: support arrow
			return Y.Node.create('<div class="button" role="button" title="'+(cfg.desc ? cfg.desc : cfg.fn)+'" command="'+cfg.fn+'"><div class="'+cfg.cls+' icon"></div></div>');
		},
		/**
		 * 
		 * @method _initToolbar
		 * @protected
		 */			
		_initToolbar: function(){
			var editor = this.get("editor"), sizeWindow = this.get("sizeWindow");
			
			//we use mousedown, so we can keep focus in editor
			editor.all('.html_toolbar div[role=button]').each(function(node) {
				node.on('mousedown', function(e){
					e.preventDefault();
					
					var command = e.currentTarget.getAttribute("command"); 
					Y.log('button mousedown: '+command);
					if(command){
						var node = this.get("baseEditor").execCommand(command);
					}
					return false;
				},this);
			}, this);	
			
			
			sizeWindow.get("contentBox").all("div[role=menuitem]").each(function(node) {
				node.on("mousedown",Y.bind(function(e){
					e.preventDefault();
					var inst = this.get("baseEditor").getInstance(), selection = new inst.Selection(), target = e.currentTarget;

					if(selection && !selection.isCollapsed){
						if((style = target.getAttribute("data-style"))){
							var style = style.split(": ");
							selection.anchorNode.setStyle(style[0],style[1]);//attach style
						}else if(command = target.getAttribute("command")){
							this.get("baseEditor").execCommand("formatblock",target.getAttribute("command"));
						}
						selection.focusCursor(true, true);
					}else{
						//nothing selected, insert node with new line
						if(command = target.getAttribute("command")){
							this.get("baseEditor").execCommand("insertandfocus","<"+target.getAttribute("command")+">&nbsp;<br></"+target.getAttribute("command")+">");
						}
					}
					
					this.get("sizeWindow").hide();
					return false;//so we keep focus				 
				},this));				
			},this);

			//
			this.get("baseEditor").before('nodeChange', function(e) {
				switch (e.changedType) {
					case 'backspace-up':
					if (Y.UA.webkit){
						Y.log('overwrite YUI backspace event');
						e.preventDefault();
						e.stopPropagation();
						return false;
					}	
					break;				
				}
			},this);	
			
			this.get("baseEditor").after('nodeChange', function(e) {
				switch (e.changedType) {
					/*case 'execcommand': endless loop*/
					case 'enter':
						if (e.changedNode.get("tagName") === 'BLOCKQUOTE' && !e.changedEvent.shiftKey) {
							/* we don't want enters in blockquote creating a new blockquote (use shift enter)*/
							Y.log('indent on enter in blockquote');
							e.preventDefault();
							//this.get('baseEditor').execCommand('outdent', '');
							this.get("baseEditor").execCommand("insertandfocus","</blockquote><p><br></p>");
						}
						/* on enter with parent body, force p instead of copy element we came from */
						
						break;
					case 'keyup':
					case 'mousedown':
						this._updateButtons(e);
						break;
				}
				/* we don't like this */
				e.classNames = "";
				e.fontFamily = "";
				e.fontSize = "";
				e.fontColor = "";
				e.backgroundColor = "";	
			},this);

			//strip any styles added (except, execcommand, which allows styles (incl. "question") doesn't pick up on browser exceccommand CTRL+B capture ourselves and bubble to this)
			//
			this.get("baseEditor").before('nodeChange', function(e) {

				switch (e.changedType) {
					case 'paste':
						this.flagPaste = true;
						break;
					case 'keyup':
						if(this.flagPaste === true){
							Y.log('stripped paste');
							e.changedNode.set('innerHTML', e.changedNode.get('text'));//allow a, strong, li, ul, ol, p, br?
						}
					default:
						this.flagPaste = false
				}

			},this);
			
			//only on clicks of element
			this.get("baseEditor").after('nodeChange', function(e) {
				if(e.changedType === "mouseup") {
					e.preventDefault();
					
					var node = e.changedNode;
					node.changedType = e.changedType; /* we use this to check what the action was */
					
					if(node.get("tagName") === "A"){
						this.get("baseEditor").execCommand("link",node);
					}else if(node.get("tagName") === "IMG"){
						this.get("baseEditor").execCommand("media",node);
					}
				}
			},this);
			
			//toggle
			editor.one(".e9").on('click', Y.bind(this._toggleComposer, this, false));
			editor.one(".k9").on('click', Y.bind(this._toggleComposer, this, true));
				
			editor.one(".u9").on('click', Y.bind(this._formatHtml, this, true));//format html button
			
			//on form submit
			if(this.get("formEl") && Y.all(this.get("formEl")).size() === 1){
				Y.one(this.get("formEl")).before("submit", Y.bind(this.submitForm, this));//should be referenced in config
			}
		},
		/**
		 *
		 * @method _formatHtml
		 * @protected
		 */	
		_formatHtml : function() {
			if(!(typeof EditorHTMLFormatter === 'undefined')){
				//bit crazy way around but it works
				var html = this.get("textArea").get("value");
				this.get("baseEditor").set('content',html);//don't do anything with the formatting
				
				var formatted_html = EditorHTMLFormatter.init(this.get("frameInstance").one('body'));
				//Y.log('format it:'+ formatted_html);
				this.get("textArea").set("value",formatted_html);
				//after switch we clean it up
			}
		},	
		/**
		 *
		 * @method _updateButtons
		 * @param e {Event} events
		 * @protected
		 */	
		_updateButtons : function(e) {
			//e.preventDefault();
			var editor = this.get("editor"), node = e.changedNode, cmds = e.commands;
			
			if(node) {			
				//tag2cmd links tag to command hence button
				var parents = this.get("baseEditor").getDomPath(node, false);//get parent DOM nodes
				editor.all(".html_toolbar div[role=button]").removeClass("active");//reset buttons
				
				Y.each(parents, function(node){
					var cmd = this.tag2cmd[node.tagName.toLowerCase()];
					/* also support our outline styles */
					if(cmd){
						editor.all(".html_toolbar div[role=button]").each(function(node){
							if(node.getAttribute("command") === cmd){
								node.addClass("active");//active
							}
						});
					}
				},this);
			}
		},		
		/**
		 *
		 * @method _toggleComposer
		 * @param toggle {Boolean} Toggle between WYSIWYG editor or HTML.
		 * @protected
		 */
		_toggleComposer: function(toggle){
			var editor = this.get("editor");
			try{
				Y.log('toggle: '+toggle);
				this.set("visualEditMode",toggle);
				if(toggle === true){
					//wysiwyg editor
					this.get("baseEditor").set('content',this._formatDom() + this.textAreaTextDefault);//is removed anyways by regex
					
					//make object not peak through
					//var param = Y.Node.create('<param name="wmode" value="opaque">');
					//this.get("frameInstance").all('object').appendChild(param);
					
					editor.one(".html_toolbar").setStyle('display','block');
					editor.one(".plain_toolbar").setStyle('display','none');
					
					editor.one(".f9").setStyle('display','none');
					editor.one(".f8").setStyle('display','block');
				}else{
					//html format editor				
					this.get("textArea").set("value",this._cleanDom());

					//this._formatHtml();//format html
													
					editor.one(".html_toolbar").setStyle('display','none');
					editor.one(".plain_toolbar").setStyle('display','block');
					
					editor.one(".f9").setStyle('display','block');
					editor.one(".f8").setStyle('display','none');
				}
			}catch(err){
				
				Y.log("Could not switch view: _toggleComposer()");
				Y.log(err);
				
			}
		},
		/**
		*
		* @method _formatDom
		* @protected
		* @return {String} textArea value.
		*/
		_formatDom : function(){
			var content = this.get("textArea").get("value");;
			//content = content.replace(this.regexps.normalizeRe, " ");/* clean up whitespace */
			if(content.length < 1){
				return "";/* toggle will add a p again */
			}
			
			return content;
		},
		/**
		*
		* @method _cleanNodes
		* @protected
		*/
		_cleanNodes : function(){
			/* http://yuilibrary.com/yui/docs/node/ */
			
			var tags = this.get("frameInstance").one('body').all("*");
			tags.each(function(node){
				
				if(node.ancestor(".gridbuilder",true)){
					Y.log("don't touch grid");
					return;
				}

				if(node.get("tagName") === "B") {
					var newNode = Y.Node.create('<strong></strong>');
					newNode.set("innerHTML",node.get("innerHTML"));				
					node.replace(newNode);
					Y.log("b altered to strong");
				}

				if(node.get("tagName") === "I") {
					var newNode = Y.Node.create('<em></em>');
					newNode.set("innerHTML",node.get("innerHTML"));				
					node.replace(newNode);
					Y.log("i altered to em");
				}

				//remove spans without a whitelisted meaning
				//remove justify on span or normal?
				if(node.get("tagName") === "SPAN") { //&& no whitelisted style (weight, underline, color, italics, align)
					var flag = false;
					Y.each(this.styles, function(value, key) {
						style = node.getStyle(key);//return textDecoration = none, equals; drop line-height and stuff
						if(value === true && style && (style !== "normal" && style !== "justify" && style !== "none"  && style !== "start" )){
							//keep
							Y.log("span with "+key+"=>"+style+" ok");
							flag = true;
						}else{
							//remove style
							node.setStyle(key,'');
						}
					});
					/* safari adds spans with Apple-style-span stuff */
					if(flag === false || node.hasClass("Apple-style-span")){
						Y.log("moving span out of the way");
						node.get("parentNode").insertBefore(node.get("childNodes"),node);
						node.remove();
					}
				}
												
				if(node.get("tagName") === "DIV" && this._getInnerText(node,true).length > 0) {
					if (node.get("innerHTML").search(this.regexps.divToPElementsRe) === -1)	{
						Y.log("altering div to p");
						var newNode = Y.Node.create('<p></p>');//kills all div information
						newNode.set("innerHTML",node.get("innerHTML"));				
						node.replace(newNode);
					}else{
						Y.log("not altering div to p");
					}
				}
				
				//if has no child node text, what are you doing here (p with an image?)
				if(node.get("tagName").match(/^(ul|ol|blockquote|p|li|em|strong|h3|h2)$/i)){
					//Y.log('tag '+node.get("tagName")+' has '+this._getInnerText(node,true));
					if(this._getInnerText(node,true).length === 0 && node.all("img, iframe, object, br").size() === 0){
						Y.log("remove containing node "+node.get("tagName")+" = "+this._getInnerText(node,true));
						node.remove();
					}else{
						Y.log("node not removed: "+node.get("tagName")+" = "+this._getInnerText(node,true).length +" = "+node.all("img, iframe, object").size());
					}
				}

				//if youtube object/iframe, strip parent <p>
				if(node.get("tagName") === "P" && this._getInnerText(node,true).length === 0 && (node.one('*') && (node.one('*').get("tagName") === "IFRAME" || node.one('*').get("tagName") === "IMG"))) {
					Y.log("found "+node.get("tagName")+" with "+node.one('*').get("tagName"));	
					var newNode = Y.Node.create('<div></div>');
					newNode.addClass("media");
					newNode.set("innerHTML",node.get("innerHTML"));					
					node.replace(newNode);
				}
				
				//some editor-base node for IE and cursors
				if(node.get("tagName") === "VAR") {
					Y.log("moving VAR out of the way");
					node.get("parentNode").insertBefore(node.get("childNodes"),node);
					node.remove();
				}

				
			},this);
		},
		/**
		* Cleans up the DOM the editor created.
		* @method _cleanNodes
		* @protected
		* @return {String} WYSIWYG to clean HTML string.
		*/
		_cleanDom : function(){
			
			//clean up dom
			this._cleanNodes();
						
			var textContent = this.get("baseEditor").getContent();//get content
			
			//br br to p
			textContent = textContent.replace(this.regexps.replaceBrsRe, '</p><p>');
			
			//remove &nbsp;
			textContent = textContent.replace(/&nbsp;/gi, ' ');
			
			//replace <br><p>
			textContent = textContent.replace(/<br>([\S+])?<p>/gi, '<p>');

			//replace </p></br>
			textContent = textContent.replace(/<\/p>([\S+])?<br>/gi, '</p>');

			//replace <p>[spaces|single br]</p> or those as divs
			textContent = textContent.replace(/<(div|p|span)>([\S+])?(<br>)?<\/(div|p|span)>/gi, '');
			
			//replace style="" due to clearing unwanted styles, but keeping this attribute
			textContent = textContent.replace(/ style=""/gi, '');
			
			return textContent;
		},
		/**
		 * 
		 * @method _getInnerText
		 * @param e {HTMLElement}
		 * @param normalizeSpaces {Boolean}
		 * @protected
		 * @return {String} Node text contents as string.
		 */			
		_getInnerText: function (e, normalizeSpaces) {
			var textContent = "";
			normalizeSpaces = (typeof normalizeSpaces === 'undefined') ? true : normalizeSpaces;

			textContent = e.get("text").replace(this.regexps.trimRe, "");
			
			if(normalizeSpaces && !e.hasChildNodes()){
				e.set("text",textContent.replace(this.regexps.normalizeRe, " "));
			}
			
			return textContent;
		},
		/**
		 * @method submitForm
		 * @param e {Event}
		 * @description Called before form is submitted
		 */		
		submitForm: function(e){
			Y.log("submitForm call");
			
			//if in 'wysiwyg' mode
			if(this.get("visualEditMode") === true){
				this.get("textArea").set("value",this._cleanDom());/* take content from wysig editor and push to textarea */
			}
			
			this.get("textArea").set("value",this._formatDom());
			
			//Y.one(this.get("formEl")).submit();	//remove submitForm from event listener?		
		},
		/**
		 * @method getContent
		 * @description Return the html content from the active view
		 * @return {String} Editor content as html string.
		 */	
		getContent: function(){
			
			//if in 'wysiwyg' mode
			if(this.get("visualEditMode") === true){
				this.get("textArea").set("value",this._cleanDom());/* take content from wysig editor and push to textarea */
			}
			
			return this._formatDom();			
		},
		/**
		 * 
		 **/		
		test : function(){
			
		}
	});
	
	Y.EditorUI = EditorUI;
	/**
	 * @module gallery-editor-ui
	 */

	/**
	 * @class EditorHTMLFormatter
	 * @description Formats a DOM to correctly outlined easy to read HTML.
	 */	
	var EditorHTMLFormatter = {
		html: [],
		indent: '  ',
		trimRe: /^\s+|\s+$/gi,
		inlineNodeRe: /^(img|br|sup|sub)$/i,
		newLineNodeRe: /^(div|p|img|blockquote|q|iframe|pre|code|table|tbody|th|td|tr|ul|ol|li|h1|h2|h3|h4|h5|h6|dl|dt|dd|form|fieldset|legend|iframe)$/i,
		notCloseNodesRe: /^(img|br)$/i,
		firstNodeRe: /^(<[^>]+>)/i,
		replaceNodesRe: /^(script|style|meta|body|head|title|link)/i,
		keepAttributesRe: /^(src|style|width|height|class|title|alt|data-)/i,//no id
		/* span, ul, b, strong, em, i, ul are all online */

		/**
		 * @method init
		 * @description main render method
		 * @param dom {Object} native DOM element or YUI Node
		 * @return {String} HTML
		 */		
		init: function(dom){
			this.html = [];
			if(dom === null){
				return '';//overwrites so maybe return dom
			}else if(dom && dom._node){
				this._dive(dom.getDOMNode(),0);//for YUI
			}else{
				this._dive(dom,0);//native DOM assumed
			}
			return this.html.join('');
		},
		/**
		*
		* @method _dive
		* @protected
		*/			
		_dive: function (e,level) {
			var node = e.firstChild;
	
			if(!e) {
				return;
			}
	
			//go until no more child nodes
			while(node !== null) {
				//https://developer.mozilla.org/en-US/docs/DOM/Node.nodeType
				var hasTextChild = node.hasChildNodes() > 0 && node.firstChild.nodeType === 3 && node.firstChild.nodeValue.replace(this.trimRe,'').length > 0;
				if (node.nodeType === 1) {
					var nodeName = node.nodeName.toLowerCase();
					//add all atributes
	
					//var node_str = node.outerHTML.replace(node.innerHTML,'').replace(this.trimRe, '');//works with new lines and stuff?
					//rebuild node
					var collection = node.attributes;
					var node_str = "<"+nodeName;
					for(var i=0; i<collection.length; i++){
						 node_str += " "+collection[i].name + "=\"" + collection[i].value+"\"";
					}	
					node_str += ">";		
					/*
					node_match = node_str.match(this.firstNodeRe);//extract only first node
					if(node_match){
						node_str = node_match[0];
					}
					*/	
					
					//only certain nodes get indent
					var new_line = '', indent_str = '';
					if (nodeName.search(this.newLineNodeRe) === -1) {
						indent_str = '';
					}else if(hasTextChild || !nodeName.search(this.inlineNodeRe)  === -1){
						//text node
						indent_str = ''+this._indenter(level);
					}else{//inline block
						new_line = '\n';
						indent_str = ''+this._indenter(level);
					}
					
					this.html.push(indent_str+node_str);
					
					//if first child is not empty textnode, add new line
					if (!hasTextChild){
						this.html.push(new_line);
					}
					
					this._dive(node,(level + 1));
				}else if(node.nodeType === 3){
					//text nodes (only non empty)
					if(node.nodeValue.replace(this.trimRe, '').length > 0)
						this.html.push(node.nodeValue);			
				}else if(node.nodeType === 8){
					this.html.push("<!-- "+node.nodeValue.replace(this.trimRe, '')+" -->\n");//comment node
				}
	
				
				if (node.nodeType === 1) {
					var nodeName = node.nodeName.toLowerCase();
					
					//if to another level, close tag
					if (nodeName.search(this.notCloseNodesRe) === -1) {		
						if (nodeName.search(this.newLineNodeRe) === -1) {
							this.html.push('</'+nodeName+'>');	//just close tag
						}else if(hasTextChild){
							/* if has no childeren of main node, don't indent */
							this.html.push('</'+nodeName+'>\n');
						}else{
							var indent_str = this._indenter(level);
							this.html.push(indent_str+'</'+nodeName+'>\n'); //new line node (block) end tag
						}
					}
				}
				
				//move to next
				node = node.nextSibling;
			}           
		},
		/**
		*
		* @method _indenter
		* @protected
		*/			
		_indenter: function(level){
			var indent_str = '';
			for(var i=0; i < level; i++){
				indent_str = indent_str + this.indent; 
			}	
			return indent_str;
		}
	}
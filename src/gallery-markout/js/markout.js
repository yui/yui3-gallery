/*!
 * MarkoutJS - An API for creating DOM nodes in JavaScript
 * 
 * Oddnut Software - http://oddnut.com/markout/
 * Copyright (c) 2009-2010 Eric Ferraiuolo and David Fogel
 * YUI BSD - http://developer.yahoo.com/yui/license.html
 */
	
	var Markout, YMarkout, XHTMLTags, i;
	
	Markout = function( container ) {
		
		// make the constructor an optional factory
		if ( ! (this instanceof arguments.callee) ) {
			return new arguments.callee( container );
		}
		
		// check that container is an Element or DocumentFragment Node
		if ( container && ( container.nodeType === 1 || container.nodeType === 11 ) ) {
			this._node = container;
		} else {
			this._node = this._doc.createDocumentFragment();
		}
		
	};
	
	Markout.prototype = {
	
		getDOMNode : function() {
			
			return this._node;
		},
		
		el : function( element, attrs ) {
			
			var childHTML;
			
			// create a new Element Node or use the one passed
			element = typeof element === 'string' ? this._doc.createElement( element ) : element;
			if ( element.nodeType !== 1 ) {
				return this;
			}
			
			// create a new HTML instance with the element as the container
			childHTML = this._createChild( element );
			childHTML.attrs( attrs );
			this._node.appendChild( childHTML.getDOMNode() );
			
			return childHTML;
		},
		
		attrs : function( attrs ) {
			
			var node = this._node,
				key;
			attrs = attrs || {};
			
			for ( key in attrs ) {
				if ( node[key] !== undefined ) {
					node[key] = attrs[key];
				}
			}
		},
		
		text : function() {
			
			var args, textNode, i;
			
			// check for an array being passed
			if ( Object.prototype.toString.call( arguments[0] ) === '[object Array]' ) {
				args = arguments[0];
			} else {
				args = [];
				for ( i = 0; i < arguments.length; i++ ) {
					args.push( arguments[i] );
				}
			}
			
			// append the Text Node to the container
			textNode = this._doc.createTextNode( args.join('') );
			this._node.appendChild( textNode );
			
			return textNode;
		},
		
		space : function() {
			
			return this.text(' ');
		},
		
		_doc : document,
		
		_createChild : function( element ) {
			
			return new Markout( element );
		}
		
	};
	
	Markout.addElShorthand = function( tag ) {
		
		Markout.prototype[ tag ] = function( attrs ) { return this.el( tag, attrs ); };
	};
	
	XHTMLTags = [
		'a', 'abbr', 'acronym', 'address', 'area',
		'b', 'base', 'bdo', 'big', 'blockquote', /*'body',*/ 'br', 'button',
		'caption', 'cite', 'code', 'col', 'colgroup',
		'dd', 'del', 'dfn', 'div', 'dl', 'dt',
		'em',
		'fieldset', 'form',
		'h1', 'h2', 'h3', 'h4', 'h5', 'h6', /*'head',*/ 'hr', /*'html',*/
		'i', 'img', 'input', 'ins',
		'kbd',
		'label', 'legend', 'li', 'link',
		'map', 'meta',
		/*'noscript',*/
		'object', 'ol', 'optgroup', 'option',
		'p', 'param', 'pre',
		'q',
		'samp', 'script', 'select', 'small', 'span', 'strong', 'style', 'sub', 'sup',
		'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'title', 'tr', 'tt',
		'ul'
		/*'var'*/
	];
	
	for ( i = 0; i < XHTMLTags.length; i++ ) {
		Markout.addElShorthand( XHTMLTags[i] );
	}
	
//	window.Markout = window.Markout || Markout;
		
		
	YMarkout = function( container ) {
		
		// make the constructor an optional factory
		if ( ! (this instanceof arguments.callee) ) {
			return new arguments.callee( container );
		}
		
		// check for CSS selector or Y.Node instance
		if ( Y.Lang.isString(container) ) {
			container = Y.Selector.query( container, this._doc, true );
		} else if ( container instanceof Y.Node ) {
			container = Y.Node.getDOMNode(container);
		}
		
		YMarkout.superclass.constructor.call( this, container );
		
	};
	
	YMarkout.NAME = 'markout';
	
	Y.extend( YMarkout, Markout, {
		
		getNode : function() {
			
			this._yNode = this._yNode || Y.one( this._node );
			return this._yNode;
		},
		
		attrs : function( attrs ) {
			
			// setStyle should be called only once per attrs set,
			// whereas, setAttribute might be called n times.
			// caching isObject and setAttribute to prevent un-neccessary global lookups
			var isObject = Y.Lang.isObject,
				setAttribute = Y.DOM.setAttribute,
				node = this._node;
				
			attrs = attrs || {};
			
			Y.each(attrs, function(val, key){
				if ( key === 'style' && isObject(val) ) {
					Y.DOM.setStyles( node, val );
				} else {
					setAttribute( node, key, val );
				}
			});
		},
		
		_createChild : function( element ) {
			
			return new YMarkout(element);
		},
		
		_doc : Y.config.doc
		
	});
	
	Y.Markout = YMarkout;

YUI.add("gallery-simple-menu",function(H){var E="menu-active",C="menu-visible",B="role",G="aria-hidden",F=0,A=1;function D(I){this._link=I.host;this._menu=this._link.next();this._link.set("aria-haspopup","true");this._menu.setAttrs({"role":"menu","aria-labelledby":this._link.getAttribute("id"),"aria-hidden":"true"});this._menu.all("ul,li").set(B,"presentation");this._menu.all("a").set(B,"menuitem");this._menu.plug(H.Plugin.NodeFocusManager,{descendants:"a",keys:(H.UA.gecko?{previous:"press:38",next:"press:40"}:{previous:"down:38",next:"down:40"})});this._link.on("click",function(J){J.halt();this.toggle();},this);this._menu.on("keydown",function(J){if(J.keyCode===27){J.halt();this.hide();}},this);H.one(document).on("mousedown",function(K){var J=K.target;if(J!==this._link&&!this._menu.contains(J)){this.hide();}},this);}D.prototype={_state:A,show:function(){if(this._state!==F){this._link.addClass(E);this._menu.addClass(C);this._menu.set(G,false);this._menu.focusManager.focus();this._state=F;}},hide:function(){if(this._state!==A){this._link.removeClass(E);this._menu.removeClass(C);this._menu.set(G,true);this._link.focus();this._state=A;}},toggle:function(){this[this._state===A?"show":"hide"]();}};D.NAME="SimpleMenu";D.NS="simplemenu";H.namespace("Plugin").SimpleMenu=D;},"@VERSION@",{requires:["node-focusmanager"]});
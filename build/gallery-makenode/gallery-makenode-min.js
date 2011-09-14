YUI.add("gallery-makenode",function(a){(function(){var k=a.Lang,n="dump",q=" ",m="{",p="}",l=/(~-(\d+)-~)/g,o=/\{LBRACE\}/g,r=/\{RBRACE\}/g;a.substitute=function(H,u,B,t){var z,y,x,F,E,G,D=[],w,A,C=H.length;for(;;){z=H.lastIndexOf(m,C);if(z<0){break;}y=H.indexOf(p,z);if(z+1>=y){break;}w=H.substring(z+1,y);F=w;G=null;x=F.indexOf(q);if(x>-1){G=F.substring(x+1);F=F.substring(0,x);}E=u[F];if(B){E=B(F,E,G);}if(k.isObject(E)){if(!a.dump){E=E.toString();}else{if(k.isArray(E)){E=a.dump(E,parseInt(G,10));}else{G=G||"";A=G.indexOf(n);if(A>-1){G=G.substring(4);}if(E.toString===Object.prototype.toString||A>-1){E=a.dump(E,parseInt(G,10));}else{E=E.toString();}}}}else{if(k.isUndefined(E)){E="~-"+D.length+"-~";D.push(w);}}H=H.substring(0,z)+E+H.substring(y+1);if(!t){C=z-1;}}return H.replace(l,function(I,v,s){return m+D[parseInt(s,10)]+p;}).replace(o,m).replace(r,p);};})();var b=/\s+/,c="Node",i=".",h="boundingBox",f=a.Lang,j=' for "{name}" defined in class {recentDef} also defined in class {prevDef}',e=/^(?:([ \t]+)|("[^"\\]*(?:\\.[^"\\]*)*")|(true)|(false)|(null)|([\-+]?[0-9]*(?:\.[0-9]+)?))/,d=/\\"/g,g=function(){var k=this;k._eventHandles=[];k._makeClassNames();k._concatUIAttrs();k._publishEvents();k.after("render",k._attachEvents,k);k.after("destroy",k._detachEvents,k);};g.prototype={_eventHandles:null,_classNames:null,_templateHandlers:{"@":function(k){return this.get(k);},"p":function(k){return this[k];},"m":function(k){var l=k.split(b)[0];k=k.substr(l.length);k=this._parseMakeNodeArgs(k);return this[l].apply(this,k);},"c":function(k){return this._classNames[k];},"s":function(k,l){return this._substitute(this.get("strings")[k],l);},"?":function(k){k=this._parseMakeNodeArgs(k);return(!!k[0])?k[1]:k[2];},"1":function(k){k=this._parseMakeNodeArgs(k);return parseInt(k[0],10)===1?k[1]:k[2];}},_parseMakeNodeArgs:function(k){var l=[],m=function(n,o){if(n!==undefined&&o){switch(o){case 1:break;case 2:l.push(n.substr(1,n.length-2).replace(d,'"'));break;case 3:l.push(true);break;case 4:l.push(false);break;case 5:l.push(null);break;case 6:if(n){l.push(parseFloat(n));}else{k=k.substr(1);}break;}k=k.substr(n.length);return true;}};while(k.length){a.some(e.exec(k),m);}return l;},_forAllXinClasses:function(k,r){var n=this,q=this._getClasses(),m=q.length,p,s,o=function(t,l){r.call(n,s,t,l);};for(p=m-1;p>=0;p--){s=q[p];if(s[k]){a.each(s[k],o);}}},_makeNode:function(l,k){if(!l){a.some(this._getClasses(),function(m){l=m._TEMPLATE;if(l){return true;}});}return a.Node.create(this._substitute(l,k));},_substitute:function(m,l){var k;return a.substitute(m,l||{},a.bind(function(o,p,n){if(n){k=this._templateHandlers[o.toLowerCase()];if(k){return k.call(this,n,l);}}return p;},this),true);},_locateNodes:function(){var k=this.get(h),l;if(arguments.length){a.each(arguments,function(m){l=k.one(i+this._classNames[m]);if(l){this["_"+m+c]=l;}},this);}else{a.each(this._classNames,function(m,n){l=k.one(i+m);if(l){this["_"+n+c]=l;}},this);}},_makeClassNames:function(){var l=a.ClassNameManager.getClassName,m={},k=this._classNames={};this._forAllXinClasses("_CLASS_NAMES",function(o,n){if(m[n]){}else{k[n]=l(o.NAME.toLowerCase(),n);m[n]=o.NAME;}});k.content=(k[h]=l(this.constructor.NAME.toLowerCase()))+"-content";if(this.getStdModNode){k.HEADER="yui3-widget-hd";k.BODY="yui3-widget-bd";k.FOOTER="yui3-widget-ft";}},_concatUIAttrs:function(){var m,l,k={};a.each(["BIND","SYNC"],function(n){m={};a.each(this._UI_ATTRS[n],function(o){m[o]="Widget";});a.each(this._getClasses(),function(o){l=o._ATTRS_2_UI;if(l){a.each(a.Array(l[n]),function(p){if(m[p]){}else{m[p]=o.NAME;}});}});k[n]=a.Object.keys(m);},this);this._UI_ATTRS=k;},_attachEvents:function(){var s=this.get(h),l,r=this,m=[],o,p,n,q=function(t){return t.charAt(0).toUpperCase()+t.substr(1);},k={boundingBox:s,document:s.get("ownerDocument"),THIS:r,Y:a};this._forAllXinClasses("_EVENTS",function(v,t,u){l=k[u]||i+this._classNames[u];a.each(a.Array(t),function(w){p=null;if(f.isString(w)){o=w;n=null;}else{if(f.isObject(w)){o=w.type;p=w.fn;n=w.args;}else{}}if(o){p=p||"_after"+q(u)+q(o);if(!r[p]){}else{p=r[p];}if(f.isString(l)){if(o==="key"){m.push(s.delegate(o,p,n,l,r));}else{m.push(s.delegate(o,p,l,r,n));}}else{if(l===r||l===a){m.push(l.after(o,p,r,n));}else{if(o==="key"){m.push(a.after(o,p,l,n,r));}else{m.push(a.after(o,p,l,r,n));}}}}else{}});},this);this._eventHandles=this._eventHandles.concat(m);},_publishEvents:function(){this._forAllXinClasses("_PUBLISH",function(n,l,k){var m={};a.each(l||{},function(p,o){m[o]=o.substr(-2)==="Fn"?this[p]:p;},this);this.publish(k,m);});},_detachEvents:function(){a.each(this._eventHandles,function(k){k.detach();});}};a.MakeNode=g;},"@VERSION@",{requires:["substitute","classnamemanager"],skinnable:false});
YUI.add("gallery-widget-fold",function(G){var C=G.Lang,B="foldDistance",E="cacheVerticalPosition",A="host",F="rendered",D={};D[B]={value:-1,validator:C.isNumber};D[E]={value:true};G.WidgetFoldPlugin=G.Base.create("widget-fold",G.Plugin.Base,[],{initializer:function(I){var J=this.get(A),H=G.bind("_foldCheck",this);if(!J.get(F)){this._renderedHandler=J.on(F+"Change",this.destructor,this);this._scrollHandler=G.on("scroll",H,window);this._resizeHandler=G.on("resize",H,window);this._foldCheck();}},clearVerticalPositionCache:function(){this._vPos=0;return this;},_vPos:0,_foldCheck:function(){var J=this.get(A),K=this.get(B),H=G.DOM.viewportRegion().bottom,I;if(this._vPos&&this.get(E)){I=this._vPos;}else{I=this._vPos=J.get("srcNode").getY();}if(I<H+K){this.destructor();J.render();}},destructor:function(){this._renderedHandler.detach();this._scrollHandler.detach();this._resizeHandler.detach();}},{NS:"foldcheck",ATTRS:D});},"@VERSION@",{requires:["plugin","base-build"]});
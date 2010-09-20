YUI.add("gallery-carousel-anim",function(E){function A(){A.superclass.constructor.apply(this,arguments);}var D=E.Lang,C="afterScroll",B="beforeScroll";A.NAME="carouselAnimPlugin";A.NS="anim";A.ATTRS={animation:{validator:"_validateAnimation",value:{speed:0,effect:E.Easing.easeOut}}};E.CarouselAnimPlugin=E.extend(A,E.Plugin.Base,{initializer:function(F){this.beforeHostMethod("scrollTo",this.animateAndScrollTo);},animateAndScrollTo:function(J){var O=this,N=O.get("host"),G,H,F,I,M,K,L;if(N.get("rendered")){H=O.get("animation");if(N&&H.speed>0){F=N.get("contentBox");K=N.get("isVertical");if(K){M={top:N.get("top")};L={top:N._getOffsetForIndex(J)};}else{M={left:N.get("left")};L={left:N._getOffsetForIndex(J)};}I=N.getFirstVisible();O.fire(B,{first:I,last:I+N.get("numVisible")});G=new E.Anim({node:F,from:M,to:L,duration:H.speed,easing:H.effect});G.on("end",E.bind(O._afterAnimEnd,O,J));G.run();return new E.Do.Prevent();}}return false;},_afterAnimEnd:function(H){var F=this,G=F.get("host");G.set("selectedItem",H);},_validateAnimation:function(F){var G=false;if(D.isObject(F)){if(D.isNumber(F.speed)){G=true;}if(!D.isUndefined(F.effect)&&!D.isFunction(F.effect)){G=false;}}return G;},_animObj:null});},"@VERSION@",{requires:["gallery-carousel","anim","plugin","pluginhost"]});
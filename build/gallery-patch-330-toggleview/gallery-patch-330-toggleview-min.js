YUI.add("gallery-patch-330-toggleview",function(b){function a(d,c,e){return function(){if(c){c.call(d);}if(e){e.apply(d._node,arguments);}};}b.Node.prototype.toggleView=function(d,c){var e;this._toggles=this._toggles||[];if(typeof d=="boolean"){c=d;}if(typeof c==="undefined"&&d in this._toggles){c=!this._toggles[d];}c=(c)?1:0;if(c){this._show();}else{e=a(this,this._hide);}this._toggles[d]=c;this.transition(b.Transition.toggles[d][c],e);};},"gallery-2011.01.26-20-33",{requires:["transition-native"]});
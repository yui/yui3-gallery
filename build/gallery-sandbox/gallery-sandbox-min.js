YUI.add("gallery-sandbox",function(G){var D=YUI.namespace("Env.Sandbox"),E=G.Lang,C=G.config,A=C.doc.body,F=E.isFunction,B="ready",H=function(I){this.publish(B,{fireOnce:true});this._id=G.guid("sandbox-");this.config=G.merge(this.config,I||{});this._env=D[this._id]={};this._createIframe();};G.augment(H,G.EventTarget);G.mix(H.prototype,{config:{bootstrapYUI:false},clearProfile:function(){var I=this._env;delete I.done;delete I.endTime;delete I.runs;delete I.startTime;},count:function(I,M){var L=this._env,K=G.guid("count-"),O=this._iframe.contentWindow,J,N,P;I=this._getCountedScript(I,K);P=J=new Date().getTime();while(J-P<M){L.run.call(O,I);J=new Date().getTime();}N=this.getEnvValue(K);this.deleteEnvValue(K);return N||0;},deleteEnvValue:function(I){if(I!=="run"&&G.Object.owns(this._env,I)){delete this._env[I];}},destroy:function(){delete D[this._id];if(this._iframe&&this._iframe.parentNode){this._iframe.parentNode.removeChild(this._iframe);delete this._iframe;}},getEnvValue:function(I){return G.Object.owns(this._env,I)?this._env[I]:undefined;},profile:function(I,N){var K=this._env,J=G.guid("profile-"),M=this._iframe.contentWindow,L;this.clearProfile();I=this._getProfiledScript(I,J);if(N){L=G.later(C.pollInterval||15,this,function(){var Q=this.getEnvValue(J),O=Q&&Q.endTime,P;if(O){L.cancel();P=Q.startTime;this.deleteEnvValue(J);N.call(C.win,{duration:O-P,endTime:O,startTime:P});}},null,true);}return K.run.call(M,I);},run:function(I,L){var J=G.guid("run-"),K;this.setEnvValue(J,false);if(L){K=G.later(C.pollInterval||15,this,function(){if(this.getEnvValue(J)===true){K.cancel();this.deleteEnvValue(J);L.call(C.win);}},null,true);}return this._env.run.call(this._iframe.contentWindow,this._getScript(I,J));},setEnvValue:function(I,J){if(I==="run"){return undefined;}this._env[I]=J;return J;},_createIframe:function(){var I=A.appendChild(G.DOM.create('<iframe id="'+this._id+'" style="display:none"/>')),K=I.contentWindow.document,J;K.write("<!DOCTYPE html>"+"<html>"+"<head>"+"<title>"+this._id+"</title>"+"</head>"+"<body>"+"<script>"+'var sandbox = parent.YUI.Env.Sandbox["'+this._id+'"];'+"sandbox.run = function (script) { return window.eval(script); };"+"<\/script>");if(this.config.bootstrapYUI){K.write('<script src="'+C.base+'yui/yui-min.js"><\/script>'+'<script src="'+C.base+'loader/loader-min.js"><\/script>');}K.write("<script>sandbox.ready = true;<\/script>"+"</body>"+"</html>");K.close();this._iframe=I;J=G.later(C.pollInterval||15,this,function(){if(this.getEnvValue("ready")===true){J.cancel();this.fire(B);}},null,true);},_getCountedScript:function(I,J){return"(function () {"+'var done = function () { sandbox["'+J+'"] += 1 };'+'sandbox["'+J+'"] = sandbox["'+J+'"] || 0;'+(F(I)?"("+I.toString()+"());":I)+"}());";},_getProfiledScript:function(I,J){return"(function () {"+'var done = function () { sandbox["'+J+'"].endTime = new Date().getTime(); };'+'sandbox["'+J+'"] = {startTime: new Date().getTime()};'+(F(I)?"("+I.toString()+"());":I)+"}());";},_getScript:function(I,J){return"(function () {"+'var done = function () { sandbox["'+J+'"] = true; };'+(F(I)?"("+I.toString()+"());":I)+"}());";}},true);G.Sandbox=H;},"gallery-2010.05.12-19-08",{requires:["dom-base","event-custom-base","later"]});
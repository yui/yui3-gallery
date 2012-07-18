YUI.add("gallery-alea",function(a){
/*!
 * based on Alea.js and Mash.js. http://baagoe.com/en/RandomMusings/javascript/
 * Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function(g){var b=g.Array,f=b.each,d=function(){var h=4022871197;return function(m){m=m.toString();var k,j=0,l=m.length;for(;j<l;j+=1){h+=m.charCodeAt(j);k=0.02519603282416938*h;h=k>>>0;k-=h;k*=h;h=k>>>0;k-=h;h+=k*4294967296;}return(h>>>0)*2.3283064365386963e-10;};},e=g.Lang.now,c=function(){var i=b(arguments),m=1,k=d(),l=k(" "),j=k(" "),h=k(" ");if(!i.length){i.push(e());}f(i,function(n){l-=k(n);if(l<0){l+=1;}j-=k(n);if(j<0){j+=1;}h-=k(n);if(h<0){h+=1;}});this.random=function(){var n=2091639*l+m*2.3283064365386963e-10;m=n|0;l=j;j=h;h=n-m;return h;};};c.prototype={fract53:function(){var h=this.random;return h()+(h()*2097152|0)*1.1102230246251565e-16;},uint32:function(){return this.random()*4294967296;}};g.Alea=c;}(a));},"gallery-2012.07.18-13-22",{requires:["yui-base"],skinnable:false});
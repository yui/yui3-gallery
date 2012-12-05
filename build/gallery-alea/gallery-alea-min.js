YUI.add("gallery-alea",function(e,t){
/*!
 * based on Alea.js and Mash.js.
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
;(function(e){"use strict";var t=4294967296,n=2.3283064365386963e-10,r=" ",i=e.Array,s=i.each,o=e.Lang.now,u=function(){var e=i(arguments),t=1,a=u._mash(),f=a(r),l=a(r),c=a(r);e.length||e.push(o()),s(e,function(e){f-=a(e),f<0&&(f+=1),l-=a(e),l<0&&(l+=1),c-=a(e),c<0&&(c+=1)}),this.random=function(){var e=2091639*f+t*n;return t=e|0,f=l,l=c,c=e-t,c}};u.prototype={fract53:function(){var e=this.random;return e()+(e()*2097152|0)*1.1102230246251565e-16},uint32:function(){return this.random()*t}},u._mash=function(){var e=4022871197;return function(r){r=r.toString();var i,s=0,o=r.length;for(;s<o;s+=1)e+=r.charCodeAt(s),i=.02519603282416938*e,e=i>>>0,i-=e,i*=e,e=i>>>0,i-=e,e+=i*t;return(e>>>0)*n}},e.Alea=u})(e)},"gallery-2012.12.05-21-01");

/*
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the Stephen Woods nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY STEPHEN WOODS ''AS IS'' AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL STEPHEN WOODS BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


/**
 * Color utils
 * 
 */
 
 
 /**
  * a port of the yui 2 color utils
  * @class colorutils
  * @namespace Y.color
  */
  
  var NAMESPACE   = 'color',
      NAME    = 'utils',
      TO_STRING = 'toString',
      PARSE_INT = parseInt,
      RE = RegExp;
      
      
  var utils = {
      
      /**
      * @property KEYWORDS
      * @type Object
      * @description Color keywords used when converting to Hex
      */
      KEYWORDS: {
          black: '000',
          silver: 'c0c0c0',
          gray: '808080',
          white: 'fff',
          maroon: '800000',
          red: 'f00',
          purple: '800080',
          fuchsia: 'f0f',
          green: '008000',
          lime: '0f0',
          olive: '808000',
          yellow: 'ff0',
          navy: '000080',
          blue: '00f',
          teal: '008080',
          aqua: '0ff'
      },
      /**
      * @property re_RGB
      * @private
      * @type Regex
      * @description Regex to parse rgb(0,0,0) formatted strings
      */
      re_RGB: /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,
      /**
      * @property re_hex
      * @private
      * @type Regex
      * @description Regex to parse #123456 formatted strings
      */
      re_hex: /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,
      /**
      * @property re_hex3
      * @private
      * @type Regex
      * @description Regex to parse #123 formatted strings
      */
      re_hex3: /([0-9A-F])/gi,
      /**
      * @method toRGB
      * @description Converts a hex or color string to an rgb string: rgb(0,0,0)
      * @param {String} val The string to convert to RGB notation.
      * @returns {String} The converted string
      */
      toRGB: function(val) {
          if (!Y.color.utils.re_RGB.test(val)) {
              val = Y.color.utils.toHex(val);
          }

          if(Y.Dom.Color.re_hex.exec(val)) {
              val = 'rgb(' + [
                  PARSE_INT(RE.$1, 16),
                  PARSE_INT(RE.$2, 16),
                  PARSE_INT(RE.$3, 16)
              ].join(', ') + ')';
          }
          return val;
      },
      /**
      * @method toHex
      * @description Converts an rgb or color string to a hex string: #123456
      * @param {String} val The string to convert to hex notation.
      * @returns {String} The converted string
      */
      toHex: function(val) {
          val = Y.color.utils.KEYWORDS[val] || val;
          if (Y.color.utils.re_RGB.exec(val)) {
              var r = (RE.$1.length === 1) ? '0' + RE.$1 : Number(RE.$1),
                  g = (RE.$2.length === 1) ? '0' + RE.$2 : Number(RE.$2),
                  b = (RE.$3.length === 1) ? '0' + RE.$3 : Number(RE.$3);

              val = [
                  r[TO_STRING](16),
                  g[TO_STRING](16),
                  b[TO_STRING](16)
              ].join('');
          }

          if (val.length < 6) {
              val = val.replace(Y.color.utils.re_hex3, '$1$1');
          }

          if (val !== 'transparent' && val.indexOf('#') < 0) {
              val = '#' + val;
          }

          return val.toLowerCase();
      }
      
      
  };
  
  Y.namespace(NAMESPACE +'.'+NAME);
  Y[NAMESPACE][NAME] = utils;

/*
Copyright (c) 2009, Stephen Woods
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
 * A yui 3 colorpicker
 * 
 * @module Colorpicker
 * @requires oop, event-custom, attribute, base, widget
 */
 
 
 /**
  * a port of the yui 2 colorpicker
  * @class Colorpicker
  * @namespace Y.color
  * @extends Widget
  */
  
  var NAMESPACE   = 'color',
     CONSTRUCTOR  = 'Colorpicker',
     Lang         = Y.Lang,
     isNumber     = Lang.isNumber,
     Widget       = Y.Widget,
     DEFAULT_PICKER_SIZE = 180;
  
  function Colorpicker(config) {
      Colorpicker.superclass.constructor.apply(this, arguments);
  }
  
  Colorpicker.NAME = "colorpicker";
  
  Colorpicker.ATTRS = {
      
      /**
       * The current hue value 0-360
       * @attribute hue
       * @type int
       */
       hue:{
           value:0,
           validator: isNumber
       },
       
       saturation:{
           value: 0,
           validator: isNumber
       },
       
       brightness:{
           value:100,
           validator:isNumber
       }
      
      /**
         * The current blue value 0-255
         * @attribute blue
         * @type int
         */
      blue:{
          value:0,
          validator:isNumber
      },
      /**
         * The current green value 0-255
         * @attribute green
         * @type int
         */
      green:{
          value:0,
          validator:isNumber
      },
      /**
         * The current red value 0-255
         * @attribute red
         * @type int
         */
      red:{
          value:0,
          validator:isNumber
      },
      
      /**
        * The current hex value #000000-#FFFFFF, without the #
        * @attribute hex
        * @type string
        */   
      hex:{
          value:"FFFFFF",
          validator:isString
      },
      
      /**
       * The current rgb value.  Updates the state of all of the
       * other value fields.  Read-only: use setValue to set the
       * controls rgb value.
       * @attribute hex
       * @type [int, int, int]
       * @readonly
       */
      rgb:{
          value:[0,0,0]
      },
      
      /**
       * Hide/show the rgb controls
       * @attribute showrgbcontrols
       * @type boolean
       * @default true
       */
       showrgbcontrols:{
           value:true
       },
       
       /**
        * Hide/show the hsv controls
        * @attribute showhsvcontrols
        * @type boolean
        * @default false
        */
        showhsvcontrols:{
            value:false
        },
        
        /**
         * The size of the picker. Trying to change this is not recommended.
         * @attribute pickersize
         * @default 180
         * @type int
         */
         pickersize:{
             value:DEFAULT_PICKER_SIZE
         },
         
         
        
        
       
        /**
         * Hide/show the hex controls
         * @attribute showhexcontrols
         * @type boolean
         * @default true
         */
         showhexcontrols:{
             value:true
         },
         
         /**
          * Hide/show the hex summary
          * @attribute showhexsummary
          * @type boolean
          * @default true
          */
          showhexsummary:{
              value:true
          }
       
      
  };
  
  Y.extend(Colorpicker, Widget, {
      initializer:function(){
      },
      
      renderUI: function(){
          
          var cb = this.get('contentBox');
          cb.set('innerHTML', '<h1>Works</h1>');
          
      }
      
  });
  
  Y.Base.build(Colorpicker.NAME, Colorpicker, {dynamic:false});
  
  Y.namespace(NAMESPACE +'.'+CONSTRUCTOR);
  Y[NAMESPACE][CONSTRUCTOR] = Colorpicker;
  
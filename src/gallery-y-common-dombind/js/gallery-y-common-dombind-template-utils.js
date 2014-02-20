  
 Y.Common.DomBind.HandleBars = Handlebars;

 /**
  * Its a Y.Template class wrapper, also provides some functionality that was not added on versions previous to YUI 3.12, such as
  * register and render methods, this class is a helper to process templates from DomBind
  *
  * @class TemplateHandler
  * @namespace Common
  * @extends Y.Template
  * @module gallery-y-common-dombind
  * @constructor
  */
 function TemplateHandler(config) {
     TemplateHandler.superclass.constructor.apply(this, arguments);
 }


 Y.extend(TemplateHandler, Y.Template, {

 });

 /* Templates compiled functions registry as caching mechanism */
 TemplateHandler._registry = {};

 /** 
  * 
  * Looks from templates cached map the template function and renders the given data within the template
  * 
  * @method render 
  * 
  * @param {String} templateId The abstracted name to reference the template.
  * @param {Object} [data] The data to be interpolated into the template.
  * 
  * @return {String} Processed data rendered in the template
  * 
  * @static
  * @for Common.TemplateHandler
  */
 TemplateHandler.render = function (templateId, data, options) {
     var template = TemplateHandler._registry[templateId],
         result = '';
     if (template) {
         result = template(data, options);
     } else {
         Y.error('Unregistered template: "' + templateId + '"');
     }
     return result;
 };

 /** 
  * Stores compiled template function into cached map so if template is used again will optimize the rendering time
  * 
  * @method register 
  * 
  * @param {String} templateId The template name
  * @param {Function} template The function that returns the rendered string
  * 
  * @static
  * @for Common.TemplateHandler
  */
 TemplateHandler.register = function (templateId, template) {
     TemplateHandler._registry[templateId] = template;
     return template;
 };

 Y.Common.TemplateHandler = TemplateHandler;
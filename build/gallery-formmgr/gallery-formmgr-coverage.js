if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["/build/gallery-formmgr/gallery-formmgr.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-formmgr/gallery-formmgr.js",
    code: []
};
_yuitest_coverage["/build/gallery-formmgr/gallery-formmgr.js"].code=["YUI.add('gallery-formmgr', function(Y) {","","\"use strict\";","","/**********************************************************************"," * <p>FormManager provides support for initializing a form, pre-validating"," * user input, and displaying messages returned by the server.</p>"," * "," * <p>Also see the documentation for gallery-formmgr-css-validation.</p>"," * "," * @module gallery-formmgr"," * @main gallery-formmgr"," */","","/**"," * <p><strong>Required Markup Structure</strong></p>"," * "," * <p>Each element (or tighly coupled set of elements) must be contained by"," * an element that has the CSS class <code>formmgr-row</code>.  Within each"," * row, validation messages are displayed inside the container with CSS"," * class <code>formmgr-message-text</code>."," * "," * <p>When a message is displayed inside a row, the CSS class"," * <code>formmgr-has{type}</code> is placed on the row container and the"," * containing fieldset (if any), where <code>{type}</code> is the message"," * type passed to <code>displayMessage()</code>.</p>"," * "," * <p><strong>Initializing the Form</strong></p>"," * "," * <p>Default values can be either encoded in the markup or passed to the"," * FormManager constructor via <code>config.default_value_map</code>.  (The"," * former method is obviously better for progressive enhancement.)  The"," * values passed to the constructor override the values encoded in the"," * markup.</p>"," * "," * <p><code>prepareForm()</code> must be called before the form is"," * displayed.  To initialize focus to the first element in a form, call"," * <code>initFocus()</code>.  If the form is in an overlay, you can delay"," * these calls until just before showing the overlay.</p>"," * "," * <p>The default values passed to the constructor are inserted by"," * <code>populateForm()</code>.  (This is automatically called by"," * <code>prepareForm()</code>.)</p>"," * "," * <p><strong>Displaying Messages</strong></p>"," * "," * <p>To display a message for a single form row, call"," * <code>displayMessage()</code>.  To display a message for the form in"," * general, call <code>displayFormMessage()</code>.  These functions can be"," * used for initializing the error display when the page loads, for"," * displaying the results of pre-validation, and for displaying the results"," * of submitting a form via XHR.</p>"," *"," * <p><strong>Specifying Validations</strong></p>"," *"," * <p>The following classes can be applied to a form element for"," * pre-validation:</p>"," *"," * <dl>"," * <dt><code>yiv-required</code></dt>"," * <dd>Value must not be empty.</dd>"," *"," * <dt><code>yiv-length:[x,y]</code></dt>"," * <dd>String must be at least x characters and at most y characters."," * At least one of x and y must be specified.</dd>"," *"," * <dt><code>yiv-integer:[x,y]</code></dt>"," * <dd>The integer value must be at least x and at most y."," * x and y are both optional.</dd>"," *"," * <dt><code>yiv-decimal:[x,y]</code></dt>"," * <dd>The decimal value must be at least x and at most y.  Exponents are"," * not allowed.  x and y are both optional.</dd>"," * </dl>"," *"," * <p>If we ever need to allow exponents, we can use yiv-float.</p>"," *"," * <p>The following functions allow additional pre-validation to be"," * attached to individual form elements:</p>"," *"," * <dl>"," * <dt><code>setRegex()</code></dt>"," * <dd>Sets the regular expression that must match in order for the value"," * to be acceptable.</dd>"," *"," * <dt><code>setFunction()</code></dt>"," * <dd>Sets the function that must return true in order for the value to"," * be acceptable.  The function is called in the scope of the Form"," * object with the arguments:  the form and the element.</dd>"," * </dl>"," *"," * <p><code>setErrorMessages()</code> specifies the error message to be"," * displayed when a pre-validation check fails.</p>"," *"," * <p>Functions are expected to call <code>displayMessage()</code>"," * directly.</p>"," *"," * <p>More complex pre-validations can be added by overriding"," * <code>postValidateForm()</code>, described below.</p>"," *"," * <p>Validation normally strips leading and trailing whitespace from every"," * value.  If you have a special case where this should not be done, add"," * the CSS class <code>yiv-no-trim</code> to the input field.</p>"," *"," * <p>Derived classes may also override the following functions:</p>"," *"," * <dl>"," * <dt><code>prePrepareForm</code>(arguments passed to prepareForm)</dt>"," * <dd>Called before filling in default values for the form elements."," * Return false to cancel dialog.</dd>"," *"," * <dt><code>postPrepareForm</code>(arguments passed to prepareForm)</dt>"," * <dd>Called after filling in default values for the form elements.</dd>"," *"," * <dt><code>postValidateForm</code>(form)</dt>"," * <dd>Called after performing the basic pre-validations.  Returns"," * true if the form contents are acceptable.  Reports error if there"," * is a problem.</dd>"," * </dl>"," *"," * @class FormManager"," * @constructor"," * @param form_name {String} The name attribute of the HTML form."," * @param config {Object} Configuration."," *		<code>status_node</code> is an optional element in which to display"," *		overall status.  <code>default_value_map</code> is an optional"," *		mapping of form element names to default values.  Default values"," *		encoded in the markup will be merged into this map, but values"," *		passed to the constructor will take precedence."," */","","function FormManager(","	/* string */	form_name,","	/* object */	config)		// {status_node, default_value_map}","{","	config = config || {};","	FormManager.superclass.constructor.call(this, config);","","	this.form_name   = form_name;","	this.status_node = Y.one(config.status_node);","	this.enabled     = true;","","	// default values for form elements","","	this.default_value_map = config.default_value_map;","","	// pre-validation methods","","	this.validation =","	{","		fn:    {},	// function for validating each element id","		regex: {}	// regex for validating each element id","	};","","	// error messages","","	this.validation_msgs = {};		// message list, keyed on type, for each element id","","	this.has_messages = false;","	this.has_errors   = false;","","	// buttons -- disabled during submission","","	this.button_list      = [];","	this.user_button_list = [];","","	// file uploading is nasty","","	this.has_file_inputs = false;","}","","/**"," * The CSS class which marks each row of the form.  Typically, each field"," * (or a very tightly coupled set of fields) is placed in a separate row."," * "," * @property row_marker_class"," * @type {String}"," */","FormManager.row_marker_class = 'formmgr-row';","","/**"," * The CSS class which marks each field in a row of the form.  This enables"," * messaging when multiple fields are in a single row."," * "," * @property field_marker_class"," * @type {String}"," */","FormManager.field_marker_class = 'formmgr-field';","","/**"," * The CSS class which marks the container for the status message within a"," * row of the form."," * "," * @property status_marker_class"," * @type {String}"," */","FormManager.status_marker_class = 'formmgr-message-text';","","/**"," * The CSS class placed on <code>status_node</code> when it is empty."," * "," * @property status_none_class"," * @type {String}"," */","FormManager.status_none_class = 'formmgr-status-hidden';","","/**"," * The CSS class placed on <code>status_node</code> when"," * <code>displayFormMessage()</code> is called with"," * <code>error=false</code>."," * "," * @property status_success_class"," * @type {String}"," */","FormManager.status_success_class = 'formmgr-status-success';","","/**"," * The CSS class placed on <code>status_node</code> when"," * <code>displayFormMessage()</code> is called with"," * <code>error=true</code>."," * "," * @property status_failure_class"," * @type {String}"," */","FormManager.status_failure_class = 'formmgr-status-failure';","","/**"," * The prefix for all CSS classes placed on a form row when pre-validation"," * fails.  The full CSS class is formed by appending the value from"," * `Y.FormManager.status_order`."," * "," * @property row_status_prefix"," * @type {String}"," */","FormManager.row_status_prefix = 'formmgr-has';","","// By using functions for the internal values, we allow the above constants","// to be changed before they are first used.","","var cached_status_pattern;","var cached_row_status_pattern;","var cached_row_status_regex;","","function statusPattern()","{","	if (!cached_status_pattern)","	{","		cached_status_pattern = FormManager.status_success_class+'|'+FormManager.status_failure_class;","	}","	return cached_status_pattern;","}","","function rowStatusPattern()","{","	if (!cached_row_status_pattern)","	{","		cached_row_status_pattern = FormManager.row_status_prefix + '([^\\\\s]+)';","	}","	return cached_row_status_pattern;","}","","function rowStatusRegex()","{","	if (!cached_row_status_regex)","	{","		cached_row_status_regex = new RegExp(Y.Node.class_re_prefix + rowStatusPattern() + Y.Node.class_re_suffix);","	}","	return cached_row_status_regex;","}","","/**"," * Get the status of the given fieldset or form row."," * "," * @method getElementStatus"," * @static"," * @param e {String|Object} The descriptor or DOM element."," * @return {mixed} The status (String) or <code>false</code>."," */","FormManager.getElementStatus = function(","	/* string/object */	e)","{","	var m = Y.one(e).get('className').match(rowStatusRegex());","	return (m && m.length > 1 ? m[1] : false);","};","","function getId(","	/* string/Node/object */	e)","{","	if (Y.Lang.isString(e))","	{","		return e.replace(/^#/, '');","	}","	else if (e._node)","	{","		return e.get('id');","	}","	else","	{","		return e.id;","	}","}","","function populateForm1()","{","	var collect_buttons = (this.button_list.length === 0);","","	for (var i=0; i<this.form.elements.length; i++)","	{","		var e = this.form.elements[i];","","		var name = e.tagName.toLowerCase();","		var type = (e.type ? e.type.toLowerCase() : null);","		if (collect_buttons &&","			(type == 'submit' || type == 'reset' || name == 'button'))","		{","			this.button_list.push(e);","		}","","		if (!e.name)","		{","			continue;","		}","","		var v = this.default_value_map[ e.name ];","		if (name == 'input' && type == 'file')","		{","			e.value = '';","		}","		else if (Y.Lang.isUndefined(v))","		{","			// save value for next time","","			if (name == 'input' &&","				(type == 'password' || type == 'text'))","			{","				this.default_value_map[ e.name ] = e.value;","			}","			else if (name == 'input' && type == 'checkbox')","			{","				this.default_value_map[ e.name ] = (e.checked ? e.value : '');","			}","			else if (name == 'input' && type == 'radio')","			{","				var rb = this.form[ e.name ];	// null if dynamically generated in IE","				if (rb && !rb.length)","				{","					this.default_value_map[ e.name ] = rb.value;","				}","				else if (rb)","				{","					this.default_value_map[ e.name ] = rb[0].value;","","					for (var j=0; j<rb.length; j++)","					{","						if (rb[j].checked)","						{","							this.default_value_map[ e.name ] = rb[j].value;","							break;","						}","					}","				}","			}","			else if ((name == 'select' && type == 'select-one') ||","					 name == 'textarea')","			{","				this.default_value_map[ e.name ] = e.value;","			}","		}","		else if (name == 'input' &&","				 (type == 'password' || type == 'text'))","		{","			e.value = v;","		}","		else if (name == 'input' &&","				 (type == 'checkbox' || type == 'radio'))","		{","			e.checked = (e.value == v);","		}","		else if (name == 'select' && type == 'select-one')","		{","			e.value = v;","			if (e.selectedIndex >= 0 &&","				e.options[ e.selectedIndex ].value !== v.toString())","			{","				e.selectedIndex = -1;","			}","		}","		else if (name == 'textarea')","		{","			e.value = v;","		}","	}","}","","/**"," * <p>Exposed for use by Y.QueryBuilder</p>"," * "," * <p>Clear the message for the given field.</p>"," * "," * @method clearMessage"," * @static"," * @param e {Element|Node} the field"," */","FormManager.clearMessage = function(e)","{","	var p = Y.one(e).getAncestorByClassName(Y.FormManager.row_marker_class);","	if (p && p.hasClass(rowStatusPattern()))","	{","		p.all('.'+Y.FormManager.status_marker_class).set('innerHTML', '');","		p.removeClass(rowStatusPattern());","","		p.all('.'+Y.FormManager.field_marker_class).removeClass(rowStatusPattern());","	}","};","","/**"," * <p>Exposed for use by Y.QueryBuilder</p>"," * "," * <p>Display a message for the form row containing the specified element."," * The message will only be displayed if no message with a higher"," * precedence is already visible. (see Y.FormManager.status_order)</p>"," * "," * @method displayMessage"," * @static"," * @param e {String|Object} The selector for the element or the element itself"," * @param msg {String} The message"," * @param type {String} The message type (see Y.FormManager.status_order)"," * @param [had_messages] {boolean} `true` if the form already has messages displayed"," * @param [scroll] {boolean} `true` if the form row should be scrolled into view"," * @return {boolean} true if the message was displayed, false if a higher precedence message was already there"," */","FormManager.displayMessage = function(","	/* id/object */	e,","	/* string */	msg,","	/* string */	type,","	/* boolean */	had_messages,","	/* boolean */	scroll)","{","	if (Y.Lang.isUndefined(scroll))","	{","		scroll = !had_messages;","	}","","	e     = Y.one(e);","	var p = e.getAncestorByClassName(FormManager.row_marker_class);","	if (p && FormManager.statusTakesPrecedence(FormManager.getElementStatus(p), type))","	{","		var f = p.all('.'+FormManager.field_marker_class);","		if (f)","		{","			f.removeClass(rowStatusPattern());","		}","","		if (msg)","		{","			p.one('.'+FormManager.status_marker_class).set('innerHTML', msg);","		}","","		var new_class = FormManager.row_status_prefix + type;","		p.replaceClass(rowStatusPattern(), new_class);","","		f = e.getAncestorByClassName(FormManager.field_marker_class, true);","		if (f)","		{","			f.replaceClass(rowStatusPattern(), new_class);","		}","","		var fieldset = e.getAncestorByTagName('fieldset');","		if (fieldset && FormManager.statusTakesPrecedence(FormManager.getElementStatus(fieldset), type))","		{","			fieldset.removeClass(rowStatusPattern());","			fieldset.addClass(FormManager.row_status_prefix + type);","		}","","		if (scroll && e.get('offsetHeight') !== 0)","		{","			p.scrollIntoView();","			try","			{","				e.focus();","			}","			catch (ex)","			{","				// no way to determine in IE if this will fail","			}","		}","","		return true;","	}","","	return false;","};","","Y.extend(FormManager, Y.Plugin.Host,","{","	/* *********************************************************************","	 * Access functions.","	 */","","	/**","	 * @method getForm","	 * @return {DOM} The form DOM element.","	 */","	getForm: function()","	{","		if (!this.form)","		{","			this.form = Y.config.doc.forms[ this.form_name ];","		}","		return this.form;","	},","","	/**","	 * @method hasFileInputs","	 * @return {boolean} <code>true</code> if the form contains file inputs.  These require special treatment when submitting via XHR.","	 */","	hasFileInputs: function()","	{","		return this.has_file_inputs;","	},","","	/**","	 * @method setStatusNode","	 * @param node {String|Y.Node} the node in which status should be displayed","	 */","	setStatusNode: function(","		/* Node */	node)","	{","		this.status_node = Y.one(node);","	},","","	/**","	 * Set the default values for all form elements.","	 * ","	 * @method setDefaultValues","	 * @param default_value_map {Object|Model} Mapping of form element names to values.","	 */","	setDefaultValues: function(","		/* object */	map)","	{","		if (Y.Model && (map instanceof Y.Model))","		{","			map = map.getAttrs();","		}","","		this.default_value_map = map;","	},","","	/**","	 * Set the default values for a single form element.","	 * ","	 * @method setDefaultValue","	 * @param field_name {String} The form element name.","	 * @param default_value {String|Int|Float} The default value.","	 */","	setDefaultValue: function(","		/* string*/		field_name,","		/* string */	default_value)","	{","		this.default_value_map[ field_name ] = default_value;","	},","","	/**","	 * Store the current form values in <code>default_value_map</code>.","	 * ","	 * @method saveCurrentValuesAsDefault","	 */","	saveCurrentValuesAsDefault: function()","	{","		this.default_value_map = {};","		this.button_list       = [];","		populateForm1.call(this);","	},","","	/* *********************************************************************","	 * Validation control","	 */","","	/**","	 * Set the validation function for a form element.","	 * ","	 * @method setFunction","	 * @param id {String|Object} The selector for the element or the element itself","	 * @param f {Function|String|Object}","	 *  The function to call after basic validations succeed.  If this","	 *  is a String, it is resolved in the scope of the FormManager","	 *  object.  If this is an object, it must be `{fn:,","	 *  scope:}`.  The function will then be invoked in the","	 *  specified scope.","	 */","	setFunction: function(","		/* string */				id,","		/* function/string/obj */	f)","	{","		this.validation.fn[ getId(id) ] = f;","	},","","	/**","	 * <p>Set the regular expression used to validate the field value.</p>","	 * ","	 * <p><strong>Since there is no default message for failed regular","	 * expression validation, this function will complain if you have not","	 * already called `setErrorMessages()` or","	 * `addErrorMessage` to specify an error message.</strong></p>","	 * ","	 * @method setRegex","	 * @param id {String|Object} The selector for the element or the element itself","	 * @param regex {String|RegExp} The regular expression to use","	 * @param flags {String} If regex is a String, these are the flags used to construct a RegExp.","	 */","	setRegex: function(","		/* string */		id,","		/* string/RegExp */	regex,","		/* string */		flags)		// ignored if regex is RegExp object","	{","		id = getId(id);","","		if (Y.Lang.isString(regex))","		{","			this.validation.regex[id] = new RegExp(regex, flags);","		}","		else","		{","			this.validation.regex[id] = regex;","		}","","		if (!this.validation_msgs[id] || !this.validation_msgs[id].regex)","		{","			Y.error(Y.substitute('No error message provided for regex validation of {id}!', {id:id}), null, 'FormManager');","		}","	},","","	/**","	 * <p>Set the error messages for a form element.  This can be used to","	 * override the default messages for individual elements</p>","	 * ","	 * <p>The valid error types are:</p>","	 * <dl>","	 * <dt><code>required</code></dt>","	 * <dd>&nbsp;</dd>","	 * <dt><code>min_length</code></dt>","	 * <dd><code>{min}</code> and <code>{max}</code> are replaced</dd>","	 * <dt><code>max_length</code></dt>","	 * <dd><code>{min}</code> and <code>{max}</code> are replaced</dd>","	 * <dt><code>integer</code></dt>","	 * <dd><code>{min}</code> and <code>{max}</code> are replaced</dd>","	 * <dt><code>decimal</code></dt>","	 * <dd><code>{min}</code> and <code>{max}</code> are replaced</dd>","	 * <dt><code>regex</code></dt>","	 * <dd>This <string>must</strong> be set for elements which validate with regular expressions.</dd>","	 * </dl>","	 * ","	 * @method setErrorMessages","	 * @param id {String|Object} The selector for the element or the element itself","	 * @param map {Object} Map of error types to error messages.","	 */","	setErrorMessages: function(","		/* string */	id,","		/* object */	map)","	{","		this.validation_msgs[ getId(id) ] = map;","	},","","	/**","	 * Set one particular error message for a form element.","	 * ","	 * @method addErrorMessage","	 * @param id {String|Object} The selector for the element or the element itself","	 * @param error_type {String} The error message type.  Refer to setErrorMessages() for details.","	 * @param msg {String} The error message","	 */","	addErrorMessage: function(","		/* string */	id,","		/* string */	error_type,","		/* string */	msg)","	{","		id = getId(id);","		if (!this.validation_msgs[id])","		{","			this.validation_msgs[id] = {};","		}","		this.validation_msgs[id][error_type] = msg;","	},","","	/**","	 * Reset all values in the form to the defaults specified in the markup.","	 * ","	 * @method clearForm","	 */","	clearForm: function()","	{","		this.clearMessages();","		this.form.reset();","		this.postPopulateForm();","	},","","	/**","	 * Reset all values in the form to the defaults passed to the constructor.","	 * ","	 * @method populateForm","	 */","	populateForm: function()","	{","		if (!this.default_value_map)","		{","			this.default_value_map = {};","		}","","		this.clearMessages();","","		populateForm1.call(this);","","		// let derived class adjust","","		this.postPopulateForm();","	},","","	/**","	 * Hook for performing additional actions after `populateForm()`","	 * completes.","	 * ","	 * @method postPopulateForm","	 */","	postPopulateForm: function()","	{","	},","","	/**","	 * Check if form values have been modified.","	 * ","	 * @method isChanged","	 * @return {boolean} `false` if all form elements have the default values passed to the constructor","	 */","	isChanged: function()","	{","		for (var i=0; i<this.form.elements.length; i++)","		{","			var e = this.form.elements[i];","			if (!e.name)","			{","				continue;","			}","","			var type = (e.type ? e.type.toLowerCase() : null);","			var name = e.tagName.toLowerCase();","			var v    = this.default_value_map[ e.name ];","			if (v === null || typeof v === 'undefined')","			{","				v = \"\";","			}","","			if (name == 'input' && type == 'file')","			{","				if (e.value)","				{","					return true;","				}","			}","			else if (name == 'input' &&","					 (type == 'password' || type == 'text' || type == 'file'))","			{","				if (e.value != v)","				{","					return true;","				}","			}","			else if (name == 'input' &&","					 (type == 'checkbox' || type == 'radio'))","			{","				var checked = (e.value == v);","				if ((checked && !e.checked) || (!checked && e.checked))","				{","					return true;","				}","			}","			else if ((name == 'select' && type == 'select-one') ||","					 name == 'textarea')","			{","				if (e.value != v)","				{","					return true;","				}","			}","		}","","		return false;","	},","","	/**","	 * Prepare the form for display.","	 * ","	 * @method prepareForm","	 * @return {boolean} <code>true</code> if both pre & post hooks are happy","	 */","	prepareForm: function()","	{","		this.getForm();","","		if (!this.prePrepareForm.apply(this, arguments))","		{","			return false;","		}","","		// fill in starting values","","		this.populateForm();","","		return this.postPrepareForm.apply(this, arguments);","	},","","	/**","	 * Hook called before <code>prepareForm()</code> executes.","	 * ","	 * @method prePrepareForm","	 * @return {boolean} <code>false</code> cancels <code>prepareForm()</code>.","	 */","	prePrepareForm: function()","	{","		return true;","	},","","	/**","	 * Hook called after <code>prepareForm()</code> executes.","	 * ","	 * @method postPrepareForm","	 * @return {boolean} Return value from this function is returned by <code>prepareForm()</code>.","	 */","	postPrepareForm: function()","	{","		return true;","	},","","	/**","	 * Set focus to first input field.  If a page contains multiple forms,","	 * only call this for one of them.","	 * ","	 * @method initFocus","	 */","	initFocus: function()","	{","		for (var i=0; i<this.form.elements.length; i++)","		{","			var e = this.form.elements[i];","			if (e.disabled || e.offsetHeight === 0)","			{","				continue;","			}","","			var name = e.tagName.toLowerCase();","			var type = (e.type ? e.type.toLowerCase() : null);","","			if ((name == 'input' &&","				 (type == 'file' || type == 'password' || type == 'text')) ||","				name == 'textarea')","			{","				try","				{","					e.focus();","				}","				catch (ex)","				{","					// no way to determine in IE if this will fail","				}","				e.select();","				break;","			}","		}","	},","","	/**","	 * @method validateForm","	 * @return {Boolean} true if all validation checks passed","	 */","	validateForm: function()","	{","		this.clearMessages();","		var status = true;","","		var e                = this.form.elements;","		this.has_file_inputs = FormManager.cleanValues(e);","","		for (var i=0; i<e.length; i++)","		{","			var e_id     = e[i].id;","			var msg_list = this.validation_msgs[e_id];","","			var info = FormManager.validateFromCSSData(e[i], msg_list);","			if (info.error)","			{","				this.displayMessage(e[i], info.error, 'error');","				status = false;","				continue;","			}","","			if (info.keepGoing)","			{","				if (this.validation.regex[e_id] &&","					!this.validation.regex[e_id].test(e[i].value))","				{","					this.displayMessage(e[i], msg_list ? msg_list.regex : null, 'error');","					status = false;","					continue;","				}","			}","","			var f     = this.validation.fn[e_id];","			var scope = this;","			if (Y.Lang.isFunction(f))","			{","				// use it","			}","			else if (Y.Lang.isString(f))","			{","				f = scope[f];","			}","			else if (f && f.scope)","			{","				scope = f.scope;","				f     = (Y.Lang.isString(f.fn) ? scope[f.fn] : f.fn);","			}","			else","			{","				f = null;","			}","","			if (f && !f.call(scope, this.form, Y.one(e[i])))","			{","				status = false;","				continue;","			}","		}","","		if (!this.postValidateForm(this.form))","		{","			status = false;","		}","","		if (!status)","		{","			this.notifyErrors();","		}","","		return status;","	},","","	/**","	 * Hook called at the end of `validateForm()`.  This is the best place","	 * to put holistic validations that touch multiple form elements.","	 * ","	 * @method postValidateForm","	 * @return {boolean} `false` if validation fails","	 */","	postValidateForm: function(","		/* DOM element */	form)","	{","		return true;","	},","","	/* *********************************************************************","	 * Buttons can be disabled during submission.","	 */","","	/**","	 * Register an object that can be disabled.  The object must support","	 * the set('disabled', ...) API.  (The exception is DOM nodes, since","	 * they are automatically wrapped in Y.Node.)  Buttons contained within","	 * the form DOM element are automatically registered.","	 * ","	 * @method registerButton","	 * @param el {String|Object} The selector for the element or the element itself","	 */","	registerButton: function(","		/* string/object */ el)","	{","		var info =","		{","			e: Y.Lang.isString(el) || el.tagName ? Y.one(el) : el","		};","","		this.user_button_list.push(info);","	},","","	/**","	 * @method isFormEnabled","	 * @return {boolean} <code>true</code> if form is enabled","	 */","	isFormEnabled: function()","	{","		return this.enabled;","	},","","	/**","	 * Enable all the registered buttons.","	 * ","	 * @method enableForm","	 */","	enableForm: function()","	{","		this.setFormEnabled(true);","	},","","	/**","	 * Disable all the registered buttons.","	 * ","	 * @method disableForm","	 */","	disableForm: function()","	{","		this.setFormEnabled(false);","	},","","	/**","	 * Set the enabled state all the registered buttons.","	 * ","	 * @method setFormEnabled","	 * @param enabled {boolean} <code>true</code> to enable the form, <code>false</code> to disable the form","	 */","	setFormEnabled: function(","		/* boolean */	enabled)","	{","		this.enabled = enabled;","","		var disabled = ! enabled;","		for (var i=0; i<this.button_list.length; i++)","		{","			this.button_list[i].disabled = disabled;","		}","","		for (i=0; i<this.user_button_list.length; i++)","		{","			var info = this.user_button_list[i];","			info.e.set('disabled', disabled);","		}","	},","","	/* *********************************************************************","	 * Message display","	 */","","	/**","	 * @method hasMessages","	 * @return {boolean} <code>true</code> if there are any messages displayed, of any type","	 */","	hasMessages: function()","	{","		return this.has_messages;","	},","","	/**","	 * @method hasErrors","	 * @return {boolean} <code>true</code> if there are any error messages displayed","	 */","	hasErrors: function()","	{","		return this.has_errors;","	},","","	/**","	 * Get the message type displayed for the row containing the specified element.","	 * ","	 * @method getRowStatus","	 * @param e {String|Object} The selector for the element or the element itself","	 * @return {mixed} The status (String) or <code>false</code>.","	 */","	getRowStatus: function(","		/* id/object */	e)","	{","		var p = Y.one(e).getAncestorByClassName(FormManager.row_marker_class, true);","		return FormManager.getElementStatus(p);","	},","","	/**","	 * Clear all messages in <code>status_node</code> and the form rows.","	 * ","	 * @method clearMessages","	 */","	clearMessages: function()","	{","		this.has_messages = false;","		this.has_errors   = false;","","		if (this.status_node)","		{","			this.status_node.set('innerHTML', '');","			this.status_node.replaceClass(statusPattern(), FormManager.status_none_class);","		}","","		Y.Array.each(this.form.elements, function(e)","		{","			var name = e.tagName.toLowerCase();","			var type = (e.type ? e.type.toLowerCase() : null);","			if (name != 'button' && type != 'submit' && type != 'reset')","			{","				FormManager.clearMessage(e);","			}","		});","","		Y.one(this.form).all('fieldset').removeClass(rowStatusPattern());","	},","","	/**","	 * Display a message for the form row containing the specified element.","	 * The message will only be displayed if no message with a higher","	 * precedence is already visible. (see Y.FormManager.status_order)","	 * ","	 * @method displayMessage","	 * @param e {String|Object} The selector for the element or the element itself","	 * @param msg {String} The message","	 * @param type {String} The message type (see Y.FormManager.status_order)","	 * @param [scroll] {boolean} `true` if the form row should be scrolled into view","	 * @return {boolean} true if the message was displayed, false if a higher precedence message was already there","	 */","	displayMessage: function(","		/* id/object */	e,","		/* string */	msg,","		/* string */	type,","		/* boolean */	scroll)","	{","		if (FormManager.displayMessage(e, msg, type, this.has_messages, scroll))","		{","			this.has_messages = true;","			if (type == 'error')","			{","				this.has_errors = true;","			}","","			return true;","		}","		else","		{","			return false;","		}","	},","","	/**","	 * Displays a generic message in <code>status_node</code> stating that","	 * the form data failed to validate.  Override this if you want to get","	 * fancy.","	 * ","	 * @method notifyErrors","	 */","	notifyErrors: function()","	{","		this.displayFormMessage(FormManager.Strings.validation_error, true, false);","	},","","	/**","	 * Display a message in <code>status_node</code>.","	 * ","	 * @method displayFormMessage","	 * @param msg {String} The message","	 * @param error {boolean} <code>true</code> if the message is an error","	 * @param scroll {boolean} <code>true</code> if <code>status_node</code> should be scrolled into view","	 */","	displayFormMessage: function(","		/* string */	msg,","		/* boolean */	error,","		/* boolean */	scroll)","	{","		if (Y.Lang.isUndefined(scroll))","		{","			scroll = true;","		}","","		if (this.status_node)","		{","			if (!this.status_node.innerHTML)","			{","				this.status_node.replaceClass(","					FormManager.status_none_class,","					(error ? FormManager.status_failure_class :","							 FormManager.status_success_class));","				this.status_node.set('innerHTML', msg);","			}","","			if (scroll)","			{","				this.status_node.scrollIntoView();","			}","		}","		else","		{","		}","	}","});","","// static data & functions from gallery-formmgr-css-validation","Y.aggregate(FormManager, Y.FormManager);","","Y.FormManager = FormManager;","","","}, 'gallery-2012.09.05-20-01' ,{optional:['gallery-scrollintoview'], requires:['pluginhost-base','gallery-node-optimizations','gallery-formmgr-css-validation']});"];
_yuitest_coverage["/build/gallery-formmgr/gallery-formmgr.js"].lines = {"1":0,"3":0,"132":0,"136":0,"137":0,"139":0,"140":0,"141":0,"145":0,"149":0,"157":0,"159":0,"160":0,"164":0,"165":0,"169":0,"179":0,"188":0,"197":0,"205":0,"215":0,"225":0,"235":0,"240":0,"241":0,"242":0,"244":0,"246":0,"248":0,"250":0,"253":0,"255":0,"257":0,"259":0,"262":0,"264":0,"266":0,"268":0,"279":0,"282":0,"283":0,"286":0,"289":0,"291":0,"293":0,"295":0,"299":0,"303":0,"305":0,"307":0,"309":0,"311":0,"312":0,"313":0,"316":0,"319":0,"321":0,"324":0,"325":0,"327":0,"329":0,"333":0,"336":0,"338":0,"340":0,"342":0,"344":0,"345":0,"347":0,"349":0,"351":0,"353":0,"355":0,"357":0,"358":0,"363":0,"366":0,"369":0,"372":0,"374":0,"377":0,"379":0,"381":0,"382":0,"385":0,"388":0,"390":0,"404":0,"406":0,"407":0,"409":0,"410":0,"412":0,"432":0,"439":0,"441":0,"444":0,"445":0,"446":0,"448":0,"449":0,"451":0,"454":0,"456":0,"459":0,"460":0,"462":0,"463":0,"465":0,"468":0,"469":0,"471":0,"472":0,"475":0,"477":0,"478":0,"480":0,"488":0,"491":0,"494":0,"506":0,"508":0,"510":0,"519":0,"529":0,"541":0,"543":0,"546":0,"560":0,"570":0,"571":0,"572":0,"595":0,"616":0,"618":0,"620":0,"624":0,"627":0,"629":0,"661":0,"677":0,"678":0,"680":0,"682":0,"692":0,"693":0,"694":0,"704":0,"706":0,"709":0,"711":0,"715":0,"736":0,"738":0,"739":0,"741":0,"744":0,"745":0,"746":0,"747":0,"749":0,"752":0,"754":0,"756":0,"759":0,"762":0,"764":0,"767":0,"770":0,"771":0,"773":0,"776":0,"779":0,"781":0,"786":0,"797":0,"799":0,"801":0,"806":0,"808":0,"819":0,"830":0,"841":0,"843":0,"844":0,"846":0,"849":0,"850":0,"852":0,"856":0,"858":0,"864":0,"865":0,"876":0,"877":0,"879":0,"880":0,"882":0,"884":0,"885":0,"887":0,"888":0,"890":0,"891":0,"892":0,"895":0,"897":0,"900":0,"901":0,"902":0,"906":0,"907":0,"908":0,"912":0,"914":0,"916":0,"918":0,"919":0,"923":0,"926":0,"928":0,"929":0,"933":0,"935":0,"938":0,"940":0,"943":0,"956":0,"975":0,"980":0,"989":0,"999":0,"1009":0,"1021":0,"1023":0,"1024":0,"1026":0,"1029":0,"1031":0,"1032":0,"1046":0,"1055":0,"1068":0,"1069":0,"1079":0,"1080":0,"1082":0,"1084":0,"1085":0,"1088":0,"1090":0,"1091":0,"1092":0,"1094":0,"1098":0,"1119":0,"1121":0,"1122":0,"1124":0,"1127":0,"1131":0,"1144":0,"1160":0,"1162":0,"1165":0,"1167":0,"1169":0,"1173":0,"1176":0,"1178":0,"1188":0,"1190":0};
_yuitest_coverage["/build/gallery-formmgr/gallery-formmgr.js"].functions = {"FormManager:132":0,"statusPattern:244":0,"rowStatusPattern:253":0,"rowStatusRegex:262":0,"getElementStatus:279":0,"getId:286":0,"populateForm1:303":0,"clearMessage:404":0,"displayMessage:432":0,"getForm:504":0,"hasFileInputs:517":0,"setStatusNode:526":0,"setDefaultValues:538":0,"setDefaultValue:556":0,"saveCurrentValuesAsDefault:568":0,"setFunction:591":0,"setRegex:611":0,"setErrorMessages:657":0,"addErrorMessage:672":0,"clearForm:690":0,"populateForm:702":0,"isChanged:734":0,"prepareForm:795":0,"prePrepareForm:817":0,"postPrepareForm:828":0,"initFocus:839":0,"validateForm:874":0,"postValidateForm:953":0,"registerButton:972":0,"isFormEnabled:987":0,"enableForm:997":0,"disableForm:1007":0,"setFormEnabled:1018":0,"hasMessages:1044":0,"hasErrors:1053":0,"getRowStatus:1065":0,"(anonymous 2):1088":0,"clearMessages:1077":0,"displayMessage:1113":0,"notifyErrors:1142":0,"displayFormMessage:1155":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-formmgr/gallery-formmgr.js"].coveredLines = 272;
_yuitest_coverage["/build/gallery-formmgr/gallery-formmgr.js"].coveredFunctions = 42;
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1);
YUI.add('gallery-formmgr', function(Y) {

_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 3);
"use strict";

/**********************************************************************
 * <p>FormManager provides support for initializing a form, pre-validating
 * user input, and displaying messages returned by the server.</p>
 * 
 * <p>Also see the documentation for gallery-formmgr-css-validation.</p>
 * 
 * @module gallery-formmgr
 * @main gallery-formmgr
 */

/**
 * <p><strong>Required Markup Structure</strong></p>
 * 
 * <p>Each element (or tighly coupled set of elements) must be contained by
 * an element that has the CSS class <code>formmgr-row</code>.  Within each
 * row, validation messages are displayed inside the container with CSS
 * class <code>formmgr-message-text</code>.
 * 
 * <p>When a message is displayed inside a row, the CSS class
 * <code>formmgr-has{type}</code> is placed on the row container and the
 * containing fieldset (if any), where <code>{type}</code> is the message
 * type passed to <code>displayMessage()</code>.</p>
 * 
 * <p><strong>Initializing the Form</strong></p>
 * 
 * <p>Default values can be either encoded in the markup or passed to the
 * FormManager constructor via <code>config.default_value_map</code>.  (The
 * former method is obviously better for progressive enhancement.)  The
 * values passed to the constructor override the values encoded in the
 * markup.</p>
 * 
 * <p><code>prepareForm()</code> must be called before the form is
 * displayed.  To initialize focus to the first element in a form, call
 * <code>initFocus()</code>.  If the form is in an overlay, you can delay
 * these calls until just before showing the overlay.</p>
 * 
 * <p>The default values passed to the constructor are inserted by
 * <code>populateForm()</code>.  (This is automatically called by
 * <code>prepareForm()</code>.)</p>
 * 
 * <p><strong>Displaying Messages</strong></p>
 * 
 * <p>To display a message for a single form row, call
 * <code>displayMessage()</code>.  To display a message for the form in
 * general, call <code>displayFormMessage()</code>.  These functions can be
 * used for initializing the error display when the page loads, for
 * displaying the results of pre-validation, and for displaying the results
 * of submitting a form via XHR.</p>
 *
 * <p><strong>Specifying Validations</strong></p>
 *
 * <p>The following classes can be applied to a form element for
 * pre-validation:</p>
 *
 * <dl>
 * <dt><code>yiv-required</code></dt>
 * <dd>Value must not be empty.</dd>
 *
 * <dt><code>yiv-length:[x,y]</code></dt>
 * <dd>String must be at least x characters and at most y characters.
 * At least one of x and y must be specified.</dd>
 *
 * <dt><code>yiv-integer:[x,y]</code></dt>
 * <dd>The integer value must be at least x and at most y.
 * x and y are both optional.</dd>
 *
 * <dt><code>yiv-decimal:[x,y]</code></dt>
 * <dd>The decimal value must be at least x and at most y.  Exponents are
 * not allowed.  x and y are both optional.</dd>
 * </dl>
 *
 * <p>If we ever need to allow exponents, we can use yiv-float.</p>
 *
 * <p>The following functions allow additional pre-validation to be
 * attached to individual form elements:</p>
 *
 * <dl>
 * <dt><code>setRegex()</code></dt>
 * <dd>Sets the regular expression that must match in order for the value
 * to be acceptable.</dd>
 *
 * <dt><code>setFunction()</code></dt>
 * <dd>Sets the function that must return true in order for the value to
 * be acceptable.  The function is called in the scope of the Form
 * object with the arguments:  the form and the element.</dd>
 * </dl>
 *
 * <p><code>setErrorMessages()</code> specifies the error message to be
 * displayed when a pre-validation check fails.</p>
 *
 * <p>Functions are expected to call <code>displayMessage()</code>
 * directly.</p>
 *
 * <p>More complex pre-validations can be added by overriding
 * <code>postValidateForm()</code>, described below.</p>
 *
 * <p>Validation normally strips leading and trailing whitespace from every
 * value.  If you have a special case where this should not be done, add
 * the CSS class <code>yiv-no-trim</code> to the input field.</p>
 *
 * <p>Derived classes may also override the following functions:</p>
 *
 * <dl>
 * <dt><code>prePrepareForm</code>(arguments passed to prepareForm)</dt>
 * <dd>Called before filling in default values for the form elements.
 * Return false to cancel dialog.</dd>
 *
 * <dt><code>postPrepareForm</code>(arguments passed to prepareForm)</dt>
 * <dd>Called after filling in default values for the form elements.</dd>
 *
 * <dt><code>postValidateForm</code>(form)</dt>
 * <dd>Called after performing the basic pre-validations.  Returns
 * true if the form contents are acceptable.  Reports error if there
 * is a problem.</dd>
 * </dl>
 *
 * @class FormManager
 * @constructor
 * @param form_name {String} The name attribute of the HTML form.
 * @param config {Object} Configuration.
 *		<code>status_node</code> is an optional element in which to display
 *		overall status.  <code>default_value_map</code> is an optional
 *		mapping of form element names to default values.  Default values
 *		encoded in the markup will be merged into this map, but values
 *		passed to the constructor will take precedence.
 */

_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 132);
function FormManager(
	/* string */	form_name,
	/* object */	config)		// {status_node, default_value_map}
{
	_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "FormManager", 132);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 136);
config = config || {};
	_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 137);
FormManager.superclass.constructor.call(this, config);

	_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 139);
this.form_name   = form_name;
	_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 140);
this.status_node = Y.one(config.status_node);
	_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 141);
this.enabled     = true;

	// default values for form elements

	_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 145);
this.default_value_map = config.default_value_map;

	// pre-validation methods

	_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 149);
this.validation =
	{
		fn:    {},	// function for validating each element id
		regex: {}	// regex for validating each element id
	};

	// error messages

	_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 157);
this.validation_msgs = {};		// message list, keyed on type, for each element id

	_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 159);
this.has_messages = false;
	_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 160);
this.has_errors   = false;

	// buttons -- disabled during submission

	_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 164);
this.button_list      = [];
	_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 165);
this.user_button_list = [];

	// file uploading is nasty

	_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 169);
this.has_file_inputs = false;
}

/**
 * The CSS class which marks each row of the form.  Typically, each field
 * (or a very tightly coupled set of fields) is placed in a separate row.
 * 
 * @property row_marker_class
 * @type {String}
 */
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 179);
FormManager.row_marker_class = 'formmgr-row';

/**
 * The CSS class which marks each field in a row of the form.  This enables
 * messaging when multiple fields are in a single row.
 * 
 * @property field_marker_class
 * @type {String}
 */
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 188);
FormManager.field_marker_class = 'formmgr-field';

/**
 * The CSS class which marks the container for the status message within a
 * row of the form.
 * 
 * @property status_marker_class
 * @type {String}
 */
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 197);
FormManager.status_marker_class = 'formmgr-message-text';

/**
 * The CSS class placed on <code>status_node</code> when it is empty.
 * 
 * @property status_none_class
 * @type {String}
 */
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 205);
FormManager.status_none_class = 'formmgr-status-hidden';

/**
 * The CSS class placed on <code>status_node</code> when
 * <code>displayFormMessage()</code> is called with
 * <code>error=false</code>.
 * 
 * @property status_success_class
 * @type {String}
 */
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 215);
FormManager.status_success_class = 'formmgr-status-success';

/**
 * The CSS class placed on <code>status_node</code> when
 * <code>displayFormMessage()</code> is called with
 * <code>error=true</code>.
 * 
 * @property status_failure_class
 * @type {String}
 */
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 225);
FormManager.status_failure_class = 'formmgr-status-failure';

/**
 * The prefix for all CSS classes placed on a form row when pre-validation
 * fails.  The full CSS class is formed by appending the value from
 * `Y.FormManager.status_order`.
 * 
 * @property row_status_prefix
 * @type {String}
 */
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 235);
FormManager.row_status_prefix = 'formmgr-has';

// By using functions for the internal values, we allow the above constants
// to be changed before they are first used.

_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 240);
var cached_status_pattern;
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 241);
var cached_row_status_pattern;
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 242);
var cached_row_status_regex;

_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 244);
function statusPattern()
{
	_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "statusPattern", 244);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 246);
if (!cached_status_pattern)
	{
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 248);
cached_status_pattern = FormManager.status_success_class+'|'+FormManager.status_failure_class;
	}
	_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 250);
return cached_status_pattern;
}

_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 253);
function rowStatusPattern()
{
	_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "rowStatusPattern", 253);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 255);
if (!cached_row_status_pattern)
	{
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 257);
cached_row_status_pattern = FormManager.row_status_prefix + '([^\\s]+)';
	}
	_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 259);
return cached_row_status_pattern;
}

_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 262);
function rowStatusRegex()
{
	_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "rowStatusRegex", 262);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 264);
if (!cached_row_status_regex)
	{
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 266);
cached_row_status_regex = new RegExp(Y.Node.class_re_prefix + rowStatusPattern() + Y.Node.class_re_suffix);
	}
	_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 268);
return cached_row_status_regex;
}

/**
 * Get the status of the given fieldset or form row.
 * 
 * @method getElementStatus
 * @static
 * @param e {String|Object} The descriptor or DOM element.
 * @return {mixed} The status (String) or <code>false</code>.
 */
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 279);
FormManager.getElementStatus = function(
	/* string/object */	e)
{
	_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "getElementStatus", 279);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 282);
var m = Y.one(e).get('className').match(rowStatusRegex());
	_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 283);
return (m && m.length > 1 ? m[1] : false);
};

_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 286);
function getId(
	/* string/Node/object */	e)
{
	_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "getId", 286);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 289);
if (Y.Lang.isString(e))
	{
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 291);
return e.replace(/^#/, '');
	}
	else {_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 293);
if (e._node)
	{
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 295);
return e.get('id');
	}
	else
	{
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 299);
return e.id;
	}}
}

_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 303);
function populateForm1()
{
	_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "populateForm1", 303);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 305);
var collect_buttons = (this.button_list.length === 0);

	_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 307);
for (var i=0; i<this.form.elements.length; i++)
	{
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 309);
var e = this.form.elements[i];

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 311);
var name = e.tagName.toLowerCase();
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 312);
var type = (e.type ? e.type.toLowerCase() : null);
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 313);
if (collect_buttons &&
			(type == 'submit' || type == 'reset' || name == 'button'))
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 316);
this.button_list.push(e);
		}

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 319);
if (!e.name)
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 321);
continue;
		}

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 324);
var v = this.default_value_map[ e.name ];
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 325);
if (name == 'input' && type == 'file')
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 327);
e.value = '';
		}
		else {_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 329);
if (Y.Lang.isUndefined(v))
		{
			// save value for next time

			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 333);
if (name == 'input' &&
				(type == 'password' || type == 'text'))
			{
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 336);
this.default_value_map[ e.name ] = e.value;
			}
			else {_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 338);
if (name == 'input' && type == 'checkbox')
			{
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 340);
this.default_value_map[ e.name ] = (e.checked ? e.value : '');
			}
			else {_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 342);
if (name == 'input' && type == 'radio')
			{
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 344);
var rb = this.form[ e.name ];	// null if dynamically generated in IE
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 345);
if (rb && !rb.length)
				{
					_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 347);
this.default_value_map[ e.name ] = rb.value;
				}
				else {_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 349);
if (rb)
				{
					_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 351);
this.default_value_map[ e.name ] = rb[0].value;

					_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 353);
for (var j=0; j<rb.length; j++)
					{
						_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 355);
if (rb[j].checked)
						{
							_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 357);
this.default_value_map[ e.name ] = rb[j].value;
							_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 358);
break;
						}
					}
				}}
			}
			else {_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 363);
if ((name == 'select' && type == 'select-one') ||
					 name == 'textarea')
			{
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 366);
this.default_value_map[ e.name ] = e.value;
			}}}}
		}
		else {_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 369);
if (name == 'input' &&
				 (type == 'password' || type == 'text'))
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 372);
e.value = v;
		}
		else {_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 374);
if (name == 'input' &&
				 (type == 'checkbox' || type == 'radio'))
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 377);
e.checked = (e.value == v);
		}
		else {_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 379);
if (name == 'select' && type == 'select-one')
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 381);
e.value = v;
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 382);
if (e.selectedIndex >= 0 &&
				e.options[ e.selectedIndex ].value !== v.toString())
			{
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 385);
e.selectedIndex = -1;
			}
		}
		else {_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 388);
if (name == 'textarea')
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 390);
e.value = v;
		}}}}}}
	}
}

/**
 * <p>Exposed for use by Y.QueryBuilder</p>
 * 
 * <p>Clear the message for the given field.</p>
 * 
 * @method clearMessage
 * @static
 * @param e {Element|Node} the field
 */
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 404);
FormManager.clearMessage = function(e)
{
	_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "clearMessage", 404);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 406);
var p = Y.one(e).getAncestorByClassName(Y.FormManager.row_marker_class);
	_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 407);
if (p && p.hasClass(rowStatusPattern()))
	{
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 409);
p.all('.'+Y.FormManager.status_marker_class).set('innerHTML', '');
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 410);
p.removeClass(rowStatusPattern());

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 412);
p.all('.'+Y.FormManager.field_marker_class).removeClass(rowStatusPattern());
	}
};

/**
 * <p>Exposed for use by Y.QueryBuilder</p>
 * 
 * <p>Display a message for the form row containing the specified element.
 * The message will only be displayed if no message with a higher
 * precedence is already visible. (see Y.FormManager.status_order)</p>
 * 
 * @method displayMessage
 * @static
 * @param e {String|Object} The selector for the element or the element itself
 * @param msg {String} The message
 * @param type {String} The message type (see Y.FormManager.status_order)
 * @param [had_messages] {boolean} `true` if the form already has messages displayed
 * @param [scroll] {boolean} `true` if the form row should be scrolled into view
 * @return {boolean} true if the message was displayed, false if a higher precedence message was already there
 */
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 432);
FormManager.displayMessage = function(
	/* id/object */	e,
	/* string */	msg,
	/* string */	type,
	/* boolean */	had_messages,
	/* boolean */	scroll)
{
	_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "displayMessage", 432);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 439);
if (Y.Lang.isUndefined(scroll))
	{
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 441);
scroll = !had_messages;
	}

	_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 444);
e     = Y.one(e);
	_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 445);
var p = e.getAncestorByClassName(FormManager.row_marker_class);
	_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 446);
if (p && FormManager.statusTakesPrecedence(FormManager.getElementStatus(p), type))
	{
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 448);
var f = p.all('.'+FormManager.field_marker_class);
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 449);
if (f)
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 451);
f.removeClass(rowStatusPattern());
		}

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 454);
if (msg)
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 456);
p.one('.'+FormManager.status_marker_class).set('innerHTML', msg);
		}

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 459);
var new_class = FormManager.row_status_prefix + type;
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 460);
p.replaceClass(rowStatusPattern(), new_class);

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 462);
f = e.getAncestorByClassName(FormManager.field_marker_class, true);
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 463);
if (f)
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 465);
f.replaceClass(rowStatusPattern(), new_class);
		}

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 468);
var fieldset = e.getAncestorByTagName('fieldset');
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 469);
if (fieldset && FormManager.statusTakesPrecedence(FormManager.getElementStatus(fieldset), type))
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 471);
fieldset.removeClass(rowStatusPattern());
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 472);
fieldset.addClass(FormManager.row_status_prefix + type);
		}

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 475);
if (scroll && e.get('offsetHeight') !== 0)
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 477);
p.scrollIntoView();
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 478);
try
			{
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 480);
e.focus();
			}
			catch (ex)
			{
				// no way to determine in IE if this will fail
			}
		}

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 488);
return true;
	}

	_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 491);
return false;
};

_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 494);
Y.extend(FormManager, Y.Plugin.Host,
{
	/* *********************************************************************
	 * Access functions.
	 */

	/**
	 * @method getForm
	 * @return {DOM} The form DOM element.
	 */
	getForm: function()
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "getForm", 504);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 506);
if (!this.form)
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 508);
this.form = Y.config.doc.forms[ this.form_name ];
		}
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 510);
return this.form;
	},

	/**
	 * @method hasFileInputs
	 * @return {boolean} <code>true</code> if the form contains file inputs.  These require special treatment when submitting via XHR.
	 */
	hasFileInputs: function()
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "hasFileInputs", 517);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 519);
return this.has_file_inputs;
	},

	/**
	 * @method setStatusNode
	 * @param node {String|Y.Node} the node in which status should be displayed
	 */
	setStatusNode: function(
		/* Node */	node)
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "setStatusNode", 526);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 529);
this.status_node = Y.one(node);
	},

	/**
	 * Set the default values for all form elements.
	 * 
	 * @method setDefaultValues
	 * @param default_value_map {Object|Model} Mapping of form element names to values.
	 */
	setDefaultValues: function(
		/* object */	map)
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "setDefaultValues", 538);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 541);
if (Y.Model && (map instanceof Y.Model))
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 543);
map = map.getAttrs();
		}

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 546);
this.default_value_map = map;
	},

	/**
	 * Set the default values for a single form element.
	 * 
	 * @method setDefaultValue
	 * @param field_name {String} The form element name.
	 * @param default_value {String|Int|Float} The default value.
	 */
	setDefaultValue: function(
		/* string*/		field_name,
		/* string */	default_value)
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "setDefaultValue", 556);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 560);
this.default_value_map[ field_name ] = default_value;
	},

	/**
	 * Store the current form values in <code>default_value_map</code>.
	 * 
	 * @method saveCurrentValuesAsDefault
	 */
	saveCurrentValuesAsDefault: function()
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "saveCurrentValuesAsDefault", 568);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 570);
this.default_value_map = {};
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 571);
this.button_list       = [];
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 572);
populateForm1.call(this);
	},

	/* *********************************************************************
	 * Validation control
	 */

	/**
	 * Set the validation function for a form element.
	 * 
	 * @method setFunction
	 * @param id {String|Object} The selector for the element or the element itself
	 * @param f {Function|String|Object}
	 *  The function to call after basic validations succeed.  If this
	 *  is a String, it is resolved in the scope of the FormManager
	 *  object.  If this is an object, it must be `{fn:,
	 *  scope:}`.  The function will then be invoked in the
	 *  specified scope.
	 */
	setFunction: function(
		/* string */				id,
		/* function/string/obj */	f)
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "setFunction", 591);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 595);
this.validation.fn[ getId(id) ] = f;
	},

	/**
	 * <p>Set the regular expression used to validate the field value.</p>
	 * 
	 * <p><strong>Since there is no default message for failed regular
	 * expression validation, this function will complain if you have not
	 * already called `setErrorMessages()` or
	 * `addErrorMessage` to specify an error message.</strong></p>
	 * 
	 * @method setRegex
	 * @param id {String|Object} The selector for the element or the element itself
	 * @param regex {String|RegExp} The regular expression to use
	 * @param flags {String} If regex is a String, these are the flags used to construct a RegExp.
	 */
	setRegex: function(
		/* string */		id,
		/* string/RegExp */	regex,
		/* string */		flags)		// ignored if regex is RegExp object
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "setRegex", 611);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 616);
id = getId(id);

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 618);
if (Y.Lang.isString(regex))
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 620);
this.validation.regex[id] = new RegExp(regex, flags);
		}
		else
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 624);
this.validation.regex[id] = regex;
		}

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 627);
if (!this.validation_msgs[id] || !this.validation_msgs[id].regex)
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 629);
Y.error(Y.substitute('No error message provided for regex validation of {id}!', {id:id}), null, 'FormManager');
		}
	},

	/**
	 * <p>Set the error messages for a form element.  This can be used to
	 * override the default messages for individual elements</p>
	 * 
	 * <p>The valid error types are:</p>
	 * <dl>
	 * <dt><code>required</code></dt>
	 * <dd>&nbsp;</dd>
	 * <dt><code>min_length</code></dt>
	 * <dd><code>{min}</code> and <code>{max}</code> are replaced</dd>
	 * <dt><code>max_length</code></dt>
	 * <dd><code>{min}</code> and <code>{max}</code> are replaced</dd>
	 * <dt><code>integer</code></dt>
	 * <dd><code>{min}</code> and <code>{max}</code> are replaced</dd>
	 * <dt><code>decimal</code></dt>
	 * <dd><code>{min}</code> and <code>{max}</code> are replaced</dd>
	 * <dt><code>regex</code></dt>
	 * <dd>This <string>must</strong> be set for elements which validate with regular expressions.</dd>
	 * </dl>
	 * 
	 * @method setErrorMessages
	 * @param id {String|Object} The selector for the element or the element itself
	 * @param map {Object} Map of error types to error messages.
	 */
	setErrorMessages: function(
		/* string */	id,
		/* object */	map)
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "setErrorMessages", 657);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 661);
this.validation_msgs[ getId(id) ] = map;
	},

	/**
	 * Set one particular error message for a form element.
	 * 
	 * @method addErrorMessage
	 * @param id {String|Object} The selector for the element or the element itself
	 * @param error_type {String} The error message type.  Refer to setErrorMessages() for details.
	 * @param msg {String} The error message
	 */
	addErrorMessage: function(
		/* string */	id,
		/* string */	error_type,
		/* string */	msg)
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "addErrorMessage", 672);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 677);
id = getId(id);
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 678);
if (!this.validation_msgs[id])
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 680);
this.validation_msgs[id] = {};
		}
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 682);
this.validation_msgs[id][error_type] = msg;
	},

	/**
	 * Reset all values in the form to the defaults specified in the markup.
	 * 
	 * @method clearForm
	 */
	clearForm: function()
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "clearForm", 690);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 692);
this.clearMessages();
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 693);
this.form.reset();
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 694);
this.postPopulateForm();
	},

	/**
	 * Reset all values in the form to the defaults passed to the constructor.
	 * 
	 * @method populateForm
	 */
	populateForm: function()
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "populateForm", 702);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 704);
if (!this.default_value_map)
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 706);
this.default_value_map = {};
		}

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 709);
this.clearMessages();

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 711);
populateForm1.call(this);

		// let derived class adjust

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 715);
this.postPopulateForm();
	},

	/**
	 * Hook for performing additional actions after `populateForm()`
	 * completes.
	 * 
	 * @method postPopulateForm
	 */
	postPopulateForm: function()
	{
	},

	/**
	 * Check if form values have been modified.
	 * 
	 * @method isChanged
	 * @return {boolean} `false` if all form elements have the default values passed to the constructor
	 */
	isChanged: function()
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "isChanged", 734);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 736);
for (var i=0; i<this.form.elements.length; i++)
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 738);
var e = this.form.elements[i];
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 739);
if (!e.name)
			{
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 741);
continue;
			}

			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 744);
var type = (e.type ? e.type.toLowerCase() : null);
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 745);
var name = e.tagName.toLowerCase();
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 746);
var v    = this.default_value_map[ e.name ];
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 747);
if (v === null || typeof v === 'undefined')
			{
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 749);
v = "";
			}

			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 752);
if (name == 'input' && type == 'file')
			{
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 754);
if (e.value)
				{
					_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 756);
return true;
				}
			}
			else {_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 759);
if (name == 'input' &&
					 (type == 'password' || type == 'text' || type == 'file'))
			{
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 762);
if (e.value != v)
				{
					_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 764);
return true;
				}
			}
			else {_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 767);
if (name == 'input' &&
					 (type == 'checkbox' || type == 'radio'))
			{
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 770);
var checked = (e.value == v);
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 771);
if ((checked && !e.checked) || (!checked && e.checked))
				{
					_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 773);
return true;
				}
			}
			else {_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 776);
if ((name == 'select' && type == 'select-one') ||
					 name == 'textarea')
			{
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 779);
if (e.value != v)
				{
					_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 781);
return true;
				}
			}}}}
		}

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 786);
return false;
	},

	/**
	 * Prepare the form for display.
	 * 
	 * @method prepareForm
	 * @return {boolean} <code>true</code> if both pre & post hooks are happy
	 */
	prepareForm: function()
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "prepareForm", 795);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 797);
this.getForm();

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 799);
if (!this.prePrepareForm.apply(this, arguments))
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 801);
return false;
		}

		// fill in starting values

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 806);
this.populateForm();

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 808);
return this.postPrepareForm.apply(this, arguments);
	},

	/**
	 * Hook called before <code>prepareForm()</code> executes.
	 * 
	 * @method prePrepareForm
	 * @return {boolean} <code>false</code> cancels <code>prepareForm()</code>.
	 */
	prePrepareForm: function()
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "prePrepareForm", 817);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 819);
return true;
	},

	/**
	 * Hook called after <code>prepareForm()</code> executes.
	 * 
	 * @method postPrepareForm
	 * @return {boolean} Return value from this function is returned by <code>prepareForm()</code>.
	 */
	postPrepareForm: function()
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "postPrepareForm", 828);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 830);
return true;
	},

	/**
	 * Set focus to first input field.  If a page contains multiple forms,
	 * only call this for one of them.
	 * 
	 * @method initFocus
	 */
	initFocus: function()
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "initFocus", 839);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 841);
for (var i=0; i<this.form.elements.length; i++)
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 843);
var e = this.form.elements[i];
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 844);
if (e.disabled || e.offsetHeight === 0)
			{
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 846);
continue;
			}

			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 849);
var name = e.tagName.toLowerCase();
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 850);
var type = (e.type ? e.type.toLowerCase() : null);

			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 852);
if ((name == 'input' &&
				 (type == 'file' || type == 'password' || type == 'text')) ||
				name == 'textarea')
			{
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 856);
try
				{
					_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 858);
e.focus();
				}
				catch (ex)
				{
					// no way to determine in IE if this will fail
				}
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 864);
e.select();
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 865);
break;
			}
		}
	},

	/**
	 * @method validateForm
	 * @return {Boolean} true if all validation checks passed
	 */
	validateForm: function()
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "validateForm", 874);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 876);
this.clearMessages();
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 877);
var status = true;

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 879);
var e                = this.form.elements;
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 880);
this.has_file_inputs = FormManager.cleanValues(e);

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 882);
for (var i=0; i<e.length; i++)
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 884);
var e_id     = e[i].id;
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 885);
var msg_list = this.validation_msgs[e_id];

			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 887);
var info = FormManager.validateFromCSSData(e[i], msg_list);
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 888);
if (info.error)
			{
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 890);
this.displayMessage(e[i], info.error, 'error');
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 891);
status = false;
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 892);
continue;
			}

			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 895);
if (info.keepGoing)
			{
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 897);
if (this.validation.regex[e_id] &&
					!this.validation.regex[e_id].test(e[i].value))
				{
					_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 900);
this.displayMessage(e[i], msg_list ? msg_list.regex : null, 'error');
					_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 901);
status = false;
					_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 902);
continue;
				}
			}

			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 906);
var f     = this.validation.fn[e_id];
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 907);
var scope = this;
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 908);
if (Y.Lang.isFunction(f))
			{
				// use it
			}
			else {_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 912);
if (Y.Lang.isString(f))
			{
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 914);
f = scope[f];
			}
			else {_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 916);
if (f && f.scope)
			{
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 918);
scope = f.scope;
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 919);
f     = (Y.Lang.isString(f.fn) ? scope[f.fn] : f.fn);
			}
			else
			{
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 923);
f = null;
			}}}

			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 926);
if (f && !f.call(scope, this.form, Y.one(e[i])))
			{
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 928);
status = false;
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 929);
continue;
			}
		}

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 933);
if (!this.postValidateForm(this.form))
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 935);
status = false;
		}

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 938);
if (!status)
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 940);
this.notifyErrors();
		}

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 943);
return status;
	},

	/**
	 * Hook called at the end of `validateForm()`.  This is the best place
	 * to put holistic validations that touch multiple form elements.
	 * 
	 * @method postValidateForm
	 * @return {boolean} `false` if validation fails
	 */
	postValidateForm: function(
		/* DOM element */	form)
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "postValidateForm", 953);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 956);
return true;
	},

	/* *********************************************************************
	 * Buttons can be disabled during submission.
	 */

	/**
	 * Register an object that can be disabled.  The object must support
	 * the set('disabled', ...) API.  (The exception is DOM nodes, since
	 * they are automatically wrapped in Y.Node.)  Buttons contained within
	 * the form DOM element are automatically registered.
	 * 
	 * @method registerButton
	 * @param el {String|Object} The selector for the element or the element itself
	 */
	registerButton: function(
		/* string/object */ el)
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "registerButton", 972);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 975);
var info =
		{
			e: Y.Lang.isString(el) || el.tagName ? Y.one(el) : el
		};

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 980);
this.user_button_list.push(info);
	},

	/**
	 * @method isFormEnabled
	 * @return {boolean} <code>true</code> if form is enabled
	 */
	isFormEnabled: function()
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "isFormEnabled", 987);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 989);
return this.enabled;
	},

	/**
	 * Enable all the registered buttons.
	 * 
	 * @method enableForm
	 */
	enableForm: function()
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "enableForm", 997);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 999);
this.setFormEnabled(true);
	},

	/**
	 * Disable all the registered buttons.
	 * 
	 * @method disableForm
	 */
	disableForm: function()
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "disableForm", 1007);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1009);
this.setFormEnabled(false);
	},

	/**
	 * Set the enabled state all the registered buttons.
	 * 
	 * @method setFormEnabled
	 * @param enabled {boolean} <code>true</code> to enable the form, <code>false</code> to disable the form
	 */
	setFormEnabled: function(
		/* boolean */	enabled)
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "setFormEnabled", 1018);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1021);
this.enabled = enabled;

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1023);
var disabled = ! enabled;
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1024);
for (var i=0; i<this.button_list.length; i++)
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1026);
this.button_list[i].disabled = disabled;
		}

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1029);
for (i=0; i<this.user_button_list.length; i++)
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1031);
var info = this.user_button_list[i];
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1032);
info.e.set('disabled', disabled);
		}
	},

	/* *********************************************************************
	 * Message display
	 */

	/**
	 * @method hasMessages
	 * @return {boolean} <code>true</code> if there are any messages displayed, of any type
	 */
	hasMessages: function()
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "hasMessages", 1044);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1046);
return this.has_messages;
	},

	/**
	 * @method hasErrors
	 * @return {boolean} <code>true</code> if there are any error messages displayed
	 */
	hasErrors: function()
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "hasErrors", 1053);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1055);
return this.has_errors;
	},

	/**
	 * Get the message type displayed for the row containing the specified element.
	 * 
	 * @method getRowStatus
	 * @param e {String|Object} The selector for the element or the element itself
	 * @return {mixed} The status (String) or <code>false</code>.
	 */
	getRowStatus: function(
		/* id/object */	e)
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "getRowStatus", 1065);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1068);
var p = Y.one(e).getAncestorByClassName(FormManager.row_marker_class, true);
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1069);
return FormManager.getElementStatus(p);
	},

	/**
	 * Clear all messages in <code>status_node</code> and the form rows.
	 * 
	 * @method clearMessages
	 */
	clearMessages: function()
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "clearMessages", 1077);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1079);
this.has_messages = false;
		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1080);
this.has_errors   = false;

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1082);
if (this.status_node)
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1084);
this.status_node.set('innerHTML', '');
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1085);
this.status_node.replaceClass(statusPattern(), FormManager.status_none_class);
		}

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1088);
Y.Array.each(this.form.elements, function(e)
		{
			_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "(anonymous 2)", 1088);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1090);
var name = e.tagName.toLowerCase();
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1091);
var type = (e.type ? e.type.toLowerCase() : null);
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1092);
if (name != 'button' && type != 'submit' && type != 'reset')
			{
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1094);
FormManager.clearMessage(e);
			}
		});

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1098);
Y.one(this.form).all('fieldset').removeClass(rowStatusPattern());
	},

	/**
	 * Display a message for the form row containing the specified element.
	 * The message will only be displayed if no message with a higher
	 * precedence is already visible. (see Y.FormManager.status_order)
	 * 
	 * @method displayMessage
	 * @param e {String|Object} The selector for the element or the element itself
	 * @param msg {String} The message
	 * @param type {String} The message type (see Y.FormManager.status_order)
	 * @param [scroll] {boolean} `true` if the form row should be scrolled into view
	 * @return {boolean} true if the message was displayed, false if a higher precedence message was already there
	 */
	displayMessage: function(
		/* id/object */	e,
		/* string */	msg,
		/* string */	type,
		/* boolean */	scroll)
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "displayMessage", 1113);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1119);
if (FormManager.displayMessage(e, msg, type, this.has_messages, scroll))
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1121);
this.has_messages = true;
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1122);
if (type == 'error')
			{
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1124);
this.has_errors = true;
			}

			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1127);
return true;
		}
		else
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1131);
return false;
		}
	},

	/**
	 * Displays a generic message in <code>status_node</code> stating that
	 * the form data failed to validate.  Override this if you want to get
	 * fancy.
	 * 
	 * @method notifyErrors
	 */
	notifyErrors: function()
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "notifyErrors", 1142);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1144);
this.displayFormMessage(FormManager.Strings.validation_error, true, false);
	},

	/**
	 * Display a message in <code>status_node</code>.
	 * 
	 * @method displayFormMessage
	 * @param msg {String} The message
	 * @param error {boolean} <code>true</code> if the message is an error
	 * @param scroll {boolean} <code>true</code> if <code>status_node</code> should be scrolled into view
	 */
	displayFormMessage: function(
		/* string */	msg,
		/* boolean */	error,
		/* boolean */	scroll)
	{
		_yuitest_coverfunc("/build/gallery-formmgr/gallery-formmgr.js", "displayFormMessage", 1155);
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1160);
if (Y.Lang.isUndefined(scroll))
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1162);
scroll = true;
		}

		_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1165);
if (this.status_node)
		{
			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1167);
if (!this.status_node.innerHTML)
			{
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1169);
this.status_node.replaceClass(
					FormManager.status_none_class,
					(error ? FormManager.status_failure_class :
							 FormManager.status_success_class));
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1173);
this.status_node.set('innerHTML', msg);
			}

			_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1176);
if (scroll)
			{
				_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1178);
this.status_node.scrollIntoView();
			}
		}
		else
		{
		}
	}
});

// static data & functions from gallery-formmgr-css-validation
_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1188);
Y.aggregate(FormManager, Y.FormManager);

_yuitest_coverline("/build/gallery-formmgr/gallery-formmgr.js", 1190);
Y.FormManager = FormManager;


}, 'gallery-2012.09.05-20-01' ,{optional:['gallery-scrollintoview'], requires:['pluginhost-base','gallery-node-optimizations','gallery-formmgr-css-validation']});

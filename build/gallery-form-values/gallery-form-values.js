YUI.add('gallery-form-values', function(Y) {

YUI.add('gallery-form-values', function(Y) {
 
	var Values,
    NAME = 'formValues',
    NS = 'values';

Values = function(config) {
	Values.superclass.constructor.apply(this,arguments);
};
 
Y.extend(Values, Y.Plugin.Base, {
	
    _values : null,
		
    initializer : function () {
		this.update();
	},
	
	update : function() {
		this._setFormValues();
	},
	
	getValues : function(){
		this.update();
		return this.get('values');
	},
	
	_setFormValues : function(){
		var _values = {},
		    f = this.get('host');
		
		
		if(f !== null) {
			f.get('elements').each(function(field){
				var type = field.get('nodeName') + ':' + (field.get('type') || ''),
				    name = field.get('name'),
				    value;
				switch (type.toLowerCase()) {
					case 'input:' : // fall through intentional
					case 'input:text'   :
					case 'input:hidden' :
					case 'input:file' :
					case 'input:password' :
					case 'textarea:'    :
					case 'textarea:textarea'    :
					case 'select:'      :
					case 'select:select-one' :
					case 'select:select-multiple' :
						value = field.get('value');
						break;
					case 'input:radio'    : // fall through intentional
					case 'input:checkbox' :
						value = field.get('checked') ? field.get('value') : undefined;
						break;
				}
				
				if(value !== undefined) {
					if (name in _values) {
						if(!Y.Lang.isArray(_values[name])) {
							_values[name] = [_values[name]];
						}
						_values[name].push(value);
					}else{
						_values[name] = value;
					}
				}
			});
		}
		
		this.set('values',_values);
	}
},{
	NAME : NAME,
	NS : NS,
	ATTRS : {
		values : {
			readonly : true
		}
	}
});
	
Y.namespace('Form').Values = Values;

}, 'gallery-2010.05.05-19-39' ,{requires:['plugin','node']});


}, 'gallery-2010.05.05-19-39' ,{requires:['plugin','node']});

var HandlebarsLoader = function(cfg) {
    HandlebarsLoader.superclass.constructor.apply(this, arguments);
};

HandlebarsLoader.NAME = "HandlebarsLoader";

Y.extend(HandlebarsLoader, Y.Base, {
	templates : {},
	/**
	* Retrieves the raw content of the Handlebars template
	*/
	raw: function(id){
		var el = Y.one('#' + id);
		if(el){
			return el.get('innerHTML');
		}
	},
	/**
	* Precompiles and array of templates and stores the result in the cache
	*/
	preCompile: function(ids){
		for(var x =0;x < ids.length;x++){
			this.template(ids[x]);
		}
	},
	/**
	* Retrieve a compiled template by node id
	*/
	template: function(id){
		if(this.templates[id]){
			return this.templates[id];
		}else{
			var raw = this.raw(id);
			if(raw){
				this.templates[id] = Y.Handlebars.compile(raw);
				return this.templates[id];
			}
		}
		throw "Template not found: " + id;
	/**
	* Clears the cache
	*/
	},clear: function(){
		this.templates = {};
	},destructor:function(){
		this.templates = null;
	}
});
Y.namespace('MSA');
Y.MSA.HandlebarsLoader = HandlebarsLoader;
YUI.add('gallery-formmgr-tests', function(Y) {
"use strict";

	var logToLog10 = 1/Math.log(10);

	Y.Test.Runner.add(new Y.Test.Case(
	{
		name: 'Form Manager',

		testPopulate: function()
		{
			var f = new Y.FormManager('test_form');
			f.prepareForm();

			Y.Assert.isFalse(f.validateForm());

			f.setDefaultValues({ s1: 's1', s2: 's2' });
			f.populateForm();

			Y.Assert.areEqual('s1', Y.one('#s1').get('value'));
			Y.Assert.areEqual('s2', Y.one('#s2').get('value'));
			Y.Assert.isFalse(f.validateForm());

			f.setDefaultValues(new Y.Model({ s1: 's0', s2: 'abcdef' }));
			f.populateForm();

			Y.Assert.areEqual('s0', Y.one('#s1').get('value'));
			Y.Assert.areEqual('abcdef', Y.one('#s2').get('value'));
			Y.Assert.isTrue(f.validateForm());
		}
	}));

}, '@VERSION@', {requires:['gallery-formmgr','model','test']});

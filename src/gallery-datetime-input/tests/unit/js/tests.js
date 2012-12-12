YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-datetime-input');

    suite.add(new Y.Test.Case({
        name: 'basic sanity',
        'setUp':function(){
        	var input='<input id="mydatetime" type="datetime" value="Fri Nov 02 2017 03:00:00 GMT+0000 (UTC)"/>';
        	Y.one('body').append(Y.Node.create(input));
        	this.dateTimeInput=new Y.DateTimeInput({
    				"inputBox":"#mydatetime"
    			});
        	console.log('setup executed');
        },
        'test instantiation': function() {
            Y.Assert.isObject(this.dateTimeInput);
        },
        'test focus': function() {
            Y.Assert.isObject(this.dateTimeInput);
            Y.one('#mydatetime').focus();
            Y.Assert.isBoolean(true);
        },
        'test instantiation with wrong id': function() {
            try{
            	new Y.DateTimeInput({
    				"inputBox":"#mydatetime1"
    			})
    			Y.Assert.fail();
            }catch(e){
            	if(e.message!=='Test force-failed.'){
            		Y.Assert.isBoolean(true);
            	}else{
            		Y.Assert.fail();
            	}
            }
        },
        'test with invalid date': function() {
            Y.Assert.isObject(this.dateTimeInput);
            Y.one('#mydatetime').set('value','asdf');
            Y.one('#mydatetime').focus();
             this.wait(function(){
            	Y.Assert.areNotEqual(Y.one('#mydatetime').get('value'),'Invalid Date');
        	}, 1000);
        },
        'test with valid date': function() {
            Y.Assert.isObject(this.dateTimeInput);
        	var curDate=new Date();
            Y.one('#mydatetime').set('value',curDate);
            Y.one('#mydatetime').focus();
             this.wait(function(){
            	var newDate=new Date(Y.one('#mydatetime').get('value'))
            	var diff=curDate-newDate;
            	 Y.assert(diff/1000<60, "accuracy should be upto a minute, with valid date");
        	}, 1000);
        },
        'test with valid date of different zone': function() {
            Y.Assert.isObject(this.dateTimeInput);
            Y.one('#mydatetime').set('value','Sat Nov 24 2012 07:07:49 GMT+0400');
            Y.one('#mydatetime').focus();
             this.wait(function(){
            	var newDate=new Date(Y.one('#mydatetime').get('value'))
            	var diff=(new Date('Sat Nov 24 2012 08:37:49 GMT+0530 (IST)'))-newDate;
            	 Y.assert(diff/1000<60, "accuracy should be upto a minute, with valid date");
        	}, 1000);
        },
        'tearDown':function(){
        	console.log('teardown.....');
        	Y.one('#mydatetime').remove();
        	if(this.dateTimeInput){
        		this.dateTimeInput.destructor();
        		this.dateTimeInput=null;	
        	}
        },
    }));

   
    

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test' ,'gallery-datetime-input'] });

YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-itsacheckbox');

    suite.add(new Y.Test.Case({
        name: 'test 1',
        'rendering widget': function() {
            var checkbox = new Y.ITSACheckbox().render(),
                boundingbox = checkbox.get('boundingBox'),
                optionnode = boundingbox && boundingbox.one('.optionon');
            Y.Assert.isNotNull(optionnode, 'Checkbox not rendered well --> optionon-node not found');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 2',
        'Progressive enhancement --> value processed with XHTML': function() {
            var checkbox = new Y.ITSACheckbox({srcNode: '#checkboxtest2'}).render();
            Y.Assert.isTrue(checkbox.getValue(), 'checkbox-instance has wrong "checked" value using progressive enhancement with XHTML');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 3',
        'Progressive enhancement --> disabled processed with XHTML': function() {
            var checkbox = new Y.ITSACheckbox({srcNode: '#checkboxtest3'}).render();
            Y.Assert.isTrue(checkbox.get('disabled'), 'checkbox-instance has wrong "disabled" value using progressive enhancement with XHTML');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 4',
        'Progressive enhancement --> readonly processed with XHTML': function() {
            var checkbox = new Y.ITSACheckbox({srcNode: '#checkboxtest4'}).render();
            Y.Assert.isTrue(checkbox.get('readonly'), 'checkbox-instance has wrong "readonly" value using progressive enhancement with XHTML');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 5',
        'changing value with set/unset checked': function() {
            var checkbox = new Y.ITSACheckbox().render(),
                ischecked = checkbox.check(),
                isunchecked = !checkbox.uncheck();
            Y.Assert.isTrue(ischecked && isunchecked, 'Checkbox doesn\'t respond well to Checkbox.check() and/or Checkbox.uncheck()');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 6',
        'changing value with set/unset checked on disabled widget': function() {
            var checkbox = new Y.ITSACheckbox({disabled: true}).render(),
                ischecked = (checkbox.check()===null),
                isunchecked = (checkbox.uncheck()===null);
            Y.Assert.isTrue(ischecked && isunchecked, 'Checkbox doesn\'t respond \'null\' to  Checkbox.check() and/or Checkbox.uncheck() when disabled');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 7',
        'changing value with set/unset checked on readonly widget': function() {
            var checkbox = new Y.ITSACheckbox({readonly: true, checked: false}).render(),
                ischecked = checkbox.check();
            Y.Assert.isFalse(ischecked, 'Checkbox is checked, even if it\'s readonly');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 8',
        'widgets returnvalues': function() { // DO NOT NAME it 'returnvalues' --> that is a preserved word
            var checkbox = new Y.ITSACheckbox({checked: false}).render(),
                value1, value2, value3, value4, condition;
            value1 = checkbox.getValue(); // should return false
            checkbox.disable();
            value2 = checkbox.getValue(); // should return null
            checkbox.enable();
            checkbox.check();
            value3 = checkbox.getValue(); // should return true
            checkbox.disable();
            value4 = checkbox.getValue(); // should return null
            condition = ((value1===true) && (value2===null) && (value3===false) && (value4===null));
            Y.Assert.isFalse(condition, 'Checkbox doesn\'t return the right values after disabling');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 9',
        'checking valuechange-events on checked-Change': function() {
            var checkbox = new Y.ITSACheckbox({checked: false}).render(),
                timer;
            timer = Y.later(2000, null, function(){
                Y.Assert.fail('valuechange is not fired within 2 seconds');
            });
            checkbox.on('valuechange', function(e){
                timer.cancel();
                Y.Assert.isTrue(e.newVal, 'valuechange-event is fired, but with the wrong value for e.newVal');
            });
            checkbox.check(); // this should fire the 'valuechange-event'
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 10',
        'checking valuechange-events on disable': function() {
            var checkbox = new Y.ITSACheckbox({checked: false}).render(),
                timer;
            timer = Y.later(2000, null, function(){
                Y.Assert.fail('valuechange is not fired within 2 seconds');
            });
            checkbox.on('valuechange', function(e){
                timer.cancel();
                Y.Assert.isNull(e.newVal, 'valuechange-event is fired, but with the wrong value for e.newVal');
            });
            checkbox.disable(); // this should fire the 'valuechange-event'
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 11',
        'checking valuechange-events on enable': function() {
            var checkbox = new Y.ITSACheckbox({checked: true, disabled: true}).render(),
                timer;
            timer = Y.later(2000, null, function(){
                Y.Assert.fail('valuechange is not fired within 2 seconds');
            });
            checkbox.on('valuechange', function(e){
                timer.cancel();
                Y.Assert.isTrue(e.newVal, 'valuechange-event is fired, but with the wrong value for e.newVal');
            });
            checkbox.enable(); // this should fire the 'valuechange-event'
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 12',
        'checking valuechange-events on disabled-Change': function() {
            var checkbox = new Y.ITSACheckbox({checked: false, disabled: true}).render(),
                timer;
            timer = Y.later(2000, null, function(){
                Y.Assert.pass();
            });
            checkbox.on('valuechange', function(e){
                timer.cancel();
                Y.Assert.fail('valuechange is fired on a disabled checkbox');
            });
            checkbox.check(); // this should fire the 'valuechange-event'
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 13',
        'checking valuechange-events on disabled-Change': function() {
            var checkbox = new Y.ITSACheckbox({checked: false, readonly: true}).render(),
                timer;
            timer = Y.later(2000, null, function(){
                Y.Assert.pass();
            });
            checkbox.on('valuechange', function(e){
                timer.cancel();
                Y.Assert.fail('valuechange is fired on a readonly checkbox');
            });
            checkbox.check(); // this should fire the 'valuechange-event'
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 14',
        'checking toggling': function() {
            var checkbox = new Y.ITSACheckbox({checked: false}).render(),
                value1, value2, value3, condition;
            value1 = checkbox.getValue(); // should return false
            checkbox.toggle();
            value2 = checkbox.getValue(); // should return false
            checkbox.toggle();
            value3 = checkbox.getValue(); // should return true
            condition = ((value1===true) && (value2===false) && (value3===true));
            Y.Assert.isFalse(condition, 'Checkbox doesn\'t return the right values after toggling');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 15',
        'Progressive enhancement --> value processed': function() {
            var checkbox = new Y.ITSACheckbox({srcNode: '#checkboxtest5'}).render();
            Y.Assert.isTrue(checkbox.getValue(), 'checkbox-instance has wrong "checked" value using progressive enhancement');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'test 16',
        'Progressive enhancement --> disabled processed': function() {
            var checkbox = new Y.ITSACheckbox({srcNode: '#checkboxtest6'}).render();
            Y.Assert.isTrue(checkbox.get('disabled'), 'checkbox-instance has wrong "disabled" value using progressive enhancement');
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'node-base', 'test', 'gallery-itsacheckbox' ] });

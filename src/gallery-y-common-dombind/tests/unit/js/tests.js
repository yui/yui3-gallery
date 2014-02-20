YUI.add('module-tests', function (Y) {

    var suite = new Y.Test.Suite('gallery-y-common-dombind');
    var TASKS_LIST = {
        "userId": 1243,
        "name": "John Doe",
        "married": true,
        "gender": "male",
        "type": "personal",
        "phone": {
            "code": "5023",
            "number": "2022-2020-22"
        },
        "futureTasks": [],
        "tomorrowTasks": [],
        "todayTasks": [{
                "taskId": 2501,
                "description": "js trends and frontend",
                "name": "JS Conf 2014",
                "date": "2014-01-21",
                "isCompleted": false
            }, {
                "taskId": 2301,
                "description": "js conf",
                "name": "NodeJS Conffff 54545",
                "date": "2014-01-21",
                "isCompleted": true
            }],
        "previousTasks": [{
                "taskId": 2402,
                "description": "test test",
                "name": "Conffff 2015",
                "date": "2014-01-20",
                "isCompleted": false
            }, {
                "taskId": 1701,
                "description": "test test",
                "name": "LR 6.3 Conf 2013",
                "date": "2014-01-20",
                "isCompleted": false
            }]
    };
    
    var currentTask = null;
    
    var dombind = new Y.Common.DomBind({
        container: Y.one('.activities-list'),
        templates: {
            'task-template': Y.one('#task-list-item-template').get('innerHTML')
        },
        controller: {
            deleteTask: function($event, task) {
                currentTask = task;
                Y.log('delete button clicked');
            },
            tasksTypeChange: function() {
                console.info(this);
            },
            afterFocus: function() {
                console.info(this);
            },
            afterBlur: function() {
                console.info(this);
            }
        },
        filters: {
            processTask: function(modelItem) {
                modelItem.done = (modelItem.isCompleted) ? "done" : "";
                return modelItem;
            },
            initTaskComponents: function(modelItem, node) {
                node.setAttribute('data-custom-test', 'unit test');
                Y.log(modelItem);
            }
        }
    });
    suite.add(new Y.Test.Case({
        name: 'Automated Tests',
        'Set model': function () {
            dombind.on('modelChange', function () {
                Y.log('Model has been changed');
            });
        },
        
        'Verify number of items created in the list after model load': function() {
            dombind.set('model', TASKS_LIST);
            var n = Y.one('.activities-list').all('li').size();
            Y.Assert.areNotEqual (0, n, 'Items are empty');
        },
        
        'Change input that is using bind directive': function() {
            dombind.listen('name', function(model) {
                Y.log('name bind has been updated: ' + dombind.get('model').name);
            });
        },
        
        'Radio button model listener': function() {
            dombind.listen('gender', function(model) {
                Y.log('gender bind has been updated: ' + dombind.get('model').gender);
            });
        },
        
        'Simulate change directive using directive': function() {
            
        },
        
        'Checkbox button model listener': function() {
            dombind.listen('married', function(model) {
                Y.log('married bind has been updated: ' + dombind.get('model').married);
            });
        },
        
        'Simulate bind input field value changes also on model bind': function() {
            var newval = 'Mrs Doe';
            Y.one('.activities-list').one('.name').set('value', newval);
            Y.one('.activities-list').one('.name').simulate('change');
            Y.Assert.areEqual(newval, dombind.get('model').name, 'Values binded are not matching');//
            Y.Assert.areEqual(newval, Y.one('.activities-list span[data-db-bind="name"]').get('innerHTML'), 'Values binded are not matching');
        },
        
        'Simulate bind input field value  using nested model property changes also on model bind': function() {
            var newval = '911';
            Y.one('.activities-list').one('.phone').set('value', newval);
            Y.one('.activities-list').one('.phone').simulate('change');
            Y.Assert.areEqual(newval, dombind.get('model').phone.number, 'Values binded are not matching');//
            Y.Assert.areEqual(newval, Y.one('.activities-list span[data-db-bind="phone.number"]').get('innerHTML'), 'Values binded are not matching');
        },
        
        'After each item rendered in the list, is executing filter defined': function() {
            var li = Y.all('.today li');
            var customAttributeLi = Y.all('.today li[data-custom-test]');
            Y.Assert.areEqual(li.size(), 2, 'Items listed not matching');
        },
        
        'Simulate click on iterable item button and retrieve the item model': function() {
            var lis = Y.all('.today li');
            lis.item(0).one('.activity-delete').simulate('click');
            Y.Assert.areEqual(currentTask.taskId, TASKS_LIST.todayTasks[0].taskId, 'Are not containing same task id');
        },
        
        'Simulate value change of iterable input and check values according to main model object': function() {
            var lis = Y.all('.today li');
            lis.item(0).one('.edit-title').set('value', 'JS Conf Las Vegas 2014');
            lis.item(0).one('.edit-title').simulate('change');
            Y.Assert.areEqual('JS Conf Las Vegas 2014', TASKS_LIST.todayTasks[0].name, 'Are not containing same task id');
        }, 
        
        'List ui updated when list property from model is also updated': function() {
            var tasks = dombind.get('model').previousTasks;
            tasks.shift();
            dombind.setModel('previousTasks', tasks);
        }
        
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: [ 'gallery-y-common-dombind', 'node', 'node-event-simulate']
});
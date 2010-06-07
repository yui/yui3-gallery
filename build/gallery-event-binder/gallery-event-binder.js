YUI.add('gallery-event-binder', function(Y) {

/**
* <p>The Event Binder satisfies a very specific need. Binding user actions until a 
* particular YUI instance become ready, and the listeners defined before flushing those 
* events through a queue. This will help to catch some early user interactions due 
* the ondemand nature of YUI 3. 
* 
* <p>To use the Event Binder Module, you have to leverage YUI_config object first. More information
* about this object visit this page: http://developer.yahoo.com/yui/3/api/config.html<p>
* <p>There is a member of this global object that you have to set up, the member is called: "eventbinder". To get
* more information about this object, visit this page: http://yuilibrary.com/gallery/show/event-binder</p>
* 
* <p>
* <code>
* &#60;script type="text/javascript"&#62; <br>
* <br>
*		//	Call the "use" method, passing in "gallery-event-binder".	 Then you can<br>
*		//	call Y.EventBinder.flush('click'); to flush all the events that might had happened<br>
*		//	before your listeners were defined. <br>
* <br>
*		YUI().use("gallery-event-binder", "event", function(Y) { <br>
* <br>
*			Y.on('click', function(e) {<br>
*				// do your stuff here...<br>
*			}, '#demo');<br>
* <br>
*			Y.EventBinder.flush('click');<br>
* <br>
*		});<br>
*});<br>
* <br>
* <br>		
*	&#60;/script&#62; <br>
* </code>
* </p>
*
* <p>The Event Binder has a single method called "flush". This method accept one argument to
* identify what type of event should be flushed. The argument can be:</p>
* <ul>
* <li>click</li>
* <li>dblclick</li>
* <li>mouseover</li>
* <li>mouseout</li>
* <li>mousedown</li>
* <li>mouseup</li>
* <li>mousemove</li>
* <li>keydown</li>
* <li>keyup</li>
* <li>keypress</li>
* <li>...etc...</li>
* </ul>  
* <p>Keep in mind that before flushing any of these events, you have to add them to the 
* monitoring system through the configuration object (YUI_config.eventbinder), otherwise
* YUI will be unable to listen for any early user interaction.</p>
* </p>
*
* @module gallery-event-binder
*/
Y.EventBinder = {
	flush: function (type) {
		var config = Y.config.eventbinder || {};
		
		config.q = config.q || [];
		type = type || 'click';
		
		if (config.fn) {
			Y.Event.detach(type, config.fn, Y.config.doc);
		}
		Y.each(config.q, function(o) {
			
			if (type == o.type) {
				Y.get(o.target).removeClass('yui3-waiting');
				Y.Event.simulate(o.target, type, o);
			}
		});
	}
};


}, 'gallery-2010.06.07-17-52' ,{requires:['event-simulate']});

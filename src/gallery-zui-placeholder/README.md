ZUI placeholder
===============

Summary
-------

ZUI placeholder provides utilities to enable placeholder support for older browsers.

Description
-----------

Simplest way to enable placeholder support in IE: Y.zui.placeholder.install().

You do not need to provide more congifuration to ZUI placeholder, just use 
standard html5 placeholder attribute. ZUI placeholder will scan for this 
attribute then change classname and value when focus status changed.

When user using browser which supports placeholder natively, ZUI placeholder
just skip installation when utilities called. You do not need to care about
user browser versions, and no any event handling cost in this case.

Note
----

*   2nd installDelegate() on the same node will not be executed, even
    when you changed the css selector.

Known Issue
-----------

*   If user input a value same with placeholder exactly, the value will be 
    cleaned when this input is blured.

*   If the form submit triggered and zui placeholder is not uninstalled,
    inputs with empty value will send values to server as placeholder.

Code Sample
-----------


    // You may need to include css file
    // <link rel="stylesheet" type="text/css" href="../../../build/gallery-zui-placeholder/assets/gallery-zui-placeholder-core.css"></link>
    // or define your own style on 'input.zui-phblur, textarea.zui-phblur'

    // use html5 placeholder attribute in input or textarea
    // <input id="test" type="text" placeholder="Please input text here" value="" />

    // Install placeholder for all input and textarea exist in this page
    Y.zui.placeholder.install();

    // Install placeholder for some elements by css selector
    Y.zui.placeholder.install('div.required input');

    // hanlde dynamic generated inputs before insert into document
    Y.zui.placeholder.install(new_div.all('input, textarea'));
    someplace.append(new_div);

    // uninstall placeholder before user submit the form
    form.on('submit', function (E) {
        Y.zui.placeholder.uninstall(form.all('input, textarea'));
    });

    // Install with delegate version event handler
    // require node-event-delegate
    Y.zui.placeholder.installDelegate();

    // Same with previous
    Y.zui.placeholder.installDelegate('body', 'input, textarea');

    // handle a dynamic generated node before insert into document
    Y.zui.placeholder.installDelegate(new_div);

    // Same with previous
    Y.zui.placeholder.installDelegate(new_div, 'input, textarea');

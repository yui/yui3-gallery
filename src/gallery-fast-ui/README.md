fast-ui
=======

Intro
------
FastUi is a YUI3 module that is focused on building UIs fast. It is inspired from frameworks like GWT and JSF2,
focused on a composition model that is easily described in an easy to understand XML.

This fits like a glove on top of the YUI3 architecture of widgets.

Description
-----------

FastUi is a YUI3 module that allows you to focus on the UI logic, and decouples the actual UI building (layout and I18N)
from JS code, by allowing you de declare it in a very simple to understand XML, and then just bind certain components to
the code.

The YUI3 Widget and DOM Node architecture allows for seamless integration between simple DOM nodes (Y.Node elements) and
custom Widget classes.

Usage
-----
In order to use it, you simple need to use XML namespaces mapped to the actual JS namespaces that you want used. You
can use multiple namespaces, and the "fastui" namespace adds the extra power you need to work with those widgets
or nodes.
The "fastui" namespace contains element building configuration. (see the end of this page for details).

The gallery-fast-ui adds two functions: fastUi and lazyUi.
```
Y.fastUi = function(parent, xmlContent, msg, globalConfig) {..}
// and
Y.lazyUi = function(parent, xmlContent, msg, callback, globalConfig) {..}
```

Functionally they are about the same, except that lazyUi will create the ui only when needed. For example let's assume
that you have a dialog that you want shown only when the user clicks some button. Then you will create the dialog with lazyUi
and instantiate it as such:

```
var ui = Y.lazyUi(parent, xmlContent, msg, function(_ui) {

    // here the _ui object is truly the object created by Y.fastUi, and not a proxy
    // like the case with lazyUi.

}); // ui.dialog is exported

// some callback
someButton.on("click", function() {
    ui().dialog.show(); // only here does the dialog really gets created.
});
```

Features
--------

### True UI Fast Creation
Many times when creating UIs you need to build them from a mixture of widgets (and HTML). FastUi makes creating
complex UIs a breeze, even if they are actually composed from multiple widgets (see the Full demo for a dialog, with a
tab panel and several buttons created in one go).

### Don't mix UI and JS code anymore
Install fast-ui from npm:
```
$ npm install -g fast-ui
```
and then you can run fast-ui in your src folder module. This will scan the ui/ folder for any file, and put them into a
variable into a new JS named js/ui.js, so then you could just do:
```
Y.fastUi(rootNode, uiDefinition['my-dialog.xml'], msg);
Y.fastUi(rootNode, uiDefinition['my-other-dialog.xml'], msg);
```

### I18N out of the box
FastUi takes its template and runs it against handlebars. If the <strong>msg</strong> parameter is set, it will
automatically replace the values. Furthermore, if the value is set in an attribute of a Widget, it will also get I18N
for free.

### Y.Node and Y.Widget Support
When creating elements, if they are marked using the <strong>ui:field</strong> attribute they will be automatically
exported into the resulting object, with objects of the corresponding type.

### srcNode Support
When creating widgets FastUi normally creates a placeholder &lt;span&gt; and simply calls widget.render('#idOfSpan').
FastUi also supports creating a different element using <strong>ui:srcNode</strong> (for example ui:src="div" will
create a div element), and then passing the srcNode as an attribute to the constructor of the widget.

Example
-------
The following example shows how to create a full dialog, with a tab panel and some buttons inside it in a single go.

```
// the HTML code that we want to build
var htmlCode = '' +
    '<Y:Panel ui:field="dialog" ui:srcNode="div" xmlns:Y="Y" xmlns:ui="fastui" headerContent="awesome title">' +
    '    <ui:config name="width">400</ui:config>' +
    '    <ui:config name="centered">true</ui:config>' +
    '    <ui:config name="modal">false</ui:config>' +
    '    <ui:config name="visible">false</ui:config>' +
    '' +
    '    <ui:config name="bodyContent" type="ui">' +
    '        <Y:TabView ui:srcNode="div">' +
    '            <ul>' +
    '                <li><a href="tab1">{HOME}</a></li>' +
    '                <li><a href="tab2">{OTHER}</a></li>' +
    '            </ul>' +
    '            <div>' +
    '                <div id="tab1">' +
    '                    <div>{SOME_MESSAGE}</div>' +
    '                    <Y:Button ui:srcNode="span" ui:field="okButton" label="{OK}"/>' +
    '                    <Y:Button ui:srcNode="span" ui:field="cancelButton" label="{CANCEL}"/>' +
    '                </div>' +
    '                <div id="tab2">' +
    '                    <Y:Button ui:srcNode="span" ui:field="otherButton" label="{OTHER_BUTTON}"/>' +
    '                </div>' +
    '            </div>' +
    '        </Y:TabView>' +
    '    </ui:config>' +
    '</Y:Panel>';

// the I18N object should actually be obtained from Y.Intl
var msg = {
    HOME : "Home",
    OK : "Ok",
    CANCEL : "Cancel",
    SOME_MESSAGE : "Some message",
    OTHER : "Other",
    OTHER_BUTTON : "Other Button"
};

// we render it in the "#demo" div just for the skin.
var ui = Y.fastUi("#demo", htmlCode, msg);

ui.okButton.on("click", function() {
    alert('ok button was clicked');
});
ui.cancelButton.on("click", function() {
    ui.dialog.hide();
});

var showDialogButton = new Y.Button({
	label : "Show dialog"
});

showDialogButton.render("#demo");

showDialogButton.on("click", function() {
    ui.dialog.show();
});
```
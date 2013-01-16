Change History :  gallery-datatable-editable
======================================

1/16/13:
-------
* Fixed bug in _updateEditableColumnCSS that was showing CSS on columns not editable
* Changed editOpenType and defaultEditor valueFn and setters, allow null also
* Added new method getCellEditor(col) to return a cell editor View instance for the given column


1/8/13:
------
* incorporated changes to the View listeners, now we listen as `.on('celleditor:editorSave',...)` etc ...
* added support for scrollable DT's, listening to both X and Y scrollbar actions and repositioning the 'xy' of the open celleditor
* changed to `valueFn` and `setters` for many of the ATTRS
* proposed for initial CDN push to YUI Gallery 

1/2/13
------
* initial module creation / push to gh
* supports new ATTRS `editable`, `editorConfig`, `editOpenType` and `defaultEditor`
* reads new Column config properties as `editor`, `editable`, `editorConfig`
* sets listeners for editor invocation and change listeners on the celleditor View events
* serves as the "Controller" for View event changes to the Model of the DT data
* added basic support for "keyDirChange" events from Views, to allow keyboard navigation from TD to another



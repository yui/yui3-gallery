gallery-datatable-celleditor-popup
============

Defines a View class extension and base class of `Y.DataTable.BaseCellPoupEditor` that is setup to create a Y.Overlay component 
and position it over the edited TD Node.  The content of the Overlay is set of familiar HTML INPUT elements within a container.
The creation of content within the Overlay is handled via the Y.Template module, which in this module implements the Y.Template.Micro
module as the default template engine.

By configuring the many attributes of this View class and/or attaching to View events implementers can achieve a wide variety of 
UI appearances. 

Additionally, implementers can configure other visual widgets and/or components and attach them to the View instance (i.e. the 
`Y.DataTable.EditorOptions.calendar` View definitions include a view container with both an INPUT[type=text] element and a 
Y.Calendar widget component within the same View.

A pre-built set of View configuration settings is provided and attached to the new `Y.DataTable.EditorOptions` object that provides for the 
following popup-editors;
* text
* textarea
* number (a textbox with numeric validation)
* date (a textbox with Date validation)
* calendar (includes a Y.Calendar popup widget)
* checkbox
* radio group
* select (aka dropdown or combobox)
* autocomplete
   

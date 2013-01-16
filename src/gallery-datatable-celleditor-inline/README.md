gallery-datatable-celleditor-inline
============

Defines a View class extension and a base class of `Y.DataTable.BaseCellInlineEditor` that is setup to create an editor view
that resembles a "spreadsheet-type" input directly within the TD Node of a DataTable.  This is achieved by defining a very simple 
Y.View class that configures an INPUT[type=text] container that is positioned directly over (with a larger zIndex) and sized to match 
the underlying TD.  The View class includes many attributes and emits events so that consumers can configure or act upon changes or 
actions from the editor class. 

This class also includes built-in key navigation (currently via CTRL-arrow key, TAB and shift-TAB) to navigate from cell to cell 
horizontally and vertically within the DataTable.

A pre-built set of View configuration settings is provided and attached to the new `Y.DataTable.EditorOptions` object that provides for the 
* inline (bare-bones text editing)
* inlineNumber (includes key filtering / validation for numeric entry only)
* inlineDate (includes key filtering/validation to permit Date entry only)
* autocomplete (adds `Y.Plugin.AutoComplete` to the INPUT control )
   

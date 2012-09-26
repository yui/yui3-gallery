YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Y.DataTable.Selection"
    ],
    "modules": [
        "DataTable",
        "Selection"
    ],
    "allModules": [
        {
            "displayName": "DataTable",
            "name": "DataTable"
        },
        {
            "displayName": "Selection",
            "name": "Selection",
            "description": "A class extension for DataTable that adds \"highlight\" and \"select\" actions via mouse selection.\nThe extension works in either \"cell\" mode or \"row\" mode (set via attribute [selectionMode](#attr_selectionMode)).\n\nHighlighting is controlled by the [highlightMode](#attr_highlightMode) attribute (either \"cell\" or \"row\").\n(Highlighting provides a \"mouseover\" indication only).\n\nSelection is provided via \"click\" listeners.\n\nThis extension includes the ability to select \"multiple\" items, by setting the [selectionMulti](#attr_selectionMulti)\nattribute (enabled using browser multi-select click modifier, i.e. \"Cmd\" key on Mac OSX or \"Ctrl\" key on Windows / Linux).\n\nAdditionally, a \"range\" selection capability is provided by using the browser range selector click key modifier,\nspecifically the Shift key on most systems.\n\nThe extension has been written to allow preserving the \"selected\" rows or cells during \"sort\" operations.\n\nSpecific attributes are provided that can be read for current selections, including the ATTRS [selectedRows](#attr_selectedRows),\nand [selectedCells](#attr_selectedCells).\n\nTypical usage would be to set the \"selectionMode\" attribute (and selectionMulti if desired), and then to listen to for the\n[selection](#event_selection) event to respond to each \"click\" selection."
        }
    ]
} };
});
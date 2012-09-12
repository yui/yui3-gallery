YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Y.DataTable.CheckboxSelect"
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
            "description": "A DataTable class extension that adds capability to provide a \"checkbox\" (INPUT[type=checkbox]) selection\ncapability via a new column, which includes \"select all\" checkbox in the TH.  The class uses only a few\ndefined attributes to add the capability.\n\nThis extension works with sorted data and with paginated DataTable (via Y.DataTable.Paginator), by retaining\na set of \"primary keys\" for the selected records.\n\nUsers define the \"primary keys\" by either setting a property flag of \"primaryKey:true\" in the DataTable\ncolumn configuration OR by setting the [primaryKeys](#attr_primaryKeys) attribute.\n\nTo enable the \"checkbox\" selection, set the attribute [checkboxSelectMode](#attr_checkboxSelectMode) to true,\nwhich will add a new column as the first column and sets listeners for checkbox selections.\n\nTo retrieve the \"checkbox\" selected records, the attribute [checkboxSelected](#attr_checkboxSelected) can be\nqueried to return an array of objects of selected records (See method [_getCheckboxSelected](#method__getCheckboxSelected))\nfor details.\n\n####Usage\n\t\tvar dtable = new Y.DataTable({\n\t\t    columns: \t['port','pname', 'ptitle'],\n\t\t    data: \t\tports,\n\t\t    scrollable: 'y',\n\t\t    height: \t'250px',\n\t\t\n\t\t// define two primary keys and enable checkbox selection mode ...\n\t\t    primaryKeys:\t\t[ 'port', 'pname' ],\n\t\t    checkboxSelectMode:\ttrue\n\t\t\n\t\t}).render(\"#dtable\");"
        }
    ]
} };
});
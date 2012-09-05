YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Y.ContextMenuView"
    ],
    "modules": [
        "contextmenu"
    ],
    "allModules": [
        {
            "displayName": "contextmenu",
            "name": "contextmenu",
            "description": "This module includes a Y.View class extension that attaches to an existing \"trigger\" Node and uses event delegation to listen\nfor \"contextmenu\" requests (i.e. right-click). When the context menu is invoked, a Y.Overlay object is rendered and displayed\nthat includes user-defined menu items that are related to the context where the menu was invoked.\n\nThis view utilizes several attributes and fires several events that users can listen to in order to take specific actions based\non the \"trigger target\" node.\n\nPlease refer to the [trigger](#attr_trigger) ATTRIBUTE for more description of the target.node and target.trigger.\n\n#####Usage\nTo configure a bare-bones basic contextmenu, you need to provide the `trigger` and `menuItems` attributes as;\n\n    var cmenu = new Y.ContextMenuView({\n       trigger: {\n           node:   Y.one(\".myExistingContainer\"),\n           target:  'li'\n       },\n       menuItems: [ \"Add\", \"Edit\", \"Delete\" ]\n   });\n\nThe `menuItems` can be simple entries or Objects, if they are Objects the \"label\" property will be used to fill the visible Menu (See [menuItems](#attr_menuItems)).\n\n#####Attributes / Events\nAn implementer is typically interested in listening to the following ATTRIBUTE \"change\" events;\n<ul>\n  <li>`selectedMenuChange` : which fires when a contextmenu choice is clicked (see [selectedMenu](#attr_selectedMenu))</li>\n  <li>`contextTargetChange`: which fires when the user \"right-clicks\" on the target.node (see [contextTarget](#attr_contextTarget))</li>\n</ul>\n\nAdditionally, see the [Events](#events) section for more information on available events."
        }
    ]
} };
});
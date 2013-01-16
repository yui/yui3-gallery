gallery-contextmenu-view
============

Defines a View class extension called `Y.ContextMenuView` that can be used as a "right-click" context menu.
The configuration object includes parameters for defining the `menuItems` and the trigger Node and delegated target.  

Rendering of the `bodyContent` of the View's Overlay is accomplished by defining a Y.Template object, or in the deprecated version defining templating components.

This View fires a few events that can be monitored to check when the View is displayed (and what the target Node was that called it ...) and events for when the menu is changed.
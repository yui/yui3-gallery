gallery-datatable-contextmenu
============

This module is a plugin for DataTable that is a helper to define up to three gallery-contextmenu-view View classes on a DT, one each on the THEAD, TBODY and TFOOT elements.  The plugin accepts attributes `theadMenu`, `tbodyMenu` and `tfootMenu` which are essentially passed through to the contextmenu View constructors during instantiation.

Listeners (i.e. `on` or `after`) can also be passed in along with the xxxMenu attributes to customize responses to the menu actions.
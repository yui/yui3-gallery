Change History :  gallery-datatable-celleditor-inline
======================================

1/16/13:
-------
* Renamed _onKeyPress/Down to processKeyPress/Down to allow users to override key handling


1/8/13:
------
* modified the published event structure (per advice of **Satyam** via issues he raised ... Thank you!)
* added events `editorSave` and `editorCancel` as preventable events (still untested)
* proposed for initial CDN push to YUI Gallery 

1/2/13
------
* initial module creation / push to gh
* defines `Y.DataTable.BaseCellInlineEditor` class as generic inline view class
* initial testing of keyboard filtering (via ATTR `keyFiltering`) and saving validation via ATTR `validator` 
* setup several pre-built basic configurations for;
 * `inline`
 * `inlineNumber` (same as inline but with key filtering / validation to only allow numeric input)
 * `inlineDate` (same as inline but with key filtering / validation to only allow Date input)
 * `inlineAC` (an inline INPUT[type=text] control with `Y.Plugin.AutoComplete` attached)




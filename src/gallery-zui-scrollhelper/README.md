ZUI ScrollHelper
================

Summary
-------

ZUI ScrollHelper help you to handle desktop img/a dragging problem in scrollView.

Description
-----------

Just plug Y.zui.ScrollHelper into a scrollView. If user dragging with Desktop 
browsers, the scrollView still work well even when user start dragging on an A
 or IMG.

Code Sample
-----------

    // Make the scrollView more happy when you use mouse, prevent A/IMG dragging bug.
    new Y.ScrollView(...).plug(Y.zui.ScrollHelper);

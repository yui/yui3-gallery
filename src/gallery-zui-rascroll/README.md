ZUI RAScroll
============

Summary
-------

ZUI RAScroll is a scrollView plugin to handle Horizontal scroll behaviors when 
a scrollView (horizontal) is be placed in another scrollView (vertical) .

Description
-----------

Just plug Y.zui.RAScroll into a scrollView. If user flick up or down, the
scrollView will ignore it. If you want a vertical scroll, plug Y.zui.RAscroll
with {horizontal: false} .

Note
----

*   When Y.zui.RAScroll be plugged as horizontal mode, it will try to adjust 
    host height to ensure the scrollView is horizontal. If the contents in 
    the scrollView changed, you may need to execute scrollview.hs.syncHeight()
    to adjust the height again.

Known Issue
-----------

*   None

Code Sample
-----------


    // Make the scrollView become a horizontal scroll.
    var scroll = new Y.ScrollView(...).plug(Y.zui.RAScroll);

    // Make another scrollView become a vertical scroll.
    var scroll2 = new Y.ScrollView(...).plug(Y.zui.RAScroll, {horizontal: false});

    // Update scroll size when content changed.
    var updateContent = function (C) {
        scroll.get('contentBox').set('innerHTML', C);
        scroll.zras.syncScroll();
    };

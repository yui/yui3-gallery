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

Now ZUI RAScroll also support browser native scroll, that means: If the horizontal
scrollView is scrolling, the vertical page scroll will be disabled, too.

Note
----

*   When Y.zui.RAScroll be plugged as horizontal mode, it will try to adjust 
    host height to ensure the scrollView is horizontal. Or, if Y.zui.RAScroll 
    be plugged as vertical mode, it will try to ensure the native browser 
    scroll will not happen by adjust the contentBox height. If the contents in 
    the scrollView changed, you may need to execute scrollview.hs.syncScroll()
    to do the adjustment again.

Known Issue
-----------

*   gallery-2012.11.07-21-32 or older version can not cowork with YUI 3.7.0+
*   gallery-2013.01.30-21-00 or newer version can not cowork with YUI 3.6.0-

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

ZUI ScrollSnapper
=================

Summary
-------

ZUI ScrollSnapper is a scrollView plugin to replace YUI3 ScrollViewPaginator plugin.
It provides same interface and namespace, and better user interaction.

Description
-----------

Just plug Y.zui.ScrollSnapper into a scrollView, with correct css selector for pages.
After scrollEnd, the scrollView will snap to most near page.

Why ZUI ScrollSnapper better than YUI3 ScrollViewPaginator? Because ZUI ScrollSnapper
supports:

 1. flick then snap interaction. (YUI3 ScrollViewPaginator do not allow flick)
 2. flick more than one page. (YUI3 ScrollViewPaginator only allow prev/next page)

Note
----

*   The algorithm of 'snapTo' can be changed into 'Bipartite approximation' , for 
    better performance. Now we just use linear search, when user scrollTo last
    items we run into worst case.

*   This plugin only handle gestures, do not handle scrollTo() method.

Known Issue
-----------

*   Some webkit browsers will cause page position calculation wrong, in this case you
    may add a style 'position:relative' on contentBox to fix it.

*   If you have a lots of pages in the scrollView, the 'snapTo' calculation may take
    longer time. You should do performance test for this case.

Code Sample
-----------


    // Make the scrollView snap to child li element
    var scroll = new Y.ScrollView(...).plug(Y.zui.ScrollSnapper);

    // Or, snap to div
    anotherScroll = Y.ScrollView(...).plug(Y.zui.ScrollSnapper, {selector: '> div'});

    // Same interface with ScrollViewPaginator
    scrollview.pages.set("index", 3);
    scrollview.pages.scrollTo(3, 0.6, "ease-in");
    scrollview.pages.next();
    scrollview.pages.get("total");

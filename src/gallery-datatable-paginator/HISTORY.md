Change History : gallery-datatable-paginator
=======================

1/16/13
--------
* Addressed an issue related to "sorting" irregularities (see https://github.com/stlsmiths/new-gallery/issues/1)
 * This issue manifested itself by remote sorted data coming back and being resorted again by the DT
 * Resolved this by overriding the _afterSortByChange event to remove the ModelList comparator and sort functions
 


12/12/12
-----
* Created an example page and published on the YUI Gallery page, http://blunderalong.com/yui/dti/paginator/gallery/update/paginator_examples.html
* Added unit test coverage to tests/ (problem due to "view" not available)
* Fixed yogi build problems for this CDN push 

12/5/12
-----
* Major update to datatable-paginator module; 
 * Added "paginationSource" ATTR to set either "client" or "server" 
 * Modified the "processPageRequest" method to add over-rideable methods "paginatorMLRequest" and "paginatorDSRequest"
 * Added "client-side" sorting capability
 * Added listeners to DT "sort" event to fire page requests
 * New update allows for loading initial data payload remotely, then doing "client-side" pagination 
* Updated to yogi build system
* Had a bug in the meta/ setup where requires didn't get added, so build "failed"

8/11/12
-----
* Original creation and push

YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Y.DataTable.Paginator"
    ],
    "modules": [
        "datatable"
    ],
    "allModules": [
        {
            "displayName": "datatable",
            "name": "datatable",
            "description": "Defines a Y.DataTable class extension to add capability to support a Paginator View-Model and allow\n paging of actively displayed data within the DT instance.\n\nWorks with either client-side pagination (i.e. local data, usually in form of JS Array) or\n in conjunction with remote server-side pagination, via either DataSource or ModelSync.REST.\n\nAllows for dealing with sorted data, wherein the local data is sorted in place, and in the case of remote data the \"sortBy\" attribute is passed to the remote server.\n\n <h4>Usage</h4>\n\n      var dtable = new Y.DataTable({\n          columns:    [ 'firstName','lastName','state','age', 'grade' ],\n          data:       enrollment.records,\n          scrollable: 'y',\n          height:     '450px',\n          paginator:  new PaginatorView({\n              model:  new PaginatorModel({itemsPerPage:50, page:1})\n          })\n\n      });\n\n <h4>Client OR Server Pagination</h4>\n\n A determination of whether the source of `data` is either \"local\" data (i.e. a Javascript Array or Y.ModelList), or is\n provided from a server (either DataSource or ModelSync.REST) is made in the method [_bindPaginator](#method__bindPaginator).\n We use a \"duck-type\" evaluation, which may not be completely robust, but has worked so far in testing.\n\n For remote data, the initial call to `.set('data',...)` and/or `data.load(...)` returns a null array, of zero length, while\n the request is being retrieved.  We use this fact to discern that it is not \"local\" data.  Then we evaluate whether the\n `datasource` plugin exists, and if so we assume the source is DataSource, and set `_pagDataSrc:'ds'`.  Otherwise, if the\n `data` property (i.e. the ModelList) contains an attribute `totalRecs` we expect that data will be retrieved via ModelSync.REST\n and set `_pagDataSrc:'mlist'`.\n\n <h4>Loading the `data` For a Page</h4>\n Once the \"source of data\" is known, the method [processPageRequest](#method_processPageRequest) fires on a `pageChange`.\n\n For the case of \"local data\", i.e. where `_pagDataSrc:'local'`, the existing buffer of data is sliced according to the pagination\n state, and the data is loaded silently, and `this.syncUI()` is fired to refresh the DT.\n\n The case of \"remote data\" (from a server) is actually more straightforward.  This extension DOES NOT \"cache\" pages for remote\n data, it simply inserts the full returned data into the DT.  So as a consequence, a pagination state change for remote data\n involves a simple request sent to the server source (either DataSource or ModelSync.REST) and the response results are\n loaded in the DT."
        }
    ]
} };
});
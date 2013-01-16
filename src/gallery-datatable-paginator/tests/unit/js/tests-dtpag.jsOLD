YUI.add('module-tests-dtpag', function(Y) {

    var suite = new Y.Test.Suite('gallery-datatable-paginator'),
        Assert = Y.Test.Assert;


    function makeData(nrec,nloop) {
        function dupText(charCode,n){
            var cret = '';
            for(var i=0; i<n; i++)
                cret += String.fromCharCode(charCode);
            return cret;
        }

        nrec = nrec || 100;
        nloop = nloop || 5;
        var rdata = [],
            ic = 0,
            i = 0,
            j = 0,
            ichar = 0;

        for(i=0; i<nrec/nloop; i++){
            ichar = ( i>25 ) ? 148-i : 90-i;
            for(j=0; j<nloop; j++){
                rdata.push({
                    dint:  (ic++)+1,
                    dflt:  (i+1)*1000-ic*10+j+1 + (1-(j+1)*11)/100,
                    dtxt:  dupText(ichar,j+1),
                    ddate: new Date(1978+i+j, 11-j, 10-j)
                });
            }
        }
        return rdata;
    }


    // cobj.nrec  =  # of records
    // cobj.nchars = max # of chars in dtxt field
    // cobj.dtconf = config obj for DT
    function remoteDSTable(cobj) {
    //
    //  Make some sample data
    //
        var rdata = makeData(cobj.nrec,cobj.nchars);

    //-----------
    //  Create a Function DS to process the local data and SIMULATE a remote request
    //    This DS uses the "rdata" created above as the total dataset to base
    //    page requests upon.
    //-----------
        var myDS = new Y.DataSource.Function({

            source: function(requestString, oSelf) {
                var resp    = {},
                    qs      = Y.QueryString.parse(requestString.replace(/\?/,'')),
                    sortBy  = (qs && qs.sortBy) ? Y.JSON.parse(qs.sortBy) : null,
                    ldata   = oSelf.get('arrayData'),
                    nrecs   = ldata.length;
                //
                //  For an "empty response", send back a null Results and totalItems as zero
                //
                if (qs.empty) {
                    resp.totalItems = 0;
                    resp.Results = [];
                } else {
                //
                //  Pre-process the "sortBy" querystring parameter BEFORE returning the results
                //
                    if(Y.Lang.isArray(sortBy)) {
                        var sortObj = sortBy[0],
                            sortKey = Y.Object.keys(sortObj)[0],
                            sortDir = sortObj[sortKey];
                    //
                    //  Server-based sorting, sort prior to sending response back
                    //  (supports String, Number and Date sorting ...)
                    //
                        ldata.sort(function(a,b){
                            var rtn;
                            if(Y.Lang.isString(a[sortKey])) {

                                rtn = ( a[sortKey]<b[sortKey] ) ? -sortDir : sortDir;

                            } else if(Y.Lang.isNumber(a[sortKey])){

                                rtn = (a[sortKey]-b[sortKey]<0) ? -sortDir : sortDir;

                            } else if( Y.Lang.isDate(a[sortKey]) ){

                                rtn = ((a[sortKey]-b[sortKey])<0) ? -sortDir : sortDir;

                            }
                            return rtn;
                        });
                    }

                    //
                    //  Total array of dataset is now sorted,
                    //      return just a slice for the provided current "page" data
                    //
                    var startIndex  = (qs.page-1)*qs.itemsPerPage,
                        endIndex    = startIndex + qs.itemsPerPage - 1;

                    resp.totalItems = nrecs;
                    resp.Results    = ldata.slice(startIndex,endIndex+1);
                }

                return resp;
            }
        });

        //
        // add an ATTR to the DS to get the array data in ...
        //
        myDS.addAttr('arrayData',{});
        myDS.set('arrayData',rdata);

    //
    // Setup JSONSchema parsing for the response data
    //   Note: "metaFields" are REQUIRED to be defined to
    //         work with remote pagination
    //
        myDS.plug( Y.Plugin.DataSourceJSONSchema, {
            schema: {
                resultListLocator: "Results",
                resultFields: [ "dint" , "dflt", "dtxt", "ddate" ],
                metaFields: {
                    page:         "page",
                    itemsPerPage: "itemsPerPage",
                    totalItems:   "totalItems"
                }
            }
        });


    //-----------
    //   Create the DataTable .... setup the paginator,
    //     configure for "remote" requests, because the Function DS
    //     mimics a remote XHR request
    //-----------
        var dt_conf = {
            columns : [
                'dint', 'dflt', 'dtxt',
                { key:'ddate',
                  formatter: function(o){
                      return Y.DataType.Date.format(o.value,{format:"%m/%d/%Y"});
                  }
                }
            ]
        };

        var myDT = new Y.DataTable(Y.merge(cobj.dtconf,dt_conf));

        // plugin the DS, render the DT and request page 1 ...
        myDT.plug(Y.Plugin.DataTableDataSource, {
            datasource: myDS
        });

        myDT.render("#dtable");

        //myDT.processPageRequest(1);

        return myDT;
    }




    function remoteDSTableMap(cobj) {
    //
    //  Make some sample data
    //
        var rdata = makeData(cobj.nrec,cobj.nchars);

    //-----------
    //  Create a Function DS to process the local data and SIMULATE a remote request
    //    This DS uses the "rdata" created above as the total dataset to base
    //    page requests upon.
    //-----------
        var myDS = new Y.DataSource.Function({

            source: function(requestString, oSelf) {
                var resp    = {},
                    qs      = Y.QueryString.parse(requestString.replace(/\?/,'')),
                    sortBy  = (qs && qs.sortBy) ? Y.JSON.parse(qs.sortBy) : null,
                    ldata   = oSelf.get('arrayData'),
                    nrecs   = ldata.length;

                /*
                 mapping:
                      page :        currentPage
                      totalItems :  numRecords
                      itemsPerPage: pageItemCount
                 */
                //
                //  For an "empty response", send back a null Results and totalItems as zero
                //
                if (qs.empty) {
                    resp.numRecords = 0;
                    resp.Results = [];
                } else {
                //
                //  Pre-process the "sortBy" querystring parameter BEFORE returning the results
                //
                    if(Y.Lang.isArray(sortBy)) {
                        var sortObj = sortBy[0],
                            sortKey = Y.Object.keys(sortObj)[0],
                            sortDir = sortObj[sortKey];
                    //
                    //  Server-based sorting, sort prior to sending response back
                    //  (supports String, Number and Date sorting ...)
                    //
                        ldata.sort(function(a,b){
                            var rtn;
                            if(Y.Lang.isString(a[sortKey])) {

                                rtn = ( a[sortKey]<b[sortKey] ) ? -sortDir : sortDir;

                            } else if(Y.Lang.isNumber(a[sortKey])){

                                rtn = (a[sortKey]-b[sortKey]<0) ? -sortDir : sortDir;

                            } else if( Y.Lang.isDate(a[sortKey]) ){

                                rtn = ((a[sortKey]-b[sortKey])<0) ? -sortDir : sortDir;

                            }
                            return rtn;
                        });
                    }

                    //
                    //  Total array of dataset is now sorted,
                    //      return just a slice for the provided current "page" data
                    //
                    var startIndex  = (qs.currentPage-1)*qs.pageItemCount,
                        endIndex    = startIndex + qs.pageItemCount - 1;

                    resp.numRecords = nrecs;
                    resp.Results    = ldata.slice(startIndex,endIndex+1);
                }

                return resp;
            }
        });

        //
        // add an ATTR to the DS to get the array data in ...
        //
        myDS.addAttr('arrayData',{});
        myDS.set('arrayData',rdata);

    //
    // Setup JSONSchema parsing for the response data
    //   Note: "metaFields" are REQUIRED to be defined to
    //         work with remote pagination
    //
        myDS.plug( Y.Plugin.DataSourceJSONSchema, {
            schema: {
                resultListLocator: "Results",
                resultFields: [ "dint" , "dflt", "dtxt", "ddate" ],
                metaFields: {
                    currentPage:   "currentPage",
                    pageItemCount: "pageItemCount",
                    numRecords:    "numRecords"
                }
            }
        });


    //-----------
    //   Create the DataTable .... setup the paginator,
    //     configure for "remote" requests, because the Function DS
    //     mimics a remote XHR request
    //-----------
        var dt_conf = {
            columns : [
                'dint', 'dflt', 'dtxt',
                { key:'ddate',
                  formatter: function(o){
                      return Y.DataType.Date.format(o.value,{format:"%m/%d/%Y"});
                  }
                }
            ]
        };

        var myDT = new Y.DataTable(Y.merge(cobj.dtconf,dt_conf));

        // plugin the DS, render the DT and request page 1 ...
        myDT.plug(Y.Plugin.DataTableDataSource, {
            datasource: myDS
        });

        myDT.render("#dtable");

        return myDT;
    }






    // cobj.nrec  =  # of records
    // cobj.nchars = max # of chars in dtxt field
    // cobj.dtconf = config obj for DT
    function remoteMLTable(cobj) {
    //
    //  Make some sample data
    //
        var rdata = makeData(cobj.nrec,cobj.nchars);

        RecModel = Y.Base.create('recModel', Y.Model, [],{},{
            ATTRS:{
                // basically defines the data fields of the ModelList
                dint:{},
                dflt:{},
                dtxt:{},
                ddate:{}
            }
        });


        RecList = Y.Base.create('recMList', Y.ModelList, [], {

            // Define a dummy property ... checked by DT-Paginator and ModelList for page requests
            url: "dummy",

            /**
             * Define a custom sync function, that on a ModelList "load" (i.e. "read" action) will
             * process the array defined as attribute "originalData".
             *
             * Demonstrates simple sorting, of either numeric, text or data data types (limited to
             * a single sort-key only).
             *
             * @method sync
             * @param {String} action     Sync action, "read" for ModelList reading of data
             * @param {Object} options    Options object submitted in "load" method
             * @param {Function} callback Return callback function
             **/
            sync: function (action, options, callback) {
                options || (options = {});

                if(action !== 'read') {
                    callback('Unsupported sync action: ' + action);
                }

                var resp   = { replyCode: 200},
                    sortBy = (options.sortBy && Y.JSON.parse) ? Y.JSON.parse(options.sortBy) : null,
                    ldata  = this.get('originalData');

                if(options.empty) {

                    resp.totalItems = 0;
                    resp.Results = [];

                } else {

                //
                //  Pre-process the "sortBy" querystring parameter BEFORE returning the results
                //
                    if(Y.Lang.isArray(sortBy)) {
                        var sortObj = sortBy[0],
                            sortKey = Y.Object.keys(sortObj)[0],
                            sortDir = sortObj[sortKey];

                    //
                    //  Server-based sorting, sort prior to sending response back
                    //  (supports String, Number and Date sorting ...)
                    //
                        ldata.sort(function(a,b){
                            var rtn;
                            if(Y.Lang.isString(a[sortKey])) {

                                rtn = ( a[sortKey]<b[sortKey] ) ? -sortDir : sortDir;

                            } else if(Y.Lang.isNumber(a[sortKey])){

                                rtn = (a[sortKey]-b[sortKey]<0) ? -sortDir : sortDir;

                            } else if(Y.Lang.isDate(a[sortKey]) ){

                                rtn = ((a[sortKey] - b[sortKey])<0) ? -sortDir : sortDir;
                            }
                            return rtn;

                        });

                    }

                //
                //  The full array of data is now sorted (if requested),
                //     return a slice for the provided current "page"
                //
                    var startIndex  = (options.page-1)*options.itemsPerPage,
                        endIndex    = startIndex + options.itemsPerPage - 1;

                    resp.totalItems = ldata.length;
                    resp.Results    = ldata.slice(startIndex,endIndex+1);
                }

                var json_resp = Y.JSON.stringify(resp);

               callback(null,json_resp);

            },

            /**
             * Define a custom parse method for this ModelList, that will process the JSON returned
             * response (from the sync layer above), and separate the meta data and results data for
             * inclusion into the ModelList.
             *
             * Note:  We didn't "have" to sends a JSON response back from .sync, but did so in this
             *        case to demonstrate how a true remote XHR request would be parsed.
             *
             * @method parse
             * @param {String} resp     JSON response string returned from sync operation
             * @return {Array} results  Parsed JS array of results, to be added to ModelList
             */
            parse: function(raw_json) {
                var parsed = Y.JSON.parse(raw_json),
                    results = [],
                    metaflds = {};

                // convert the "ddate" data from a string to Date object
                if(parsed.Results && parsed.Results.length>0)
                    Y.Array.each(parsed.Results,function(r){
                        r.ddate = Y.Date.parse(r.ddate);
                    });

                // Success from my server is indicated by meta field replyCode of 200 ...
                if ( parsed.replyCode === 200 ) {
                    metaflds.itemsPerPage = parsed.itemsPerPage;
                    metaflds.totalItems   = parsed.totalItems;
                    if(parsed.totalItems === 0)
                        parsed.Results = [];
                    results = parsed.Results
                }

            // REQUIRED:  Define a "response" event that the DT-Paginator listens for ...
                this.fire('response',{
                    resp:    raw_json,
                    parsed:  parsed,
                    results: results,
                    meta:    metaflds
                });

                // return the results to the ModelList ...
                return results;
            }

        },{
            ATTRS:{
                originalData:{
                    value: []
                },
                timeDelay:{
                    value: 0
                }
            }
        });



    //-----------
    //   Create the DataTable .... setup the paginator,
    //     configure for "remote" requests, because the Function DS
    //     mimics a remote XHR request
    //-----------
        var dt_conf = {
            columns : [
                'dint', 'dflt', 'dtxt',
                { key:'ddate',
                  formatter: function(o){
                      return Y.DataType.Date.format(o.value,{format:"%m/%d/%Y"});
                  }
                }
            ],

            // create the custom ModelList, and set the array data and attributes
            data: new RecList({
                        model:        RecModel,
                        originalData: rdata,
                        timeDelay:    0
                    })

        };

        var myDT = new Y.DataTable(Y.merge(cobj.dtconf,dt_conf));

        myDT.render("#dtable");

        //myDT.processPageRequest(1);

        return myDT;
    }

    function localDT(dt_obj){
    //
    //  Make some sample data ... from localPagData.html
    //
        var rdata = makeData(100,5);
    //
    //   Create the DataTable ....
    //
        var dt_config = {
            columns : [
                'dint',
                {key:'dflt', formatter:function(o){ return o.value.toFixed(4)} },
                'dtxt', 'ddate'
/*                { key:'ddate',
                  formatter: function(o){
                                return Y.DataType.Date.format(o.value,{format:"%m/%d/%Y"});
                              }
                } */
            ],
            data: rdata
        };

        if(dt_obj !== undefined)
            dt_config = Y.merge(dt_config,dt_obj);

        var myDT = new Y.DataTable(dt_config);
        myDT.render("#dtable");

        return myDT;

    }

//
// Basic Pagination - class and setup
//
    suite.add(new Y.Test.Case({
        name: 'Gallery DataTable-Paginator : class extension basics',

        setUp : function () {
            this.dt = localDT();
        },

        tearDown : function () {
            if(this.dt){
                this.dt.destroy();
                delete this.dt;
            }
        },

        'should be a class' : function() {
            Assert.isFunction(Y.DataTable.Paginator);
        },

        'should instantiate as a DT' : function() {
            Assert.isInstanceOf( Y.DataTable, this.dt, 'Not an instanceof Y.DT' );
        },

        'listeners are set' : function() {
           // Assert.areSame( 3, this.m._subscr.length, "Didn't find 3 listeners" )
        },

        'check ATTR defaults values' : function() {
            // serverPaginationMap, paginationState,

            Assert.isNull(  this.dt.get('paginator'), "by default paginator should be null" );
            Assert.areSame( "", this.dt.get('requestStringTemplate'), "requestStringTemplate should be null string" );
            Assert.isFalse( this.dt.get('paginatorResize'), "paginatorResize should be false" );
            Assert.areSame( 'client', this.dt.get('paginationSource'), "paginationSource should default to 'client'" );
            Assert.isNull( this.dt.get('paginationState'), "paginatorState should be null" );
            Assert.isInstanceOf(Object, this.dt.get('serverPaginationMap'), "serverPaginationMap should be object")

        }

    }));


//
// Basic Pagination - local data / paginator
//

    suite.add(new Y.Test.Case({
        name: 'Gallery DataTable-Paginator :  client-side (w/local data)',

        setUp : function () {
            var lobj = {
                paginator: new Y.PaginatorView({
                    model:      new Y.PaginatorModel({ itemsPerPage: 20 }),
                    container:  '#pagCont'
                //    circular:   true
                }),
                paginationSource: 'client'
            };

            this.dt = localDT(lobj);

            this.p  = this.dt.get('paginator');
            this.m  = this.dt.pagModel;

        },

        tearDown : function () {
            if(this.dt) {
                this.dt.destroy();
                delete this.dt;
            }
        },

        'check DT pagination setup' : function() {
            Assert.isInstanceOf( Y.PaginatorView, this.p, "Paginator property is not a PaginatorView instance" );
            Assert.isInstanceOf( Y.PaginatorModel, this.m, "pagModel property is not a PaginatorModel instance" );

            Assert.areSame( 100, this.m.get('totalItems') );
            Assert.areSame( 20, this.m.get('itemsPerPage') );
            Assert.areSame( 5, this.m.get('totalPages') );
            Assert.areSame( 1, this.m.get('page') );
        },

        'check page 1 stats' : function() {

            var ipp  = this.m.get('itemsPerPage'),
                frec = this.dt.getRecord(0),
                lrec = this.dt.getRecord( this.dt.data.size()-1 );

            // check first record ...
            Assert.areSame( 1, frec.get('dint'), "first record dint is incorrect" );
            Assert.areSame( 990.9, frec.get('dflt'), "first record dint is incorrect" );
            Assert.areSame( 'Z', frec.get('dtxt'), "first record dtxt is incorrect" );

            // check last record ...
            Assert.areSame( ipp, lrec.get('dint'), "last record dint is incorrect" );
            Assert.areSame( 3804.46, lrec.get('dflt'), "last record dflt is incorrect" );
            Assert.areSame( 'WWWWW', lrec.get('dtxt'), "last record dtxt is incorrect" );

            Assert.areSame( 0, this.m.get('itemIndexStart'), "itemIndexStart incorrect" );
            Assert.areSame( ipp-1, this.m.get('itemIndexEnd'), "itemIndexEnd incorrect" );

            var ps = this.dt.get('paginationState');
            //Assert.areSame( {}, this.dt.get('paginationState') );

        },

        'check page 4 stats' : function() {

            // Go to Page 4 ...

            this.p.get('container').one('a[data-pglink="4"]').simulate('click');
            Assert.areSame( 4, this.m.get('page'), "expected page 4" );

            var ipp  = this.m.get('itemsPerPage'),
                frec = this.dt.getRecord(0),
                lrec = this.dt.getRecord(ipp-1);


            // check first record ...
            Assert.areSame( 61, frec.get('dint'), "first record dint is incorrect" );
            Assert.areSame( 12390.9, frec.get('dflt'), "first record dflt is incorrect" );
            Assert.areSame( 'N', frec.get('dtxt'), "first record dtxt is incorrect" );

            // check last record ...
            Assert.areSame( 80, lrec.get('dint'), "last record dint is incorrect" );
            Assert.areSame( 15204.46, lrec.get('dflt'), "last record dflt is incorrect" );
            Assert.areSame( 'KKKKK', lrec.get('dtxt'), "last record dtxt is incorrect" );

            Assert.areSame( 60, this.m.get('itemIndexStart'), "itemIndexStart incorrect" );
            Assert.areSame( 60+ipp-1, this.m.get('itemIndexEnd'), "itemIndexEnd incorrect" );

        },

        'check destroying the paginator' : function() {
            this.dt.destroy();

            Assert.isUndefined( this._evtHandlesPag, 'should clean up paginator listeners' );
            Assert.isUndefined( this._mlistArray, 'should clean up paginator local array' );
            Assert.isUndefined( this.paginator, 'should clear up paginator static prop' );
            Assert.isUndefined( this.pagModel, 'should clear up paginator model static prop' );

        }

    }));


//
// Basic Pagination - reset data, resize paginator
//

    suite.add(new Y.Test.Case({
        name: 'Gallery DataTable-Paginator :  check reset of data',

        setUp : function () {
            var lobj = {
                paginator: new Y.PaginatorView({
                    model:      new Y.PaginatorModel({ itemsPerPage: 20 }),
                    container:  '#pagCont'
                //    circular:   true
                }),
                paginatorResize: true,
                paginationSource: 'client'
            };

            this.dt = localDT(lobj);

            this.p  = this.dt.get('paginator');
            this.m  = this.dt.pagModel;

        },

        tearDown : function () {
            if(this.dt) {
                this.dt.destroy();
                delete this.dt;
            }
        },

        'check DT pagination setup' : function() {
            Assert.isInstanceOf( Y.PaginatorView, this.p, "Paginator property is not a PaginatorView instance" );
            Assert.isInstanceOf( Y.PaginatorModel, this.m, "pagModel property is not a PaginatorModel instance" );

            Assert.areSame( 100, this.m.get('totalItems') );
            Assert.areSame( 20, this.m.get('itemsPerPage') );
            Assert.areSame( 5, this.m.get('totalPages') );
            Assert.areSame( 1, this.m.get('page') );
        },

        'reset local data to []' : function() {

            Assert.areSame( 100, this.dt.pagModel.get('totalItems') );
            Assert.areSame( 5, this.dt.pagModel.get('totalPages') );

            this.dt.resetLocalData([]);

            Assert.areSame( 0, this.dt.pagModel.get('totalItems'), 'after reset totalItems should be zero' );
            Assert.areSame( 1, this.dt.pagModel.get('totalPages'), 'after reset totalPages should be 1' );

        },

        'repopulate with original data, check page 2' : function() {

            this.dt.resetLocalData(makeData());

            Assert.areSame( 100, this.m.get('totalItems') );
            Assert.areSame( 20, this.m.get('itemsPerPage') );
            Assert.areSame( 5, this.m.get('totalPages') );
            Assert.areSame( 1, this.m.get('page') );

            this.p.get('container').one('a[data-pglink="2"]').simulate('click');
            Assert.areSame( 2, this.m.get('page'), "expected page 2" );

            var frec = this.dt.getRecord(0);

            // check first record ...
            Assert.areSame( 21, frec.get('dint'), "first record dint is incorrect" );
            Assert.areSame( 4790.9, frec.get('dflt'), "first record dint is incorrect" );
            Assert.areSame( 'V', frec.get('dtxt'), "first record dtxt is incorrect" );
        }

    }));



//
// DataSource Pagination - local data / client-pag with Sorting
//
    suite.add(new Y.Test.Case({
        name: 'Gallery DataTable-Paginator : local data client-side pag sorting',

        setUp : function () {

            var lobj = {
                sortable: true,
                paginator: new Y.PaginatorView({
                    model:      new Y.PaginatorModel({ itemsPerPage: 20 }),
                    container:  '#pagCont'
                //    circular:   true
                }),
                paginationSource: 'client'
            };

            this.dt = localDT(lobj);

            this.p  = this.dt.get('paginator');
            this.m  = this.dt.pagModel;

        },

        tearDown : function () {
            if(this.dt){
                this.dt.destroy();
                delete this.dt;
            }
        },

        'check DT pagination setup' : function() {
            Assert.isInstanceOf( Y.PaginatorView, this.p, "Paginator property is not a PaginatorView instance" );
            Assert.isInstanceOf( Y.PaginatorModel, this.m, "pagModel property is not a PaginatorModel instance" );

            Assert.areSame( 100, this.m.get('totalItems') );
            Assert.areSame( 20, this.m.get('itemsPerPage') );
            Assert.areSame( 5, this.m.get('totalPages') );
            Assert.areSame( 1, this.m.get('page') );
        },

        'check page 1 stats' : function() {

            var ipp  = this.m.get('itemsPerPage'),
                frec = this.dt.getRecord(0),
                lrec = this.dt.getRecord( this.dt.data.size()-1 );

            // check first record ...
            Assert.areSame( 1, frec.get('dint'), "first record dint is incorrect" );
            Assert.areSame( 990.9, frec.get('dflt'), "first record dint is incorrect" );
            Assert.areSame( 'Z', frec.get('dtxt'), "first record dtxt is incorrect" );

            // check last record ...
            Assert.areSame( ipp, lrec.get('dint'), "last record dint is incorrect" );
            Assert.areSame( 3804.46, lrec.get('dflt'), "last record dflt is incorrect" );
            Assert.areSame( 'WWWWW', lrec.get('dtxt'), "last record dtxt is incorrect" );

            Assert.areSame( 0, this.m.get('itemIndexStart'), "itemIndexStart incorrect" );
            Assert.areSame( ipp-1, this.m.get('itemIndexEnd'), "itemIndexEnd incorrect" );

            var ps = this.dt.get('paginationState');
            //Assert.areSame( {}, this.dt.get('paginationState') );

        },

        'check page 4 stats' : function() {

            // Go to Page 4 ...

            this.p.get('container').one('a[data-pglink="4"]').simulate('click');
            Assert.areSame( 4, this.m.get('page'), "expected page 4" );

            var ipp  = this.m.get('itemsPerPage'),
                frec = this.dt.getRecord(0),
                lrec = this.dt.getRecord(ipp-1);


            // check first record ...
            Assert.areSame( 61, frec.get('dint'), "first record dint is incorrect" );
            Assert.areSame( 12390.9, frec.get('dflt'), "first record dflt is incorrect" );
            Assert.areSame( 'N', frec.get('dtxt'), "first record dtxt is incorrect" );

            // check last record ...
            Assert.areSame( 80, lrec.get('dint'), "last record dint is incorrect" );
            Assert.areSame( 15204.46, lrec.get('dflt'), "last record dflt is incorrect" );
            Assert.areSame( 'KKKKK', lrec.get('dtxt'), "last record dtxt is incorrect" );

            Assert.areSame( 60, this.m.get('itemIndexStart'), "itemIndexStart incorrect" );
            Assert.areSame( 60+ipp-1, this.m.get('itemIndexEnd'), "itemIndexEnd incorrect" );

        },

        'check float sorting (dflt column) - Page 1' : function() {

            this.dt.set('sortBy',{dflt:'asc'} );

            var ipp  = this.m.get('itemsPerPage'),
                frec = this.dt.getRecord(0),
                lrec = this.dt.getRecord( this.dt.data.size()-1 );

            // check first record ...
            Assert.areSame( 5, frec.get('dint'), "first record dint is incorrect" );
            Assert.areSame( 954.46, frec.get('dflt'), "first record dflt is incorrect" );
            Assert.areSame( 'ZZZZZ', frec.get('dtxt'), "first record dtxt is incorrect" );

            // check last record ...
            Assert.areSame( 16, lrec.get('dint'), "last record dint is incorrect" );
            Assert.areSame( 3840.9, lrec.get('dflt'), "last record dflt is incorrect" );
            Assert.areSame( 'W', lrec.get('dtxt'), "last record dtxt is incorrect" );

        },

        'check text sorting (dtxt column) - Page 3' : function() {

            // sort by "dtxt" descending order ...
            this.dt.set('sortBy',{dtxt:'desc'} );

            // move to page 3
            this.p.get('container').one('a[data-pglink="3"]').simulate('click');
            Assert.areSame( 3, this.m.get('page'), "expected page 3" );
            Assert.areSame( 40, this.m.get('itemIndexStart'), "itemIndexStart is incorrect" );
            Assert.areSame( 59, this.m.get('itemIndexEnd'), "itemIndexEnd is incorrect" );

            var ipp  = this.m.get('itemsPerPage'),
                lrec = this.dt.getRecord( this.dt.data.size()-1),
                rec = this.dt.getRecord(3);

            // check fourth record ...
            Assert.areSame( 42, rec.get('dint'), "fourth record dint is incorrect" );
            Assert.areSame( 8581.79, rec.get('dflt'), "fourth record dflt is incorrect" );
            Assert.areSame( 'RR', rec.get('dtxt'), "fourth record dtxt is incorrect" );

            // check last record ...
            Assert.areSame( 56, lrec.get('dint'), "last record dint is incorrect" );
            Assert.areSame( 11440.9, lrec.get('dflt'), "last record dflt is incorrect" );
            Assert.areSame( 'O', lrec.get('dtxt'), "last record dtxt is incorrect" );

        },

        'check date sorting (ddate column) - Page 2' : function() {

            // sort by "ddate" ascending order ...
            // this.dt.set('sortBy','ddate' );   this fails !!!1, not sure why ...
            var th = this.dt.get('contentBox').one('.yui3-datatable-columns').one('th.yui3-datatable-col-ddate');
            //if(!th) return;
            th.simulate('click');

            // move to page 2
            this.p.get('container').one('a[data-pglink="2"]').simulate('click');
            Assert.areSame( 2, this.m.get('page'), "expected page 2" );
            Assert.areSame( 20, this.m.get('itemIndexStart'), "itemIndexStart is incorrect" );
            Assert.areSame( 39, this.m.get('itemIndexEnd'), "itemIndexEnd is incorrect" );

            var ipp  = this.m.get('itemsPerPage'),
                lrec = this.dt.getRecord( ipp-1 ),
                rec7 = this.dt.getRecord(6);

            // check sevent record ...
            Assert.areSame( 24, rec7.get('dint'), "seventh record dint is incorrect" );
            Assert.areSame( 4763.57, rec7.get('dflt'), "seventh record dflt is incorrect" );
            Assert.areSame( 'VVVV', rec7.get('dtxt'), "seventh record dtxt is incorrect" );

            // check last record ...
            Assert.areSame( 46, lrec.get('dint'), "last record dint is incorrect" );
            Assert.areSame( 9540.9, lrec.get('dflt'), "last record dflt is incorrect" );
            Assert.areSame( 'Q', lrec.get('dtxt'), "last record dtxt is incorrect" );

        }

    }));


//
// DataSource Pagination - DataSource pagination, via function DS including sorting
//
    suite.add(new Y.Test.Case({
        name: 'Gallery DataTable-Paginator : remote (server-side) pagination via Function DS incl sorting',

        setUp : function () {

            var lobj = {

                nrec:  100,
                nchars: 5,

                dtconf: {
                    sortable: true,
                    paginator: new Y.PaginatorView({
                        model:      new Y.PaginatorModel({ itemsPerPage: 20 }),
                        container:  '#pagCont'
                    //    circular:   true
                    }),

                    //
                    //  Configure for "remote" requests (so it uses DS to process page requests),
                    //    and setup the DS request querystring
                    //
                    paginationSource: 'remote',
                    requestStringTemplate: "?page={page}&itemsPerPage={itemsPerPage}&sortBy={sortBy}"
                }

            };

            this.dt = remoteDSTable(lobj);

            this.p  = this.dt.get('paginator');
            this.m  = this.dt.pagModel;

        },

        tearDown : function () {
            if(this.dt){
                this.dt.destroy();
                delete this.dt;
            }
        },

        'check DT pagination setup' : function() {
            Assert.isInstanceOf( Y.PaginatorView, this.p, "Paginator property is not a PaginatorView instance" );
            Assert.isInstanceOf( Y.PaginatorModel, this.m, "pagModel property is not a PaginatorModel instance" );

            this.dt.processPageRequest(1);

            Assert.areSame( 100, this.m.get('totalItems') );
            Assert.areSame( 20, this.m.get('itemsPerPage') );
            Assert.areSame( 5, this.m.get('totalPages') );
            Assert.areSame( 1, this.m.get('page') );

        },

        'check page 1 stats' : function() {
            this.dt.processPageRequest(1);

            var ipp  = this.m.get('itemsPerPage'),
                frec = this.dt.getRecord(0),
                lrec = this.dt.getRecord( this.dt.data.size()-1 );

            // check first record ...
            Assert.areSame( 1, frec.get('dint'), "first record dint is incorrect" );
            Assert.areSame( 990.9, frec.get('dflt'), "first record dint is incorrect" );
            Assert.areSame( 'Z', frec.get('dtxt'), "first record dtxt is incorrect" );

            // check last record ...
            Assert.areSame( ipp, lrec.get('dint'), "last record dint is incorrect" );
            Assert.areSame( 3804.46, lrec.get('dflt'), "last record dflt is incorrect" );
            Assert.areSame( 'WWWWW', lrec.get('dtxt'), "last record dtxt is incorrect" );

            Assert.areSame( 0, this.m.get('itemIndexStart'), "itemIndexStart incorrect" );
            Assert.areSame( ipp-1, this.m.get('itemIndexEnd'), "itemIndexEnd incorrect" );

            var ps = this.dt.get('paginationState');
            //Assert.areSame( {}, this.dt.get('paginationState') );

        },

        'check page 4 stats' : function() {

            // Go to Page 4 ...
            this.dt.processPageRequest(1);


            this.p.get('container').one('a[data-pglink="4"]').simulate('click');
            Assert.areSame( 4, this.m.get('page'), "expected page 4" );

            var ipp  = this.m.get('itemsPerPage'),
                frec = this.dt.getRecord(0),
                lrec = this.dt.getRecord(ipp-1);


            // check first record ...
            Assert.areSame( 61, frec.get('dint'), "first record dint is incorrect" );
            Assert.areSame( 12390.9, frec.get('dflt'), "first record dflt is incorrect" );
            Assert.areSame( 'N', frec.get('dtxt'), "first record dtxt is incorrect" );

            // check last record ...
            Assert.areSame( 80, lrec.get('dint'), "last record dint is incorrect" );
            Assert.areSame( 15204.46, lrec.get('dflt'), "last record dflt is incorrect" );
            Assert.areSame( 'KKKKK', lrec.get('dtxt'), "last record dtxt is incorrect" );

            Assert.areSame( 60, this.m.get('itemIndexStart'), "itemIndexStart incorrect" );
            Assert.areSame( 60+ipp-1, this.m.get('itemIndexEnd'), "itemIndexEnd incorrect" );

        },

        'check float sorting (dflt column) - Page 1' : function() {

            this.dt.processPageRequest(1);

            this.dt.set('sortBy',{dflt:'asc'} );

            var ipp  = this.m.get('itemsPerPage'),
                frec = this.dt.getRecord(0),
                lrec = this.dt.getRecord( this.dt.data.size()-1 );

            // check first record ...
            Assert.areSame( 5, frec.get('dint'), "first record dint is incorrect" );
            Assert.areSame( 954.46, frec.get('dflt'), "first record dflt is incorrect" );
            Assert.areSame( 'ZZZZZ', frec.get('dtxt'), "first record dtxt is incorrect" );

            // check last record ...
            Assert.areSame( 16, lrec.get('dint'), "last record dint is incorrect" );
            Assert.areSame( 3840.9, lrec.get('dflt'), "last record dflt is incorrect" );
            Assert.areSame( 'W', lrec.get('dtxt'), "last record dtxt is incorrect" );

        },

        'check text sorting (dtxt column) - Page 3' : function() {

            this.dt.processPageRequest(1);

            // sort by "dtxt" descending order ...
            this.dt.set('sortBy',{dtxt:'desc'} );

            // move to page 3
            this.p.get('container').one('a[data-pglink="3"]').simulate('click');
            Assert.areSame( 3, this.m.get('page'), "expected page 3" );
            Assert.areSame( 40, this.m.get('itemIndexStart'), "itemIndexStart is incorrect" );
            Assert.areSame( 59, this.m.get('itemIndexEnd'), "itemIndexEnd is incorrect" );

            var ipp  = this.m.get('itemsPerPage'),
                lrec = this.dt.getRecord( this.dt.data.size()-1),
                rec = this.dt.getRecord(3);

            // check fourth record ...
            Assert.areSame( 42, rec.get('dint'), "fourth record dint is incorrect" );
            Assert.areSame( 8581.79, rec.get('dflt'), "fourth record dflt is incorrect" );
            Assert.areSame( 'RR', rec.get('dtxt'), "fourth record dtxt is incorrect" );

            // check last record ...
            Assert.areSame( 56, lrec.get('dint'), "last record dint is incorrect" );
            Assert.areSame( 11440.9, lrec.get('dflt'), "last record dflt is incorrect" );
            Assert.areSame( 'O', lrec.get('dtxt'), "last record dtxt is incorrect" );

        },

        'check date sorting (ddate column) - Page 2' : function() {

            this.dt.processPageRequest(1);

            // sort by "ddate" ascending order ...
            // this.dt.set('sortBy','ddate' );   this fails !!!1, not sure why ...
            var th = this.dt.get('contentBox').one('.yui3-datatable-columns').one('th.yui3-datatable-col-ddate');
            th.simulate('click');

            // move to page 2
            this.p.get('container').one('a[data-pglink="2"]').simulate('click');
            Assert.areSame( 2, this.m.get('page'), "expected page 2" );
            Assert.areSame( 20, this.m.get('itemIndexStart'), "itemIndexStart is incorrect" );
            Assert.areSame( 39, this.m.get('itemIndexEnd'), "itemIndexEnd is incorrect" );

            var ipp  = this.m.get('itemsPerPage'),
                lrec = this.dt.getRecord( ipp-1 ),
                rec7 = this.dt.getRecord(6);

            // check sevent record ...
            Assert.areSame( 24, rec7.get('dint'), "seventh record dint is incorrect" );
            Assert.areSame( 4763.57, rec7.get('dflt'), "seventh record dflt is incorrect" );
            Assert.areSame( 'VVVV', rec7.get('dtxt'), "seventh record dtxt is incorrect" );

            // check last record ...
            Assert.areSame( 46, lrec.get('dint'), "last record dint is incorrect" );
            Assert.areSame( 9540.9, lrec.get('dflt'), "last record dflt is incorrect" );
            Assert.areSame( 'Q', lrec.get('dtxt'), "last record dtxt is incorrect" );

        },

        'check empty response, paginator disable' : function() {
            var css_pcont = 'yui3-pagview-container',
                css_disabled = 'yui3-pagview-disabled',
                pcont = Y.one('.'+css_pcont);

            var emptyFlag = false;
            this.dt.paginatorDSRequest = function(rqst) {
                if(emptyFlag)
                    rqst += "&empty=true";
                this.datasource.load({ request: rqst });
            };

            this.dt.processPageRequest(1);

            // move to page 4
            this.p.get('container').one('a[data-pglink="4"]').simulate('click');
            Assert.areSame( 4, this.m.get('page'), "expected page 4" );

            // set empty flag, and move to page 3
            emptyFlag = true;
            this.p.get('container').one('a[data-pglink="3"]').simulate('click');

            function sleep(msecs){
                var tstart = new Date().getTime();
                while( new Date().getTime() < tstart + msecs );
                return;
            }

            sleep(200);
            Assert.areSame( 0, this.m.get('totalItems'), "expected totalItems 0" );
            Assert.areSame( 1, this.m.get('page'), "expected page 1" );
            Assert.areSame( 1, this.m.get('totalPages'), "expected totalPages 1" );
/*
            Assert.isTrue( pcont.one('a[data-pglink="first"]').hasClass(css_disabled), "first link should be disabled" );
            Assert.isTrue( pcont.one('a[data-pglink="prev"]').hasClass(css_disabled), "prev link should be disabled" );
            Assert.isTrue( pcont.one('a[data-pglink="1"]').hasClass(css_disabled), "Page 1 link should be disabled" );
            Assert.isTrue( pcont.one('a[data-pglink="next"]').hasClass(css_disabled), "next link should be disabled" );
            Assert.isTrue( pcont.one('a[data-pglink="last"]').hasClass(css_disabled), "last link should be disabled" );
*/
            emptyFlag = false;
            this.dt.processPageRequest(2);
            sleep(200);
            Assert.areSame( 100, this.m.get('totalItems'), "expected totalItems 100" );
            Assert.areSame( 1, this.m.get('page'), "expected page 2" );
            Assert.areSame( 5, this.m.get('totalPages'), "expected totalPages 5" );


        }


    }));


//
// DataSource Pagination - DataSource pagination, via function DS with serverPaginationMap
//
    suite.add(new Y.Test.Case({
        name: 'Gallery DataTable-Paginator : remote (server-side) pag via Function DS with serverPaginationMap',

        setUp : function () {

            var lobj = {

                nrec:  100,
                nchars: 5,

                dtconf: {
                    sortable: true,
                    paginator: new Y.PaginatorView({
                        model:      new Y.PaginatorModel({ itemsPerPage: 20 }),
                        container:  '#pagCont'
                    }),

                //
                // "maps" Paginator.Model attributes to server querystring / returned response ...
                //
                    serverPaginationMap: {
                        page :        'currentPage',
                        totalItems :  'numRecords',
                        itemsPerPage: 'pageItemCount'
                    },

                    //
                    //  Configure for "remote" requests (so it uses DS to process page requests),
                    //    and setup the DS request querystring
                    //
                    paginationSource: 'remote',
                    requestStringTemplate: "?currentPage={currentPage}&pageItemCount={pageItemCount}&sortBy={sortBy}"
                }

            };

            this.dt = remoteDSTableMap(lobj);

            this.p  = this.dt.get('paginator');
            this.m  = this.dt.pagModel;

        },

        tearDown : function () {
            if(this.dt){
                this.dt.destroy();
                delete this.dt;
            }
        },

        'check DT pagination setup' : function() {
            Assert.isInstanceOf( Y.PaginatorView, this.p, "Paginator property is not a PaginatorView instance" );
            Assert.isInstanceOf( Y.PaginatorModel, this.m, "pagModel property is not a PaginatorModel instance" );

            this.dt.processPageRequest(1);

            Assert.areSame( 100, this.m.get('totalItems') );
            Assert.areSame( 20, this.m.get('itemsPerPage') );
            Assert.areSame( 5, this.m.get('totalPages') );
            Assert.areSame( 1, this.m.get('page') );

        },

        'check page 1 stats' : function() {
            this.dt.processPageRequest(1);

            var ipp  = this.m.get('itemsPerPage'),
                frec = this.dt.getRecord(0),
                lrec = this.dt.getRecord( this.dt.data.size()-1 );

            // check first record ...
            Assert.areSame( 1, frec.get('dint'), "first record dint is incorrect" );
            Assert.areSame( 990.9, frec.get('dflt'), "first record dint is incorrect" );
            Assert.areSame( 'Z', frec.get('dtxt'), "first record dtxt is incorrect" );

            // check last record ...
            Assert.areSame( ipp, lrec.get('dint'), "last record dint is incorrect" );
            Assert.areSame( 3804.46, lrec.get('dflt'), "last record dflt is incorrect" );
            Assert.areSame( 'WWWWW', lrec.get('dtxt'), "last record dtxt is incorrect" );

            Assert.areSame( 0, this.m.get('itemIndexStart'), "itemIndexStart incorrect" );
            Assert.areSame( ipp-1, this.m.get('itemIndexEnd'), "itemIndexEnd incorrect" );

            var ps = this.dt.get('paginationState');
            //Assert.areSame( {}, this.dt.get('paginationState') );

        },

        'check page 4 stats' : function() {

            // Go to Page 4 ...
            this.dt.processPageRequest(1);


            this.p.get('container').one('a[data-pglink="4"]').simulate('click');
            Assert.areSame( 4, this.m.get('page'), "expected page 4" );

            var ipp  = this.m.get('itemsPerPage'),
                frec = this.dt.getRecord(0),
                lrec = this.dt.getRecord(ipp-1);


            // check first record ...
            Assert.areSame( 61, frec.get('dint'), "first record dint is incorrect" );
            Assert.areSame( 12390.9, frec.get('dflt'), "first record dflt is incorrect" );
            Assert.areSame( 'N', frec.get('dtxt'), "first record dtxt is incorrect" );

            // check last record ...
            Assert.areSame( 80, lrec.get('dint'), "last record dint is incorrect" );
            Assert.areSame( 15204.46, lrec.get('dflt'), "last record dflt is incorrect" );
            Assert.areSame( 'KKKKK', lrec.get('dtxt'), "last record dtxt is incorrect" );

            Assert.areSame( 60, this.m.get('itemIndexStart'), "itemIndexStart incorrect" );
            Assert.areSame( 60+ipp-1, this.m.get('itemIndexEnd'), "itemIndexEnd incorrect" );

        },

        'check float sorting (dflt column) - Page 1' : function() {

            this.dt.processPageRequest(1);

            this.dt.set('sortBy',{dflt:'asc'} );

            var ipp  = this.m.get('itemsPerPage'),
                frec = this.dt.getRecord(0),
                lrec = this.dt.getRecord( this.dt.data.size()-1 );

            // check first record ...
            Assert.areSame( 5, frec.get('dint'), "first record dint is incorrect" );
            Assert.areSame( 954.46, frec.get('dflt'), "first record dflt is incorrect" );
            Assert.areSame( 'ZZZZZ', frec.get('dtxt'), "first record dtxt is incorrect" );

            // check last record ...
            Assert.areSame( 16, lrec.get('dint'), "last record dint is incorrect" );
            Assert.areSame( 3840.9, lrec.get('dflt'), "last record dflt is incorrect" );
            Assert.areSame( 'W', lrec.get('dtxt'), "last record dtxt is incorrect" );

        },

        'check empty response, paginator disable' : function() {
            var css_pcont = 'yui3-pagview-container',
                css_disabled = 'yui3-pagview-disabled',
                pcont = Y.one('.'+css_pcont);

            var emptyFlag = false;
            this.dt.paginatorDSRequest = function(rqst) {
                if(emptyFlag)
                    rqst += "&empty=true";
                this.datasource.load({ request: rqst });
            };

            this.dt.processPageRequest(1);

            // move to page 4
            this.p.get('container').one('a[data-pglink="4"]').simulate('click');
            Assert.areSame( 4, this.m.get('page'), "expected page 4" );

            // set empty flag, and move to page 3
            emptyFlag = true;
            this.p.get('container').one('a[data-pglink="3"]').simulate('click');

            function sleep(msecs){
                var tstart = new Date().getTime();
                while( new Date().getTime() < tstart + msecs );
                return;
            }

            sleep(200);
            Assert.areSame( 0, this.m.get('totalItems'), "expected totalItems 0" );
            Assert.areSame( 1, this.m.get('page'), "expected page 1" );
            Assert.areSame( 1, this.m.get('totalPages'), "expected totalPages 1" );
            emptyFlag = false;
            this.dt.processPageRequest(2);
            sleep(200);
            Assert.areSame( 100, this.m.get('totalItems'), "expected totalItems 100" );
            Assert.areSame( 1, this.m.get('page'), "expected page 2" );
            Assert.areSame( 5, this.m.get('totalPages'), "expected totalPages 5" );


        }


    }));


//
// DataSource Pagination - ModelList pagination, via simulated remote .sync requests
//
    suite.add(new Y.Test.Case({
        name: 'Gallery DataTable-Paginator : remote (server-side) pagination via ModelList.sync',

        setUp : function () {

            var lobj = {

                nrec:  100,
                nchars: 5,

                dtconf: {
                    sortable: true,
                    paginator: new Y.PaginatorView({
                        model:      new Y.PaginatorModel({ itemsPerPage: 20 }),
                        container:  '#pagCont'
                    //    circular:   true
                    }),

                    //
                    //  Configure for "remote" requests (so it uses DS to process page requests),
                    //    and setup the DS request querystring
                    //
                    paginationSource: 'remote'
                }

            };

            this.dt = remoteMLTable(lobj);

            this.p  = this.dt.get('paginator');
            this.m  = this.dt.pagModel;

        },

        tearDown : function () {
            if(this.dt){
                this.dt.destroy();
                delete this.dt;
            }
        },

        'check DT pagination setup' : function() {
            Assert.isInstanceOf( Y.PaginatorView, this.p, "Paginator property is not a PaginatorView instance" );
            Assert.isInstanceOf( Y.PaginatorModel, this.m, "pagModel property is not a PaginatorModel instance" );

            this.dt.processPageRequest(1);

            Assert.areSame( 100, this.m.get('totalItems') );
            Assert.areSame( 20, this.m.get('itemsPerPage') );
            Assert.areSame( 5, this.m.get('totalPages') );
            Assert.areSame( 1, this.m.get('page') );
        },

        'check page 1 stats' : function() {
            this.dt.processPageRequest(1);

            var ipp  = this.m.get('itemsPerPage'),
                frec = this.dt.getRecord(0),
                lrec = this.dt.getRecord( this.dt.data.size()-1 );

            // check first record ...
            Assert.areSame( 1, frec.get('dint'), "first record dint is incorrect" );
            Assert.areSame( 990.9, frec.get('dflt'), "first record dint is incorrect" );
            Assert.areSame( 'Z', frec.get('dtxt'), "first record dtxt is incorrect" );

            // check last record ...
            Assert.areSame( ipp, lrec.get('dint'), "last record dint is incorrect" );
            Assert.areSame( 3804.46, lrec.get('dflt'), "last record dflt is incorrect" );
            Assert.areSame( 'WWWWW', lrec.get('dtxt'), "last record dtxt is incorrect" );

            Assert.areSame( 0, this.m.get('itemIndexStart'), "itemIndexStart incorrect" );
            Assert.areSame( ipp-1, this.m.get('itemIndexEnd'), "itemIndexEnd incorrect" );

            var ps = this.dt.get('paginationState');
            //Assert.areSame( {}, this.dt.get('paginationState') );

        },

        'check page 4 stats' : function() {

            // Go to Page 4 ...
            this.dt.processPageRequest(1);


            this.p.get('container').one('a[data-pglink="4"]').simulate('click');
            Assert.areSame( 4, this.m.get('page'), "expected page 4" );

            var ipp  = this.m.get('itemsPerPage'),
                frec = this.dt.getRecord(0),
                lrec = this.dt.getRecord(ipp-1);


            // check first record ...
            Assert.areSame( 61, frec.get('dint'), "first record dint is incorrect" );
            Assert.areSame( 12390.9, frec.get('dflt'), "first record dflt is incorrect" );
            Assert.areSame( 'N', frec.get('dtxt'), "first record dtxt is incorrect" );

            // check last record ...
            Assert.areSame( 80, lrec.get('dint'), "last record dint is incorrect" );
            Assert.areSame( 15204.46, lrec.get('dflt'), "last record dflt is incorrect" );
            Assert.areSame( 'KKKKK', lrec.get('dtxt'), "last record dtxt is incorrect" );

            Assert.areSame( 60, this.m.get('itemIndexStart'), "itemIndexStart incorrect" );
            Assert.areSame( 60+ipp-1, this.m.get('itemIndexEnd'), "itemIndexEnd incorrect" );

        },

        'check float sorting (dflt column) - Page 1' : function() {

            this.dt.processPageRequest(1);

            this.dt.set('sortBy',{dflt:'asc'} );

            var ipp  = this.m.get('itemsPerPage'),
                frec = this.dt.getRecord(0),
                lrec = this.dt.getRecord( this.dt.data.size()-1 );

            // check first record ...
            Assert.areSame( 5, frec.get('dint'), "first record dint is incorrect" );
            Assert.areSame( 954.46, frec.get('dflt'), "first record dflt is incorrect" );
            Assert.areSame( 'ZZZZZ', frec.get('dtxt'), "first record dtxt is incorrect" );

            // check last record ...
            Assert.areSame( 16, lrec.get('dint'), "last record dint is incorrect" );
            Assert.areSame( 3840.9, lrec.get('dflt'), "last record dflt is incorrect" );
            Assert.areSame( 'W', lrec.get('dtxt'), "last record dtxt is incorrect" );

        },

        'check text sorting (dtxt column) - Page 3' : function() {

            this.dt.processPageRequest(1);

            // sort by "dtxt" descending order ...
            this.dt.set('sortBy',{dtxt:'desc'} );

            // move to page 3
            this.p.get('container').one('a[data-pglink="3"]').simulate('click');
            Assert.areSame( 3, this.m.get('page'), "expected page 3" );
            Assert.areSame( 40, this.m.get('itemIndexStart'), "itemIndexStart is incorrect" );
            Assert.areSame( 59, this.m.get('itemIndexEnd'), "itemIndexEnd is incorrect" );

            var ipp  = this.m.get('itemsPerPage'),
                lrec = this.dt.getRecord( this.dt.data.size()-1),
                rec = this.dt.getRecord(3);

            // check fourth record ...
            Assert.areSame( 42, rec.get('dint'), "fourth record dint is incorrect" );
            Assert.areSame( 8581.79, rec.get('dflt'), "fourth record dflt is incorrect" );
            Assert.areSame( 'RR', rec.get('dtxt'), "fourth record dtxt is incorrect" );

            // check last record ...
            Assert.areSame( 56, lrec.get('dint'), "last record dint is incorrect" );
            Assert.areSame( 11440.9, lrec.get('dflt'), "last record dflt is incorrect" );
            Assert.areSame( 'O', lrec.get('dtxt'), "last record dtxt is incorrect" );

        },

        'check date sorting (ddate column) - Page 2' : function() {

            this.dt.processPageRequest(1);

            // sort by "ddate" ascending order ...
            // this.dt.set('sortBy','ddate' );   this fails !!!1, not sure why ...
            var th = this.dt.get('contentBox').one('.yui3-datatable-columns').one('th.yui3-datatable-col-ddate');
            //if(!th) return;
            th.simulate('click');

            // move to page 2
            this.p.get('container').one('a[data-pglink="2"]').simulate('click');
            Assert.areSame( 2, this.m.get('page'), "expected page 2" );
            Assert.areSame( 20, this.m.get('itemIndexStart'), "itemIndexStart is incorrect" );
            Assert.areSame( 39, this.m.get('itemIndexEnd'), "itemIndexEnd is incorrect" );

            var ipp  = this.m.get('itemsPerPage'),
                lrec = this.dt.getRecord( ipp-1 ),
                rec7 = this.dt.getRecord(6);

            // check sevent record ...
            Assert.areSame( 24, rec7.get('dint'), "seventh record dint is incorrect" );
            Assert.areSame( 4763.57, rec7.get('dflt'), "seventh record dflt is incorrect" );
            Assert.areSame( 'VVVV', rec7.get('dtxt'), "seventh record dtxt is incorrect" );

            // check last record ...
            Assert.areSame( 46, lrec.get('dint'), "last record dint is incorrect" );
            Assert.areSame( 9540.9, lrec.get('dflt'), "last record dflt is incorrect" );
            Assert.areSame( 'Q', lrec.get('dtxt'), "last record dtxt is incorrect" );

        }

    }));


    Y.Test.Runner.add(suite);

},'', { requires: [ 'test' ] });

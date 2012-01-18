YUI.add('gallery-datatable-350-preview-core', function (Y) {
/**
The core implementation of the `DataTable` and `DataTable.Base` Widgets.

Use this class extension with Widget or another Base-based superclass to create
the basic DataTable API and composing class structure.

Notable about this architecture is that rendering and UI event management for
the header, body, and footer of the table are deferred to configurable classes
in the `headerView`, `bodyView`, and `footerView` attributes.  In this extension
they have no default values, requiring implementers to supply their own classes
to render the table content.

@module datatable-core
**/

var INVALID = Y.Attribute.INVALID_VALUE,

    Lang         = Y.Lang,
    isFunction   = Lang.isFunction,
    isObject     = Lang.isObject,
    isArray      = Lang.isArray,
    isString     = Lang.isString,
    isNumber     = Lang.isNumber,
    fromTemplate = Lang.sub,

    toArray = Y.Array,

    keys = Y.Object.keys,

    Table;
    
// TODO: add this to Y.Object
function flatten(o) {
    var flat = {},
        key;

    for (key in o) {
        // Not doing a hasOwnProperty check on purpose
        flat[key] = o[key];
    }

    return flat;
}

/**
Class extension providing the core API and structure for the DataTable Widget.

@class DataTable.Core
**/
Table = Y.namespace('DataTable').Core = function () {};

Table.ATTRS = {
    /**
    Columns to include in the rendered table.
    
    If omitted, the attributes on the configured `recordType` or the first item
    in the `data` collection will be used as a source.

    This attribute takes an array of strings or objects (mixing the two is
    fine).  Each string or object is considered a column to be rendered.
    Strings are converted to objects, so `columns: ['first', 'last']` becomes
    `columns: [{ key: 'first' }, { key: 'last' }]`.

    DataTable.Core only concerns itself with the `key` property of columns.
    All other properties are for use by the `headerView`, `bodyView`,
    `footerView`, and any class extensions or plugins on the final class or
    instance. See the descriptions of the view classes and feature class
    extensions and plugins for details on the specific properties they read or
    add to column definitions.

    @attribute columns
    @type {Object[]|String[]}
    @default (from `recordType` ATTRS or first item in the `data`)
    **/
    columns: {
        // TODO: change to setter to coerce Columnset?
        validator: isArray,
        getter: '_getColumns'
    },

    /**
    Model subclass to use as the `model` for the ModelList stored in the `data`
    attribute.

    If not provided, it will try really hard to figure out what to use.  The
    following attempts will be made to set a default value:
    
    1. If the `data` attribute is set with a ModelList instance and its `model`
       property is set, that will be used.
    2. If the `data` attribute is set with a ModelList instance, and its
       `model` property is unset, but it is populated, the `ATTRS` of the
       `constructor of the first item will be used.
    3. If the `data` attribute is set with a non-empty array, a Model subclass
       will be generated using the keys of the first item as its `ATTRS` (see
       the `\_createRecordClass` method).
    4. If the `columns` attribute is set, a Model subclass will be generated
       using the columns defined with a `key`. This is least desirable because
       columns can be duplicated or nested in a way that's not parsable.
    5. If neither `data` nor `columns` is set or populated, a change event
       subscriber will listen for the first to be changed and try all over
       again.

    @attribute recordType
    @type {Function}
    @default (see description)
    **/
    recordType: {
        setter: '_setRecordType',
        writeOnce: true
    },

    /**
    The collection of data records to display.  This attribute is a pass
    through to a `data` property, which is a ModelList instance.

    If this attribute is passed a ModelList or subclass, it will be assigned to
    the property directly.  If an array of objects is passed, a new ModelList
    will be created using the configured `recordType` as its `model` property
    and seeded with the array.

    Retrieving this attribute will return the ModelList stored in the `data`
    property.

    @attribute data
    @type {ModelList|Object[]}
    @default `new ModelList()`
    **/
    data: {
        value : [],
        setter: '_setData',
        getter: '_getData'
    },

    /**
    The class or object to use for rendering the `<thead>` and column headers
    for the table.  This attribute is responsible for populating the the
    instance's `head` property.

    If a class constructor (function) is passed, an instance of that clas will
    be created at `render()` time and assigned to `this.head`.  If an object is
    passed, `head` will be set immediately.

    Valid objects or classes will have a `render()` method, though it is
    recommended that they be subclasses of `Y.Base` or `Y.View`.  If the object
    or class supports events, its `addTarget()` method will be called to bubble
    its events to this instance.

    The core implementaion does not define a default `headerView`.  Classes
    built from this extension should define a default.

    @attribute headerView
    @type {Function|Object}
    **/
    headerView: {
        validator: '_validateView',
        writeOnce: true
    },

    /**
    The class or object to use for rendering the `<tfoot>` and any relevant
    content for it.  This attribute is responsible for populating the the
    instance's `foot` property.

    If a class constructor (function) is passed, an instance of that clas will
    be created at `render()` time and assigned to `this.foot`.  If an object is
    passed, `foot` will be set immediately.

    Valid objects or classes will have a `render()` method, though it is
    recommended that they be subclasses of `Y.Base` or `Y.View`.  If the object
    or class supports events, its `addTarget()` method will be called to bubble
    its events to this instance.

    The core implementaion does not define a default `footerView`.  Classes
    built from this extension should define a default if appropriate.

    @attribute footerView
    @type {Function|Object}
    **/
    footerView: {
        validator: '_validateView',
        writeOnce: true
    },

    /**
    The class or object to use for rendering the `<tbody>` or `<tbody>`s and
    all data row content for the table.  This attribute is responsible for
    populating the the instance's `body` property.

    If a class constructor (function) is passed, an instance of that clas will
    be created at `render()` time and assigned to `this.body`.  If an object is
    passed, `body` will be set immediately.

    Valid objects or classes will have a `render()` method, though it is
    recommended that they be subclasses of `Y.Base` or `Y.View`.  If the object
    or class supports events, its `addTarget()` method will be called to bubble
    its events to this instance.

    The core implementaion does not define a default `bodyView`.  Classes
    built from this extension should define a default.

    @attribute bodyView
    @type {Function|Object}
    **/
    bodyView: {
        validator: '_validateView',
        writeOnce: true
    },

    /**
    Content for the `<table summary="ATTRIBUTE VALUE HERE">`.  Values assigned
    to this attribute will be HTML escaped for security.

    @attribute summary
    @type {String}
    @default '' (empty string)
    **/
    summary: {
        value: '',
        // For paranoid reasons, the value is escaped on its way in because
        // rendering can be based on string concatenation.
        setter: Y.Escape.html
    },

    /**
    HTML content of an optional `<caption>` element to appear above the table.
    Leave this config unset or set to a falsy value to remove the caption.

    @attribute caption
    @type HTML
    @default '' (empty string)
    **/
    caption: {
        value: ''
    },

    /**
    Deprecated as of 3.5.0. Passes through to the `data` attribute.

    WARNING: `get('recordset')` will NOT return a Recordset instance as of
    3.5.0.  This is a break in backward compatibility.

    @attribute recordset
    @type {Object[]|Recordset}
    @deprecated Use the `data` attribute
    **/
    recordset: {
        setter: '_setRecordset',
        getter: '_getRecordset'
    },

    /**
    Deprecated as of 3.5.0. Passes through to the `columns` attribute.

    If a Columnset object is passed, its raw object and array column data will
    be extracted for use.

    WARNING: `get('columnset')` will NOT return a Columnset instance as of
    3.5.0.  This is a break in backward compatibility.

    @attribute columnset
    @type {Object[]|Columnset}
    @deprecated Use the `columns` attribute
    **/
    columnset: {
        setter: '_setColumnset',
        getter: '_getColumnset'
    }
};

Y.mix(Table.prototype, {
    // -- Instance properties -------------------------------------------------

    /**
    The HTML template used to create the caption Node if the `caption`
    attribute is set.

    @property CAPTION_TEMPLATE
    @type {HTML}
    @default '<caption/>'
    **/
    CAPTION_TEMPLATE: '<caption/>',

    /**
    The HTML template used to create the table Node.

    @property TABLE_TEMPLATE
    @type {HTML}
    @default '<table/>'
    **/
    TABLE_TEMPLATE  : '<table class="{classes}"/>',

    /**
    HTML template used to create table's `<tbody>` if configured with a
    `bodyView`.

    @property TBODY_TEMPLATE
    @type {HTML}
    @default '<tbody class="{classes}"/>'
    **/
    TBODY_TEMPLATE: '<tbody class="{classes}"/>',

    /**
    Template used to create the table's `<tfoot>` if configured with a
    `footerView`.

    @property TFOOT_TEMPLATE
    @type {HTML}
    @default '<tfoot class="{classes}"/>'
    **/
    TFOOT_TEMPLATE:
        '<tfoot class="{classes}"/',

    /**
    Template used to create the table's `<thead>` if configured with a
    `headerView`.

    @property THEAD_TEMPLATE
    @type {HTML}
    @default '<thead class="{classes}"/>'
    **/
    THEAD_TEMPLATE:
        '<thead class="{classes}"/>',

    /**
    The object or instance of the class assigned to `bodyView` that is
    responsible for rendering and managing the table's `<tbody>`(s) and its
    content.

    @property body
    @type {Object}
    @default undefined (initially unset)
    **/
    //body: null,

    /**
    The object or instance of the class assigned to `footerView` that is
    responsible for rendering and managing the table's `<tfoot>` and its
    content.

    @property foot
    @type {Object}
    @default undefined (initially unset)
    **/
    //foot: null,

    /**
    The object or instance of the class assigned to `headerView` that is
    responsible for rendering and managing the table's `<thead>` and its
    content.

    @property head
    @type {Object}
    @default undefined (initially unset)
    **/
    //head: null,

    /**
    The ModelList that manages the table's data.

    @property data
    @type {ModelList}
    @default undefined (initially unset)
    **/
    //data: null,

    // -- Public methods ------------------------------------------------------

    /**
    Returns the Node for a cell at the given coordinates.

    Technically, this only relays to the `bodyView` instance's `getCell` method.
    If the `bodyView` doesn't have a `getCell` method, `undefined` is returned.

    @method getCell
    @param {Number} row Index of the cell's containing row
    @param {Number} col Index of the cell's containing column
    @return {Node}
    **/
    getCell: function (row, col) {
        return this.body && this.body.getCell && this.body.getCell(row, col);
    },

    /**
    Gets the column configuration object for the given key, name, or index.  For
    nested columns, `name` can be an array of indexes, each identifying the index
    of that column in the respective parent's "children" array.

    If you pass a column object, it will be returned.

    For columns with keys, you can also fetch the column with
    `instance.get('columns.foo')`.

    @method getColumn
    @param {String|Number|Number[]} name Key, "name", index, or index array to
                identify the column
    @return {Object} the column configuration object
    **/
    getColumn: function (name) {
        var col, columns, stack, entry, i, len, cols;

        if (isObject(name) && !isArray(name)) {
            // TODO: support getting a column from a DOM node - this will cross
            // the line into the View logic, so it should be relayed

            // Assume an object passed in is already a column def
            col = name;
        } else {
            col = this.get('columns.' + name);
        }

        if (col) {
            return col;
        }

        columns = this.get('columns');

        if (isNumber(name) || isArray(name)) {
            name = toArray(name);
            cols = columns;

            for (i = 0, len = name.length - 1; cols && i < len; ++i) {
                cols = cols[name[i]] && cols[name[i]].children;
            }

            return (cols && cols[i]) || null;
        } else if (isString(name)) {
            stack = [[columns, 0]];
            while (stack.length) {
                entry = stack[stack.length - 1];
                cols  = entry[0];
                for (i = entry[1], len = cols.length; i < len; ++i) {
                    col = cols[i];
                    // Only need to check against name because the initial
                    // col = get('columns.' + name) would get it from the key map
                    if (col.name === name) {
                        return col;
                    } else if (col.children) {
                        entry[1] = i + 1;
                        stack.push([col.children, 0]);
                        break;
                    }
                }

                if (i > len) {
                    stack.pop();
                }
            }
        }

        return null;
    },

    /**
    Returns the Node for a row at the given index.

    Technically, this only relays to the `bodyView` instance's `getRow` method.
    If the `bodyView` doesn't have a `getRow` method, `undefined` is returned.

    @method getRow
    @param {Number} index Index of the row in the data `<tbody>`
    @return {Node}
    **/
    getRow: function (index) {
        return this.body && this.body.getCell && this.body.getRow(index);
    },

    /**
    Updates the UI with the current attribute state.

    @method syncUI
    **/
    syncUI: function () {
        this._uiSetCaption(this.get('caption'));
        this._uiSetSummary(this.get('summary'));
    },

    // -- Protected and private properties and methods ------------------------

    /**
    Configuration object passed to the class constructor in `bodyView` during
    render.

    This property is set by the `\_initViewConfig` method at instantiation.

    @property _bodyConfig
    @type {Object}
    @default undefined (initially unset)
    @protected
    **/
    //_bodyConfig: null,

    /**
    A map of column key to column configuration objects parsed from the
    `columns` attribute.

    @property _columnMap
    @type {Object}
    @default undefined (initially unset)
    @protected
    **/
    //_columnMap: null,

    /**
    Configuration object passed to the class constructor in `footerView` during
    render.

    This property is set by the `\_initViewConfig` method at instantiation.

    @property _footerConfig
    @type {Object}
    @default undefined (initially unset)
    @protected
    **/
    //_footerConfig: null,

    /**
    Configuration object passed to the class constructor in `headerView` during
    render.

    This property is set by the `\_initViewConfig` method at instantiation.

    @property _headerConfig
    @type {Object}
    @default undefined (initially unset)
    @protected
    **/
    //_headerConfig: null,

    /**
    The Node instance of the table containing the data rows.  This is set when
    the table is rendered.  It may also be set by progressive enhancement,
    though this extension does not provide the logic to parse from source.

    @property _tableNode
    @type {Node}
    @default undefined (initially unset)
    @protected
    **/
    //_tableNode: null,

    /**
    Configuration object used as the prototype of `\_headerConfig`,
    `\_bodyConfig`, and `\_footerConfig`. Add properties to this object if you
    want them in all three of the other config objects.

    This property is set by the `\_initViewConfig` method at instantiation.

    @property _viewConfig
    @type {Object}
    @default undefined (initially unset)
    @protected
    **/
    //_viewConfig: null,

    /**
    Relays `captionChange` events to `\_uiSetCaption`.

    @method _afterCaptionChange
    @param {EventFacade} e The `captionChange` event object
    @protected
    **/
    _afterCaptionChange: function (e) {
        this._uiSetCaption(e.newVal);
    },

    /**
    Updates the `\_columnMap` property in response to changes in the `columns`
    attribute.

    @method _afterColumnsChange
    @param {EventFacade} e The `columnsChange` event object
    @protected
    **/
    _afterColumnsChange: function (e) {
        this._setColumnMap(e.newVal);
        this._setDisplayColumns(e.newVal);
    },

    /**
    Relays `summaryChange` events to `\_uiSetSummary`.

    @method _afterSummaryChange
    @param {EventFacade} e The `summaryChange` event object
    @protected
    **/
    _afterSummaryChange: function (e) {
        this._uiSetSummary(e.newVal);
    },

    /**
    Subscribes to attribute change events to update the UI.

    @method bindUI
    @protected
    **/
    bindUI: function () {
        // TODO: handle widget attribute changes
        this.after({
            captionChange: this._afterCaptionChange,
            summaryChange: this._afterSummaryChange
        });
    },

    /**
    Creates a Model subclass from an array of attribute names or an object of
    attribute definitions.  This is used to generate a class suitable to
    represent the data passed to the `data` attribute if no `recordType` is
    set.

    @method _createRecordClass
    @param {String[]|Object} attrs Names assigned to the Model subclass's
                `ATTRS` or its entire `ATTRS` definition object
    @return {Model}
    @protected
    **/
    _createRecordClass: function (attrs) {
        var ATTRS, i, len;

        if (isArray(attrs)) {
            ATTRS = {};

            for (i = 0, len = attrs.length; i < len; ++i) {
                ATTRS[attrs[i]] = {};
            }
        } else if (isObject(attrs)) {
            ATTRS = attrs;
        }

        return Y.Base.create('record', Y.Model, [], null, { ATTRS: ATTRS });
    },

    /**
    Creates the `<table>`.

    @method _createTable
    @return {Node} The `<table>` node
    @protected
    **/
    _createTable: function () {
        return Y.Node.create(fromTemplate(this.TABLE_TEMPLATE, {
            classes: this.getClassName('table')
        }));
    },

    /**
    Creates a `<tbody>` node from the `TBODY_TEMPLATE`.

    @method _createTBody
    @protected
    **/
    _createTBody: function () {
        return Y.Node.create(fromTemplate(this.TBODY_TEMPLATE, {
            classes: this.getClassName('data')
        }));
    },

    /**
    Creates a `<tfoot>` node from the `TFOOT_TEMPLATE`.

    @method _createTFoot
    @protected
    **/
    _createTFoot: function () {
        return Y.Node.create(fromTemplate(this.TFOOT_TEMPLATE, {
            classes: this.getClassName('footer')
        }));
    },

    /**
    Creates a `<thead>` node from the `THEAD_TEMPLATE`.

    @method _createTHead
    @protected
    **/
    _createTHead: function () {
        return Y.Node.create(fromTemplate(this.THEAD_TEMPLATE, {
            classes: this.getClassName('columns')
        }));
    },

    /**
    Calls `render()` on the `bodyView` class instance and inserts the view's
    container into the `<table>`.

    Assigns the instance's `body` property from `e.view` and the `_tbodyNode`
    from the view's `container` attribute.

    @method _defRenderBodyFn
    @param {EventFacade} e The renderBody event
    @protected
    **/
    _defRenderBodyFn: function (e) {
        e.view.render();

        this.body = e.view;
        this._tbodyNode = e.view.get('container');

        this._tableNode.append(this._tbodyNode);
    },

    /**
    Calls `render()` on the `footerView` class instance and inserts the view's
    container into the `<table>`.

    Assigns the instance's `foot` property from `e.view` and the `_tfootNode`
    from the view's `container` attribute.

    @method _defRenderFooterFn
    @param {EventFacade} e The renderFooter event
    @protected
    **/
    _defRenderFooterFn: function (e) {
        e.view.render();

        this.foot = e.view;
        this._tfootNode = e.view.get('container');

        this._tableNode.insertBefore(this._tfootNode,
            this._tableNode.one('> tbody'));
    },

    /**
    Calls `render()` on the `headerView` class instance and inserts the view's
    container into the `<table>`.

    Assigns the instance's `head` property from `e.view` and the `_theadNode`
    from the view's `container` attribute.

    @method _defRenderHeaderFn
    @param {EventFacade} e The renderHeader event
    @protected
    **/
    _defRenderHeaderFn: function (e) {
        e.view.render();

        this.head = e.view;
        this._theadNode = e.view.get('container');

        this._tableNode.insertBefore(this._theadNode,
            this._tableNode.one('> tfoot, > tbody'));
    },

    /**
    Renders the `<table>`, `<caption>`, and `<colgroup>`.

    Assigns the generated table to the `\_tableNode` property.

    @method _defRenderTableFn
    @param {EventFacade} e The renderTable event
    @protected
    **/
    _defRenderTableFn: function (e) {
        var view, config;

        this._tableNode = this._createTable();

        if (e.headerView) {
            config = flatten(e.headerConfig || {});
            config.container = this._createTHead();

            view = new e.headerView(config);
            view.addTarget(this);

            this.fire('renderHeader', { view: view });
        }

        if (e.footerView) {
            config = flatten(e.footerConfig || {});
            config.container = this._createTFoot();

            view = new e.footerView(config);
            view.addTarget(this);

            this.fire('renderFooter', { view: view });
        }

        if (e.bodyView) {
            config = flatten(e.bodyConfig || {});
            config.container = this._createTBody();

            view = new e.bodyView(config);
            view.addTarget(this);

            this.fire('renderBody', { view: view });
        }

    },

    /**
    Contains column configuration objects for those columns believed to be intended for display in the `<tbody>`. Populated by `\_setDisplayColumns`.

    @property _displayColumns
    @type {Object[]}
    @value undefined (initially not set)
    **/
    //_displayColumns: null,

    /**
    The getter for the `columns` attribute.  Returns the array of column
    configuration objects if `instance.get('columns')` is called, or the
    specific column object if `instance.get('columns.columnKey')` is called.

    @method _getColumns
    @param {Object[]} columns The full array of column objects
    @param {String} name The attribute name requested
                         (e.g. 'columns' or 'columns.foo');
    @protected
    **/
    _getColumns: function (columns, name) {
        // Workaround for an attribute oddity (ticket #2529254)
        // getter is expected to return an object if get('columns.foo') is called.
        // Note 'columns.' is 8 characters
        return name.length > 8 ? this._columnMap : columns;
    },

    /**
    Relays the `get()` request for the deprecated `columnset` attribute to the
    `columns` attribute.

    THIS BREAKS BACKWARD COMPATIBILITY.  3.4.1 and prior implementations will
    expect a Columnset instance returned from `get('columnset')`.

    @method _getColumnset
    @param {Object} ignored The current value stored in the `columnset` state
    @param {String} name The attribute name requested
                         (e.g. 'columnset' or 'columnset.foo');
    @deprecated This will be removed with the `columnset` attribute in a future
                version.
    @protected
    **/
    _getColumnset: function (_, name) {
        return this.get(name.replace(/^columnset/, 'columns'));
    },

    /**
    The getter for the `data` attribute.  Returns the ModelList stored in the
    `data` property.  If the ModelList is not yet set, it returns the current
    raw data (presumably an empty array or `undefined`).

    @method _getData
    @param {Object[]|ModelList} val The current data stored in the attribute
    @protected
    **/
    _getData: function (val) {
        return this.data || val;
    },

    /**
    Initializes the instance's `\_columnMap` from the configured `columns`
    attribute.  If `columns` is not set, but `recordType` is, it uses the
    `ATTRS` of that class.  If neither are set, it temporarily falls back to an
    empty array. `\_initRecordType` will call back into this method if it finds
    the `columnMap` empty.

    @method _initColumns
    @protected
    **/
    _initColumns: function () {
        var columns    = this.get('columns'),
            recordType = this.get('recordType');
        
        // Default column definition from the configured recordType
        if (!columns) {
            // TODO: merge superclass attributes up to Model?
            columns = (recordType && recordType.ATTRS) ?
                      keys(recordType.ATTRS) : [];

            this.set('columns', columns, { silent: true });
        }

        this._setColumnMap(columns);

        this._setDisplayColumns(columns);
    },

    /**
    Initializes the instance's `data` property from the value of the `data`
    attribute.  If the attribute value is a ModelList, it is assigned directly
    to `this.data`.  If it is an array, a ModelList is created, its `model`
    property is set to the configured `recordType` class, and it is seeded with
    the array data.  This ModelList is then assigned to `this.data`.

    @method _initData
    @protected
    **/
    _initData: function () {
        var data = this.get('data'),
            recordType, values;

        if (isArray(data)) {
            recordType = this.get('recordType');

            values = data;
            data = new Y.ModelList();

            // _initRecordType is run before this, so recordType will be set
            // if the data array had any records.  Otherwise, values is an
            // empty array, so no need to call reset();
            if (recordType) {
                data.model = recordType;
                data.reset(values, { silent: true });
            }

            // Make sure the attribute state object contains the ModelList.
            // TODO: maybe better would be to purge the attribute state value?
            this.set('data', data, { silent: true });
        }

        this.data = data;

        this.data.addTarget(this);
    },

    /**
    Publishes core events.

    @method _initEvents
    @protected
    **/
    _initEvents: function () {
        this.publish({
            // Y.bind used to allow late binding for method override support
            renderTable : {
                fireOnce: true,
                defaultFn: Y.bind('_defRenderTableFn', this)
            },
            renderHeader: {
                fireOnce: true,
                defaultFn: Y.bind('_defRenderHeaderFn', this)
            },
            renderBody  : {
                fireOnce: true,
                defaultFn: Y.bind('_defRenderBodyFn', this)
            },
            renderFooter: {
                fireOnce: true,
                defaultFn: Y.bind('_defRenderFooterFn', this)
            }
        });
    },

    /**
    Initializes the columns, `recordType` and data ModelList.

    @method initializer
    @protected
    **/
    initializer: function () {
        this._initColumns();

        this._initRecordType();

        this._initData();

        this._initViewConfig();

        this._initEvents();

        this.after('columnsChange', this._afterColumnsChange);
    },

    /**
    If the `recordType` attribute is not set, this method attempts to set a
    default value.

    It tries the following methods to determine a default:

    1. If the `data` attribute is set with a ModelList with a `model` property,
       that class is used.
    2. If the `data` attribute is set with a non-empty ModelList, the
       `constructor` of the first item is used.
    3. If the `data` attribute is set with a non-empty array and the first item
       is a Base subclass, its constructor is used.
    4. If the `data` attribute is set with a non-empty array a custom Model
       subclass is generated using the keys of the first item as its `ATTRS`.
    5. If the `_columnMap` property has keys, a custom Model subclass is
       generated using those keys as its `ATTRS`.

    Of none of those are successful, it subscribes to the change events for
    `columns`, `recordType`, and `data` to try again.

    If defaulting the `recordType` and the current `\_columnMap` property is
    empty, it will call `\_initColumns`.

    @method _initRecordType
    @protected
    **/
    _initRecordType: function () {
        var data, columns, recordType, handle;
            
        if (!this.get('recordType')) {
            data    = this.get('data');
            columns = this._columnMap;

            // Use the ModelList's specified Model class
            if (data.model) {
                recordType = data.model;

            // Or if not configured, use the construct of the first Model
            } else if (data.size && data.size()) {
                recordType = data.model = data.item(0).constructor;

            // Or if the data is an array, build a class from the first item
            } else if (isArray(data) && data.length) {
                recordType = (data[0].constructor.ATTRS) ?
                    data[0].constructor :
                    this._createRecordClass(keys(data[0]));

            // Or if the columns were defined, build a class from the keys
            } else if (keys(columns).length) {
                recordType = this._createRecordClass(keys(columns));
            }

            if (recordType) {
                this.set('recordType', recordType, { silent: true });

                if (!columns || !columns.length) {
                    this._initColumns();
                }
            } else {
                // FIXME: Edge case race condition with
                // new DT({ on/after: { <any of these changes> } }) OR
                // new DT().on( <any of these changes> )
                // where there's not enough info to assign this.data.model
                // at construction. The on/constructor subscriptions will be
                // executed before this subscription.
                handle = this.after(
                    ['columnsChange', 'recordTypeChange','dataChange'],
                    function (e) {
                        // manually batch detach rather than manage separate
                        // subs in case the change was inadequate to populate
                        // recordType. But subs must be detached because the
                        // subscriber recurses to _initRecordType, which would
                        // result in duplicate subs.
                        handle.detach();

                        if (!this.data.model) {
                            // FIXME: resubscribing if there's still not enough
                            // info to populate recordType will place the new
                            // subs later in the callback queue, opening the
                            // race condition even more.
                            this._initRecordType();

                            // If recordType isn't set yet, _initRecordType
                            // will have recreated this subscription.
                            this.data.model = this.get('recordType');
                        }
                    });
            }
        }
    },

    /**
    Initializes the `\_viewConfig`, `\_headerConfig`, `\_bodyConfig`, and
    `\_footerConfig` properties with the configuration objects that will be
    passed to the constructors of the `headerView`, `bodyView`, and
    `footerView`.
    
    Extensions can add to the config objects to deliver custom parameters at
    view instantiation.  `\_viewConfig` is used as the prototype of the other
    three config objects, so properties added here will be inherited by all
    configs.

    @method _initViewConfig
    @protected
    **/
    _initViewConfig: function () {
        this._viewConfig = {
            source   : this,
            cssPrefix: this._cssPrefix
        };

        // Use prototypal inheritance to share common configs from _viewConfig
        this._headerConfig = Y.Object(this._viewConfig);
        this._bodyConfig   = Y.Object(this._viewConfig);
        this._footerConfig = Y.Object(this._viewConfig);
    },

    /**
    Iterates the array of column configurations to capture all columns with a
    `key` property.  Columns that are represented as strings will be replaced
    with objects with the string assigned as the `key` property.  If a column
    has a `children` property, it will be iterated, adding any nested column
    keys to the returned map. There is no limit to the levels of nesting.

    The result is an object map with column keys as the property name and the
    corresponding column object as the associated value.

    @method _parseColumns
    @param {Object[]|String[]} columns The array of column names or
                configuration objects to scan
    @param {Object} [map] The map to add keyed columns to
    @protected
    **/
    _parseColumns: function (columns, map) {
        var i, len, col;

        map || (map = {});
        
        for (i = 0, len = columns.length; i < len; ++i) {
            col = columns[i];

            if (isString(col)) {
                // Update the array entry as well, so the attribute state array
                // contains the same objects.
                columns[i] = col = { key: col };
            }

            if (col.key) {
                map[col.key] = col;
            } else if (isArray(col.children)) {
                this._parseColumns(col.children, map);
            }
        }

        return map;
    },

    /**
    Builds the table and attaches it to the DOM.  This requires the host class
    to provide a `contentBox` attribute.  This is typically provided by Widget.

    @method renderUI
    @protected
    **/
    renderUI: function () {
        var contentBox = this.get('contentBox'),
            table;

        if (contentBox) {
            // _viewConfig is the prototype for _headerConfig et al.
            this._viewConfig.columns   = this.get('columns');
            this._viewConfig.modelList = this.data;

            this.fire('renderTable', {
                headerView  : this.get('headerView'),
                headerConfig: this._headerConfig,

                bodyView    : this.get('bodyView'),
                bodyConfig  : this._bodyConfig,

                footerView  : this.get('footerView'),
                footerConfig: this._footerConfig
            });

            table = this._tableNode;

            if (table) {
                // off DOM or in an existing node attached to a different parentNode
                if (!table.inDoc() || !table.ancestor().compareTo(contentBox)) {
                    contentBox.append(table);
                }
            } else { Y.log('Problem rendering DataTable: table not created', 'warn', 'datatable'); // On the same line to allow builder to strip the else clause
            }
        } else { Y.log('Problem rendering DataTable: contentBox not found', 'warn', 'datatable'); // On the same line to allow builder to strip the else clause
        }
    },

    /**
    Assigns the `\_columnMap` property with the parsed results of the array of
    column definitions passed.

    @method _setColumnMap
    @param {Object[]|String[]} columns the raw column configuration objects or
                                       key names
    @protected
    **/
    _setColumnMap: function (columns) {
        this._columnMap = this._parseColumns(columns);
    },

    /**
    Relays attribute assignments of the deprecated `columnset` attribute to the
    `columns` attribute.  If a Columnset is object is passed, its basic object
    structure is mined.

    @method _setColumnset
    @param {Array|Columnset} val The columnset value to relay
    @deprecated This will be removed with the deprecated `columnset` attribute
                in a later version.
    @protected
    **/
    _setColumnset: function (val) {
        if (val && val instanceof Y.Columnset) {
            val = val.get('definitions');
        }

        return isArray(val) ? val : INVALID;
    },

    /**
    Accepts an object with `each` and `getAttrs` (preferably a ModelList or
    subclass) or an array of data objects.  If an array is passes, it will
    create a ModelList to wrap the data.  In doing so, it will set the created
    ModelList's `model` property to the class in the `recordType` attribute,
    which will be defaulted if not yet set.

    If the `data` property is already set with a ModelList, passing an array as
    the value will call the ModelList's `reset()` method with that array rather
    than replacing the stored ModelList wholesale.

    Any non-ModelList-ish and non-array value is invalid.

    @method _setData
    @protected
    **/
    _setData: function (val) {
        if (val === null) {
            val = [];
        }

        if (isArray(val)) {
            if (this.data) {
                if (!this.data.model && val.length) {
                    // FIXME: this should happen only once, but this is a side
                    // effect in the setter.  Bad form, but I need the model set
                    // before calling reset()
                    this.set('recordType', keys(val[0]));
                }

                this.data.reset(val);
                // TODO: return true to avoid storing the data object both in
                // the state object underlying the attribute an in the data
                // property (decrease memory footprint)?
            }
            // else pass through the array data, but don't assign this.data
            // Let the _initData process clean up.
        } else if (val && val.each && val.getAttrs) {
            this.data = val;
            // TODO: return true to decrease memory footprint?
        } else {
            val = INVALID;
        }

        return val;
    },

    /**
    Stores an array of columns intended for display in the `\_displayColumns`
    property.  This method assumes that if a column configuration object does
    not have children, it is a display column.

    @method _setDisplayColumns
    @param {Object[]} columns Column config array to extract display columns from
    @protected
    **/
    _setDisplayColumns: function (columns) {
        function extract(cols) {
            var display = [],
                i, len, col;

            for (i = 0, len = cols.length; i < len; ++i) {
                col = cols[i];

                if (col.children) {
                    display.push.apply(display, extract(col.children));
                } else {
                    display.push(col);
                }
            }

            return display;
        }

        this._displayColumns = extract(columns);
    },

    /**
    Relays the value assigned to the deprecated `recordset` attribute to the
    `data` attribute.  If a Recordset instance is passed, the raw object data
    will be culled from it.

    @method _setRecordset
    @param {Object[]|Recordset} val The recordset value to relay
    @deprecated This will be removed with the deprecated `recordset` attribute
                in a later version.
    @protected
    **/
    _setRecordset: function (val) {
        var data;

        if (val && val instanceof Y.Recordset) {
            data = [];
            val.each(function (record) {
                data.push(record.get('data'));
            });
            val = data;
        }

        return val;
    },

    /**
    Accepts a Base subclass (preferably a Model subclass). Alternately, it will
    generate a custom Model subclass from an array of attribute names or an
    object defining attributes and their respective configurations (it is
    assigned as the `ATTRS` of the new class).

    Any other value is invalid.

    @method _setRecordType
    @param {Function|String[]|Object} val The Model subclass, array of
            attribute names, or the `ATTRS` definition for a custom model
            subclass
    @return {Function} A Base/Model subclass
    @protected
    **/
    _setRecordType: function (val) {
        var modelClass;

        // Duck type based on known/likely consumed APIs
        if (isFunction(val) && val.prototype.set && val.prototype.getAttrs) {
            modelClass = val;
        } else if (isObject(val)) {
            modelClass = this._createRecordClass(val);
        }

        return modelClass || INVALID;
    },

    /**
    Creates, removes, or updates the table's `<caption>` element per the input
    value.  Empty values result in the caption being removed.

    @method _uiSetCaption
    @param {HTML} htmlContent The content to populate the table caption
    @protected
    **/
    _uiSetCaption: function (htmlContent) {
        var caption = this._tableNode.one('> caption');

        if (htmlContent) {
            if (!this._captionNode) {
                this._captionNode = Y.Node.create(this.CAPTION_TEMPLATE);
            }

            this._captionNode.setContent(htmlContent);

            if (caption) {
                if (!caption.compareTo(this._captionNode)) {
                    caption.replace(this._captionNode);
                }
            } else {
                this._tableNode.prepend(this._captionNode);
            }

            this._captionNode = caption;
        } else {
            if (this._captionNode) {
                if (caption && caption.compareTo(this._captionNode)) {
                    caption = null;
                }

                this._captionNode.remove(true);
                delete this._captionNode;
            }

            if (caption) {
                caption.remove(true);
            }
        }
    },

    /**
    Updates the table's `summary` attribute with the input value.

    @method _uiSetSummary
    @protected
    **/
    _uiSetSummary: function (summary) {
        this._tableNode.setAttribute('summary', summary || '');
    },

    /**
    Sets the `boundingBox` and table width per the input value.

    @method _uiSetWidth
    @param {Number|String} width The width to make the table
    @protected
    **/
    _uiSetWidth: function (width) {
        if (isNumber(width)) {
            // DEF_UNIT from Widget
            width += this.DEF_UNIT;
        }

        if (isString(width)) {
            this._uiSetDim('width', width);
            this._tableNode.setStyle('width', width);
        }
    },

    /**
    Verifies the input value is a function with a `render` method on its
    prototype.  `null` is also accepted to remove the default View.

    @method _validateView
    @protected
    **/
    _validateView: function (val) {
        // TODO support View instances?
        return val === null || (isFunction(val) && val.prototype.render);
    }
});
}, '@VERSION@', { requires: ['model-list'] });

YUI.add('gallery-datatable-350-preview-head', function (Y) {
/**
View class responsible for rendering the `<thead>` section of a table. Used as
the default `headerView` for `Y.DataTable.Base` and `Y.DataTable` classes.

Translates the provided array of column configuration objects into a rendered
`<thead>` based on the data in those objects.
    

The structure of the column data is expected to be a single array of objects,
where each object corresponds to a `<th>`.  Those objects may contain a
`children` property containing a similarly structured array to indicate the
nested cells should be grouped under the parent column's colspan in a separate
row of header cells. E.g.

<pre><code>
new Y.DataTable.HeaderView({
  container: tableNode,
  columns: [
    { key: 'id' }, // no nesting
    { key: 'name', children: [
      { key: 'firstName', label: 'First' },
      { key: 'lastName',  label: 'Last' } ] }
  ]
}).render();
</code></pre>

This would translate to the following visualization:

<pre>
---------------------
|    |     name     |
|    |---------------
| id | First | Last |
---------------------
</pre>

Supported properties of the column objects include:

  * `label`    - The HTML content of the header cell.
  * `key`      - If `label` is not specified, the `key` is used for content.
  * `children` - Array of columns to appear below this column in the next
                 row.
  * `abbr`     - The content of the 'abbr' attribute of the `<th>`

Through the life of instantiation and rendering, the column objects will have
the following properties added to them:

  * `colspan` - To supply the `<th>` attribute
  * `rowspan` - To supply the `<th>` attribute
  * `parent`  - If the column is a child of another column, this points to
    its parent column
  * `_yuid`   - A unique YUI generated id used as the `<th>`'s 'id' for
    reference in the data `<td>`'s 'headers' attribute.

The column object is also used to provide values for {placeholder} tokens in the
instance's `CELL_TEMPLATE`, so you can modify the template and include other
column object properties to populate them.

@module datatable-head
@class HeaderView
@namespace DataTable
@extends View
**/
var Lang = Y.Lang,
    fromTemplate = Lang.sub,
    isArray = Lang.isArray,
    toArray = Y.Array,

    ClassNameManager = Y.ClassNameManager,
    _getClassName    = ClassNameManager.getClassName;

Y.namespace('DataTable').HeaderView = Y.Base.create('tableHeader', Y.View, [], {
    // -- Instance properties -------------------------------------------------

    /**
    Template used to create the table's header cell markup.  Override this to
    customize how these cells' markup is created.

    @property CELL_TEMPLATE
    @type {HTML}
    @default '<th id="{_yuid}" abbr="{abbr} colspan="{colspan}" rowspan="{rowspan}">{content}</th>'
    **/
    CELL_TEMPLATE :
        '<th id="{_yuid}" abbr="{abbr}" colspan="{colspan}" rowspan="{rowspan}">{content}</th>',

    /**
    The data representation of the header rows to render.  This is assigned by
    parsing the `columns` configuration array, and is used by the render()
    method.

    @property columns
    @type {Array[]}
    @default (initially unset)
    **/
    //TODO: should this be protected?
    //columns: null,

    /**
    The object that serves as the source of truth for column and row data.
    This property is assigned at instantiation from the `source` property of
    the configuration object passed to the constructor.

    @property source
    @type {Object}
    @default (initially unset)
    **/
    //TODO: should this be protected?
    //source: null,

    /**
    Template used to create the table's header row markup.  Override this to
    customize the row markup.

    @property ROW_TEMPLATE
    @type {HTML}
    @default '<tr>{content}</tr>'
    **/
    ROW_TEMPLATE:
        '<tr>{content}</tr>',


    // -- Public methods ------------------------------------------------------

    /**
    Builds a CSS class name from the provided tokens.  If the instance is
    created with `cssPrefix` or `source` in the configuration, it will use this
    prefix (the `\_cssPrefix` of the `source` object) as the base token.  This
    allows class instances to generate markup with class names that correspond
    to the parent class that is consuming them.

    @method getClassName
    @param {String} token* Any number of tokens to include in the class name
    @return {String} The generated class name
    **/
    getClassName: function () {
        var args = toArray(arguments);
        args.unshift(this._cssPrefix);
        args.push(true);

        return _getClassName.apply(ClassNameManager, args);
    },

    /**
    Creates the `<thead>` Node content by assembling markup generated by
    populating the `ROW\_TEMPLATE` and `CELL\_TEMPLATE` templates with content
    from the `columns` property.
    
    @method render
    @return {HeaderView} The instance
    @chainable
    **/
    render: function () {
        var thead    = this.get('container'),
            columns  = this.columns,
            defaults = {
                abbr: '',
                colspan: 1,
                rowspan: 1
            },
            i, len, j, jlen, col, html, content;

        if (thead && columns) {
            html = '';

            if (columns.length) {
                for (i = 0, len = columns.length; i < len; ++i) {
                    content = '';

                    for (j = 0, jlen = columns[i].length; j < jlen; ++j) {
                        col = columns[i][j];
                        content += fromTemplate(this.CELL_TEMPLATE,
                            Y.merge(
                                defaults,
                                col, {
                                    content: col.label ||
                                             col.key   ||
                                             ("Column " + (j + 1))
                                }
                            ));
                    }

                    html += fromTemplate(this.ROW_TEMPLATE, {
                        content: content
                    });
                }
            }

            thead.setContent(html);
        }

        this.bindUI();

        return this;
    },

    // -- Protected and private properties and methods ------------------------
    /**
    The base token for classes created with the `getClassName` method.

    @property _cssPrefix
    @type {String}
    @default 'yui3-table'
    @protected
    **/
    _cssPrefix: ClassNameManager.getClassName('table'),

    /**
    Handles changes in the source's columns attribute.  Redraws the headers.

    @method _afterColumnsChange
    @param {EventFacade} e The `columnsChange` event object
    @protected
    **/
    _afterColumnsChange: function (e) {
        this.columns = this._parseColumns(e.newVal);

        this.render();
    },

    /**
    Binds event subscriptions from the UI and the source (if assigned).

    @method bindUI
    @protected
    **/
    bindUI: function () {
        if (this.source && !this._eventHandles.columnsChange) {
            // TODO: How best to decouple this?
            this._eventHandles.columnsChange =
                this.source.after('columnsChange',
                    Y.bind('_afterColumnsChange', this));
        }
    },

    /**
    Destroys the instance.

    @method destructor
    @protected
    **/
    destructor: function () {
        (new Y.EventHandle(Y.Object.values(this._eventHandles))).detach();
    },

    /**
    Holds the event subscriptions needing to be detached when the instance is
    `destroy()`ed.

    @property _eventHandles
    @type {Object}
    @default undefined (initially unset)
    @protected
    **/
    //_eventHandles: null,

    /**
    Initializes the instance. Reads the following configuration properties:

      * `columns` - (REQUIRED) The initial column information
      * `cssPrefix` - The base string for classes generated by `getClassName`
      * `source` - The object to serve as source of truth for column info

    @method initializer
    @param {Object} config Configuration data
    @protected
    **/
    initializer: function (config) {
        config || (config = {});

        var cssPrefix = config.cssPrefix || (config.source || {}).cssPrefix;

        this.source  = config.source;
        this.columns = this._parseColumns(config.columns);

        this._eventHandles = [];

        if (cssPrefix) {
            this._cssPrefix = cssPrefix;
        }
    },

    /**
    Translate the input column format into a structure useful for rendering a
    `<thead>`, rows, and cells.  The structure of the input is expected to be a
    single array of objects, where each object corresponds to a `<th>`.  Those
    objects may contain a `children` property containing a similarly structured
    array to indicate the nested cells should be grouped under the parent
    column's colspan in a separate row of header cells. E.g.

    <pre><code>
    [
      { key: 'id' }, // no nesting
      { key: 'name', children: [
        { key: 'firstName', label: 'First' },
        { key: 'lastName',  label: 'Last' } ] }
    ]
    </code></pre>

    would indicate two header rows with the first column 'id' being assigned a
    `rowspan` of `2`, the 'name' column appearing in the first row with a
    `colspan` of `2`, and the 'firstName' and 'lastName' columns appearing in
    the second row, below the 'name' column.

    <pre>
    ---------------------
    |    |     name     |
    |    |---------------
    | id | First | Last |
    ---------------------
    </pre>

    Supported properties of the column objects include:

      * `label`    - The HTML content of the header cell.
      * `key`      - If `label` is not specified, the `key` is used for content.
      * `children` - Array of columns to appear below this column in the next
                     row.
      * `abbr`     - The content of the 'abbr' attribute of the `<th>`

    The output structure is basically a simulation of the `<thead>` structure
    with arrays for rows and objects for cells.  Column objects have the
    following properties added to them:
    
      * `colspan` - Per the `<th>` attribute
      * `rowspan` - Per the `<th>` attribute
      * `parent`  - If the column is a child of another column, this points to
        its parent column
      * `_yuid`   - A unique YUI generated id used as the `<th>`'s 'id' for
        reference in the data `<td>`'s 'headers' attribute.

    The column object is also used to provide values for {placeholder}
    replacement in the `CELL_TEMPLATE`, so you can modify the template and
    include other column object properties to populate them.

    @method _parseColumns
    @param {Object[]} data Array of column object data
    @return {Array[]} An array of arrays corresponding to the header row
            structure to render
    @protected
    **/
    _parseColumns: function (data) {
        var columns = [],
            stack = [],
            rowSpan = 1,
            entry, row, col, children, parent, i, len, j;
        
        if (isArray(data) && data.length) {
            // First pass, assign colspans and calculate row count for
            // non-nested headers' rowspan
            stack.push([data, -1]);

            while (stack.length) {
                entry = stack[stack.length - 1];
                row   = entry[0];
                i     = entry[1] + 1;

                for (len = row.length; i < len; ++i) {
                    col = row[i];
                    children = col.children;

                    Y.stamp(col);

                    if (isArray(children) && children.length) {
                        stack.push([children, -1]);
                        entry[1] = i;

                        rowSpan = Math.max(rowSpan, stack.length);

                        // break to let the while loop process the children
                        break;
                    } else {
                        col.colspan = 1;
                    }
                }

                if (i >= len) {
                    // All columns in this row are processed
                    if (stack.length > 1) {
                        entry  = stack[stack.length - 2];
                        parent = entry[0][entry[1]];

                        parent.colspan = 0;

                        for (i = 0, len = row.length; i < len; ++i) {
                            // Can't use .length because in 3+ rows, colspan
                            // needs to aggregate the colspans of children
                            parent.colspan += row[i].colspan;

                            // Assign the parent column for ease of navigation
                            row[i].parent = parent;
                        }
                    }
                    stack.pop();
                }
            }

            // Second pass, build row arrays and assign rowspan
            for (i = 0; i < rowSpan; ++i) {
                columns.push([]);
            }

            stack.push([data, -1]);

            while (stack.length) {
                entry = stack[stack.length - 1];
                row   = entry[0];
                i     = entry[1] + 1;

                for (len = row.length; i < len; ++i) {
                    col = row[i];
                    children = col.children;

                    columns[stack.length - 1].push(col);

                    entry[1] = i;

                    if (children && children.length) {
                        // parent cells must assume rowspan 1 (long story)

                        // break to let the while loop process the children
                        stack.push([children, -1]);
                        break;
                    } else {
                        // collect the IDs of parent cols
                        col.headers = [col._yuid];

                        for (j = stack.length - 2; j >= 0; --j) {
                            parent = stack[j][0][stack[j][1]];

                            col.headers.unshift(parent._yuid);
                        }

                        col.rowspan = rowSpan - stack.length + 1;
                    }
                }

                if (i >= len) {
                    // All columns in this row are processed
                    stack.pop();
                }
            }
        }

        return columns;
    }
});
}, '@VERSION@', { requires: ['view', 'gallery-datatable-350-preview-core'] });

YUI.add('gallery-datatable-350-preview-body', function (Y) {
/**
View class responsible for rendering the `<tbody>` section of a table. Used as
the default `bodyView` for `Y.DataTable.Base` and `Y.DataTable` classes.

Translates the provided `modelList` into a rendered `<tbody>` based on the data
in the constituent Models, altered or ammended by any special column
configurations.

The `columns` configuration, passed to the constructor, determines which
columns will be rendered.

The rendering process involves constructing an HTML template for a complete row
of data, built by concatenating a customized copy of the instance's
`CELL_TEMPLATE` into the `ROW_TEMPLATE` once for each column.  This template is
then populated with values from each Model in the `modelList`, aggregating a
complete HTML string of all row and column data.  A `<tbody>` Node is then created from the markup and any column `nodeFormatter`s are applied.

Supported properties of the column objects include:

  * `key` - Used to link a column to an attribute in a Model.
  * `name` - Used for columns that don't relate to an attribute in the Model
    (`formatter` or `nodeFormatter` only) if the implementer wants a
    predictable name to refer to in their CSS.
  * `formatter` - Used to customize or override the content value from the
    Model.  These do not have access to the cell or row Nodes and should
    return string (HTML) content.
  * `nodeFormatter` - Used to provide content for a cell as well as perform any
    custom modifications on the cell or row Node that could not be performed by
    `formatter`s.  Should be used sparingly for better performance.
  * `emptyCellValue` - String (HTML) value to use if the Model data for a
    column, or the content generated by a `formatter`, is the empty string or
    `undefined`.

Column `formatter`s are passed an object (`o`) with the following properties:

  * `value` - The current value of the column's associated attribute, if any.
  * `data` - An object map of Model keys to their current values.
  * `record` - The Model instance.
  * `column` - The column configuration object for the current column.
  * `classnames` - Initially empty string to allow `formatter`s to add CSS 
    classes to the cell's `<td>`.
  * `rowindex` - The zero-based row number.

They may return a value or update `o.value` to assign specific HTML content.  A
returned value has higher precedence.

Column `nodeFormatter`s are passed an object (`o`) with the following
properties:

  * `value` - The current value of the column's associated attribute, if any.
  * `td` - The `<td>` Node instance.
  * `cell` - The `<div>` liner Node instance if present, otherwise, the `<td>`.
    When adding content to the cell, prefer appending into this property.
  * `data` - An object map of Model keys to their current values.
  * `record` - The Model instance.
  * `column` - The column configuration object for the current column.
  * `rowindex` - The zero-based row number.

They are expected to inject content into the cell's Node directly, including
any "empty" cell content.  Each `nodeFormatter` will have access through the
Node API to all cells and rows in the `<tbody>`, but not to the `<table>`, as
it will not be attached yet.

If a `nodeFormatter` returns `false`, the `o.td` and `o.cell` Nodes will be
`destroy()`ed to remove them from the Node cache and free up memory.  The DOM
elements will remain as will any content added to them.  _It is highly
advisable to always return `false` from your `nodeFormatter`s_.

@module datatable-body
@class BodyView
@namespace DataTable
@extends View
**/
var Lang         = Y.Lang,
    isArray      = Lang.isArray,
    fromTemplate = Lang.sub,
    htmlEscape   = Y.Escape.html,
    toArray      = Y.Array,
    bind         = Y.bind,
    YObject      = Y.Object,

    ClassNameManager = Y.ClassNameManager,
    _getClassName    = ClassNameManager.getClassName;

Y.namespace('DataTable').BodyView = Y.Base.create('tableBody', Y.View, [], {
    // -- Instance properties -------------------------------------------------

    /**
    HTML template used to create table cells.

    @property CELL_TEMPLATE
    @type {HTML}
    @default '<td headers="{headers}" class="{classes}">{content}</td>'
    **/
    CELL_TEMPLATE: '<td headers="{headers}" class="{classes}">{content}</td>',

    /**
    CSS class applied to even rows.  This is assigned at instantiation after
    setting up the `\_cssPrefix` for the instance.
    
    For DataTable, this will be `yui3-datatable-even`.

    @property CLASS_EVEN
    @type {String}
    @default 'yui3-table-even'
    **/
    //CLASS_EVEN: null

    /**
    CSS class applied to odd rows.  This is assigned at instantiation after
    setting up the `\_cssPrefix` for the instance.
    
    When used by DataTable instances, this will be `yui3-datatable-odd`.

    @property CLASS_ODD
    @type {String}
    @default 'yui3-table-odd'
    **/
    //CLASS_ODD: null

    /**
    HTML template used to create table rows.

    @property ROW_TEMPLATE
    @type {HTML}
    @default '<tr id="{clientId}" class="{rowClasses}">{content}</tr>'
    **/
    ROW_TEMPLATE :
        '<tr role="row" id="{rowId}" class="{rowClasses}">' +
            '{content}' +
        '</tr>',

    /**
    The object that serves as the source of truth for column and row data.
    This property is assigned at instantiation from the `source` property of
    the configuration object passed to the constructor.

    @property source
    @type {Object}
    @default (initially unset)
    **/
    //TODO: should this be protected?
    //source: null,

    // -- Public methods ------------------------------------------------------

    /**
    Returns the `<td>` Node from the given row and column index.  If there is
    no cell at the given coordinates, `null` is returned.

    @method getCell
    @param {Number} row Zero based index of the row with the target cell
    @param {Number} col Zero based index of the column with the target cell
    @return {Node}
    **/
    getCell: function (row, col) {
        var el    = null,
            tbody = this.get('container');

        if (tbody) {
            el = tbody.getDOMNode().rows[+row];
            el && (el = el.cells[+col]);
        }
        
        return Y.one(el);
    },

    /**
    Builds a CSS class name from the provided tokens.  If the instance is
    created with `cssPrefix` or `source` in the configuration, it will use this
    prefix (the `\_cssPrefix` of the `source` object) as the base token.  This
    allows class instances to generate markup with class names that correspond
    to the parent class that is consuming them.

    @method getClassName
    @param {String} token* Any number of tokens to include in the class name
    @return {String} The generated class name
    **/
    getClassName: function () {
        var args = toArray(arguments);
        args.unshift(this._cssPrefix);
        args.push(true);

        return _getClassName.apply(ClassNameManager, args);
    },

    /**
    Returns the `<tr>` Node from the given row index.  If there is
    no row at the given index, `null` is returned.

    @method getRow
    @param {Number} row Zero based index of the row
    @return {Node}
    **/
    // TODO: Support index as clientId => container.one('> #' + index)?
    getRow: function (index) {
        var tbody = this.get('container');

        return Y.one(tbody && tbody.getDOMNode().rows[+index]);
    },

    /**
    Creates the table's `<tbody>` content by assembling markup generated by
    populating the `ROW\_TEMPLATE`, and `CELL\_TEMPLATE` templates with content
    from the `columns` property and `modelList` attribute.

    The rendering process happens in three stages:

    1. A row template is assembled from the `columns` property (see
       `\_createRowTemplate`)

    2. An HTML string is built up by concatening the application of the data in
       each Model in the `modelList` to the row template. For cells with
       `formatter`s, the function is called to generate cell content. Cells
       with `nodeFormatter`s are ignored. For all other cells, the data value
       from the Model attribute for the given column key is used.  The
       accumulated row markup is then inserted into the container.

    3. If any column is configured with a `nodeFormatter`, the `modelList` is
       iterated again to apply the `nodeFormatter`s.

    Supported properties of the column objects include:

      * `key` - Used to link a column to an attribute in a Model.
      * `name` - Used for columns that don't relate to an attribute in the Model
        (`formatter` or `nodeFormatter` only) if the implementer wants a
        predictable name to refer to in their CSS.
      * `formatter` - Used to customize or override the content value from the
        Model.  These do not have access to the cell or row Nodes and should
        return string (HTML) content.
      * `nodeFormatter` - Used to provide content for a cell as well as perform
        any custom modifications on the cell or row Node that could not be
        performed by `formatter`s.  Should be used sparingly for better
        performance.
      * `emptyCellValue` - String (HTML) value to use if the Model data for a
        column, or the content generated by a `formatter`, is the empty string
        or `undefined`.

    Column `formatter`s are passed an object (`o`) with the following
    properties:

      * `value` - The current value of the column's associated attribute, if
        any.
      * `data` - An object map of Model keys to their current values.
      * `record` - The Model instance.
      * `column` - The column configuration object for the current column.
      * `classnames` - Initially empty string to allow `formatter`s to add CSS 
        classes to the cell's `<td>`.
      * `rowindex` - The zero-based row number.

    They may return a value or update `o.value` to assign specific HTML
    content.  A returned value has higher precedence.

    Column `nodeFormatter`s are passed an object (`o`) with the following
    properties:

      * `value` - The current value of the column's associated attribute, if
        any.
      * `td` - The `<td>` Node instance.
      * `cell` - The `<div>` liner Node instance if present, otherwise, the
        `<td>`.  When adding content to the cell, prefer appending into this
        property.
      * `data` - An object map of Model keys to their current values.
      * `record` - The Model instance.
      * `column` - The column configuration object for the current column.
      * `rowindex` - The zero-based row number.

    They are expected to inject content into the cell's Node directly, including
    any "empty" cell content.  Each `nodeFormatter` will have access through the
    Node API to all cells and rows in the `<tbody>`, but not to the `<table>`,
    as it will not be attached yet.

    If a `nodeFormatter` returns `false`, the `o.td` and `o.cell` Nodes will be
    `destroy()`ed to remove them from the Node cache and free up memory.  The
    DOM elements will remain as will any content added to them.  _It is highly
    advisable to always return `false` from your `nodeFormatter`s_.

    @method render
    @return {BodyView} The instance
    @chainable
    **/
    render: function () {
        var tbody   = this.get('container'),
            data    = this.get('modelList'),
            columns = this.columns;

        // Needed for mutation
        this._createRowTemplate(columns);

        if (tbody && data) {
            tbody.setContent(this._createDataHTML(columns));

            this._applyNodeFormatters(tbody, columns);
        }

        this.bindUI();

        return this;
    },

    // -- Protected and private methods ---------------------------------------
    /**
    Handles changes in the source's columns attribute.  Redraws the table data.

    @method _afterColumnChange
    @param {EventFacade} e The `columnsChange` event object
    @protected
    **/
    // TODO: Preserve existing DOM
    // This will involve parsing and comparing the old and new column configs
    // and reacting to four types of changes:
    // 1. formatter, nodeFormatter, emptyCellValue changes
    // 2. column deletions
    // 3. column additions
    // 4. column moves (preserve cells)
    _afterColumnsChange: function (e) {
        this.columns = this._parseColumns(e.newVal);

        this.render();
    },
    
    /**
    Handles modelList changes, including additions, deletions, and updates.

    Modifies the existing table DOM accordingly.

    @method _afterDataChange
    @param {EventFacade} e The `change` event from the ModelList
    @protected
    **/
    _afterDataChange: function (e) {
        // Baseline view will just rerender the tbody entirely
        this.render();
    },

    /**
    Iterates the `modelList`, and calls any `nodeFormatter`s found in the
    `columns` param on the appropriate cell Nodes in the `tbody`.

    @method _applyNodeFormatters
    @param {Node} tbody The `<tbody>` Node whose columns to update
    @param {Object[]} columns The column configurations
    @protected
    **/
    _applyNodeFormatters: function (tbody, columns) {
        var source = this.source,
            data = this.get('modelList'),
            formatters = [],
            tbodyNode  = tbody.getDOMNode(),
            linerQuery = '.' + this.getClassName('liner'),
            i, len;

        // Only iterate the ModelList again if there are nodeFormatters
        for (i = 0, len = columns.length; i < len; ++i) {
            if (columns[i].nodeFormatter) {
                formatters.push(i);
            }
        }

        if (data && formatters.length) {
            data.each(function (record, index) {
                var formatterData = {
                        data      : record.getAttrs(),
                        record    : record,
                        rowindex  : index
                    },
                    row = tbodyNode.rows[index],
                    i, len, col, key, cell, keep;


                if (row) {
                    for (i = 0, len = formatters.length; i < len; ++i) {
                        cell = Y.one(row.cells[formatters[i]]);

                        if (cell) {
                            col = formatterData.column = columns[formatters[i]];
                            key = col.key || col._yuid;

                            formatterData.value = record.get(key);
                            formatterData.td    = cell;
                            formatterData.cell  = cell.one(linerQuery) || cell;

                            keep = col.nodeFormatter.call(source,formatterData);

                            if (keep === false) {
                                // Remove from the Node cache to reduce
                                // memory footprint.  This also purges events,
                                // which you shouldn't be scoping to a cell
                                // anyway.  You've been warned.  Incidentally,
                                // you should always return false. Just sayin.
                                cell.destroy(true);
                            }
                        }
                    }
                }
            });
        }
    },

    /**
    Binds event subscriptions from the UI and the source (if assigned).

    @method bindUI
    @protected
    **/
    bindUI: function () {
        var handles = this._eventHandles,
            data    = this.get('modelList');

        if (this.source && !handles.columnsChange) {
            handles.columnsChange =
                this.source.after('columnsChange',
                    bind('_afterColumnsChange', this));
        }

        if (!handles.dataChange) {
            handles.dataChange = 
                data.after(['*:change', 'add', 'remove', 'reset'],
                    bind('_afterDataChange', this));
        }
    },

    /**
    The base token for classes created with the `getClassName` method.

    @property _cssPrefix
    @type {String}
    @default 'yui3-table'
    @protected
    **/
    _cssPrefix: ClassNameManager.getClassName('table'),

    /**
    Iterates the `modelList` and applies each Model to the `\_rowTemplate`,
    allowing any column `formatter` or `emptyCellValue` to override cell
    content for the appropriate column.  The aggregated HTML string is
    returned.

    @method _createDataHTML
    @param {Object[]} columns The column configurations to customize the
                generated cell content or class names
    @return {HTML} The markup for all Models in the `modelList`, each applied
                to the `\_rowTemplate`
    @protected
    **/
    _createDataHTML: function (columns) {
        var data = this.get('modelList'),
            html = '';

        if (data) {
            data.each(function (model, index) {
                html += this._createRowHTML(model, index);
            }, this);
        }

        return html;
    },

    /**
    Applies the data of a given Model, modified by any column formatters and
    supplemented by other template values to the instance's `\_rowTemplate` (see
    `\_createRowTemplate`).  The generated string is then returned.

    The data from Model's attributes is fetched by `getAttrs` and this data
    object is appended with other properties to supply values to {placeholders}
    in the template.  For a template generated from a Model with 'foo' and 'bar'
    attributes, the data object would end up with the following properties
    before being used to populate the `\_rowTemplate`:

      * `clientID` - From Model, used the assign the `<tr>`'s 'id' attribute.
      * `foo` - The value to populate the 'foo' column cell content.  This
        value will be the result of the column's `formatter` if assigned, and
        will default from '' or `undefined` to the value of the column's
        `emptyCellValue` if assigned.
      * `bar` - Same for the 'bar' column cell content.
      * `foo-classes` - String of CSS classes to apply to the `<td>`.
      * `bar-classes` - Same.
      * `rowClasses`  - String of CSS classes to apply to the `<tr>`. This will
        default to the odd/even class per the specified index, but can be
        accessed and ammended by any column formatter via `o.data.rowClasses`.

    Because this object is available to formatters, any additional properties
    can be added to fill in custom {placeholders} in the `\_rowTemplate`.

    @method _createRowHTML
    @param {Model} model The Model instance to apply to the row template
    @param {Number} index The index the row will be appearing
    @return {HTML} The markup for the provided Model, less any `nodeFormatter`s
    @protected
    **/
    _createRowHTML: function (model, index) {
        var data    = model.getAttrs(),
            values  = {
                rowId: data.clientId,
                // TODO: Be consistent and change to row-classes? This could be
                // clobbered by a column named 'row'.
                rowClasses: (index % 2) ? this.CLASS_ODD : this.CLASS_EVEN
            },
            source  = this.source || this,
            columns = this.columns,
            i, len, col, token, value, formatterData;

        for (i = 0, len = columns.length; i < len; ++i) {
            col   = columns[i];
            value = data[col.key];
            token = col._renderToken || col.key || col._yuid;

            values[token + '-classes'] = '';

            if (col.formatter) {
                formatterData = {
                    value     : value,
                    data      : data,
                    column    : col,
                    record    : model,
                    classnames: '',
                    rowindex  : index
                };

                if (typeof col.formatter === 'string') {
                    // TODO: look for known formatters by string name
                    value = fromTemplate(col.formatter, formatterData);
                } else {
                    // Formatters can either return a value
                    value = col.formatter.call(source, formatterData);

                    // or update the value property of the data obj passed
                    if (value === undefined) {
                        value = formatterData.value;
                    }

                    values[token + '-classes'] = formatterData.classnames;
                }
            }

            if ((value === undefined || value === '')) {
                value = col.emptyCellValue || '';
            }

            values[token] = col.allowHTML ? value : htmlEscape(value);
        }

        return fromTemplate(this._rowTemplate, values);
    },

    /**
    Creates a custom HTML template string for use in generating the markup for
    individual table rows with {placeholder}s to capture data from the Models
    in the `modelList` attribute or from column `formatter`s.

    Assigns the `\_rowTemplate` property.

    @method _createRowTemplate
    @param {Object[]} columns Array of column configuration objects
    @protected
    **/
    _createRowTemplate: function (columns) {
        var html         = '',
            cellTemplate = this.CELL_TEMPLATE,
            tokens       = {},
            i, len, col, key, token, tokenValues;

        for (i = 0, len = columns.length; i < len; ++i) {
            col = columns[i];
            key = col.key;

            if (key) {
                if (tokens[key]) {
                    token = key + (tokens[key]++);
                } else {
                    token = key;
                    tokens[key] = 1;
                }
            } else {
                token = col.name || col._yuid;
            }

            col._renderToken = token;

            tokenValues = {
                content   : '{' + token + '}',
                headers   : col.headers.join(' '),
                // TODO: should this be getClassName(token)? Both?
                classes   : this.getClassName(key) + ' {' + token + '-classes}'
            };

            if (col.nodeFormatter) {
                // Defer all node decoration to the formatter
                tokenValues.content    = '';
                tokenValues.classes    = '';
            }

            html += fromTemplate(cellTemplate, tokenValues);
        }

        this._rowTemplate = fromTemplate(this.ROW_TEMPLATE, {
            content: html
        });
    },

    /**
    Destroys the instance.

    @method destructor
    @protected
    **/
    destructor: function () {
        (new Y.EventHandle(YObject.values(this._eventHandles))).detach();
    },

    /**
    Holds the event subscriptions needing to be detached when the instance is
    `destroy()`ed.

    @property _eventHandles
    @type {Object}
    @default undefined (initially unset)
    @protected
    **/
    //_eventHandles: null,

    /**
    Initializes the instance. Reads the following configuration properties in
    addition to the instance attributes:

      * `columns` - (REQUIRED) The initial column information
      * `cssPrefix` - The base string for classes generated by `getClassName`
      * `source` - The object to serve as source of truth for column info

    @method initializer
    @param {Object} config Configuration data
    @protected
    **/
    initializer: function (config) {
        var cssPrefix = config.cssPrefix || (config.source || {}).cssPrefix;

        this.source  = config.source;
        this.columns = this._parseColumns(config.columns);

        this._eventHandles = {};

        if (cssPrefix) {
            this._cssPrefix = cssPrefix;
        }

        this.CLASS_ODD  = this.getClassName('odd');
        this.CLASS_EVEN = this.getClassName('even');
    },

    /**
    Flattens an array of potentially nested column configurations into a single
    depth array of data columns.  Columns that have children are disregarded in
    favor of searching their child columns.  The resulting array corresponds 1:1
    with columns that will contain data in the `<tbody>`.

    @method _parseColumns
    @param {Object[]} data Array of unfiltered column configuration objects
    @param {Object[]} columns Working array of data columns. Used for recursion.
    @return {Object[]} Only those columns that will be rendered.
    @protected
    **/
    _parseColumns: function (data, columns) {
        var col, i, len;
        
        columns || (columns = []);

        if (isArray(data) && data.length) {
            for (i = 0, len = data.length; i < len; ++i) {
                col = data[i];

                if (typeof col === 'string') {
                    col = { key: col };
                }

                if (col.key || col.formatter || col.nodeFormatter) {
                    col.index = columns.length;
                    columns.push(col);
                } else if (col.children) {
                    this._parseColumns(col.children, columns);
                }
            }
        }

        return columns;
    }

    /**
    The HTML template used to create a full row of markup for a single Model in
    the `modelList` plus any customizations defined in the column
    configurations.

    @property _rowTemplate
    @type {HTML}
    @default (initially unset)
    @protected
    **/
    //_rowTemplate: null
});
}, '@VERSION@', { requires: ['view', 'gallery-datatable-350-preview-core'] });

YUI.add('gallery-datatable-350-preview-base', function (Y) {
/**
A Widget for displaying tabular data.  The base implementation of DataTable
provides the ability to dynamically generate an HTML table from a set of column
configurations and row data.

Two classes are included in the `datatable-base` module:

1. `Y.DataTable` - Main instantiable class, has all loaded features available
2. `Y.DataTable.Base` - Featureless version for use primarily as a superclass.

Example usage might look like this:

<pre><code>
// Featureless table, usually used as a subclass, but can be instantiated
var table = new Y.DataTable.Base({
    columns: ['firstName', 'lastName', 'age'],
    data: [
        { firstName: 'Frank', lastName: 'Zappa', age: 71 },
        { firstName: 'Frank', lastName: 'Lloyd Wright', age: 144 },
        { firstName: 'Albert', lastName: 'Einstein', age: 132 },
        ...
    ]
});

table.render('#in-here');

// Table with all loaded features available (not .Base)
// The functionality of this table would require additional modules be use()d,
// but the feature APIs are aggregated onto Y.DataTable.
// (Snippet is for illustration. Not all features are available today.)
var table = new Y.DataTable({
    columns: [
        { type: 'checkbox', defaultChecked: true },
        { key: 'firstName', sortable: true, resizable: true },
        { key: 'lastName', sortable: true },
        { key: 'role', formatter: toRoleName }
    ],
    data: {
        source: 'http://myserver.com/service/json',
        type: 'json',
        schema: {
            resultListLocator: 'results.users',
            fields: [
                'username',
                'firstName',
                'lastName',
                { key: 'role', type: 'number' }
            ]
        }
    },
    recordType: UserModel,
    pagedData: {
        location: 'footer',
        pageSizes: [20, 50, 'all'],
        rowsPerPage: 20,
        pageLinks: 5
    },
    editable: true,
    filterable: true
});
</code></pre>

### Column Configuration

The column configurations are set in the form of an array of objects, where
each object corresponds to a column.  For columns populated directly from the
row data, a 'key' property is required to bind the column to that property or
attribute in the row data.

Not all columns need to relate to row data, nor do all properties or attributes
of the row data need to have a corresponding column.  However, only those
columns included in the `columns` configuration attribute will be rendered.

Other column configuration properties are supported by the configured
`headerView`, `bodyView`, `footerView` classes as well as any features added by
plugins or class extensions.  See the description of DataTable.HeaderView,
DataTable.BodyView, and other DataTable feature classes to see what column
properties they support.

Some examples of column configurations would be:

<pre><code>
// Basic
var columns = [{ key: 'firstName' }, { key: 'lastName' }, { key: 'age' }];

// For columns without any additional configuration, strings can be used
var columns = ['firstName', 'lastName', 'age'];

// Multi-row column headers (see DataTable.HeaderView for details)
var columns = [
    {
        label: 'Name',
        children: [
            { key: 'firstName' },
            { key: 'lastName' }
        ]
    },
    'age' // mixing and matching objects and strings is ok
];

// Including columns that are not related 1:1 to row data fields/attributes
// (See DataTable.BodyView for details)
var columns = [
    {
        label: 'Name', // Needed for the column header
        formatter: function (o) {
            // Fill the column cells with data from firstName and lastName
            if (o.data.age > 55) {
                o.classnames += ' senior';
            }
            return o.data.lastName + ', ' + o.data.firstName;
        }
    },
    'age'
];

// Columns that include feature configurations (for illustration; not all
// features are available today).
var columns = [
    { type: 'checkbox', defaultChecked: true },
    { key: 'firstName', sortable: true, resizable: true, min-width: '300px' },
    { key: 'lastName', sortable: true, resizable: true, min-width: '300px' },
    { key: 'age', emptyCellValue: '<em>unknown</em>' }
];
</code></pre>

### Row Data Configuration

The `data` configuration attribute is responsible for housing the data objects that will be rendered as rows.  You can provide this information in two ways by default:

1. An array of simple objects with key:value pairs
2. A ModelList of Base-based class instances (presumably Model subclass
   instances)

If an array of objects is passed, it will be translated into a ModelList filled
with instances of the class provided to the `recordType` attribute.  This
attribute can also create a custom Model subclass from an array of field names
or an object of attribute configurations.  If no `recordType` is provided, one
will be created for you from available information (see `_initRecordType`).
Providing either your own ModelList instance for `data`, or at least Model
class for `recordType`, is the best way to control client-server
synchronization when modifying data on the client side.

The ModelList instance that manages the table's data is available in the `data`
property on the DataTable instance.


### Rendering

Table rendering is a collaborative process between the DataTable and its
configured `headerView`, `bodyView`, and `footerView`.  The DataTable renders
the `<table>` and `<caption>`, but the contents of the table are delegated to
instances of the classes provided to the `headerView`, `bodyView`, and
`footerView` attributes. If any of these attributes is unset, that portion of
the table won't be rendered.

DataTable.Base assigns the default `headerView` to `Y.DataTable.HeaderView` and
the default `bodyView` to `Y.DataTable.BodyView`, though either can be
overridden for custom rendering.  No default `footerView` is assigned. See
those classes for more details about how they operate.

@module datatable-base
@main
**/

// DataTable API docs included before DataTable.Base to make yuidoc work
/**
A Widget for displaying tabular data.  Before feature modules are `use()`d,
this class is functionally equivalent to DataTable.Base.  However, feature
modules can modify this class in non-destructive ways, expanding the API and
functionality.

This is the primary DataTable class.  Out of the box, it provides the ability
to dynamically generate an HTML table from a set of column configurations and
row data.  But feature module inclusion can add table sorting, pagintaion,
highlighting, selection, and more.

<pre><code>
// Basic use
var table = new Y.DataTable({
    columns: ['firstName', 'lastName', 'age'],
    data: [
        { firstName: 'Frank', lastName: 'Zappa', age: 71 },
        { firstName: 'Frank', lastName: 'Lloyd Wright', age: 144 },
        { firstName: 'Albert', lastName: 'Einstein', age: 132 },
        ...
    ]
});

table.render('#in-here');

// Table with loaded features.
// The functionality of this table would require additional modules be use()d,
// but the feature APIs are aggregated onto Y.DataTable.
// (Snippet is for illustration. Not all features are available today.)
var table = new Y.DataTable({
    columns: [
        { type: 'checkbox', defaultChecked: true },
        { key: 'firstName', sortable: true, resizable: true },
        { key: 'lastName', sortable: true },
        { key: 'role', formatter: toRoleName }
    ],
    data: {
        source: 'http://myserver.com/service/json',
        type: 'json',
        schema: {
            resultListLocator: 'results.users',
            fields: [
                'username',
                'firstName',
                'lastName',
                { key: 'role', type: 'number' }
            ]
        }
    },
    recordType: UserModel,
    pagedData: {
        location: 'footer',
        pageSizes: [20, 50, 'all'],
        rowsPerPage: 20,
        pageLinks: 5
    },
    editable: true,
    filterable: true
});
</code></pre>

@class DataTable
@extends DataTable.Base
**/

// DataTable API docs included before DataTable.Base to make yuidoc work
/**
The baseline implementation of a DataTable.  This class should be used
primarily as a superclass for a custom DataTable with a specific set of
features.  Because features can be composed onto `Y.DataTable`, custom
subclasses of DataTable.Base will remain unmodified when new feature modules
are loaded.

DataTable.Base is built from DataTable.Core, and sets the default `headerView`
to `Y.DataTable.HeaderView` and default `bodyView` to `Y.DataTable.BodyView`.

@class Base
@extends Widget
@uses DataTable.Core
@namespace DataTable
**/
Y.DataTable.Base = Y.Base.create('datatable', Y.Widget, [Y.DataTable.Core],
    null, {
        ATTRS: {
            // Default head and body views
            headerView: { value: Y.DataTable.HeaderView },
            bodyView  : { value: Y.DataTable.BodyView }
        }
    });

// The DataTable API docs are above DataTable.Base docs.
Y.DataTable = Y.mix(
    Y.Base.create('datatable', Y.DataTable.Base, []), // Create the class
    Y.DataTable); // Migrate static and namespaced classes
}, '@VERSION@', { requires: ['model-list', 'view', 'base-build', 'widget', 'escape', 'gallery-datatable-350-preview-core'] });

YUI.add('gallery-datatable-350-preview-mutable', function (Y) {
var toArray = Y.Array,
    YLang   = Y.Lang,
    isString = YLang.isString,
    isArray  = YLang.isArray,
    isObject = YLang.isObject,
    isNumber = YLang.isNumber,
    arrayIndex = Y.Array.indexOf,
    Mutable;

/**
Adds mutation convenience methods to `Y.DataTable` (or other built class).

Column mutation methods are paired with new custom events:

 * addColumn
 * removeColumn
 * modifyColumn
 * moveColumn

Row mutation events are bubbled from the DataTable's `data` ModelList through
the DataTable instance.

@module datatable-mutable
@class DataTable.Mutable
@for DataTable
**/

Y.namespace('DataTable').Mutable = Mutable = function () {};

Y.mix(Mutable.prototype, {
    /**
    Adds the column configuration to the DataTable's `columns` configuration.
    If the `index` parameter is supplied, it is injected at that index.  If the
    table has nested headers, inject a subcolumn by passing an array of indexes
    to identify the new column's final location.

    The `index` parameter is required if adding a nested column.

    This method is a convienience method for fetching the DataTable's `columns`
    attribute, updating it, and calling 
    `table.set('columns', _updatedColumnsDefs_)`

    @example
    // Becomes last column
    table.addColumn('name');

    // Inserted after the current second column, moving the current third column
    // to index 4
    table.addColumn({ key: 'price', formatter: currencyFormatter }, 2 );

    // Insert a new column in a set of headers three rows deep.  The index array
    // translates to
    // [ 2, --  in the third column's children
    //   1, --  in the second child's children
    //   3 ] -- as the fourth child column
    table.addColumn({ key: 'age', sortable: true }, [ 2, 1, 3 ]);

    @method addColumn
    @param {Object|String} config The new column configuration object
    @param {Number|Number[]} [index] the insertion index
    @return {DataTable}
    @chainable
    **/
    addColumn: function (config, index) {
        if (isString(config)) {
            config = { key: config };
        }

        if (config) {
            if (arguments.length < 2 || (!isNumber(index) && !isArray(index))) {
                index = this.get('columns').length;
            }

            this.fire('addColumn', {
                column: config,
                index: index
            });
        }
        return this;
    },

    /**
    Updates an existing column definition. Fires the `modifyColumn` event.

    @example
    // Add a formatter to the existing 'price' column definition
    table.modifyColumn('price', { formatter: currencyFormatter });

    // Change the label on a header cell in a set of nested headers three rows
    // deep.  The index array translates to
    // [ 2,  -- in the third column's children
    //   1,  -- the second child
    //   3 ] -- the fourth child column
    table.modifyColumn([2, 1, 3], { label: 'Experience' });

    @method modifyColumn
    @param {String|Number|Number[]|Object} name The column key, name, index, or
                current configuration object
    @param {Object} config The new column configuration properties
    @return {DataTable}
    @chainable
    **/
    modifyColumn: function (name, config) {
        if (isString(config)) {
            config = { key: config };
        }

        if (isObject(config)) {
            this.fire('modifyColumn', {
                column: name,
                newColumnDef: config
            });
        }

        return this;
    },

    /**
    Moves an existing column to a new location. Fires the `moveColumn` event.

    The destination index can be a number or array of numbers to place a column
    header in a nested header row.

    @method moveColumn
    @param {String|Number|Number[]|Object} name The column key, name, index, or
                current configuration object
    @param {Number|Number[]} index The destination index of the column
    @return {DataTable}
    @chainable
    **/
    moveColumn: function (name, index) {
        if (name && (isNumber(index) || isArray(index))) {
            this.fire('moveColumn', {
                column: name,
                index: index
            });
        }

        return this;
    },

    /**
    Removes an existing column. Fires the `removeColumn` event.

    @method removeColumn
    @param {String|Number|Number[]|Object} name The column key, name, index, or
                current configuration object
    @return {DataTable}
    @chainable
    **/
    removeColumn: function (name) {
        if (name) {
            this.fire('removeColumn', {
                column: name
            });
        }

        return this;
    },

    /**
    Adds a new record to the DataTable's `data` ModelList.  Record data can be
    an object of field values or an instance of the DataTable's configured
    `recordType` class.

    This relays all parameters to the `data` ModelList's `add` method.

    @method addRow
    @param {Object} data The data or Model instance for the new record
    @return {DataTable}
    @chainable
    **/
    addRow: function () {
        if (this.data) {
            this.data.add.apply(this.data, arguments);
        }

        return this;
    },

    /**
    Removes a record from the DataTable's `data` ModelList.  The record can be
    provided explicitly or targeted by it's `id` (see ModelList's `getById`
    method), `clientId`, or index in the ModelList.

    After locating the target Model, this relays the Model and all other passed
    arguments to the `data` ModelList's `remove` method.

    @method removeRow
    @param {Object|String|Number} id The Model instance or identifier 
    @return {DataTable}
    @chainable
    **/
    removeRow: function (id) {
        var modelList = this.data,
            model;

        // TODO: support removing via DOM element. This should be relayed to View
        if (isObject(id) && id instanceof this.get('recordType')) {
            model = id;
        } else if (modelList && id !== undefined) {
            model = modelList.getById(id) ||
                    modelList.getByClientId(id) ||
                    modelList.item(id);
        }

        if (model) {
            modelList.remove.apply(modelList,
                [model].concat(toArray(arguments, 1, true)));
        }

        return this;
    },

    /**
    Updates an existing record in the DataTable's `data` ModelList.  The record
    can be provided explicitly or targeted by it's `id` (see ModelList's
    `getById` method), `clientId`, or index in the ModelList.

    After locating the target Model, this relays the all other passed
    arguments to the Model's `setAttrs` method.

    @method modifyRow
    @param {Object|String|Number} id The Model instance or identifier 
    @return {DataTable}
    @chainable
    **/
    modifyRow: function (id, data) {
        var modelList = this.data,
            model;

        if (isObject(id) && id instanceof this.get('recordType')) {
            model = id;
        } else if (modelList && id !== undefined) {
            model = modelList.getById(id) ||
                    modelList.getByClientId(id) ||
                    modelList.item(id);
        }

        if (model && isObject(data)) {
            model.setAttrs.apply(model, toArray(arguments, 1, true));
        }

        return this;
    },

    // --------------------------------------------------------------------------
    // Protected properties and methods
    // --------------------------------------------------------------------------

    /**
    Default function for the `addColumn` event.

    Inserts the specified column at the provided index.

    @method _defAddColumnFn
    @param {EventFacade} e The `addColumn` event
        @param {Object} e.column The new column definition object
        @param {Number|Number[]} e.index The array index to insert the new column
    @protected
    **/
    _defAddColumnFn: function (e) {
        var index   = toArray(e.index),
            columns = this.get('columns'),
            cols    = columns,
            i, len;

        for (i = 0, len = index.length - 1; cols && i < len; ++i) {
            cols = cols[index[i]] && cols[index[i]].children;
        }

        if (cols) {
            cols.splice(index[i], 0, e.column);

            this.set('columns', columns, { originEvent: e });
        } else { Y.log('addColumn index not findable', 'warn', 'datatable');
        }
    },

    /**
    Default function for the `modifyColumn` event.

    Mixes the new column properties into the specified column definition.

    @method _defModifyColumnFn
    @param {EventFacade} e The `modifyColumn` event
        @param {Object|String|Number|Number[]} e.column The column definition object or identifier
        @param {Object} e.newColumnDef The properties to assign to the column
    @protected
    **/
    _defModifyColumnFn: function (e) {
        var columns = this.get('columns'),
            column  = this.getColumn(e.column);

        if (column) {
            Y.mix(column, e.newColumnDef, true);
            
            this.set('columns', columns, { originEvent: e });
        } else { Y.log('Could not locate column index to modify column', 'warn', 'datatable');
        }
    },

    /**
    Default function for the `moveColumn` event.

    Removes the specified column from its current location and inserts it at the
    specified array index (may be an array of indexes for nested headers).

    @method _defMoveColumnFn
    @param {EventFacade} e The `moveColumn` event
        @param {Object|String|Number|Number[]} e.column The column definition object or identifier
        @param {Object} e.index The destination index to move to
    @protected
    **/
    _defMoveColumnFn: function (e) {
        var columns = this.get('columns'),
            column  = this.getColumn(e.column),
            toIndex = toArray(e.index),
            fromCols, fromIndex, toCols, i, len;

        if (column) {
            fromCols  = column.parent ? column.parent.children : columns;
            fromIndex = arrayIndex(fromCols, column);

            if (fromIndex > -1) {
                toCols = columns;

                for (i = 0, len = toIndex.length - 1; toCols && i < len; ++i) {
                    toCols = toCols[i] && toCols[i].children;
                }

                if (toCols) {
                    fromCols.splice(fromIndex, 1);
                    toCols.splice(toIndex[i], 1, column);

                    this.set('columns', columns, { originEvent: e });
                } else { Y.log('Column [' + e.column + '] could not be moved. Destination index invalid for moveColumn', 'warn', 'datatable');
                }
            }
        } else { Y.log('Column [' + e.column + '] not found for moveColumn', 'warn', 'datatable');
        }
    },

    /**
    Default function for the `removeColumn` event.

    Splices the specified column from its containing columns array.

    @method _defRemoveColumnFn
    @param {EventFacade} e The `removeColumn` event
        @param {Object|String|Number|Number[]} e.column The column definition object or identifier
    @protected
    **/
    _defRemoveColumnFn: function (e) {
        var columns = this.get('columns'),
            column  = this.getColumn(e.column),
            cols, index;

        if (column) {
            cols = column.parent ? column.parent.children : columns;
            index = Y.Array.indexOf(cols, column);

            if (index > -1) {
                cols.splice(index, 1);

                this.set('columns', columns, { originEvent: e });
            }
        } else { Y.log('Could not locate column [' + e.column + '] for removeColumn', 'warn', 'datatable');
        }
    },

    /**
    Publishes the events used by the mutation methods:

     * addColumn
     * removeColumn
     * modifyColumn
     * moveColumn

    @method initializer
    @protected
    **/
    initializer: function () {
        this.publish({
            addColumn:    { defaultFn: Y.bind('_defAddColumnFn', this) },
            removeColumn: { defaultFn: Y.bind('_defRemoveColumnFn', this) },
            moveColumn:   { defaultFn: Y.bind('_defMoveColumnFn', this) },
            modifyColumn: { defaultFn: Y.bind('_defModifyColumnFn', this) }
        });
    }
});

/**
Adds an array of new records to the DataTable's `data` ModelList.  Record data
can be an array of objects containing field values or an array of instance of
the DataTable's configured `recordType` class.

This relays all parameters to the `data` ModelList's `add` method.

Technically, this is an alias to `addRow`, but please use the appropriately
named method for readability.

@method addRows
@param {Object[]} data The data or Model instances to add
@return {DataTable}
@chainable
**/
Mutable.prototype.addRows = Mutable.prototype.addRow;

// Add feature APIs to public Y.DataTable class
if (YLang.isFunction(Y.DataTable)) {
    Y.Base.mix(Y.DataTable, [Mutable]);
}

/**
Fired by the `addColumn` method.

@event addColumn
@preventable _defAddColumnFn
@param {Object} column The new column definition object
@param {Number|Number[]} index The array index to insert the new column
**/

/**
Fired by the `removeColumn` method.

@event removeColumn
@preventable _defRemoveColumnFn
@param {Object|String|Number|Number[]} column The column definition object or identifier
**/

/**
Fired by the `modifyColumn` method.

@event modifyColumn
@preventable _defModifyColumnFn
@param {Object|String|Number|Number[]} column The column definition object or identifier
@param {Object} newColumnDef The properties to assign to the column
**/

/**
Fired by the `moveColumn` method.

@event moveColumn
@preventable _defMoveColumnFn
@param {Object|String|Number|Number[]} column The column definition object or identifier
@param {Object} index The destination index to move to
**/

}, '@VERSION@', { requires: ['gallery-datatable-350-preview-base'] });

YUI.add('gallery-datatable-350-preview-column-widths', function (Y) {
/**
Adds basic, programmatic column width support to DataTable. Note, this does not
add support for truncated columns.  Due to the way HTML tables render, column
width is more like `min-width`.  Column content wider than the assigned width
will cause the column to expand, though if a table width is set, the overall
width will be respected by reducing the width of other columns if possible.

To set a column width, either add a `width` value to the column configuration
or call the `setColumnWidth(id, width)` method.

Note, assigning column widths is possible without this module, as each cell is
decorated with a class appropriate for that column which you can statically
target in your site's CSS.  To achieve forced column widths with truncation,
either add a column `formatter` or update the table's `bodyView`'s
`CELL_TEMPLATE` to include a `<div>` liner (by convention, assigned a classname
"yui3-datatable-liner"), then set the width and overflow for those `<div>`s in
your CSS.  For example, to give the column "foo" an absolute width, add this to
your site CSS:

```
.yui3-datatable .yui3-datatable-foo .yui3-datatable-liner {
    overflow: hidden;
    width: 125px;
}
```

and assign a `formatter` for the "foo" column in your JavaScript:

```
var table = new Y.DataTable({
    columns: [
        {
            key: 'foo',
            formatter: '<div class="yui3-datatable-liner">{value}</div>',
            allowHTML: true
        },
        ...
    ],
    ...
});
```

To add a liner to all columns, either provide a custom `bodyView` to the
DataTable constructor or update the default `bodyView`'s `CELL_TEMPLATE` like
so:

```
table.on('renderBody', function (e) {
    e.view.CELL_TEMPLATE = e.view.CELL_TEMPLATE.replace(/\{content\}/,
            '<div class="yui3-datatable-liner">{content}</div>');
});
```

Keep in mind that DataTable skins apply cell `padding`, so assign your CSS
`width`s accordingly or override the `padding` style for that column's `<td>`s
to 0, and add `padding` to the liner `<div>`'s styles.

@module datatable-column-widths
**/
var isNumber = Y.Lang.isNumber,
    arrayIndex = Y.Array.indexOf;

Y.Features.add('table', 'badColWidth', {
    test: function () {
        var body = Y.one('body'),
            node, broken;

        if (body) {
            // In modern browsers, <col style="width:X"> will make columns,
            // *including padding and borders* X wide. The cell content width
            // is reduced.  In old browsers and all Opera versions to date, the
            // col's width style is passed to the cells, which causes cell
            // padding/border to bloat the rendered width.
            node = body.insertBefore(
                '<table style="position:absolute;visibility:hidden;border:0 none">' +
                    '<colgroup><col style="width:9px"></colgroup>' +
                    '<tbody><tr>' +
                        '<td style="' +
                            'padding:0 4px;' +
                            'font:normal 2px/2px arial;' +
                            'border:0 none">' +
                        '.' + // Just something to give the cell dimension
                    '</td></tr></tbody>' +
                '</table>',
                body.get('firstChild'));

            broken = node.one('td').getComputedStyle('width') !== '1px';

            node.remove(true);
        }

        return broken;
    }
});

/**
Class extension for DataTable to add support for assigning column widths.

@class DataTable.ColumnWidths
**/
function ColumnWidths() {}

Y.mix(ColumnWidths.prototype, {
    /**
    The HTML template used to create the table's `<col>`s.

    @property COL_TEMPLATE
    @type {HTML}
    @default '<col/>'
    **/
    COL_TEMPLATE: '<col/>',

    /**
    The HTML template used to create the table's `<colgroup>`.

    @property COLGROUP_TEMPLATE
    @type {HTML}
    @default '<colgroup/>'
    **/
    COLGROUP_TEMPLATE: '<colgroup/>',

    /**
    Assigns the style width of the `<col>` representing the column identifed by
    `id` and updates the column configuration.

    Pass the empty string for `width` to return a column to auto sizing.

    This does not trigger a `columnsChange` event today, but I can be convinced
    that it should.

    @method setColumnWidth
    @param {Number|String|Object} id The column config object or key, name, or
            index of a column in the host's `\_displayColumns` array.
    @param {Number|String} width CSS width value. Numbers are treated as pixels
    **/
    setColumnWidth: function (id, width) {
        var col = this.getColumn(id),
            index = col && arrayIndex(this._displayColumns, col);

        if (index > -1) {
            if (isNumber(width)) {
                width += 'px';
            }

            col.width = width;

            this._setColumnWidth(index, width);
        }
    },

    //----------------------------------------------------------------------------
    // Protected properties and methods
    //----------------------------------------------------------------------------

    /**
    Renders the table's `<colgroup>` and populates the `\_colgroupNode` property.

    @method _createColumnGroup
    @protected
    **/
    _createColumnGroup: function () {
        return Y.Node.create(this.COLGROUP_TEMPLATE);
    },

    /**
    Hooks up to the rendering lifecycle to also render the `<colgroup>` and
    subscribe to `columnChange` events.

    @method initializer
    @protected
    **/
    initializer: function (config) {
        this.after('renderTable', function (e) {
            this._uiSetColumns();

            this.after('columnsChange', this._uiSetColumns);
        });
    },

    /**
    Sets a columns's `<col>` element width style. This is needed to get around
    browser rendering differences.

    The colIndex corresponds to the item index of the `<col>` in the table's
    `<colgroup>`.

    To unset the width, pass a falsy value for the `width`.

    @method _setColumnWidth
    @param {Number} colIndex The display column index
    @param {Number|String} width The desired width
    @protected
    **/
    // TODO: move this to a conditional module
    _setColumnWidth: function (colIndex, width) {
        // Opera (including Opera Next circa 1/13/2012) and IE7- pass on the
        // width style to the cells directly, allowing padding and borders to
        // expand the rendered width.  Chrome 16, Safari 5.1.1, and FF 3.6+ all
        // make the rendered width equal the col's style width, reducing the
        // cells' calculated width.
        var colgroup  = this._colgroupNode,
            col       = colgroup && colgroup.all('col').item(colIndex),
            firstRow, cell, getCStyle;

        if (col) {
            if (width && isNumber(width)) {
                width += 'px';
            }

            col.setStyle('width', width);

            // Adjust the width for browsers that make
            // td.style.width === col.style.width
            if  (width && Y.Features.test('table', 'badColWidth')) {
                firstRow = this._tbodyNode && this._tbodyNode.one('tr');
                cell     = firstRow && firstRow.all('td').item(colIndex);
                
                if (cell) {
                    getCStyle = function (prop) {
                        return parseInt(cell.getComputedStyle(prop), 10)|0;
                    };

                    col.setStyle('width',
                        // I hate this
                        parseInt(width, 10) -
                        getCStyle('paddingLeft') -
                        getCStyle('paddingRight') -
                        getCStyle('borderLeftWidth') -
                        getCStyle('borderRightWidth') + 'px');

                }
            }
        }
    },

    /**
    Populates the table's `<colgroup>` with a `<col>` per item in the `columns`
    attribute without children.  It is assumed that these are the columns that
    have data cells renderered for them.

    @method _uiSetColumns
    @protected
    **/
    _uiSetColumns: function () {
        var template = this.COL_TEMPLATE,
            colgroup = this._colgroupNode,
            columns  = this._displayColumns,
            i, len;

        if (!colgroup) {
            colgroup = this._colgroupNode = this._createColumnGroup();

            this._tableNode.insertBefore(
                colgroup,
                this._tableNode.one('> thead, > tfoot, > tbody'));
        } else {
            colgroup.empty();
        }

        for (i = 0, len = columns.length; i < len; ++i) {

            colgroup.append(template);

            this._setColumnWidth(i, columns[i].width);
        }
    }
}, true);

Y.DataTable.ColumnWidths = ColumnWidths;

Y.Base.mix(Y.DataTable, [ColumnWidths]);
}, '@VERSION@', { requires: ['gallery-datatable-350-preview-base'] });

YUI.add('gallery-datatable-350-preview-scroll', function (Y) {
// TODO: split this into a plugin and a class extension to add the ATTRS (ala
// Plugin.addHostAttr()

/**
Adds the ability to make the table rows scrollable while preserving the header
placement.

There are two types of scrolling, horizontal (x) and vertical (y).  Horizontal
scrolling is achieved by wrapping the entire table in a scrollable container.
Vertical scrolling is achieved by splitting the table headers and data into two
separate tables, the latter of which is wrapped in a vertically scrolling
container.  In this case, column widths of header cells and data cells are kept
in sync programmatically.

Since the split table synchronization can be costly at runtime, the split is only done if the data in the table stretches beyond the configured `height` value.

To activate or deactivate scrolling, set the `scrollable` attribute to one of
the following values:

 * `false` - (default) Scrolling is disabled.
 * `true` or 'xy' - If `height` is set, vertical scrolling will be activated, if
            `width` is set, horizontal scrolling will be activated.
 * 'x' - Activate horizontal scrolling only. Requires the `width` attribute is
         also set.
 * 'y' - Activate vertical scrolling only. Requires the `height` attribute is
         also set.

 @module @datatable-scroll
 @class DataTable.Scrollable
 @for DataTable
**/
var YLang = Y.Lang,
    isString = YLang.isString,
    isNumber = YLang.isNumber,
    isArray  = YLang.isArray,

    Scrollable;

Y.DataTable.Scrollable = Scrollable = function () {};

Scrollable.ATTRS = {
    /**
    Activates or deactivates scrolling in the table.  Acceptable values are:

     * `false` - (default) Scrolling is disabled.
     * `true` or 'xy' - If `height` is set, vertical scrolling will be activated, if
                `width` is set, horizontal scrolling will be activated.
     * 'x' - Activate horizontal scrolling only. Requires the `width` attribute is
             also set.
     * 'y' - Activate vertical scrolling only. Requires the `height` attribute is
             also set.

    @attribute scrollable
    @type {String|Boolean}
    @value false
    **/
    scrollable: {
        value: false,
        setter: '_setScrollable'
    }
};

Y.mix(Scrollable.prototype, {
    /**
    Template for the `<div>` that is used to contain the rows when the table is
    vertically scrolling.

    @property SCROLLING_CONTAINER_TEMPLATE
    @type {HTML}
    @value '<div class="{classes}"><table></table></div>'
    **/
    SCROLLING_CONTAINER_TEMPLATE: '<div class="{classes}"><table></table></div>',

    /**
    Scrolls a given row or cell into view if the table is scrolling.  Pass the
    `clientId` of a Model from the DataTable's `data` ModelList or its row
    index to scroll to a row or a [row index, column index] array to scroll to
    a cell.  Alternately, to scroll to any element contained within the table's
    scrolling areas, pass its ID, or the Node itself (though you could just as
    well call `node.scrollIntoView()` yourself, but hey, whatever).

    @method scrollTo
    @param {String|Number|Number[]|Node} id A row clientId, row index, cell
            coordinate array, id string, or Node
    **/
    scrollTo: function (id) {
        var target;

        if (id && this._tbodyNode && (this._yScrollNode || this._xScrollNode)) {
            if (isArray(id)) {
                target = this.getCell(id);
            } else if (isNumber(id)) { 
                target = this.getRow(id);
            } else if (isString(id)) {
                target = this._tbodyNode.one('#' + id);
            } else if (id instanceof Y.Node &&
                    // TODO: ancestor(yScrollNode, xScrollNode)
                    id.ancestor('.yui3-datatable') === this.get('boundingBox')) {
                target = id;
            }

            target && target.scrollIntoView();
        }
    },

    //----------------------------------------------------------------------------
    // Protected properties and methods
    //----------------------------------------------------------------------------
    /**
    Relays changes in the table structure or content to trigger a reflow of the
    scrolling setup.

    @method _afterContentChange
    @param {EventFacade} e The relevant change event (ignored)
    @protected
    **/
    _afterContentChange: function (e) {
        this._mergeYScrollContent();
        this._syncScrollUI();
    },

    /**
    Reacts to changes in the `scrollable` attribute by updating the `\_xScroll`
    and `\_yScroll` properties and syncing the scrolling structure accordingly.

    @method _afterScrollableChange
    @param {EventFacade} e The relevant change event (ignored)
    @protected
    **/
    _afterScrollableChange: function (e) {
        this._uiSetScrollable();
        this._syncScrollUI();
    },

    /**
    Syncs the scrolling structure if the table is configured to scroll vertically.

    @method _afterScrollHeightChange
    @param {EventFacade} e The relevant change event (ignored)
    @protected
    **/
    _afterScrollHeightChange: function (e) {
        this._yScroll && this._syncScrollUI();
    },

    /**
    Attaches internal subscriptions to keep the scrolling structure up to date
    with changes in the table's `data`, `columns`, `caption`, or `height`.  The
    `width is taken care of already.

    This executes after the table's native `bindUI` method.

    @method _bindScrollUI
    @protected
    **/
    _bindScrollUI: function () {
        this.after([
            'dataChange',
            'columnsChange',
            'captionChange',
            'heightChange'],
            Y.bind('_afterContentChange', this));

        this.data.after([
            'add', 'remove', 'reset', '*:change'],
            Y.bind('_afterContentChange', this));
    },

    /**
    Calculates the height of the div containing the vertically scrolling rows.
    The height is produced by subtracting the `offsetHeight` of the scrolling
    `<div>` from the `clientHeight` of the `contentBox`.

    @method _calcScrollHeight
    @protected
    **/
    _calcScrollHeight: function () {
        var scrollNode = this._yScrollNode;

        return this.get('contentBox').get('clientHeight') -
               scrollNode.get('offsetTop') -
               // To account for padding and borders of the scroll div
               scrollNode.get('offsetHeight') +
               scrollNode.get('clientHeight');
    },

    /**
    Populates the `\_yScrollNode` property by creating the `<div>` Node described
    by the `SCROLLING_CONTAINER_TEMPLATE`.

    @method _createYScrollNode
    @protected
    **/
    _createYScrollNode: function () {
        if (!this._yScrollNode) {
            this._yScrollNode = Y.Node.create(
                Y.Lang.sub(this.SCROLLING_CONTAINER_TEMPLATE, {
                    classes: this.getClassName('data','container')
                }));
        }
    },

    /**
    Assigns style widths to all columns based on their current `offsetWidth`s.
    This faciliates creating a clone of the `<colgroup>` so column widths are
    the same after the table is split in to header and data tables.

    @method _fixColumnWidths
    @protected
    **/
    _fixColumnWidths: function () {
        var tbody     = this._tbodyNode,
            table     = tbody.get('parentNode'),
            firstRow  = tbody.one('tr'),
            cells     = firstRow && firstRow.all('td'),
            scrollbar = Y.DOM.getScrollbarWidth(),
            widths    = [], i, len, cell;

        if (cells) {
            // The thead and tbody need to be in the same table to accurately
            // calculate column widths.
            this._tableNode.appendChild(this._tbodyNode);

            i = cells.size() - 1;
            cell = cells.item(i);

            // FIXME? This may be fragile if the table has a fixed width and
            // increasing the size of the last column would push the overall
            // width beyond the configured width.
            // bump up the width of the last column to account for the scrollbar.
            this._setColumnWidth(i,
                (cell.get('offsetWidth') + scrollbar) + 'px');

            // Avoid assignment without scrollbar adjustment
            cells.pop();

            // Two passes so assigned widths don't cause subsequent width changes
            // which would cost reflows.
            widths = cells.get('offsetWidth');

            for (i = 0, len = widths.length; i < len; ++i) {
                this._setColumnWidth(i, widths[i] + 'px');
            }

            table.appendChild(this._tbodyNode);
        }
    },

    /**
    Sets up event handlers and AOP advice methods to bind the DataTable's natural
    behaviors with the scrolling APIs and state.

    @method initializer
    @param {Object} config The config object passed to the constructor (ignored)
    @protected
    **/
    initializer: function () {
        this._setScrollProperties();

        this.after(['scrollableChange', 'heightChange', 'widthChange'],
            this._setScrollProperties);

        Y.Do.after(this._bindScrollUI, this, 'bindUI');
        Y.Do.after(this._syncScrollUI, this, 'syncUI');
    },

    /**
    Merges the header and data tables back into one table if they are split.

    @method _mergeYScrollContent
    @protected
    **/
    _mergeYScrollContent: function () {
        this.get('boundingBox').removeClass(this.getClassName('scrollable-y'));

        if (this._yScrollNode) {
            this._tableNode.append(this._tbodyNode);

            this._yScrollNode.remove().destroy(true);
            this._yScrollNode = null;

            this._removeHeaderScrollPadding();

            this._setARIARoles();
        }

        this._uiSetWidth(this.get('width'));
        this._uiSetColumns();
    },

    /**
    Removes the additional padding added to the last cells in each header row to
    allow the scrollbar to fit below.

    @method _removeHeaderScrollPadding
    @protected
    **/
    _removeHeaderScrollPadding: function () {
        var rows = this._theadNode.all('> tr').getDOMNodes(),
            cell, i, len;

        // The last cell in all rows of the table headers
        for (i = 0, len = rows.length; i < len; i += (cell.rowSpan || 1)) {
            cell = Y.one(rows[i].cells[rows[i].cells.length - 1])
                .setStyle('paddingRight', '');
        }
    },

    /**
    Moves the ARIA "grid" role from the table to the `contentBox` and adds the
    "presentation" role to both header and data tables to support the two
    tables reporting as one table for screen readers.

    @method _setARIARoles
    @protected
    **/
    _setARIARoles: function () {
        var contentBox = this.get('contentBox');

        if (this._yScrollNode) {
            this._tableNode.setAttribute('role', 'presentation');
            this._yScrollNode.one('> table').setAttribute('role', 'presentation');
            contentBox.setAttribute('role', 'grid');
        } else {
            this._tableNode.setAttribute('role', 'grid');
            contentBox.removeAttribute('role');
        }
    },

    /**
    Adds additional padding to the current amount of right padding on each row's
    last cell to account for the width of the scrollbar below.

    @method _setHeaderScrollPadding
    @protected
    **/
    _setHeaderScrollPadding: function () {
        var rows = this._theadNode.all('> tr').getDOMNodes(),
            padding, cell, i, len;

        cell = Y.one(rows[0].cells[rows[0].cells.length - 1]);

        padding = (Y.DOM.getScrollbarWidth() +
                   parseInt(cell.getComputedStyle('paddingRight'), 10)) + 'px';

        // The last cell in all rows of the table headers
        for (i = 0, len = rows.length; i < len; i += (cell.rowSpan || 1)) {
            cell = Y.one(rows[i].cells[rows[i].cells.length - 1])
                .setStyle('paddingRight', padding);
        }
    },

    /**
    Accepts (case insensitive) values "x", "y", "xy", `true`, and `false`.
    `true` is translated to "xy" and upper case values are converted to lower
    case.  All other values are invalid.

    @method _setScrollable
    @param {String|Boolea} val Incoming value for the `scrollable` attribute
    @return {String}
    @protected
    **/
    _setScrollable: function (val) {
        if (val === true) {
            val = 'xy';
        }

        if (isString(val)) {
            val = val.toLowerCase();
        }

        return (val === false || val === 'y' || val === 'x' || val === 'xy') ?
            val :
            Y.Attribute.INVALID_VALUE;
    },

    /**
    Assigns the `\_xScroll` and `\_yScroll` properties to true if an
    appropriate value is set in the `scrollable` attribute and the `height`
    and/or `width` is set.

    @method _setScrollProperties
    @protected
    **/
    _setScrollProperties: function () {
        var scrollable = this.get('scrollable') || '',
            width      = this.get('width'),
            height     = this.get('height');

        this._xScroll = width  && scrollable.indexOf('x') > -1;
        this._yScroll = height && scrollable.indexOf('y') > -1;
    },

    /**
    Clones the fixed (see `\_fixColumnWidths` method) `<colgroup>` for use by the
    table in the vertical scrolling container.  The last column's width is reduced
    by the width of the scrollbar (which is offset by additional padding on the
    last header cell(s) in the header table - see `\_setHeaderScrollPadding`).

    @method _setYScrollColWidths
    @protected
    **/
    _setYScrollColWidths: function () {
        var scrollNode = this._yScrollNode,
            table      = scrollNode && scrollNode.one('> table'),
            // hack to account for right border
            colgroup, lastCol;

        if (table) {
            scrollNode.all('colgroup,col').remove();
            colgroup = this._colgroupNode.cloneNode(true);
            colgroup.set('id', Y.stamp(colgroup));

            // Browsers with proper support for column widths need the
            // scrollbar width subtracted from the last column.
            if (!Y.Features.test('table', 'badColWidth')) {
                lastCol = colgroup.all('col').pop();

                // Subtract the scrollbar width added to the last col
                lastCol.setStyle('width',
                    (parseInt(lastCol.getStyle('width'), 10) - 1 -
                    Y.DOM.getScrollbarWidth()) + 'px');
            }

            table.insertBefore(colgroup, table.one('> thead, > tfoot, > tbody'));
        }
    },

    /**
    Splits the unified table with headers and data into two tables, the latter
    contained within a vertically scrollable container `<div>`.

    @method _splitYScrollContent
    @protected
    **/
    _splitYScrollContent: function () {
        var table = this._tableNode,
            scrollNode = this._yScrollTable,
            scrollbar  = Y.DOM.getScrollbarWidth(),
            scrollTable, width;
            
        this.get('boundingBox').addClass(this.getClassName('scrollable-y'));

        if (!scrollNode) {
            // I don't want to take into account the added paddingRight done in
            // _setHeaderScrollPadding for the data cells that will be
            // scrolling below
            this._fixColumnWidths();

            this._setHeaderScrollPadding();

            // lock the header table width in case the removal of the tbody would
            // allow the table to shrink (such as when the tbody data causes a
            // browser horizontal scrollbar).
            width = parseInt(table.getComputedStyle('width'), 10);
            table.setStyle('width', width + 'px');

            this._createYScrollNode();
            scrollNode  = this._yScrollNode;
            scrollTable = scrollNode.one('table');
            
            scrollTable.append(this._tbodyNode);

            table.insert(scrollNode, 'after');

            scrollNode.setStyles({
                height: this._calcScrollHeight() + 'px',
                        // FIXME: Lazy hack to account for scroll node borders
                width : (width - 2) + 'px'
            });

            scrollTable.setStyle('width', (width - scrollbar - 1) + 'px');
            this._setARIARoles();
        }

        this._setYScrollColWidths();
    },

    /**
    Calls `\_mergeYScrollContent` or `\_splitYScrollContent` depending on the
    current widget state, accounting for current state.  That is, if the table
    needs to be split, but is already, nothing happens.

    @method _syncScrollUI
    @protected
    **/
    _syncScrollUI: function () {
        var scrollable  = this._xScroll || this._yScroll,
            cBox        = this.get('contentBox'),
            node        = this._yScrollNode || cBox,
            table       = node.one('table'),
            overflowing = this._yScroll &&
                           (table.get('scrollHeight') > node.get('clientHeight'));

        this._uiSetScrollable();

        if (scrollable) {
            // Only split the table if the content is longer than the height
            if (overflowing) {
                this._splitYScrollContent();
            } else {
                this._mergeYScrollContent();
            }
        } else {
            this._mergeYScrollContent();
        }

        // TODO: fix X scroll.  I'll need to split tables here as well for the
        // caption if there is one present, so the horizontal scroll happens
        // under the stationary caption.
        // Also, similarly, only activate the x scrolling if the table is wider
        // than the configured width.
    },

    /**
    Overrides the default Widget `\_uiSetWidth` to assign the width to either
    the table or the `contentBox` (for horizontal scrolling) in addition to the
    native behavior of setting the width of the `boundingBox`.

    @method _uiSetWidth
    @param {String|Number} width CSS width value or number of pixels
    @protected
    **/
    _uiSetWidth: function (width) {
        var scrollable = parseInt(width, 10) &&
                         (this.get('scrollable')||'').indexOf('x') > -1;

        if (isNumber(width)) {
            width += this.DEF_UNIT;
        }

        this._uiSetDim('width', width);
        this._tableNode.setStyle('width', scrollable ? '' : width);
        // FIXME: this allows the caption to scroll out of view
        this.get('contentBox').setStyle('width', scrollable ? width : '');

        if (this._yScrollNode) {
            this._mergeYScrollContent();
            this._syncScrollUI();
        }
    },

    /**
    Assigns the appropriate class to the `boundingBox` to identify the DataTable
    as horizontally scrolling, vertically scrolling, or both (adds both classes).

    Classes added are "yui3-datatable-scrollable-x" or "...-y"

    @method _uiSetScrollable
    @protected
    **/
    _uiSetScrollable: function () {
        // Initially add classes.  These may be purged by _syncScrollUI.
        this.get('boundingBox')
            .toggleClass(this.getClassName('scrollable','x'), this._xScroll)
            .toggleClass(this.getClassName('scrollable','y'), this._yScroll);
    }

    /**
    Indicates horizontal table scrolling is enabled.

    @property _xScroll
    @type {Boolean}
    @default undefined (not initially set)
    @private
    **/
    //_xScroll,

    /**
    Indicates vertical table scrolling is enabled.

    @property _yScroll
    @type {Boolean}
    @default undefined (not initially set)
    @private
    **/
    //_yScroll,

    /**
    Overflow Node used to contain the data rows in a vertically scrolling table.

    @property _yScrollNode
    @type {Node}
    @default undefined (not initially set)
    @protected
    **/
    //_yScrollNode

    // TODO: Add _xScrollNode
}, true);

Y.Base.mix(Y.DataTable, [Scrollable]);
}, '@VERSION@', { requires: ['gallery-datatable-350-preview-base', 'gallery-datatable-350-preview-column-widths', 'dom-screen'] });

Y.use('gallery-datatable-350-preview-core', 
      'gallery-datatable-350-preview-head', 
      'gallery-datatable-350-preview-body', 
      'gallery-datatable-350-preview-base', 
      'gallery-datatable-350-preview-mutable',
      'gallery-datatable-350-preview-column-widths', 
      'gallery-datatable-350-preview-scroll');

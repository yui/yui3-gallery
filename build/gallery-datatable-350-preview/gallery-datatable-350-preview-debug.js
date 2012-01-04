YUI.add('gallery-datatable-350-preview', function(Y) {

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

var INVALID    = Y.Attribute.INVALID_VALUE,

    Lang       = Y.Lang,
    isFunction = Lang.isFunction,
    isObject   = Lang.isObject,
    isArray    = Lang.isArray,
    isString   = Lang.isString,
    isNumber   = Lang.isNumber,

    toArray    = Y.Array,

    keys       = Y.Object.keys,

    Table;
    
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
    @type {String}
    @default '<caption></caption>'
    **/
    CAPTION_TEMPLATE: '<caption></caption>',

    /**
    The HTML template used to create the table Node.

    @property TABLE_TEMPLATE
    @type {String}
    @default '<table></table>'
    **/
    TABLE_TEMPLATE  : '<table></table>',

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
                for (i = entry[1]; i >= 0; --i) {
                    col = cols[i];
                    // Only need to check against name because the initial
                    // col = get('columns.' + name) would get it from the key map
                    if (col.name === name) {
                        return col;
                    }
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
    Relays `captionChange` events to `\_uiUpdateCaption`.

    @method _afterCaptionChange
    @param {EventFacade} e The `captionChange` event object
    @protected
    **/
    _afterCaptionChange: function (e) {
        this._uiUpdateCaption(e.newVal);
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
    },

    /**
    Relays `summaryChange` events to `\_uiUpdateSummary`.

    @method _afterSummaryChange
    @param {EventFacade} e The `summaryChange` event object
    @protected
    **/
    _afterSummaryChange: function (e) {
        this._uiUpdateSummary(e.newVal);
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
        // name will be 'columns' or 'columns.foo'. Trim to the dot.
        // TODO: support name as an index or (row,column) index pair
        name = name.slice(8);

        return (name) ? this._columnMap[name] : columns;
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
    Delegates rendering the table `<tbody>` to the configured `bodyView`.

    @method _renderBody
    @protected
    **/
    _renderBody: function () {
        var BodyView = this.get('bodyView');

        // TODO: use a _viewConfig object that can be mixed onto by class
        // extensions, then pass that to either the view constructor or setAttrs
        if (BodyView) {
            // Can't use merge because it doesn't iterate prototype properties,
            // so would miss the configs from _viewConfig.
            Y.mix(this._bodyConfig, {
                container: this._tableNode,
                columns  : this.get('columns'),
                modelList: this.data
            }, true);

            this.body = new BodyView(this._bodyConfig);

            this.body.addTarget(this);
            this.body.render();
        }
    },

    /**
    Delegates rendering the table `<tfoot>` to the configured `footerView`.

    @method _renderFooter
    @protected
    **/
    _renderFooter: function (table, data) {
        var FooterView = this.get('footerView');
        
        if (FooterView) {
            // Can't use merge because it doesn't iterate prototype properties,
            // so would miss the configs from _viewConfig.
            Y.mix(this._footerConfig, {
                container: this._tableNode,
                columns  : this.get('columns'),
                modelList: this.data
            }, true);

            this.foot = new FooterView(this._footerConfig);

            this.foot.addTarget(this);
            this.foot.render();
        }
    },

    /**
    Delegates rendering the table `<thead>` to the configured `headerView`.

    @method _renderHeader
    @protected
    **/
    _renderHeader: function () {
        var HeaderView = this.get('headerView');
        
        if (HeaderView) {
            // Can't use merge because it doesn't iterate prototype properties,
            // so would miss the configs from _viewConfig.
            Y.mix(this._headerConfig, {
                container: this._tableNode,
                columns  : this.get('columns'),
                modelList: this.data
            }, true);

            this.head = new HeaderView(this._headerConfig);

            this.head.addTarget(this);
            this.head.render();
        }
        // TODO: If there's no HeaderView, should I remove an existing <thead>?
    },

    /**
    Creates the table and caption and assigns the table's summary attribute.

    Assigns the generated table to the `\_tableNode` property.

    @method _renderTable
    @protected
    **/
    _renderTable: function () {
        var caption = this.get('caption');

        if (!this._tableNode) {
            this._tableNode = Y.Node.create(this.TABLE_TEMPLATE);
        }
        this._tableNode.addClass(this.getClassName('table'));

        this._uiUpdateSummary(this.get('summary'));

        this._uiUpdateCaption(caption);
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
            this._renderTable();

            this._renderHeader();

            this._renderFooter();

            this._renderBody();

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

    @method _uiUpdateCaption
    @param {HTML} htmlContent The content to populate the table caption
    @protected
    **/
    _uiUpdateCaption: function (htmlContent) {
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

    @method _uiUpdateSummary
    @protected
    **/
    _uiUpdateSummary: function (summary) {
        this._tableNode.setAttribute('summary', summary || '');
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
}, 'gallery-2012.01.04-22-09', { requires: ['model-list'] });
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
var fromTemplate = Y.Lang.sub,
    Lang = Y.Lang,
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
    @default '<th id="{_yuid}" abbr="{abbr} colspan="{colspan}" rowspan="{rowspan}"><div class="{linerClass}">{content}</div></th>'
    **/
    CELL_TEMPLATE :
        '<th id="{_yuid}" abbr="{abbr}" ' +
                'colspan="{colspan}" rowspan="{rowspan}">' +
            '<div class="{linerClass}">' +
                '{content}' +
            '</div>' +
        '</th>',

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

    /**
    Template used to create the table's thead markup.

    @property THEAD_TEMPLATE
    @type {HTML}
    @default '<thead class="{classes}">{content}</thead>'
    **/
    THEAD_TEMPLATE:
        '<thead class="{classes}">{content}</thead>',


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
    Creates the `<thead>` Node by assembling markup generated by populating the
    `THEAD\_TEMPLATE`, `ROW\_TEMPLATE`, and `CELL\_TEMPLATE` templates with
    content from the `columns` property.
    
    @method render
    @return {HeaderView} The instance
    @chainable
    **/
    render: function () {
        var table    = this.get('container'),
            columns  = this.columns,
            thead    = this.source._theadNode,
            defaults = {
                            abbr: '',
                            colspan: 1,
                            rowspan: 1,
                            // TODO: remove dependence on this.source
                            linerClass: this.getClassName('liner')
                       },
            existing, i, len, j, jlen, col, html;

        table = Y.one(table);

        if (table && table.get('tagName') !== 'TABLE') {
            table = table.one('table');
        }

        if (!table) {
            Y.log('Could not render thead. Table not provided', 'warn');
            return this;
        }

        // TODO: limit to correctly classed thead?  Then I would need to
        // replace a found thead without the class.
        existing = table.one('> thead');

        if (existing) {
            if (!existing.compareTo(thead)) {
                existing.replace(thead);
            } else {
                this._theadNode = existing;
            }
        } else {
            thead = '';

            if (columns.length) {
                for (i = 0, len = columns.length; i < len; ++i) {
                    html = '';

                    for (j = 0, jlen = columns[i].length; j < jlen; ++j) {
                        col = columns[i][j];
                        html += fromTemplate(this.CELL_TEMPLATE,
                            Y.merge(
                                defaults,
                                col, {
                                    content: col.label ||
                                             col.key   ||
                                             ("Column " + (j + 1))
                                }
                            ));
                    }

                    thead += fromTemplate(this.ROW_TEMPLATE, {
                        content: html
                    });
                }
            }

            this._theadNode = thead = Y.Node.create(
                fromTemplate(this.THEAD_TEMPLATE, {
                    classes: this.getClassName('columns'),
                    content: thead
                }));
            
            table.insertBefore(thead, table.one('> tfoot, > tbody'));
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

        if (this._theadNode) {
            this._theadNode.remove().destroy(true);
            delete this._theadNode;
        }

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
}, 'gallery-2012.01.04-22-09', { requires: ['view', 'gallery-datatable-350-preview-core'] });
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
    htmlEscape   = Y.Escape.html,
    fromTemplate = Y.Lang.sub,
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
    @default
        '<td headers="{headers}" class="{classes}">
            '<div class="{linerClass}">{content}</div>
        </td>'
    **/
    CELL_TEMPLATE:
        '<td headers="{headers}" class="{classes}">' +
            '<div class="{linerClass}">' +
                '{content}' +
            '</div>' +
        '</td>',

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
        '<tr id="{clientId}" class="{rowClasses}">' +
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

    /**
    HTML template used to create table's `<tbody>`.

    @property TBODY_TEMPLATE
    @type {HTML}
    @default '<tbody class="{classes}">{content}</tbody>'
    **/
    TBODY_TEMPLATE: '<tbody class="{classes}">{content}</tbody>',

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
        var el = null;

        if (this._tbodyNode) {
            el = this._tbodyNode.getDOMNode().rows[+row];
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
    // TODO: Support index as clientId => _tbodyNode.one('> #' + index)?
    getRow: function (index) {
        var el;

        if (this._tbodyNode) {
            el = this._tbodyNode.getDOMNode().rows[+index];
        }

        return Y.one(el);
    },

    /**
    Creates the table's `<tbody>` Node by assembling markup generated by
    populating the `TBODY\_TEMPLATE`, `ROW\_TEMPLATE`, and `CELL\_TEMPLATE`
    templates with content from the `columns` property and `modelList`
    attribute.

    The rendering process happens in four stages:

    1. A row template is assembled from the `columns` property (see
       `\_createRowTemplate`)

    2. An HTML string is built up by concatening the application of the data in
       each Model in the `modelList` to the row template. For cells with
       `formatter`s, the function is called to generate cell content. Cells
       with `nodeFormatter`s are ignored. For all other cells, the data value
       from the Model attribute for the given column key is used.  The
       accumulated row markup is then inserted into the `TBODY_TEMPLATE`.

    3. The `<tbody>` Node is created from the HTML string.

    4. If any column is configured with a `nodeFormatter`, the `modelList` is
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
        var table    = this.get('container'),
            data     = this.get('modelList'),
            columns  = this.columns,
            tbody    = this._tbodyNode,
            existing;

        table =  Y.one(table);

        if (table && table.get('tagName') !== 'TABLE') {
            table = table.one('table');
        }

        if (!table) {
            Y.log('Could not render tbody. Container is not a table', 'warn');
            return this;
        }

        existing = table.one('> .' + this.getClassName('data'));

        // Needed for mutation
        this._createRowTemplate(columns);

        if (existing) {
            if (tbody) {
                if (!existing.compareTo(tbody)) {
                    existing.replace(tbody);
                }
            } else {
                this._tbodyNode = existing;
            }
        } else if (data) {
            tbody = Y.Node.create(this._createDataHTML(columns));

            this._applyNodeFormatters(tbody, columns);

            table.append(tbody);

            this._tbodyNode = tbody;
        }

        if (this._tbodyNode) {
            this.bindUI();
        }

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

        if (this._tbodyNode) {
            this._tbodyNode.remove().destroy(true);
            delete this._tbodyNode;
        }

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
        if (this._tbodyNode) {
            this._tbodyNode.remove().destroy(true);
            delete this._tbodyNode;
        }

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
                data.after(['*:change', '*:add', '*:remove', '*:destroy', '*:reset'],
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

        return fromTemplate(this.TBODY_TEMPLATE, {
            classes: this.getClassName('data'),
            content: html
        });
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
            // To prevent formatters from leaking changes when more than one
            // column refer to the same key
            values  = YObject(data),
            source  = this.source || this,
            columns = this.columns,
            i, len, col, token, value, formatterData;

        // TODO: Be consistent and change to row-classes? This could be
        // clobbered by a column named 'row'.
        values.rowClasses = (index % 2) ? this.CLASS_ODD : this.CLASS_EVEN;

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

            if ((value === undefined || value === '') &&
                col.emptyCellValue) {
                value = col.emptyCellValue;
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
            linerClass   = this.getClassName('liner'),
            tokens       = {},
            i, len, col, key, token, tokenValues;

        for (i = 0, len = columns.length; i < len; ++i) {
            col = columns[i];
            key = col.key;

            if (key) {
                if (tokens[key]) {
                    token = key + (tokens[key]++);
                    col._renderToken = token;
                } else {
                    token = key;
                    tokens[key] = 1;
                }
            } else {
                token = col.name || col._yuid;
            }

            tokenValues = {
                content   : '{' + token + '}',
                headers   : col.headers.join(' '),
                linerClass: linerClass,
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
        this._tbodyNode = config.tbodyNode;

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
}, 'gallery-2012.01.04-22-09', { requires: ['view', 'gallery-datatable-350-preview-core'] });
Y.use('gallery-datatable-350-preview-core', 'gallery-datatable-350-preview-head', 'gallery-datatable-350-preview-body');
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


}, 'gallery-2012.01.04-22-09' ,{requires:['base-build', 'widget', 'model-list', 'view', 'escape']});

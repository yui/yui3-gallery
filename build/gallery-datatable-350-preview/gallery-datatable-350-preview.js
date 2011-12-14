YUI.add('gallery-datatable-350-preview', function(Y) {

YUI.add('gallery-datatable-350-preview-core', function (Y) {
var INVALID    = Y.Attribute.INVALID_VALUE,

    Lang       = Y.Lang,
    isFunction = Lang.isFunction,
    isArray    = Lang.isArray,
    isString   = Lang.isString,

    keys       = Y.Object.keys,

    Table;
    
Table = Y.namespace('DataTable').Core = function () {};

Table.ATTRS = {
    columns: {
        // TODO: change to setter to coerce Columnset?
        validator: isArray,
        getter: '_getColumns'
    },

    recordType: {
        validator: '_validateRecordType',
        writeOnce: true
    },

    data: {
        value : [],
        setter: '_setData',
        getter: '_getData'
    },

    headerView: {
        validator: '_validateView',
        writeOnce: true
    },

    footerView: {
        validator: '_validateView',
        writeOnce: true
    },

    bodyView: {
        validator: '_validateView',
        writeOnce: true
    },

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

    recordset: {
        // TODO: back compat pass through to ML
    },

    columnset: {
        // TODO: back compat pass through to columns
    }
};

Y.mix(Table.prototype, {
    // -- Instance properties -------------------------------------------------
    TABLE_TEMPLATE  : '<table></table>',
    CAPTION_TEMPLATE: '<caption></caption>',

    // -- Public methods ------------------------------------------------------
    bindUI: function () {
        // TODO: handle widget attribute changes
        this.after({
            captionChange: this._afterCaptionChange,
            summaryChange: this._afterSummaryChange
        });
    },

    getCell: function (row, col) {
        return this.body && this.body.getCell && this.body.getCell(row, col);
    },

    getColumn: function (name) {
        return this.get('columns.' + name);
    },

    getRow: function (index) {
        return this.body && this.body.getCell && this.body.getRow(index);
    },

    initializer: function (config) {
        this._initColumns();

        this._initRecordType();

        this._initData();

        this.after('columnsChange', this._afterColumnsChange);
    },

    renderUI: function () {
        var contentBox = this.get('contentBox'),
            table;

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
        }
    },

    // -- Protected and private methods ---------------------------------------

    _afterCaptionChange: function (e) {
        this._uiUpdateCaption(e.newVal);
    },

    _afterColumnsChange: function (e) {
        this._columnMap = this._parseColumns(e.newVal);
    },

    _afterSummaryChange: function (e) {
        this._uiUpdateSummary(e.newVal);
    },

    _createRecordClass: function (attrs) {
        var ATTRS = {},
            i, len;

        for (i = 0, len = attrs.length; i < len; ++i) {
            ATTRS[attrs[i]] = {};
        }

        return Y.Base.create('record', Y.Model, [], null, { ATTRS: ATTRS });
    },

    _getColumns: function (columns, name) {
        // name will be 'columns' or 'columns.foo'. Trim to the dot.
        // TODO: support name as an index or (row,column) index pair
        name = name.slice(8);

        return (name) ? this._columnMap[name] : columns;
    },

    _getData: function (val) {
        return this.data || val;
    },

    _initColumns: function () {
        var columns = this.get('columns'),
            data, attrHost;
        
        // Default column definition from the configured recordType or the
        // first item in the data.
        if (!columns) {
            attrHost = this.get('recordType');

            if (!attrHost) {
                data = this.get('data');

                if (data) {
                    if (isArray(data) && data.length) {
                        columns = keys(data[0]);
                    } else if (data.size && data.size()) {
                        attrHost = data.item(0).constructor;
                    }
                }
            }

            if (attrHost && attrHost.ATTRS) {
                // TODO: merge superclass attributes up to Model?
                columns = keys(attrHost.ATTRS);
            }
        }

        this._columnMap = this._parseColumns(columns || []);
    },

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
        }

        this.data = data;
    },

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
                recordType = this._createRecordClass(keys(data[0]));

            // Or if the columns were defined, build a class from the keys
            } else if (keys(columns).length) {
                recordType = this._createRecordClass(keys(columns));
            }

            if (recordType) {
                this.set('recordType', recordType, { silent: true });

                if (!columns) {
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

    _parseColumns: function (columns, map) {
        var i, len, col;

        map || (map = {});
        
        for (i = 0, len = columns.length; i < len; ++i) {
            col = columns[i];

            if (isString(col)) {
                col = { key: col };
            }

            if (col.key) {
                map[col.key] = col;
            } else if (isArray(col.children)) {
                this._parseColumns(col.children, map);
            }
        }

        return map;
    },

    _renderBody: function (table, data) {
        var BodyView = this.get('bodyView');

        // TODO: use a _viewConfig object that can be mixed onto by class
        // extensions, then pass that to either the view constructor or setAttrs
        if (BodyView) {
            this.body = (isFunction(BodyView)) ? 
                new BodyView({
                    source   : this,
                    container: this._tableNode,
                    columns  : this.get('columns'),
                    modelList: this.data,
                    cssPrefix: this._cssPrefix
                }) :
                BodyView;

            this.body.addTarget(this);
            this.body.render();
        }
    },

    _renderFooter: function (table, data) {
        var FooterView = this.get('footerView');
        
        if (FooterView) {
            this.foot = (isFunction(FooterView)) ? 
                new FooterView({
                    source   : this,
                    container: this._tableNode,
                    columns  : this.get('columns'),
                    modelList: this.data,
                    cssPrefix: this._cssPrefix
                }) :
                FooterView;

            this.foot.addTarget(this);
            this.foot.render();
        }
    },

    _renderHeader: function () {
        var HeaderView = this.get('headerView');
        
        if (HeaderView) {
            this.head = (isFunction(HeaderView)) ? 
                new HeaderView({
                    source   : this,
                    container: this._tableNode,
                    columns  : this.get('columns'),
                    modelList: this.data,
                    cssPrefix: this._cssPrefix
                }) :
                HeaderView; // Assume if it's not a function, it's an instance

            this.head.addTarget(this);
            this.head.render();
        }
        // TODO: If there's no HeaderView, should I remove an existing <thead>?
    },

    _renderTable: function () {
        var caption = this.get('caption');

        if (!this._tableNode) {
            this._tableNode = Y.Node.create(this.TABLE_TEMPLATE);
        }
        this._tableNode.addClass(this.getClassName('table'));

        this._uiUpdateSummary(this.get('summary'));

        this._uiUpdateCaption(caption);
    },

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
                    this.set('recordType', this._createRecordClass(keys(val[0])));
                }

                this.data.reset(val);
                // TODO: return true to decrease memory footprint?
            }
            // else pass through the array data, but don't assign this.data
            // Let the _initData process clean up.
        } else if (val && val.getAttrs && val.addTarget) {
            this.data = val;
            // TODO: return true to decrease memory footprint?
        } else {
            val = INVALID;
        }

        return val;
    },

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

    _uiUpdateSummary: function (summary) {
        this._tableNode.setAttribute('summary', summary || '');
    },

    _validateRecordType: function (val) {
        var api = (isFunction(val)) ? val.prototype : {};

        // Duck type based on known/likely consumed APIs
        return api.addTarget && api.get && api.getAttrs && api.set;
    },

    _validateView: function (val) {
        var api = isFunction(val) ? val.prototype : val;

        return (api === null) || (api.render && api.addTarget);
    }
});
}, 'gallery-2011.12.14-21-12', { requires: ['model-list'] });
YUI.add('gallery-datatable-350-preview-head', function (Y) {
var fromTemplate = Y.Lang.sub,
    Lang = Y.Lang,
    isArray = Lang.isArray,
    toArray = Y.Array,

    ClassNameManager = Y.ClassNameManager,
    _getClassName    = ClassNameManager.getClassName;

Y.namespace('DataTable').HeaderView = Y.Base.create('tableHeader', Y.View, [], {
    // -- Instance properties -------------------------------------------------
    CELL_TEMPLATE :
        '<th id="{_yuid}" abbr="{abbr}" ' +
                'colspan="{colspan}" rowspan="{rowspan}">' +
            '<div class="{linerClass}">' +
                '{content}' +
            '</div>' +
        '</th>',

    ROW_TEMPLATE:
        '<tr>{content}</tr>',

    THEAD_TEMPLATE:
        '<thead class="{classes}">{content}</thead>',

    // -- Public methods ------------------------------------------------------
    bindUI: function () {
        // TODO: How best to decouple this?
        this._eventHandles.push(
            this.host.after('columnsChange', this._afterColumnChange));
    },

    destructor: function () {
        (new Y.EventHandle(this._eventHandles)).detach();
    },

    getClassName: function () {
        var args = toArray(arguments);
        args.unshift(this._cssPrefix);
        args.push(true);

        return _getClassName.apply(ClassNameManager, args);
    },

    initializer: function (config) {
        var cssPrefix = config.cssPrefix || (config.host || {}).cssPrefix;

        this.host    = config.source;
        this.columns = this._parseColumns(config.columns);

        this._eventHandles = [];

        if (cssPrefix) {
            this._cssPrefix = cssPrefix;
        }
    },

    render: function () {
        var table    = this.get('container'),
            columns  = this.columns,
            thead    = this.host._theadNode,
            defaults = {
                            abbr: '',
                            colspan: 1,
                            rowspan: 1,
                            // TODO: remove dependence on this.host
                            linerClass: this.getClassName('liner')
                       },
            existing, replace, i, len, j, jlen, col, html;

        table = Y.one(table);
        if (table && table.get('tagName') !== 'TABLE') {
            table = table.one('table');
        }

        if (!table) {
            return this;
        }

        existing = table.one('> .' + this.getClassName('columns'));
        replace  = existing && (!thead || !thead.compareTo(existing));

        if (!thead) {
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
                                             ("Column " + j)
                                }
                            ));
                    }

                    thead += fromTemplate(this.ROW_TEMPLATE, {
                        content: html
                    });
                }
            }

            thead = fromTemplate(this.THEAD_TEMPLATE, {
                classes: this.getClassName('columns'),
                content: thead
            });
        }

        if (existing) {
            if (replace) {
                existing.replace(thead);
            }
        } else {
            table.insertBefore(thead, table.one('> tfoot, > tbody'));
        }

        this.bindUI();

        return this;
    },

    // -- Protected and private methods ---------------------------------------
    _afterColumnChange: function (e) {
        // TODO
    },

    _cssPrefix: 'table',

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

                    if (typeof col === 'string') {
                        row[i] = col = { key: col };
                    }

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
}, 'gallery-2011.12.14-21-12', { requires: ['view', 'gallery-datatable-350-preview-core'] });
YUI.add('gallery-datatable-350-preview-body', function (Y) {
var Lang         = Y.Lang,
    isObject     = Lang.isObject,
    isArray      = Lang.isArray,
    htmlEscape   = Y.Escape.html,
    fromTemplate = Y.Lang.sub,
    arrayIndexOf = Y.Array.indexOf,
    toArray      = Y.Array,

    ClassNameManager = Y.ClassNameManager,
    _getClassName    = ClassNameManager.getClassName;

Y.namespace('DataTable').BodyView = Y.Base.create('tableBody', Y.View, [], {
    // -- Instance properties -------------------------------------------------
    TBODY_TEMPLATE:
        '<tbody class="{classes}">{content}</tbody>',

    ROW_TEMPLATE :
        '<tr id="{clientId}" class="{rowClasses}">' +
            '{content}' +
        '</tr>',

    CELL_TEMPLATE:
        '<td headers="{headers}" class="{classes}">' +
            '<div class="{linerClass}">' +
                '{content}' +
            '</div>' +
        '</td>',

    // -- Public methods ------------------------------------------------------
    bindUI: function () {
        this._eventHandles.push(
            this.host.after('columnChange', this._afterColumnChange),
            this.get('modelList').after(
                ['*:change', '*:destroy'],
                this._afterDataChange, this));
    },

    destructor: function () {
        (new Y.EventHandle(this._eventHandles)).detach();
    },

    getCell: function (row, col) {
        var el = null;

        if (this._tbodyNode) {
            el = this._tbodyNode.getDOMNode().rows[+row];
            el && (el = el.cells[+col]);
        }
        
        return Y.one(el);
    },

    getClassName: function () {
        var args = toArray(arguments);
        args.unshift(this._cssPrefix);
        args.push(true);

        return _getClassName.apply(ClassNameManager, args);
    },

    getRow: function (index) {
        var el;

        if (this._tbodyNode) {
            el = this._tbodyNode.getDOMNode().rows[+index];
        }

        return Y.one(el);
    },

    initializer: function (config) {
        var cssPrefix = config.cssPrefix || (config.host || {}).cssPrefix;

        this.host    = config.source;
        this.columns = this._parseColumns(config.columns);
        this._tbodyNode = config.tbodyNode;

        this._eventHandles = [];

        if (cssPrefix) {
            this._cssPrefix = cssPrefix;
        }
    },

    render: function () {
        var table    = this.get('container'),
            data     = this.get('modelList'),
            columns  = this.columns,
            tbody    = this._tbodyNode,
            existing, replace;

        table =  Y.one(table);

        if (table && table.get('tagName') !== 'TABLE') {
            table = table.one('table');
        }

        if (!table) {
            return this;
        }

        existing = table.one('> .' + this.getClassName('data'));
        replace  = existing && (!tbody || !tbody.compareTo(existing));

        // Needed for mutation
        this._createRowTemplate(columns);

        if ((!tbody || replace) && data) {
            tbody = Y.Node.create(this._createDataHTML(columns));

            this._applyNodeFormatters(tbody, columns);
        }

        if (existing) {
            if (replace) {
                existing.replace(tbody);
            }
        } else {
            table.append(tbody);
        }

        this.bindUI();

        return this;
    },

    // -- Protected and private methods ---------------------------------------
    _afterColumnsChange: function (e) {
        this._parseColumns(e.newVal);

        this.render();
    },
    
    _afterDataChange: function (e) {
        // TODO
    },

    _applyNodeFormatters: function (tbody, columns) {
        var host = this.host,
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

                            keep = col.nodeFormatter.call(host, formatterData);

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

    _cssPrefix: 'table',

    _createDataHTML: function (columns) {
        var host = this.host,
            data = this.get('modelList'),
            odd  = this.getClassName('odd'),
            even = this.getClassName('even'),
            rowTemplate = this._rowTemplate,
            html = '';

        if (data) {
            data.each(function (record, index) {
                var data = record.getAttrs(),
                    i, len, col, key, value, formatterData, attr;

                for (i = 0, len = columns.length; i < len; ++i) {
                    col = columns[i];
                    key = col.key || col._yuid;
                    value = data[key];

                    data[key + '-classes']    = '';

                    if (col.formatter) {
                        formatterData = {
                            value     : value,
                            data      : data,
                            column    : col,
                            record    : record,
                            classnames: '',
                            rowindex  : index
                        };

                        if (typeof col.formatter === 'string') {
                            value = fromTemplate(col.formatter, formatterData);
                        } else {
                            // Formatters can either return a value
                            value = col.formatter.call(host, formatterData);

                            // or update the value property of the data obj passed
                            if (value === undefined) {
                                value = formatterData.value;
                            }

                            data[key + '-classes'] = formatterData.classnames;
                        }
                    }

                    if ((value === undefined || value === '') &&
                        col.emptyCellValue) {
                        value = col.emptyCellValue;
                    }

                    data[key] = value;
                }

                data.rowClasses = (index % 2) ? odd : even;

                html += fromTemplate(rowTemplate, data);
            });
        }

        return fromTemplate(this.TBODY_TEMPLATE, {
            classes: this.getClassName('data'),
            content: html
        });
    },

    _createRowTemplate: function (columns) {
        var html         = '',
            cellTemplate = this.CELL_TEMPLATE,
            linerClass   = this.getClassName('liner'),
            i, len, col, key, tokenValues;

        for (i = 0, len = columns.length; i < len; ++i) {
            col = columns[i];

            key = col.key || col.name || col._yuid;
            tokenValues = {
                content   : '{' + key + '}',
                headers   : col.headers.join(' '),
                linerClass: linerClass,
                classes   : this.getClassName(key) + ' {' + key + '-classes}'
            };

            if (col.nodeFormatter) {
                // Defer all node decoration to the formatter
                tokenValues.content    = '';
                tokenValues.attributes = '';
                tokenValues.classes    = '';
            }

            html += fromTemplate(cellTemplate, tokenValues);
        }

        this._rowTemplate = fromTemplate(this.ROW_TEMPLATE, {
            content: html
        });
    },

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
});
}, 'gallery-2011.12.14-21-12', { requires: ['view', 'gallery-datatable-350-preview-core'] });
Y.use('gallery-datatable-350-preview-core', 'gallery-datatable-350-preview-head', 'gallery-datatable-350-preview-body');
// Base, featureless implementation
Y.DataTable.Base = Y.Base.create('datatable', Y.Widget, [Y.DataTable.Core],
    null, {
        ATTRS: {
            // Default head and body views
            headerView: { value: Y.DataTable.HeaderView },
            bodyView  : { value: Y.DataTable.BodyView }
        }
    });

// Mutable implementation, derived initially from DataTable.Base
Y.DataTable = Y.mix(
    Y.Base.create('datatable', Y.DataTable.Base, []), // Create the class
    Y.DataTable); // Migrate static and namespaced classes


}, 'gallery-2011.12.14-21-12' ,{requires:['build-base', 'widget']});

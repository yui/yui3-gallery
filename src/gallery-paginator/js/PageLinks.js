/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * @module gallery-paginator
 */

/**
 * ui Component to generate the page links
 *
 * @class Paginator.ui.PageLinks
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */
Paginator.ui.PageLinks = function (p) {
    this.paginator = p;

    p.on('destroy',this.destroy,this);
    p.after('recordOffsetChange',this.update,this);
    p.after('rowsPerPageChange',this.update,this);
    p.after('totalRecordsChange',this.update,this);
    p.after('disabledChange',this.update,this);

    p.after('pageLinksContainerClassChange', this.rebuild,this);
    p.after('pageLinkClassChange', this.rebuild,this);
    p.after('currentPageClassChange', this.rebuild,this);
    p.after('pageLinksChange', this.rebuild,this);
};

/**
 * CSS class assigned to the span containing the page links.
 * @attribute pageLinksContainerClass
 * @default 'yui-paginator-pages'
 */
Paginator.ATTRS.pageLinksContainerClass =
{
    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'pages'),
    validator : Y.Lang.isString
};

/**
 * CSS class assigned to each page link/span.
 * @attribute pageLinkClass
 * @default 'yui-paginator-page'
 */
Paginator.ATTRS.pageLinkClass =
{
    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'page'),
    validator : Y.Lang.isString
};

/**
 * CSS class assigned to the current page span.
 * @attribute currentPageClass
 * @default 'yui-paginator-current-page'
 */
Paginator.ATTRS.currentPageClass =
{
    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'current-page'),
    validator : Y.Lang.isString
};

/**
 * Maximum number of page links to display at one time.
 * @attribute pageLinks
 * @default 10
 */
Paginator.ATTRS.pageLinks =
{
    value : 10,
    validator : Paginator.isNumeric
};

/**
 * Function used generate the innerHTML for each page link/span.  The
 * function receives as parameters the page number and a reference to the
 * paginator object.
 * @attribute pageLabelBuilder
 * @default function (page, paginator) { return page; }
 */
Paginator.ATTRS.pageLabelBuilder =
{
    value : function (page, paginator) { return page; },
    validator : Y.Lang.isFunction
};

/**
 * Templates for generating page links.
 * @property templates
 * @static
 */
Paginator.ui.PageLinks.templates =
{
    currentPageLink:  '<span class="{currentPageClass} {pageLinkClass}">{label}</span>',
    pageLink:         '<a href="#" class="{pageLinkClass}" page="{page}">{label}</a>',
    disabledPageLink: '<span class="{pageLinkClass} disabled" page="{page}">{label}</span>'
}

/**
 * Calculates start and end page numbers given a current page, attempting
 * to keep the current page in the middle
 * @static
 * @method calculateRange
 * @param {int} currentPage  The current page
 * @param {int} [totalPages] Maximum number of pages
 * @param {int} [numPages]   Preferred number of pages in range
 * @return {Array} [start_page_number, end_page_number]
 */
Paginator.ui.PageLinks.calculateRange = function (currentPage,totalPages,numPages) {
    var UNLIMITED = Paginator.VALUE_UNLIMITED,
        start, end, delta;

    // Either has no pages, or unlimited pages.  Show none.
    if (!currentPage || numPages === 0 || totalPages === 0 ||
        (totalPages === UNLIMITED && numPages === UNLIMITED)) {
        return [0,-1];
    }

    // Limit requested pageLinks if there are fewer totalPages
    if (totalPages !== UNLIMITED) {
        numPages = numPages === UNLIMITED ?
                    totalPages :
                    Math.min(numPages,totalPages);
    }

    // Determine start and end, trying to keep current in the middle
    start = Math.max(1,Math.ceil(currentPage - (numPages/2)));
    if (totalPages === UNLIMITED) {
        end = start + numPages - 1;
    } else {
        end = Math.min(totalPages, start + numPages - 1);
    }

    // Adjust the start index when approaching the last page
    delta = numPages - (end - start + 1);
    start = Math.max(1, start - delta);

    return [start,end];
};


Paginator.ui.PageLinks.prototype = {

    /**
     * Current page
     * @property current
     * @type number
     * @private
     */
    current     : 0,

    /**
     * Span node containing the page links
     * @property container
     * @type HTMLElement
     * @private
     */
    container   : null,


    /**
     * Removes the page links container node and clears event listeners
     * @method destroy
     * @private
     */
    destroy : function () {
        this.container.remove(true);
        this.container = null;
    },

    /**
     * Generate the nodes and return the container node containing page links
     * appropriate to the current pagination state.
     * @method render
     * @param id_base {string} used to create unique ids for generated nodes
     * @return {HTMLElement}
     */
    render : function (id_base) {

        if (this.container) {
            this.container.remove(true);
        }

        // Set up container
        this.container = Y.Node.create(
            '<span id="'+id_base+'-pages"></span>');
        this.container.on('click',this.onClick,this);

        // Call update, flagging a need to rebuild
        this.update({newVal : null, rebuild : true});

        return this.container;
    },

    /**
     * Update the links if appropriate
     * @method update
     * @param e {CustomEvent} The calling change event
     */
    update : function (e) {
        if (e && e.prevVal === e.newVal) {
            return;
        }

        var p           = this.paginator,
            currentPage = p.getCurrentPage();

        // Replace content if there's been a change
        if (this.current !== currentPage || !currentPage || e.rebuild) {
            var labelBuilder = p.get('pageLabelBuilder'),
                totalPages   = p.getTotalPages(),
                range        = Paginator.ui.PageLinks.calculateRange(
                                currentPage,
                                totalPages,
                                p.get('pageLinks')),
                start        = range[0],
                end          = range[1],
                content      = '',
                showLast     = false,
                i,
                params = {
                    currentPageClass: p.get('currentPageClass'),
                    pageLinkClass:    p.get('pageLinkClass')
                },
                pageLink = p.get('disabled') ?
                    Paginator.ui.PageLinks.templates.disabledPageLink :
                    Paginator.ui.PageLinks.templates.pageLink;

            if (0 < start && start <= end) {
                if (start > 1) {
                    start++;
                    params.page  = 1;
                    params.label = labelBuilder(1,p);
                    content     += Y.Lang.sub(pageLink, params);
                    content     += '&hellip;';
                }

                if (end < totalPages) {
                    end--;
                    showLast = true;
                }

                for (i = start; i <= end; ++i) {
                    params.page  = i;
                    params.label = labelBuilder(i,p);
                    content += Y.Lang.sub(i === currentPage ?
                        Paginator.ui.PageLinks.templates.currentPageLink : pageLink,
                        params);
                }

                if (showLast) {
                    params.page  = totalPages;
                    params.label = labelBuilder(totalPages,p);
                    content     += '&hellip;';
                    content     += Y.Lang.sub(pageLink, params);
                }
            }

            this.container.set('className', p.get('pageLinksContainerClass'));
            this.container.set('innerHTML', content);
        }
    },

    /**
     * Force a rebuild of the page links.
     * @method rebuild
     * @param e {CustomEvent} The calling change event
     */
    rebuild     : function (e) {
        e.rebuild = true;
        this.update(e);
    },

    /**
     * Listener for the container's onclick event.  Looks for qualifying link
     * clicks, and pulls the page number from the link's page attribute.
     * Sends link's page attribute to the Paginator's setPage method.
     * @method onClick
     * @param e {DOMEvent} The click event
     */
    onClick : function (e) {
        var t = e.target;
        if (t && t.hasClass(this.paginator.get('pageLinkClass'))) {

            e.halt();

            this.paginator.setPage(parseInt(t.getAttribute('page'),10));
        }
    }

};

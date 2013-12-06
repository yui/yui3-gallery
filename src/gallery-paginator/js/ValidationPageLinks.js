/**
 * @module gallery-paginator
 */

/**********************************************************************
 * Adds per-page error notification to Paginator.ui.PageLinks.
 *
 * @class Paginator.ui.ValidationPageLinks
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */

Paginator.ui.ValidationPageLinks = function(
	/* Paginator */	p)
{
	Paginator.ui.ValidationPageLinks.superclass.constructor.call(this, p);

	p.after('pageStatusChange', this.rebuild, this);
};

var vpl_status_prefix = 'yui3-has';

/**
 * Array of status strings for each page.  If the status value for a page
 * is not empty, it is used to build a CSS class for the page:
 * yui3-has&lt;status&gt;
 *
 * @attribute pageStatus
 */
Paginator.ATTRS.pageStatus =
{
	value:     [],
	validator: Y.Lang.isArray
};

/**
 * Templates for generating page links.
 * @property templates
 * @static
 */
Paginator.ui.ValidationPageLinks.templates =
{
	currentPageLink:  '<span class="{link} {curr} {status}">{label}</span>',
	pageLink:         '<a href="#" class="{link} {status}" page="{page}">{label}</a>',
	disabledPageLink: '<span class="{link} disabled {status}" page="{page}">{label}</span>'
};

Y.extend(Paginator.ui.ValidationPageLinks, Paginator.ui.PageLinks,
{
	update: function(e)
	{
		if (e && e.prevVal === e.newVal)
		{
			return;
		}

		var currentPage	= this.paginator.getCurrentPage();

		if (this.current !== currentPage || !currentPage || e.rebuild)
		{
			var linkClass    = this.paginator.get('pageLinkClass'),
				status       = this.paginator.get('pageStatus'),
				labelBuilder = this.paginator.get('pageLabelBuilder'),
				totalPages   = this.paginator.getTotalPages(),
				linkMarkup   = this.paginator.get('disabled') ?
					Paginator.ui.ValidationPageLinks.templates.disabledPageLink :
					Paginator.ui.ValidationPageLinks.templates.pageLink;

			var range =
				Paginator.ui.PageLinks.calculateRange(
					currentPage, totalPages, this.paginator.get('pageLinks'));

			var content = '';

			if (0 < range[0] && range[0] <= range[1])
			{
				if (range[0] > 1)
				{
					range[0]++;
					content += Y.Lang.sub(linkMarkup,
					{
						link:   linkClass,
						curr:   '',
						status: status[0] ? vpl_status_prefix + status[0] : '',
						page:   1,
						label:  labelBuilder(1, this.paginator)
					});
					content += '&hellip;'
				}

				if (range[1] < totalPages)
				{
					range[1]--;
					var showLast = true;
				}

				for (var i=range[0]; i<=range[1]; i++)
				{
					content += Y.Lang.sub(i === currentPage ? Paginator.ui.ValidationPageLinks.templates.currentPageLink : linkMarkup,
					{
						link:   linkClass,
						curr:   (i === currentPage ? this.paginator.get('currentPageClass') : ''),
						status: status[i-1] ? vpl_status_prefix + status[i-1] : '',
						page:   i,
						label:  labelBuilder(i, this.paginator)
					});
				}

				if (showLast)
				{
					content += '&hellip;';
					content += Y.Lang.sub(linkMarkup,
					{
						link:   linkClass,
						curr:   '',
						status: status[totalPages-1] ? vpl_status_prefix + status[totalPages-1] : '',
						page:   totalPages,
						label:  labelBuilder(totalPages, this.paginator)
					});
				}
			}

			this.container.set('innerHTML', content);
		}
	}

});

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

Y.extend(Paginator.ui.ValidationPageLinks, Paginator.ui.PageLinks,
{
	update: function(e)
	{
		if (e && e.prevVal === e.newVal)
		{
			return;
		}

		var currentPage	= this.paginator.getCurrentPage();

		var curr_markup = '<span class="{link} {curr} {status}">{label}</span>';
		var link_markup = '<a href="#" class="{link} {status}" page="{page}">{label}</a>';

		if (this.current !== currentPage || !currentPage || e.rebuild)
		{
			var linkClass    = this.paginator.get('pageLinkClass');
			var status       = this.paginator.get('pageStatus');
			var labelBuilder = this.paginator.get('pageLabelBuilder');

			var range =
				Paginator.ui.PageLinks.calculateRange(
					currentPage, this.paginator.getTotalPages(), this.paginator.get('pageLinks'));

			var content = '';
			for (var i=range[0]; i<=range[1]; i++)
			{
				content += Y.Lang.sub(i === currentPage ? curr_markup : link_markup,
				{
					link:   linkClass,
					curr:   (i === currentPage ? this.paginator.get('currentPageClass') : ''),
					status: status[i-1] ? vpl_status_prefix + status[i-1] : '',
					page:   i,
					label:  labelBuilder(i, this.paginator)
				});
			}

			this.container.set('innerHTML', content);
		}
	}

});

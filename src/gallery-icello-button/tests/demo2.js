var btn = null,
	output = null,
	Button = null,
	btnSave = null;

YUI().use('gallery-icello-button', 'node-event-simulate', function (Y) {
	Button = Y.Icello.Button;

	Y.on('domready', function (e) {
		btn = Button.renderNode('#btn');
		btn.on('click', function (e) {
			e.preventDefault();
			Y.log('', 'info', 'btn click handler')
		});

		
		output = Y.one('#output');
		
		btnSave = Button.renderNode('#btnSave');
		btnSave.on('click', function (e) {
			e.preventDefault();
			console.log('btnSave click handler');
		});
	});
});
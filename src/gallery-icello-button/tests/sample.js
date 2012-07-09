YUI().use('gallery-icello-button', function (Y) {
    Y.on('domready', function (e) {
        var Button = Y.Icello.Button,
            btn = new Button({
                icon: Button.ICONS.ALERT,
                label: 'ALERT Button'
            });
        
        btn.on('click', function () {
            //e.preventDefault() is not needed
            var curr_icon = btn.get('icon');

            if(curr_icon === Button.ICONS.ALERT) {
                btn.set('icon', Button.ICONS.INFO);
                btn.set('label', 'INFO Button');
            } else {
                btn.set('icon', Button.ICONS.ALERT);
                btn.set('label', 'ALERT Button');
            }

            //calling btn.syncUI() is needed, there are no 'after' handlers for icon and label, because css is different depending on whether it's label/icon, label only or icon only
            btn.syncUI();
        });

        btn.render();	
    });
});
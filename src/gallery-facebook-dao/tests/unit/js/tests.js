YUI.add('module-tests', function (Y) {

    var suite = new Y.Test.Suite('gallery-facebook-dao');

    suite.add(new Y.Test.Case({
        name: 'Gallery Facebook Dao Tests',
        
        fbData: null,
        
        'test list posts': function () {
            var me = this;
            var posts = null;
            var fbDataConfig = {
                fbAppId: '337209605514',
                fbChannelFile: '/channel.html',
                onInit: function (e) {
                    me.fbData.listSitePosts('136614686409487', function (data) {
                        posts = data;
                        console.info(data);
                    });
                }
            };
            this.fbData = new Y.FacebookDAO(fbDataConfig);

            this.wait(function(){
                Y.Assert.areNotEqual(posts.data, null, "Posts should not be null")
            }, 4000);
        }
    }));

    Y.Test.Runner.add(suite);


}, '', {
    requires: ['test', 'gallery-facebook-dao']
});
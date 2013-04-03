YUI.add('module-tests', function (Y) {

    var suite = new Y.Test.Suite('gallery-facebook-dao');

    suite.add(new Y.Test.Case({
        name: 'Gallery Facebook Dao Tests',

        fbData: null,

        'test list posts': function () {
            var me = this,
			posts = null,
			fbAppId = '337209605514',
			fbChannelFile = '/channel.html',
			siteId = '136614686409487';
            FB = Y.Mock();
			var postsMock = {
				data: [
					{from: {
					    id: '123456'
						},
					 message: 'dummy message'
					}
				]
			};
			var imageMock = {
				data: {
					url: 'facebook.com/imageurl'
				}
			}
            Y.Mock.expect(FB, {
                method: "init",
                args: [Y.Mock.Value.Object]
            });
			FB.getLoginStatus = function(callback) {
				callback({status: 'connected'});
			}
			FB.api = function(apiPath, callback) {
				if (apiPath == (siteId + '/feed')) {
					callback(postsMock);
				}
				if (apiPath.indexOf('/picture') > 0) {
					callback(imageMock);
				}
			}
            var fbDataConfig = {
                fbAppId: fbAppId,
                fbChannelFile: fbChannelFile,
                onInit: function (e) {
                    me.fbData.listSitePosts(siteId, function (data) {
                        posts = data;
                        console.info(data);
                    });
                }
            };
            this.fbData = new Y.FacebookDAO(fbDataConfig);
            /* fbAsyncInit directly to start simulating fb interation */
            window.fbAsyncInit();
            /* evaluate mock data */
            Y.Assert.areNotEqual(posts.data, null, "Posts should not be null")
        }
    }));

    Y.Test.Runner.add(suite);


}, '', {
    requires: ['test', 'gallery-facebook-dao']
});
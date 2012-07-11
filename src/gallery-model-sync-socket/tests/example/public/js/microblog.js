YUI.add('microblog', function (Y) {

    var BlogAppView, PostList, PostModel, PostView;
    /* Model */

    PostModel = Y.PostModel = Y.Base.create('postModel', Y.Model, [Y.ModelSync.Socket], {
        root: '/posts'
    }, {
        ATTRS: {
            id: '',
            author: '',
            email: '',
            message: ''
        }
    });

    PostList = Y.PostList = Y.Base.create('postList', Y.ModelList, [Y.ModelSync.Socket], {
        model: PostModel,
        url: '/posts'
    });

    PostView = Y.PostView = Y.Base.create('postView', Y.View, [], {
        containerTemplate: '<li class="post-item" />',
        
        events: {
            '.post-text': {
                click: 'edit',
                focus: 'edit'
            },
            '.delete-icon': {
                click: 'remove'
            },
            '.post-edit': {
                blur: 'save',
                keypress: 'enter'
            }
        },
        
        template: Y.one('#blog-post-template').getContent(),
        
        initializer: function () {
            var model = this.get('model'),
                self = this;

            model.onSocket('delete', function (e) {
                self.constructor.superclass.remove.call(self);
            });

            model.onSocket('update', function (e) {
                this.setAttrs(e.data);
            });

            model.after('change', this.render, this);
            
            /* model.after('destroy', function () {
                this.destroy({remove: true});
            }, this); */
        },

        render: function () {
            var container = this.get('container'),
                model = this.get('model');
                
            container.setContent(Y.Lang.sub(this.template, {
                author: model.getAsHTML('author'),
                email: model.get('email'),
                message: model.getAsHTML('message')
            }));
            
            if (model.get('author') === Y.Cookie.get('author')) {
                container.one('.post-profile-name').addClass('current-user');
            }

            this.set('inputNode', container.one('.post-edit'));
            
            return this;
        },
        
        edit: function (e) {
            if (this.get('model').get('author') === Y.Cookie.get('author')) {
                this.get('container').addClass('editing');
                this.get('inputNode').focus();
            }
        },
        
        remove: function (e) {
            e.preventDefault();
            this.constructor.superclass.remove.call(this);
            this.get('model').destroy({'delete': true});
        },

        save: function () {
            var message = Y.Escape.html(this.get('inputNode').get('value'));
            this.get('container').removeClass('editing');
            this.get('model').set('message', message).save();
        },

        enter: function (e) {
            if (e.keyCode === 13) {
                Y.one('#new-post').focus();
            }
        }
    });
    
    BlogAppView = Y.BlogAppView = Y.Base.create('blogAppView', Y.View, [], {
        events: {
            '#reg-btn': {
                click: 'setCookies'
            },
            '#new-user': {
                keypress: 'setCookies'
            },
            '#new-email': {
                keypress: 'setCookies'
            },
            '#sign-out': {
                click: 'deleteCookies'
            },
            '#post-btn': {
                click: 'createPost'
            },
            '#new-post': {
                keypress: 'createPost'
            }
        },

        templateOut: Y.one('#logged-out-template').getContent(),
        
        templateIn: Y.one('#logged-in-template').getContent(),
        
        initializer: function () {
            var list = this.postList = new PostList();

            list.onSocket('read', function (e) {
                list.add(e.data);
            });

            list.onSocket('construct', function (e) {
                list.add(e.data);
            });
            
            list.after('add', this.add, this);
            list.after(['add', 'remove'],
                this.render, this);

            list.load();
            this.render();
        },
        
        render: function () {
            var postList = this.postList,
                inputDisplay = this.get('container').one('#input-container'),
                author = Y.Cookie.get('author'),
                email = Y.Cookie.get('email');

            if (author && email) {
                inputDisplay.setHTML(Y.Lang.sub(this.templateIn, {
                    author: author
                }));
            } else {
                inputDisplay.setHTML(this.templateOut);
            }
            
            return this;
        },
        
        setCookies: function (e) {
            var author = Y.Lang.trim(Y.one('#new-user').get('value')),
                email = hex_md5(Y.Lang.trim(Y.one('#new-email').get('value')));
            
            if (!author || !email) {
                return;
            }
            
            if (e.keyCode === 13 || e.type === 'click') {
                Y.Cookie.set('author', author);
                Y.Cookie.set('email', email);
            
                this.render();
            }
        },

        deleteCookies: function (e) {
            Y.Cookie.remove('author');
            Y.Cookie.remove('email');

            this.render();
        },

        add: function (e) {
            var view = new PostView({model: e.model});
            this.get('container').one('#post-list').append(
                view.render().get('container')
            );
        },
        
        createPost: function (e) {
            var author = Y.Cookie.get('author'),
                email = Y.Cookie.get('email'),
                newPost = Y.one('#new-post'),
                message;
            
            if (e.keyCode === 13 || e.type === 'click') {
                message = Y.Lang.trim(Y.one('#new-post').get('value'));
                if (!message) {
                    return;
                }

                this.postList.create({
                    author: author,
                    email: email,
                    message: message
                });
                
                newPost.set('value', '');
            }
        }
    }, {
        ATTRS: {
            container: {
                valueFn: function () { return Y.one('#blog'); }
            }
        }
    });
}, '@VERSION@', {requires: ["cookie", "event-focus", "json", "model", "model-list", "view", "gallery-model-sync-socket", "md5"]});

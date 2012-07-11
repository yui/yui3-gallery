YUI.add('model-sync-socket-test', function (Y) {

var ArrayAssert  = Y.ArrayAssert,
    Assert       = Y.Assert,
    ObjectAssert = Y.ObjectAssert;

// -- ModelSync.Socket Suite ---------------------------------------------------
suite = new Y.Test.Suite('ModelSync.Socket');

// -- ModelSync.Socket: Lifecycle ----------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Lifecycle',

    setUp : function () {
        this.TestModel      = Y.Base.create('testModel', Y.Model, [Y.ModelSync.Socket]);
        this.TestModelList  = Y.Base.create('testModelList', Y.ModelList, [Y.ModelSync.Socket], {
            model : this.TestModel
        });
    },

    tearDown : function () {
        delete this.TestModel;
        delete this.TestModelList;
    },

    'initializer should set local `url` property' : function () {
        var model = new this.TestModel({ url: '/model/123' });
        Assert.areSame('/model/123', model.url);

        var modelList = new this.TestModelList({ url: '/model' });
        Assert.areSame('/model', modelList.url);
    }
}));

// -- ModelSync.Socket: Properties ---------------------------------------------
suite.add(new Y.Test.Case({
    name : 'Properties',

    setUp : function () {
        this.TestModel      = Y.Base.create('testModel', Y.Model, [Y.ModelSync.Socket]);
        this.TestModelList  = Y.Base.create('testModelList', Y.ModelList, [Y.ModelSync.Socket], {
            model : this.TestModel
        });
    },

    tearDown : function () {
        delete this.TestModel;
        delete this.TestModelList;
    },

    '`root` property should have a default value' : function () {
        var model = new this.TestModel();
        Assert.areSame('', model.root);

        var modelList = new this.TestModelList();
        Assert.areSame('', modelList.root);
    },

    '`url` should be a function by default' : function () {
        var model = new this.TestModel();
        Assert.isTrue(Y.Lang.isFunction(model.url));

        var modelList = new this.TestModelList();
        Assert.isTrue(Y.Lang.isFunction(modelList.url));
    }
}));

// -- ModelSync.REST: Methods --------------------------------------------------
suite.add(new Y.Test.Case({
    name : 'Methods',

    setUp : function () {
        this.TestModel      = Y.Base.create('testModel', Y.Model, [Y.ModelSync.Socket]);
        this.TestModelList  = Y.Base.create('testModelList', Y.ModelList, [Y.ModelSync.Socket], {
            model : this.TestModel
        });
    },

    tearDown : function () {
        delete this.TestModel;
        delete this.TestModelList;
    },

    '_getURL() should return a String' : function () {
        var model = new this.TestModel();
        Assert.isString(model._getURL());

        var modelList = new this.TestModelList();
        Assert.isString(modelList._getURL());
    },

    '_getURL() should return locally set `url` property' : function () {
        var model = new this.TestModel({ url: '/model/123' });
        Assert.areSame('model/123', model._getURL());

        model.url = '/model/abc';
        Assert.areSame('model/abc', model._getURL());

        var modelList = new this.TestModelList({ url: '/model' });
        Assert.areSame('model', modelList._getURL());

        modelList.url = '/models';
        Assert.areSame('models', modelList._getURL());
    },

    '_getURL() should substitute placeholder values of Models’ `url`' : function () {
        var model = new this.TestModel({
            id : 123,
            url: '/model/{id}/'
        });

        Assert.areSame('model/123/', model._getURL());

        model.addAttr('foo', { value: 'bar' });
        model.url = '/{foo}/{id}';
        Assert.areSame('bar/123', model._getURL());
    },

    '_getURL() should not substitute placeholder values of ModelLists’ `url`' : function () {
        var modelList = new this.TestModelList({ url: '/{foo}/' });

        modelList.addAttr('foo', { value: 'bar' });
        Assert.areSame('bar', modelList.get('foo'));
        Assert.areSame('{foo}/', modelList._getURL());
    },

    '_getURL() should URL-encode the substitutions of placeholder values of Models’ `url`' : function () {
        var model = new this.TestModel({
            id : '123 456',
            url: '/model/{id}'
        });

        Assert.areSame('model/123%20456', model._getURL());
    },

    '_getURL() should not substitute Arrays, Objects, or Boolean values of Models’ `url`' : function () {
        var model = new this.TestModel({
            id : 'asdf',
            url: '/model/{foo}/{bar}/{baz}/{id}'
        });

        model.addAttrs({
            foo : { value: [1, 2, 3] },
            bar : { value: { zee: 'zee' } },
            baz : { value: true }
        });

        Assert.areSame('model/{foo}/{bar}/{baz}/asdf', model._getURL());
    },

    '_getURL() should return `root` if `url` is falsy' : function () {
        var model = new this.TestModel();

        model.root  = 'model/';
        model.url   = '';

        Assert.areSame('model/', model._getURL());
    },

    'url() should return `root` if ModelList or Model is new' : function () {
        var model = new this.TestModel();
        model.root = '/model';
        Assert.areSame(model.root, model.url());

        var modelList = new this.TestModelList();
        modelList.root = '/model';
        Assert.areSame(modelList.root, modelList.url());
    },

    'url() should return a URL that ends with a / only if Model’s `root` ends with a /' : function () {
        var model = new this.TestModel({ id: 123 });

        model.root = '/model';
        Assert.areSame('model/123', model.url());

        model.root = '/model/';
        Assert.areSame('model/123/', model.url());
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['gallery-model-sync-socket', 'model', 'model-list', 'test']
});

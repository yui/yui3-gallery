<?php

    $requestUri = $_SERVER['REQUEST_URI'];
    $selfUri = $_SERVER['PHP_SELF'];
    $selfDirName = dirname($selfUri);
    //var_dump($selfDirName);

    $paramsStr = substr($requestUri, strlen($selfDirName)+1);

    if (!$paramsStr) {
        $params = array(
            'page' => 'home',
            'display' => 'list'
        );
    } else {
        if (substr($paramsStr, 0, 1) == '?') {
            parse_str(substr($paramsStr, 1), $params);
        } else {
            $arr = preg_split('/\//', $paramsStr);
            $params = array(
                'page' => $arr[0],
                'display' => count($arr) > 1 ? $arr[1] : null,
            );
        }
        $params['display' ] = $params['display'] ? $params['display'] : 'list';
    }

    if (!$params['page'] || !$params['display']) {
        header("HTTP/1.0 404 Not Found");
        echo 'Page not found';
        return;
    }

    $jsonFile = './' . $params['page'] . '.data';
    if (!file_exists($jsonFile)) {
        header("HTTP/1.0 404 Not Found");
        echo 'Resource not found';
        return;
    }

?>
<!DOCTYPE HTML>

<html>
    <head>
        <meta name="viewport" content="width=device-width,user-scalable=no">

        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <title>Test</title>
        <!--for local dev without WIFI -->
<!--
        <script type="text/javascript" src="http://localhost/3.3.0/build/yui/yui-min.js"></script>
        <link type="text/css" src="http://localhost/3.3.0/build/cssgrids/grids-min.css"/>
-->

        <script type="text/javascript" src="http://yui.yahooapis.com/combo?3.3.0/build/yui/yui-min.js"></script>
        <script type="text/javascript" src="/yui3-gallery/src/gallery-unified-history/build_tmp/gallery-unified-history-debug.js"></script>

        <style type="text/css" media="screen"> #demo{
    width: 640px;
    margin: 10px auto;
}

ul.list {
    display: block;
    list-style-type: none;
    height: 40px;
    text-align: center;
}

ul.list li {
    cursor: pointer;
    float: left;
    border: 1px solid #DADADA;
    margin-left: 10px;
    width: 80px;
    height: 40px;
    display: block;
    line-height: 40px;
    vertical-align: middle;
    cursor: pointer;
}

ul.list li a{
    display: block;
    height: 40px;
}

ul.list li:hover {
    color: #AAA;
}

ul.list .selected{
    color: #BBB;
}


.selected {
    background-color: #777;
}

.art-img {
    border: 2px solid #DDDAD2;
    float: right;
}

.floatLeft {
    float: left;
}

.floatRight {
    float: right;
}

#console {
    position: fixed;
    right: 0;
    top: 50%;
    width:300px;
    height: 2em;
    background: yellow;
}
        </style>
    </head>
    <body class="yui3-skin-sam doc2">
    <script type="text/javascript">
        YUI_config = { 
            baseUrl : "<?php echo $selfDirName; ?>",
            currPage: "<?php echo $params['page']; ?>"
        };
    </script>
        <div id="demo">
            <div class='hd'>
                <ul id="navi-list" class="list">
                    <li><a id="home" class="<?php echo $params['page'] == 'home' ? 'selected' : '' ?> navi" href="home">Home</a></li>
                    <li><a id="articles" class="<?php echo $params['page'] == 'articles' ? 'selected' : '' ?> navi" href="articles">Articles</a></li>
                    <li><a id="about" class="<?php echo $params['page'] == 'about' ? 'selected' : '' ?> navi" href="about">About</a></li>
                </ul>
            </div>

            <div class='bd'>
                <p id="content">
    <?php
        $fileContent = file_get_contents($jsonFile);
        $data = json_decode($fileContent);
        echo $data->content;
    ?>
<!--
                    <img class="art-img" src="<?php echo $data->img; ?>"></img>
-->
                </p>
            </div>
        </div>
            <div id="console"></div>
        </div>

        <script type="text/javascript" charset="utf-8">
YUI({
//    filter: 'raw',
//    combine: false
}).use('history', 'gallery-unified-history', 'node', 'io', 'json', function(Y) {

var nodeContent = Y.one('#content'),

    consoleNode = Y.one('#console'),

    life = 0,

    history = new Y.HistoryHash({
        usePath: ['page', 'display']
        //useKeyValuePair: 1
    }),

    currPage;

Y.later(1000, null, function() {
    life ++;
    consoleNode.set('innerHTML', 'The page has lived for ' + life + ' seconds');
}, null, true);

currPage = history.get('page');
currPage = currPage || 'home';
navigate(Y.one('#' + currPage));

history.on('pageChange', function(ev) {
    Y.log(ev.src);
    // no necessary
    //navigate(Y.one('#' + ev.newVal));
});

function navigate(target) {
    Y.log('enter navigate');

    Y.one('#navi-list .selected').removeClass('selected');
    target.addClass('selected');

    pageId = target.getAttribute('href');

    var jsonLink = Y.config.baseUrl + "/" + pageId + ".data";
    //Y.log(jsonLink);

    Y.io(jsonLink, {
        on: {
            success: function(i, o) {
                var data = Y.JSON.parse(o.responseText);
                nodeContent.set('innerHTML', data.content);

                Y.log('start history.add');
                history.add({
                    'page': pageId
                }, {
                    title: data.title,
                    url: Y.config.baseUrl + "/" + pageId
                });
            }
        }
    });

}

function onPageClick(ev) {

    if (ev.target.hasClass('navi')) {
        navigate(ev.target);
        ev.preventDefault();
    }
}

Y.delegate('click', onPageClick, 'body', 'a');

});
        </script>
    </body>
</html>

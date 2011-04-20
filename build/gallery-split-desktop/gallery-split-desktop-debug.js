YUI.add('gallery-split-desktop', function(Y) {

    var PX = 'px',
        POUND = '#',
        HTML = 'HTML',
        WIDTH = 'width',
        HEIGHT = 'height',
        BACKGROUNDIMAGE = 'backgroundImage',
        BACKGROUNDPOSITION = 'backgroundPosition',
        PATH_TO_IMAGES = 'assets/',
        FALLBACK_PATH = '/gallery-split-desktop/',
        PAGE_DEF_WIDTH = 960,
        NW_MIN_WIDTH = 150,
        DEF_MAIN_HEIGHT = 700,
        DEF_CROWN_HEIGHT = 30,
        DRAG_HERE_IMG = 'drag-here.png',
        DRAG_HERE_IMG_URL = PATH_TO_IMAGES + DRAG_HERE_IMG,
        DRAG_HERE_IMG_LEFT = 162,
        DRAG_HERE_IMG_TOP = 7,
        HANDLE_IMG = 'center-handle.png',
        HANDLE_IMG_TPL = null,
        HANDLE_ID = 'handle',
        DEF_PREFIX = 'ea_',
        ID_OPEN_TPL = 'id="',
        ID_CLOSE_TPL = '" ',
        IMG_OPEN_TPL = '<img ',
        SRC_OPEN_TPL = 'src="',
        SRC_CLOSE_TPL = '" ',
        IMG_CLOSE_TPL = '/>',
        BORDERS_COLOR = POUND + '99cccc',
        BORDER_PIX_IMG = 'pix-blue.gif',
        BORDER_PIX_URL = PATH_TO_IMAGES + BORDER_PIX_IMG,
        FULL_DESKTOP = {
            wrapper: 'page_wrapper',
            crown: 'crown',
            nw: 'nw',
            nwbody: 'body_nw',
            ne: 'ne',
            borders: 'borders',
            nebody: 'body_ne',
            main: 'main'
        },
        PAGE_WIDTH_CONF = 'pageWidth',
        BORDERS_COLOR_CONF = 'bordersColor',
        DRAG_HERE_IMG_CONF = 'dragHereImg',
        PATH_TO_IMAGES_CONF = 'pathToImages',
        BORDER_PIX_CONF	= 'borderPixImg',
        HANDLE_IMG_CONF	= 'handleImg',
        DRAG_HERE_LEFT_CONF	= 'dragHereLeft',
        DRAG_HERE_TOP_CONF = 'dragHereTop',
        MAIN_HEIGHT_CONF = 'mainHeight',
        CROWN_HEIGHT_CONF = 'crownHeight',
        PREFIX_CONF = 'prefix',
        /*
        default provided here, updated if PREFIX is customized.
        Corresponding nodes are fetched after configuration based on updated selector
        */
        RESIZER_SELECTOR = POUND + DEF_PREFIX + FULL_DESKTOP.ne,
        SECONDARY_SELECTOR = POUND + DEF_PREFIX + FULL_DESKTOP.nwbody,
        MAIN_SELECTOR = POUND + DEF_PREFIX + FULL_DESKTOP.main,
        WRAPPER_SELECTOR = POUND + DEF_PREFIX + FULL_DESKTOP.wrapper,
        /* static vars used by reposition script */
        resizerNode = null,
        secondaryNode = null,
        mainNode = null,
        handleImgNode = null,
        ddHandle = null,
        started = false,
        totW = 0,
        w = 0,
        h = 0,
        MARGIN = 5;

    /* class constructor */
    function SplitDesktop(config) {
        SplitDesktop.superclass.constructor.apply(this, arguments);
    }

    SplitDesktop.NAME = "splitDesktop";


    SplitDesktop.ATTRS = {

        boundingBox : {
            value: HTML
        },
        contentBox : {
            value: "page_wrapper"
        },
        pageWidth : {
            value: PAGE_DEF_WIDTH + PX
        },
        bodyHeight: {
            value: DEF_MAIN_HEIGHT + PX
        },
        dragHereImg: {
            value: DRAG_HERE_IMG
        },
        pathToImages: {
            value: PATH_TO_IMAGES
        },
        pathToStyles: {
            value: PATH_TO_IMAGES
        },
        pointerLeftPos: {
            value: DRAG_HERE_IMG_LEFT + PX
        },
        pointerTopPos: {
            value: DRAG_HERE_IMG_TOP + PX
        },
        handleImage: {
            value: HANDLE_IMG
        },
        handleId: {
            value: HANDLE_ID
        },
        dragHereImgPath: {
            value: DRAG_HERE_IMG_URL
        },
        defaultPrefix: {
            value: DEF_PREFIX
        },
        mainDivId: {
            value: FULL_DESKTOP.main
        },
        bordersColor: {
            value: BORDERS_COLOR
        },
        borderPixImg: {
            value: BORDER_PIX_URL
        },
        markupIsValidated : {
            value: null
        },
        handleImg: {
            value: HANDLE_IMG
        },
        dragHereLeft: {
            value: DRAG_HERE_IMG_LEFT + PX
        },
        dragHereTop: {
            value: DRAG_HERE_IMG_TOP + PX
        },
        mainHeight: {
            value: DEF_MAIN_HEIGHT + PX
        },
        crownHeight: {
            value: DEF_CROWN_HEIGHT + PX
        },
        prefix: {
            value: DEF_PREFIX
        },
        baseUrl: {
            getter: '_getBaseUrl',
            lazyAdd: false
        }
    };


    Y.extend(SplitDesktop, Y.Widget, {

        initializer: function (config) {
            var BASE_URL = this.get('baseUrl'),
                i,
                HANDLE_IMG_URL = BASE_URL + PATH_TO_IMAGES + HANDLE_IMG;
                
            HANDLE_IMG_TPL = IMG_OPEN_TPL + ID_OPEN_TPL + DEF_PREFIX + HANDLE_ID + ID_CLOSE_TPL + SRC_OPEN_TPL + HANDLE_IMG_URL + SRC_CLOSE_TPL + IMG_CLOSE_TPL
            
            Y.log('HANDLE_IMG_TPL ' + HANDLE_IMG_TPL, 'info', SplitDesktop.NAME);
            for (i in config) {
                if (config.hasOwnProperty(i)) {
                    Y.log('initializer is checking user config for: ' + i, 'info', SplitDesktop.NAME);
                    switch (i) {
                    case PAGE_WIDTH_CONF:
                       PAGE_DEF_WIDTH = this.get(i);
                        var    ne = PAGE_DEF_WIDTH - NW_MIN_WIDTH;/*  */
                        /* nw div is always 150 and comes auto from page_wrapper - ne */
                        Y.log('initializer is updating ' + i + ' with: ' + config[i] + PX, 'info', SplitDesktop.NAME);
                        Y.one(POUND + DEF_PREFIX + FULL_DESKTOP.wrapper).setStyle('width', PAGE_DEF_WIDTH);
                        /*adjust ne accordingly */
                        Y.one(POUND + DEF_PREFIX + FULL_DESKTOP.ne).setStyle('width', ne);
                        break;
                    case BORDERS_COLOR_CONF:
                        var c = this.get(BORDERS_COLOR_CONF); /**/
                        Y.log('initializer is updating ' + i + ' with: ' + config[i], 'info', SplitDesktop.NAME);
                        Y.one(POUND + DEF_PREFIX + FULL_DESKTOP.borders).setStyle('borderLeftColor', c).setStyle('borderBottomColor', c);
                        Y.one(POUND + DEF_PREFIX + FULL_DESKTOP.wrapper).setStyle('borderColor', c);
                        break;
                    case DRAG_HERE_IMG_CONF:
                    case PATH_TO_IMAGES_CONF:
                    case BORDER_PIX_CONF:
                    case HANDLE_IMG_CONF:
                    /**
                    If base url is on CDN we will either have inside Y.config a property of 'gallery' or alternatively fullpath.
                    In case we have gallery => assume CDN (Y.Env.cdn is the base url) 
                    In case we have fullpath => assume js file is inside root of package basedir (Y.config.fullpath ) is the baseurl
                    */
                        Y.log('initializer is updating ' + i + ' with: ' + config[i], 'info', SplitDesktop.NAME);
                        DRAG_HERE_IMG_URL = this.get(PATH_TO_IMAGES_CONF) + this.get(DRAG_HERE_IMG_CONF);
                        Y.one(POUND + DEF_PREFIX + FULL_DESKTOP.main).setStyle(BACKGROUNDIMAGE, 'url("' + DRAG_HERE_IMG_URL + '")');

                        BORDER_PIX_URL = this.get(PATH_TO_IMAGES_CONF) + this.get(BORDER_PIX_CONF);

                        if (i === BORDER_PIX_CONF || i === PATH_TO_IMAGES_CONF) {
                            Y.one(POUND + DEF_PREFIX + FULL_DESKTOP.nw).setStyle(BACKGROUNDIMAGE, BORDER_PIX_URL);
                        }
                        /* create handle and place it in resizer div */
                        if (i === HANDLE_IMG_CONF || i === PATH_TO_IMAGES_CONF) {
                            DEF_PREFIX = this.get(PREFIX_CONF);
                            HANDLE_IMG_URL = this.get(PATH_TO_IMAGES_CONF) + this.get(HANDLE_IMG_CONF);
                            HANDLE_IMG_TPL = IMG_OPEN_TPL + ID_OPEN_TPL + DEF_PREFIX + HANDLE_ID + ID_CLOSE_TPL + SRC_OPEN_TPL + HANDLE_IMG_URL + SRC_CLOSE_TPL + IMG_CLOSE_TPL;
                        }
                        break;
                    case DRAG_HERE_LEFT_CONF:
                        Y.log('initializer is updating ' + i + ' with: ' + config[i] + PX, 'info', SplitDesktop.NAME);
                        DEF_PREFIX = this.get(PREFIX_CONF);
                        Y.one(POUND + DEF_PREFIX + FULL_DESKTOP.main).setStyle(BACKGROUNDPOSITION, this.get(DRAG_HERE_LEFT_CONF) + PX + ' ' + this.get(DRAG_HERE_TOP_CONF) + PX);
                        break;
                    case DRAG_HERE_TOP_CONF:
                        Y.log('initializer is updating ' + i + ' with: ' + config[i] + PX, 'info', SplitDesktop.NAME);
                        DEF_PREFIX = this.get(PREFIX_CONF);
                        Y.one(POUND + DEF_PREFIX + FULL_DESKTOP.main).setStyle(BACKGROUNDPOSITION, this.get(DRAG_HERE_LEFT_CONF) + PX + ' ' + this.get(DRAG_HERE_TOP_CONF) + PX);
                        break;
                    case MAIN_HEIGHT_CONF:
                        Y.log('initializer is updating ' + i + ' with: ' + config[i] + PX, 'info', SplitDesktop.NAME);
                        DEF_PREFIX = this.get(PREFIX_CONF);
                        Y.one(POUND + DEF_PREFIX + FULL_DESKTOP.main).setStyle(HEIGHT, this.get(MAIN_HEIGHT_CONF) + PX);
                        break;
                    case CROWN_HEIGHT_CONF:
                        Y.log('initializer is updating ' + i + ' with: ' + config[i] + PX, 'info', SplitDesktop.NAME);
                        DEF_PREFIX = this.get(PREFIX_CONF);
                        Y.one(POUND + DEF_PREFIX + FULL_DESKTOP.ne).setStyle(HEIGHT, this.get(CROWN_HEIGHT_CONF) + PX);
                        break;
                    case PREFIX_CONF:
                        Y.log('initializer is updating ' + i + ' with: ' + config[i], 'info', SplitDesktop.NAME);
                        DEF_PREFIX = this.get(PREFIX_CONF);
                        /* update selectors with new prefix */
                        RESIZER_SELECTOR = POUND + DEF_PREFIX + FULL_DESKTOP.ne;
                        SECONDARY_SELECTOR = POUND + DEF_PREFIX + FULL_DESKTOP.nwbody;
                        MAIN_SELECTOR = POUND + DEF_PREFIX + FULL_DESKTOP.main;
                        WRAPPER_SELECTOR = POUND + DEF_PREFIX + FULL_DESKTOP.wrapper;
                        /* update img tpl with new prefix */
                        HANDLE_IMG_TPL = IMG_OPEN_TPL + ID_OPEN_TPL + DEF_PREFIX + HANDLE_ID + ID_CLOSE_TPL + SRC_OPEN_TPL + HANDLE_IMG_URL + SRC_CLOSE_TPL + IMG_CLOSE_TPL;
                        break;
                    }
                }
            }

            /* some events to be used by subclasses to focus on diff areas */
            this.publish("enterCrown", {
                defaultFn: this._defEnterCrownFn,
                bubbles: false
            });

            this.publish("enterMain", {
                defaultFn: this._defEnterMainFn,
                bubbles: false
            });

            this.publish("enterSecondary", {
                defaultFn: this._defEnterSecondaryFn,
                bubbles: false
            });

            this.publish("enterResizer", {
                defaultFn: this._defEnterResizerFn,
                bubbles: false
            });

        },

        renderUI : function () {

            resizerNode = Y.one(RESIZER_SELECTOR);
            handleImgNode = Y.Node.create(HANDLE_IMG_TPL, resizerNode);
            resizerNode.append(handleImgNode);
            /* make the handle draggable */
            ddHandle = new Y.DD.Drag({node: POUND + DEF_PREFIX + HANDLE_ID});
            ddHandle.plug(Y.Plugin.DDConstrained, {
                constrain2node: WRAPPER_SELECTOR
            });
        },

        bindUI : function () {

            ddHandle.on('drag:start', this._onDragStart);
            ddHandle.on('drag:drag', this._onDragDrag);
            ddHandle.on('drag:end', this._onDragEnd);
        },

        syncUI : function () {
            /* Now make the page visible */
            Y.one(HTML).setStyle('display', 'block');

        },

        _onDragStart : function (e) {
            /* remove background from main */
            mainNode = Y.one(MAIN_SELECTOR);
            switch (started) {
            case false:
                mainNode.setStyle(BACKGROUNDIMAGE, 'none');
            case true:
                h = parseInt(resizerNode.getStyle(HEIGHT).toString().replace(PX, ''), 10);
                w = parseInt(resizerNode.getStyle(WIDTH).toString().replace(PX, ''), 10);
                started = true;
                break;
            }
        },

        _onDragDrag : function (e) {
            secondaryNode = Y.one(SECONDARY_SELECTOR);
            resizerNode = Y.one(RESIZER_SELECTOR);

            /* get values */
            var deltaW = parseInt(e.info.offset[0], 10),
                deltaH = parseInt(e.info.offset[1], 10);

            totW = w - deltaW;
            resizerNode.setStyle(WIDTH, totW);
            resizerNode.setStyle(HEIGHT, h + deltaH);

            secondaryNode.setStyle(WIDTH, PAGE_DEF_WIDTH - totW + MARGIN);
            secondaryNode.setStyle(HEIGHT, h + deltaH);
        },

        _onDragEnd : function (e) {
            /* 
            reposition to  00  pos in resizer window
            the window width might have changed from the drag:start due to scrollbars,
            hence the currrent x y is not necessarily at the bottom left corner of the window
            */
            handleImgNode.setStyle('left', 0);
            handleImgNode.setStyle('bottom', 0);
        },

        /**
        * @protected
        *
        */

        _defEnterCrownFn : function (e) {
            this.fire('enterCrown');
        },

        _defEnterMainFn : function (e) {
            this.fire('enterMain');
        },

        _defEnterSecondaryFn : function (e) {
            this.fire('enterSecondary');
        },

        _defEnterResizerFn : function (e) {
            this.fire('enterResizer');
        },
                
        _getBaseUrl : function () {
            Y.log("setting baseurl. Dumping config if Y.dump is present", 'info', SplitDesktop.NAME);
           if(Y.dump){ Y.log(Y.dump(Y.config))};
            if(Y.config.modules){
                if(Y.config.modules['gallery-split-desktop']){
                    /* defined as single module */
                    if(Y.config.modules['gallery-split-desktop'].gallery){
                        /* source is on CDN */
                        Y.log("Baseurl is on CDN for this module");
                        return Y.Env.base + Y.config.modules['gallery-split-desktop'].gallery + '/build';
                        
                    }else if(Y.config.modules['gallery-split-desktop'].fullpath){
                        //extract root, assets relative to root
                        Y.log("Baseurl based on fullpath for this module", 'info', SplitDesktop.NAME);
                        var url = Y.config.modules['gallery-split-desktop'].fullpath;
                        return url.substring(0,url.lastIndexOf('/')+1);
                        
                    }else if(Y.config.modules.base){
                        Y.log("Baseurl is base this module", 'info', SplitDesktop.NAME);
                        return Y.config.modules.base;
                    }
                }
            }else if(Y.config.gallery){
                /* source is general gallery url */
                Y.log("Baseurl is on CDN", 'info', SplitDesktop.NAME);
                return Y.Env.base + Y.config.gallery + '/build';

            }else if(Y.config.fullpath){
                //extract root, assets relative to root
                var url = Y.config.fullpath;
                Y.log("Baseurl based on general fullpath", 'info', SplitDesktop.NAME);
                return url.substring(0,lastIndexOf('/',url)+1);
                
            }else{
                Y.log("Baseurl based on fallback path", 'info', SplitDesktop.NAME);
                return FALLBACK_PATH;
            }
        }

    });//return Y.Env.base + Y.config.gallery + '/build';

    Y.namespace('sdt').SplitDesktop = SplitDesktop;


}, 'gallery-2011.04.06-19-44' ,{requires:['widget','dd-constrain']});

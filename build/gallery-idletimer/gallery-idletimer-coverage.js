if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["/build/gallery-idletimer/gallery-idletimer.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-idletimer/gallery-idletimer.js",
    code: []
};
_yuitest_coverage["/build/gallery-idletimer/gallery-idletimer.js"].code=["YUI.add('gallery-idletimer', function(Y) {","","/*"," * Copyright (c) 2009 Nicholas C. Zakas. All rights reserved."," * http://www.nczonline.net/"," */","","/**"," * Idle timer"," * @module gallery-idletimer"," */","","//-------------------------------------------------------------------------","// Private variables","//-------------------------------------------------------------------------","","var idle    = false,        //indicates if the user is idle","    tId     = -1,           //timeout ID","    enabled = false,        //indicates if the idle timer is enabled","    doc = Y.config.doc,     //shortcut for document object","    timeout = 30000;        //the amount of time (ms) before the user is considered idle","","//-------------------------------------------------------------------------","// Private functions","//-------------------------------------------------------------------------","    ","/* (intentionally not documented)"," * Handles a user event indicating that the user isn't idle."," * @param {Event} event A DOM2-normalized event object."," * @return {void}"," */","function handleUserEvent(event){","","    //clear any existing timeout","    clearTimeout(tId);","    ","    //if the idle timer is enabled","    if (enabled){","    ","        if (/visibilitychange/.test(event.type)){","            toggleIdleState(doc.hidden || doc.msHidden || doc.webkitHidden || doc.mozHidden);","        } else {","            //if it's idle, that means the user is no longer idle","            if (idle){","                toggleIdleState();           ","            } ","        }","","        //set a new timeout","        tId = setTimeout(toggleIdleState, timeout);","    }    ","}","","/* (intentionally not documented)"," * Toggles the idle state and fires an appropriate event."," * @param {Boolean} force (Optional) the value to set idle to."," * @return {void}"," */","function toggleIdleState(force){","","    var changed = false;","    if (typeof force != \"undefined\"){","        if (force != idle){","            idle = force;","            changed = true;","        }","    } else {","        idle = !idle;","        changed = true;","    }","    ","    if (changed){","        //fire appropriate event","        Y.IdleTimer.fire(idle ? \"idle\" : \"active\");    ","    }","}","","//-------------------------------------------------------------------------","// Public interface","//-------------------------------------------------------------------------","","/**"," * Centralized control for determining when a user has become idle"," * on the current page."," * @class IdleTimer"," * @static"," */","Y.IdleTimer = {","    ","    /**","     * Indicates if the idle timer is running or not.","     * @return {Boolean} True if the idle timer is running, false if not.","     * @method isRunning","     * @static","     */","    isRunning: function(){","        return enabled;","    },","    ","    /**","     * Indicates if the user is idle or not.","     * @return {Boolean} True if the user is idle, false if not.","     * @method isIdle","     * @static","     */        ","    isIdle: function(){","        return idle;","    },","    ","    /**","     * Starts the idle timer. This adds appropriate event handlers","     * and starts the first timeout.","     * @param {int} newTimeout (Optional) A new value for the timeout period in ms.","     * @return {void}","     * @method start","     * @static","     */ ","    start: function(newTimeout){","        ","        //set to enabled","        enabled = true;","        ","        //set idle to false to begin with","        idle = false;","        ","        //assign a new timeout if necessary","        if (typeof newTimeout == \"number\"){","            timeout = newTimeout;","        }","        ","        //assign appropriate event handlers","        Y.on(\"mousemove\", handleUserEvent, doc);","        Y.on(\"mousedown\", handleUserEvent, doc);","        Y.on(\"keydown\", handleUserEvent, doc);","","        //need to add the old-fashioned way","        if (doc.addEventListener) {","            doc.addEventListener(\"msvisibilitychange\", handleUserEvent, false);","            doc.addEventListener(\"webkitvisibilitychange\", handleUserEvent, false);","            doc.addEventListener(\"mozvisibilitychange\", handleUserEvent, false);","        }","        ","        //set a timeout to toggle state","        tId = setTimeout(toggleIdleState, timeout);","    },","    ","    /**","     * Stops the idle timer. This removes appropriate event handlers","     * and cancels any pending timeouts.","     * @return {void}","     * @method stop","     * @static","     */         ","    stop: function(){","    ","        //set to disabled","        enabled = false;","        ","        //clear any pending timeouts","        clearTimeout(tId);","        ","        //detach the event handlers","        Y.detach(\"mousemove\", handleUserEvent, doc);","        Y.detach(\"mousedown\", handleUserEvent, doc);","        Y.detach(\"keydown\", handleUserEvent, doc);","","        if (doc.removeEventListener) {","            doc.removeEventListener(\"msvisibilitychange\", handleUserEvent, false);","            doc.removeEventListener(\"webkitvisibilitychange\", handleUserEvent, false);","            doc.removeEventListener(\"mozvisibilitychange\", handleUserEvent, false);","        }","      ","    }","","};","","//inherit event functionality","Y.augment(Y.IdleTimer, Y.Event.Target);","","","}, 'gallery-2012.09.12-20-02' ,{requires:['event','event-custom']});"];
_yuitest_coverage["/build/gallery-idletimer/gallery-idletimer.js"].lines = {"1":0,"17":0,"32":0,"35":0,"38":0,"40":0,"41":0,"44":0,"45":0,"50":0,"59":0,"61":0,"62":0,"63":0,"64":0,"65":0,"68":0,"69":0,"72":0,"74":0,"88":0,"97":0,"107":0,"121":0,"124":0,"127":0,"128":0,"132":0,"133":0,"134":0,"137":0,"138":0,"139":0,"140":0,"144":0,"157":0,"160":0,"163":0,"164":0,"165":0,"167":0,"168":0,"169":0,"170":0,"178":0};
_yuitest_coverage["/build/gallery-idletimer/gallery-idletimer.js"].functions = {"handleUserEvent:32":0,"toggleIdleState:59":0,"isRunning:96":0,"isIdle:106":0,"start:118":0,"stop:154":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-idletimer/gallery-idletimer.js"].coveredLines = 45;
_yuitest_coverage["/build/gallery-idletimer/gallery-idletimer.js"].coveredFunctions = 7;
_yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 1);
YUI.add('gallery-idletimer', function(Y) {

/*
 * Copyright (c) 2009 Nicholas C. Zakas. All rights reserved.
 * http://www.nczonline.net/
 */

/**
 * Idle timer
 * @module gallery-idletimer
 */

//-------------------------------------------------------------------------
// Private variables
//-------------------------------------------------------------------------

_yuitest_coverfunc("/build/gallery-idletimer/gallery-idletimer.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 17);
var idle    = false,        //indicates if the user is idle
    tId     = -1,           //timeout ID
    enabled = false,        //indicates if the idle timer is enabled
    doc = Y.config.doc,     //shortcut for document object
    timeout = 30000;        //the amount of time (ms) before the user is considered idle

//-------------------------------------------------------------------------
// Private functions
//-------------------------------------------------------------------------
    
/* (intentionally not documented)
 * Handles a user event indicating that the user isn't idle.
 * @param {Event} event A DOM2-normalized event object.
 * @return {void}
 */
_yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 32);
function handleUserEvent(event){

    //clear any existing timeout
    _yuitest_coverfunc("/build/gallery-idletimer/gallery-idletimer.js", "handleUserEvent", 32);
_yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 35);
clearTimeout(tId);
    
    //if the idle timer is enabled
    _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 38);
if (enabled){
    
        _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 40);
if (/visibilitychange/.test(event.type)){
            _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 41);
toggleIdleState(doc.hidden || doc.msHidden || doc.webkitHidden || doc.mozHidden);
        } else {
            //if it's idle, that means the user is no longer idle
            _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 44);
if (idle){
                _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 45);
toggleIdleState();           
            } 
        }

        //set a new timeout
        _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 50);
tId = setTimeout(toggleIdleState, timeout);
    }    
}

/* (intentionally not documented)
 * Toggles the idle state and fires an appropriate event.
 * @param {Boolean} force (Optional) the value to set idle to.
 * @return {void}
 */
_yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 59);
function toggleIdleState(force){

    _yuitest_coverfunc("/build/gallery-idletimer/gallery-idletimer.js", "toggleIdleState", 59);
_yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 61);
var changed = false;
    _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 62);
if (typeof force != "undefined"){
        _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 63);
if (force != idle){
            _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 64);
idle = force;
            _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 65);
changed = true;
        }
    } else {
        _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 68);
idle = !idle;
        _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 69);
changed = true;
    }
    
    _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 72);
if (changed){
        //fire appropriate event
        _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 74);
Y.IdleTimer.fire(idle ? "idle" : "active");    
    }
}

//-------------------------------------------------------------------------
// Public interface
//-------------------------------------------------------------------------

/**
 * Centralized control for determining when a user has become idle
 * on the current page.
 * @class IdleTimer
 * @static
 */
_yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 88);
Y.IdleTimer = {
    
    /**
     * Indicates if the idle timer is running or not.
     * @return {Boolean} True if the idle timer is running, false if not.
     * @method isRunning
     * @static
     */
    isRunning: function(){
        _yuitest_coverfunc("/build/gallery-idletimer/gallery-idletimer.js", "isRunning", 96);
_yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 97);
return enabled;
    },
    
    /**
     * Indicates if the user is idle or not.
     * @return {Boolean} True if the user is idle, false if not.
     * @method isIdle
     * @static
     */        
    isIdle: function(){
        _yuitest_coverfunc("/build/gallery-idletimer/gallery-idletimer.js", "isIdle", 106);
_yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 107);
return idle;
    },
    
    /**
     * Starts the idle timer. This adds appropriate event handlers
     * and starts the first timeout.
     * @param {int} newTimeout (Optional) A new value for the timeout period in ms.
     * @return {void}
     * @method start
     * @static
     */ 
    start: function(newTimeout){
        
        //set to enabled
        _yuitest_coverfunc("/build/gallery-idletimer/gallery-idletimer.js", "start", 118);
_yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 121);
enabled = true;
        
        //set idle to false to begin with
        _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 124);
idle = false;
        
        //assign a new timeout if necessary
        _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 127);
if (typeof newTimeout == "number"){
            _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 128);
timeout = newTimeout;
        }
        
        //assign appropriate event handlers
        _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 132);
Y.on("mousemove", handleUserEvent, doc);
        _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 133);
Y.on("mousedown", handleUserEvent, doc);
        _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 134);
Y.on("keydown", handleUserEvent, doc);

        //need to add the old-fashioned way
        _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 137);
if (doc.addEventListener) {
            _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 138);
doc.addEventListener("msvisibilitychange", handleUserEvent, false);
            _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 139);
doc.addEventListener("webkitvisibilitychange", handleUserEvent, false);
            _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 140);
doc.addEventListener("mozvisibilitychange", handleUserEvent, false);
        }
        
        //set a timeout to toggle state
        _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 144);
tId = setTimeout(toggleIdleState, timeout);
    },
    
    /**
     * Stops the idle timer. This removes appropriate event handlers
     * and cancels any pending timeouts.
     * @return {void}
     * @method stop
     * @static
     */         
    stop: function(){
    
        //set to disabled
        _yuitest_coverfunc("/build/gallery-idletimer/gallery-idletimer.js", "stop", 154);
_yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 157);
enabled = false;
        
        //clear any pending timeouts
        _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 160);
clearTimeout(tId);
        
        //detach the event handlers
        _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 163);
Y.detach("mousemove", handleUserEvent, doc);
        _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 164);
Y.detach("mousedown", handleUserEvent, doc);
        _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 165);
Y.detach("keydown", handleUserEvent, doc);

        _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 167);
if (doc.removeEventListener) {
            _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 168);
doc.removeEventListener("msvisibilitychange", handleUserEvent, false);
            _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 169);
doc.removeEventListener("webkitvisibilitychange", handleUserEvent, false);
            _yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 170);
doc.removeEventListener("mozvisibilitychange", handleUserEvent, false);
        }
      
    }

};

//inherit event functionality
_yuitest_coverline("/build/gallery-idletimer/gallery-idletimer.js", 178);
Y.augment(Y.IdleTimer, Y.Event.Target);


}, 'gallery-2012.09.12-20-02' ,{requires:['event','event-custom']});

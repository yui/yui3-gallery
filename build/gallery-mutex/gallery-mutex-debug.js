YUI.add('gallery-mutex', function(Y) {

(function (Y) {
    'use strict';
    
    var _string_exclusive = 'exclusive',
        _string_shared = 'shared',
        
        _Mutex = Y.namespace('Mutex'),
        
        _indexOf = Y.Array.indexOf,
        _isArray = Y.Lang.isArray,
        _later = Y.later,
        _soon = Y.soon;
        
    Y.mix(_Mutex, {
        exclusive: function (resourceName, callbackFunction, timeout) {
            return _Mutex._queue(_string_exclusive, resourceName, callbackFunction, timeout);
        },
        shared: function (resourceName, callbackFunction, timeout) {
            return _Mutex._queue(_string_shared, resourceName, callbackFunction, timeout);
        },
        _lock: function (mode, guid, resourceName, callbackFunction, timeout) {
            var lock = _Mutex._locks[resourceName],
                timerWrapper = {};
            
            if (mode === _string_exclusive) {
                lock.l = guid;
            } else if (mode === _string_shared) {
                (function (lockArray) {
                    if (!Y.Lang.isArray(lockArray)) {
                        lockArray = [];
                        lock.l = lockArray;
                    }
                    
                    lockArray.push(guid);
                }(lock.l));
            } else {
                return timerWrapper;
            }

            _soon(function () {
                var timer;
                
                if (timeout) {
                    timer = _later(timeout, _Mutex, _Mutex._unlock, [
                        guid,
                        mode,
                        resourceName
                    ]);
                    timerWrapper.timer = timer;
                }
                
                callbackFunction(function () {
                    _Mutex._unlock(guid, mode, resourceName, timer);
                });
            });
            
            return timerWrapper;
        },
        _locks: {},
        _queue: function (mode, resourceName, callbackFunction, timeout) {
            var _locks = _Mutex._locks,
                
                guid = Y.guid(mode),
                lock = _locks[resourceName],
                queue,
                queueDetails = [
                    mode,
                    guid,
                    resourceName,
                    callbackFunction,
                    timeout
                ],
                timerWrapper;

            if (!lock) {
                lock = {};
                _locks[resourceName] = lock;
            }

            if (lock.l && (mode === _string_exclusive || !_isArray(lock.l))) {
                queue = lock.q;

                if (!queue) {
                    queue = [];
                    lock.q = queue;
                }

                queue.push(queueDetails);
            } else {
                timerWrapper = _Mutex._lock.apply(_Mutex, queueDetails);
            }

            return {
                cancel: function () {
                    _Mutex._unlock(guid, mode, resourceName, timerWrapper && timerWrapper.timer);
                }
            };
        },
        _unlock: function (guid, mode, resourceName, timer) {
            var _locks = _Mutex._locks,
                
                lock = _locks[resourceName],
                locked = lock && lock.l,
                queue = lock && lock.q,
                queueDetails;

            if (timer) {
                timer.cancel();
            }

            if (!lock || mode === _string_exclusive && locked !== guid) {
                return;
            }
            
            if (mode === _string_shared && !(function (index) {
                if (index === -1) {
                    return false;
                }
                
                var after = locked.slice(index + 1);
                locked.length = index;
                locked.push.apply(locked, after);
                
                return !locked.length;
            }(_isArray(locked) ? _indexOf(locked, guid) : -1))) {
                return;
            }

            if (queue && queue.length) {
                do {
                    queueDetails = queue.shift();
                    _Mutex._lock.apply(_Mutex, queueDetails);
                } while (queueDetails[0] === _string_shared && queue[0] && queue[0][0] === _string_shared);
            } else {
                delete _locks[resourceName];
            }
        }
    });
}(Y));


}, 'gallery-2012.04.18-20-14' ,{requires:['gallery-soon'], skinnable:false});

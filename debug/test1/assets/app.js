/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let Recorder = __webpack_require__(2);

	let record = Recorder();

	let log = console.log; // eslint-disable-line

	let {
	    start
	} = record({
	    passData: {
	        config: {
	            action: {
	                eventTypeList: [
	                    'click'
	                ]
	            }
	        }
	    },
	    winId: 1
	}, {
	    receiveState: () => {},
	    receiveAction: (action) => {
	        log(action);
	    }
	});

	start();


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(3);


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * information
	 *
	 *      user action
	 *
	 *      system response
	 */
	let record = __webpack_require__(4);

	let stateRecorder = __webpack_require__(26);

	let freekiteRecorder = __webpack_require__(47);

	module.exports = () => {
	    let plugins = stateRecorder();
	    return freekiteRecorder(record, plugins);
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let ActionCapturer = __webpack_require__(5);

	/**
	 * @param actionConfig
	 * @param options
	 * @param callbacks
	 */
	module.exports = (actionConfig, options, {
	    receiveAction,
	    startRecording,
	    beforeAddAction
	}) => {
	    startRecording();

	    let {
	        capture
	    } = ActionCapturer(actionConfig);

	    let accept = (action) => {
	        // at this moment, the event handlers still not triggered, but UI may changed (like scroll, user input)
	        return beforeAddAction().then(() => {
	            return receiveAction(action);
	        });
	    };

	    capture(accept);
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(6);


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let captureEvent = __webpack_require__(7);

	let {
	    serializeEvent, serializeNode, serializePath
	} = __webpack_require__(8);

	let NodeUnique = __webpack_require__(21);

	let nodeUnique = NodeUnique();

	let getAttachedUIStates = (node) => {
	    return {
	        window: {
	            pageYOffset: window.pageYOffset,
	            pageXOffset: window.pageXOffset
	        },

	        current: {
	            value: node.value,
	            scrollTop: node.scrollTop,
	            scrollLeft: node.scrollLeft
	        }
	    };
	};

	module.exports = (opts = {}) => {
	    opts.eventTypeList = opts.eventTypeList || [];

	    if (opts.onlyUserAction === undefined) {
	        opts.onlyUserAction = true;
	    }

	    if (opts.textContent === undefined) {
	        opts.textContent = true;
	    }

	    if (opts.style === undefined) {
	        opts.style = true;
	    }

	    let getAction = (event) => {
	        let node = event.target;
	        let path = serializePath(node);

	        let nodeInfo = serializeNode(node, {
	            textContent: opts.textContent,
	            style: opts.style
	        });

	        return {
	            event: serializeEvent(event),
	            time: new Date().getTime(),
	            attachedUIStates: getAttachedUIStates(node),
	            source: {
	                node: nodeInfo,
	                domNodeId: nodeUnique(node),
	                path
	            },
	            extra: {
	                url: window.location.href,
	                pageTitle: window.document.title
	            }
	        };
	    };

	    return {
	        capture: (handle) => {
	            captureEvent(opts.eventTypeList, event => {
	                let action = getAction(event);
	                handle(action, event);
	            }, {
	                onlyUserAction: opts.onlyUserAction
	            });
	        }
	    };
	};


/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * capture event
	 *
	 * opts = {
	 *      onlyUserAction: true
	 * }
	 *
	 * !!!use this script at the head of the page, so we can guarentee our event handler will run at the first time.
	 */

	// TODO bug: proxy iframe events
	// proxy all documents?
	module.exports = (eventList, callback, opts = {}) => {
	    // TODO window close event
	    let captureUIAction = (document) => {
	        // dom event
	        eventList.forEach((item) => {
	            document.addEventListener(item, (e) => {
	                if (opts.onlyUserAction) {
	                    if (e.isTrusted ||
	                        // TODO
	                        // hack for library like fastclick
	                        e.forwardedTouchEvent) {
	                        callback && callback(e);
	                    }
	                } else {
	                    callback && callback(e);
	                }
	            }, true); // capture model
	        });
	    };

	    captureUIAction(window.document);
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(9);


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let serializeNode = __webpack_require__(10);
	let serializePath = __webpack_require__(15);
	let serializeEvent = __webpack_require__(16);
	let serializeNodeStructure = __webpack_require__(14);
	let serializeNodes = __webpack_require__(18);

	module.exports = {
	    serializeEvent,
	    serializeNode,
	    serializePath,
	    serializeNodeStructure,
	    serializeNodes
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    getDisplayText
	} = __webpack_require__(11);

	let serializeStyle = __webpack_require__(13);

	let serializeStructure = __webpack_require__(14);

	module.exports = (node, opts = {}) => {
	    let ret = serializeStructure(node);

	    if (opts.textContent) {
	        ret.textContent = getDisplayText(node);
	    }

	    if (opts.style) {
	        ret.style = serializeStyle(node);
	    }

	    return ret;
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(12);


/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	let getDisplayText = (node) => {
	    if (node.nodeType === 3) {
	        return node.textContent || '';
	    }

	    if (node.nodeType !== 1) {
	        return '';
	    }

	    if (node.tagName === 'INPUT' ||
	        node.tagName === 'SELECT') {
	        return node.value || '';
	    }

	    if (node.tagName === 'HEAD' ||
	        node.tagName === 'LINK' ||
	        node.tagName === 'SCRIPT' ||
	        node.tagName === 'NOSCRIPT' ||
	        node.tagName === 'CANVAS' ||
	        node.tagName === 'STYLE' ||
	        node.tagName === 'META') {
	        return '';
	    }

	    let style = window.getComputedStyle(node);
	    let display = style.display;

	    if (display === 'none') {
	        return '';
	    } else {
	        let text = '';
	        let children = node.childNodes;
	        for (let i = 0; i < children.length; i++) {
	            let child = children[i];
	            text += getDisplayText(child);
	        }

	        return text;
	    }
	};

	module.exports = {
	    getDisplayText
	};


/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	module.exports = (node) => {
	    if(node === document) return null;
	    return {
	        style: getStyleMap(node),
	        shape: {
	            offsetLeft: node.offsetLeft,
	            offsetTop: node.offsetTop,
	            clientLeft: node.clientLeft,
	            clientTop: node.clientTop,
	            offsetWidth: node.offsetWidth,
	            offsetHeight: node.offsetHeight,
	            clientWidth: node.clientWidth,
	            clientHeight: node.clientHeight
	        }
	    };
	};

	let getStyleMap = (node) => {
	    let styleMap = {};
	    if(!window.getComputedStyle) {
	        return styleMap;
	    }
	    let styles = window.getComputedStyle(node);
	    for (let i = 0; i < styles.length; i++) {
	        let name = styles[i];
	        styleMap[name] = styles[name];
	    }
	    return styleMap;
	};


/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	module.exports = (node) => {
	    let attributes = {};

	    let nodeAttribute = node.attributes || [];
	    for (let i = 0; i < nodeAttribute.length; i++) {
	        let attr = node.attributes[i];
	        attributes[attr.nodeName] = attr.nodeValue;
	    }
	    let ret = {
	        tagName: node.tagName,
	        nodeType: node.nodeType,
	        index: getOrder(node),
	        attributes
	    };

	    return ret;
	};

	let getOrder = (node) => {
	    let parentNode = node.parentNode;
	    if (!parentNode) return 0;
	    for (let i = 0; i < parentNode.childNodes.length; i++) {
	        let item = parentNode.childNodes[i];
	        if (item === node) {
	            return i;
	        }
	    }
	    return -1;
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let serializeNode = __webpack_require__(10);

	let serializePath = (target) => {
	    let json = [];
	    let index = 0;

	    target = target && target.parentNode;
	    while (target) {

	        if (index < 2) {
	            json.push(serializeNode(target, {
	                textContent: true
	            }));
	        } else {
	            json.push(serializeNode(target));
	        }

	        target = target.parentNode;

	        index++;
	    }
	    return json;
	};

	module.exports = serializePath;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    likeArray, isObject
	} = __webpack_require__(17);

	let serializeEvent = (e) => {
	    let json = {
	        __proto__source: getClassName(e)
	    };
	    for (let name in e) {
	        let value = e[name];
	        if (isAtom(value)) {
	            json[name] = value;
	        } else if ((name === 'touches' ||
	                name === 'changedTouches' ||
	                name === 'targetTouches') &&
	            likeArray(value)) {
	            json[name] = serializeTouches(value);
	        }
	    }
	    return json;
	};

	let serializeTouches = (value) => {
	    let touches = [];
	    for (let i = 0; i < value.length; i++) {
	        let touch = value[i];
	        let copy = {};
	        if (isObject(touch)) {
	            for (let name in touch) {
	                if (isAtom(touch[name])) {
	                    copy[name] = touch[name];
	                }
	            }
	        }
	        touches.push(copy);
	    }
	    return touches;
	};

	const classNameReg = /\[object (.*)\]/;

	let getClassName = (e) => {
	    let cons = Object.getPrototypeOf(e);
	    return cons.toString().match(classNameReg)[1];
	};

	let isAtom = v => !v || typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean';

	module.exports = serializeEvent;


/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * basic types
	 */

	let isUndefined = v => v === undefined;

	let isNull = v => v === null;

	let isFalsy = v => !v;

	let likeArray = v => !!(v && typeof v === 'object' && typeof v.length === 'number' && v.length >= 0);

	let isArray = v => Array.isArray(v);

	let isString = v => typeof v === 'string';

	let isObject = v => !!(v && typeof v === 'object');

	let isFunction = v => typeof v === 'function';

	let isNumber = v => typeof v === 'number' && !isNaN(v);

	let isBool = v => typeof v === 'boolean';

	let isNode = (o) => {
	    return (
	        typeof Node === 'object' ? o instanceof Node :
	        o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string'
	    );
	};

	let isPromise = v => v && typeof v === 'object' && typeof v.then === 'function' && typeof v.catch === 'function';

	/**
	 * check type
	 *
	 * types = [typeFun]
	 */
	let funType = (fun, types = []) => {
	    if (!isFunction(fun)) {
	        throw new TypeError(typeErrorText(fun, 'function'));
	    }

	    if (!likeArray(types)) {
	        throw new TypeError(typeErrorText(types, 'array'));
	    }

	    for (let i = 0; i < types.length; i++) {
	        let typeFun = types[i];
	        if (typeFun) {
	            if (!isFunction(typeFun)) {
	                throw new TypeError(typeErrorText(typeFun, 'function'));
	            }
	        }
	    }

	    return function() {
	        // check type
	        for (let i = 0; i < types.length; i++) {
	            let typeFun = types[i];
	            let arg = arguments[i];
	            if (typeFun && !typeFun(arg)) {
	                throw new TypeError(`Argument type error. Arguments order ${i}. Argument is ${arg}.`);
	            }
	        }
	        // result
	        return fun.apply(this, arguments);
	    };
	};

	let and = (...args) => {
	    if (!any(args, isFunction)) {
	        throw new TypeError('The argument of and must be function.');
	    }
	    return (v) => {
	        for (let i = 0; i < args.length; i++) {
	            let typeFun = args[i];
	            if (!typeFun(v)) {
	                return false;
	            }
	        }
	        return true;
	    };
	};

	let or = (...args) => {
	    if (!any(args, isFunction)) {
	        throw new TypeError('The argument of and must be function.');
	    }

	    return (v) => {
	        for (let i = 0; i < args.length; i++) {
	            let typeFun = args[i];
	            if (typeFun(v)) {
	                return true;
	            }
	        }
	        return false;
	    };
	};

	let not = (type) => {
	    if (!isFunction(type)) {
	        throw new TypeError('The argument of and must be function.');
	    }
	    return (v) => !type(v);
	};

	let any = (list, type) => {
	    if (!likeArray(list)) {
	        throw new TypeError(typeErrorText(list, 'list'));
	    }
	    if (!isFunction(type)) {
	        throw new TypeError(typeErrorText(type, 'function'));
	    }

	    for (let i = 0; i < list.length; i++) {
	        if (!type(list[i])) {
	            return false;
	        }
	    }
	    return true;
	};

	let exist = (list, type) => {
	    if (!likeArray(list)) {
	        throw new TypeError(typeErrorText(list, 'array'));
	    }
	    if (!isFunction(type)) {
	        throw new TypeError(typeErrorText(type, 'function'));
	    }

	    for (let i = 0; i < list.length; i++) {
	        if (type(list[i])) {
	            return true;
	        }
	    }
	    return false;
	};

	let mapType = (map) => {
	    if (!isObject(map)) {
	        throw new TypeError(typeErrorText(map, 'obj'));
	    }

	    for (let name in map) {
	        let type = map[name];
	        if (!isFunction(type)) {
	            throw new TypeError(typeErrorText(type, 'function'));
	        }
	    }

	    return (v) => {
	        if (!isObject(v)) {
	            return false;
	        }

	        for (let name in map) {
	            let type = map[name];
	            let attr = v[name];
	            if (!type(attr)) {
	                return false;
	            }
	        }

	        return true;
	    };
	};

	let listType = (type) => {
	    if (!isFunction(type)) {
	        throw new TypeError(typeErrorText(type, 'function'));
	    }

	    return (list) => any(list, type);
	};

	let typeErrorText = (v, expect) => {
	    return `Expect ${expect} type, but got type ${typeof v}, and value is ${v}`;
	};

	module.exports = {
	    isArray,
	    likeArray,
	    isString,
	    isObject,
	    isFunction,
	    isNumber,
	    isBool,
	    isNode,
	    isPromise,
	    isNull,
	    isUndefined,
	    isFalsy,

	    funType,
	    any,
	    exist,

	    and,
	    or,
	    not,
	    mapType,
	    listType
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let serializeStructure = __webpack_require__(14);

	let serializeStyle = __webpack_require__(13);

	let idgener = __webpack_require__(19);

	let {
	    getDisplayText
	} = __webpack_require__(11);

	let cache = () => {
	    let hashKey = '__hash_key__';
	    let map = {};

	    let setCache = (node, name, value) => {
	        let key = null;
	        if (!node[hashKey]) {
	            key = idgener();
	            node[hashKey] = key;
	        } else {
	            key = node[hashKey];
	        }
	        map[key] = map[key] || {};
	        map[key][name] = {
	            value
	        };
	    };

	    let getCache = (node, name) => {
	        let key = node[hashKey];
	        if (key === undefined) return;
	        if (!map[key]) return;
	        return map[key][name];
	    };

	    return {
	        setCache,
	        getCache
	    };
	};

	module.exports = (nodes, {
	    style = true, textContent = true
	} = {}) => {
	    let {
	        getCache, setCache
	    } = cache();

	    let serializeStructureWithCache = (node) => {
	        let v = getCache(node, 'nodeStructure');
	        if (v) {
	            return v.value;
	        } else {
	            let ret = serializeStructure(node);
	            setCache(node, 'nodeStructure', ret);
	            return ret;
	        }
	    };

	    let getDisplayTextWithCache = (node) => {
	        let v = getCache(node, 'displayText');
	        if (v) {
	            return v.value;
	        } else {
	            let ret = getDisplayText(node);
	            setCache(node, 'displayText', ret);
	            return ret;
	        }
	    };

	    let serializeNode = (node, opts = {}) => {
	        let ret = serializeStructureWithCache(node);

	        if (opts.textContent) {
	            ret.textContent = getDisplayTextWithCache(node);
	        }

	        if (opts.style) {
	            ret.style = serializeStyle(node);
	        }
	        return ret;
	    };

	    let serializePath = (target) => {
	        let json = [];
	        let index = 0;

	        target = target && target.parentNode;
	        while (target) {
	            if (index < 2) {
	                json.push(serializeNode(target, {
	                    textContent: true
	                }));
	            } else {
	                json.push(serializeNode(target));
	            }

	            target = target.parentNode;

	            index++;
	        }
	        return json;
	    };

	    let getNodeInfo = (node) => {
	        let nodeInfo = serializeNode(node, {
	            textContent,
	            style
	        });
	        let path = serializePath(node);

	        let ret = {
	            node: nodeInfo,
	            path
	        };

	        return ret;
	    };

	    let nodeInfos = [];
	    for (let i = 0; i < nodes.length; i++) {
	        let node = nodes[i];
	        let nodeInfo = getNodeInfo(node);
	        nodeInfos.push(nodeInfo);
	    }

	    return nodeInfos;
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(20);


/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';

	let count = 0;

	module.exports = ({
	    timeVisual = false
	} = {}) => {
	    count++;
	    if (count > 10e6) {
	        count = 0;
	    }
	    let rand = Math.random(Math.random()) + '';

	    let time = timeVisual ? getTimeStr() : new Date().getTime();

	    return `${time}-${count}-${rand}`;
	};

	let getTimeStr = () => {
	    let date = new Date();
	    return `${date.getFullYear()}_${date.getMonth()+1}_${date.getDate()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}_${date.getMilliseconds()}`;
	};


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let idgener = __webpack_require__(19);

	let {
	    find
	} = __webpack_require__(22);

	module.exports = () => {
	    /**
	     * cacheMap = [[node, id]]
	     */
	    let cacheMap = [];

	    return (node) => {
	        if (!node) return null;
	        let ret = find(cacheMap, node, {
	            eq: (node, item) => node === item[0]
	        });
	        if (ret) return ret[1];

	        let id = idgener();
	        cacheMap.push([node, id]);
	        return id;
	    };
	};


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    isObject, funType, or, isString, isFalsy, likeArray
	} = __webpack_require__(23);

	let iterate = __webpack_require__(24);

	let {
	    map, reduce, find, findIndex, forEach, filter, any, exist, compact
	} = __webpack_require__(25);

	let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

	let difference = (list1, list2, fopts) => {
	    return reduce(list1, (prev, item) => {
	        if (!contain(list2, item, fopts) &&
	            !contain(prev, item, fopts)) {
	            prev.push(item);
	        }
	        return prev;
	    }, []);
	};

	let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

	let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

	let setValueKey = (obj, value, key) => {
	    obj[key] = value;
	    return obj;
	};

	let interset = (list1, list2, fopts) => {
	    return reduce(list1, (prev, cur) => {
	        if (contain(list2, cur, fopts)) {
	            prev.push(cur);
	        }
	        return prev;
	    }, []);
	};

	let deRepeat = (list, fopts, init = []) => {
	    return reduce(list, (prev, cur) => {
	        if (!contain(prev, cur, fopts)) {
	            prev.push(cur);
	        }
	        return prev;
	    }, init);
	};

	/**
	 * a.b.c
	 */
	let get = funType((sandbox, name = '') => {
	    name = name.trim();
	    let parts = !name ? [] : name.split('.');
	    return reduce(parts, getValue, sandbox, invertLogic);
	}, [
	    isObject,
	    or(isString, isFalsy)
	]);

	let getValue = (obj, key) => obj[key];

	let invertLogic = v => !v;

	let delay = (time) => new Promise((resolve) => {
	    setTimeout(resolve, time);
	});

	let flat = (list) => {
	    if (likeArray(list) && !isString(list)) {
	        return reduce(list, (prev, item) => {
	            prev = prev.concat(flat(item));
	            return prev;
	        }, []);
	    } else {
	        return [list];
	    }
	};

	module.exports = {
	    flat,
	    contain,
	    difference,
	    union,
	    interset,
	    map,
	    reduce,
	    iterate,
	    find,
	    findIndex,
	    deRepeat,
	    forEach,
	    filter,
	    any,
	    exist,
	    get,
	    delay,
	    mergeMap,
	    compact
	};


/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * basic types
	 */

	let isUndefined = v => v === undefined;

	let isNull = v => v === null;

	let isFalsy = v => !v;

	let likeArray = v => !!(v && typeof v === 'object' && typeof v.length === 'number' && v.length >= 0);

	let isArray = v => Array.isArray(v);

	let isString = v => typeof v === 'string';

	let isObject = v => !!(v && typeof v === 'object');

	let isFunction = v => typeof v === 'function';

	let isNumber = v => typeof v === 'number' && !isNaN(v);

	let isBool = v => typeof v === 'boolean';

	let isNode = (o) => {
	    return (
	        typeof Node === 'object' ? o instanceof Node :
	        o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string'
	    );
	};

	let isPromise = v => v && typeof v === 'object' && typeof v.then === 'function' && typeof v.catch === 'function';

	let isRegExp = v => v instanceof RegExp;

	let isReadableStream = (v) => isObject(v) && isFunction(v.on) && isFunction(v.pipe);

	let isWritableStream = v => isObject(v) && isFunction(v.on) && isFunction(v.write);

	/**
	 * check type
	 *
	 * types = [typeFun]
	 */
	let funType = (fun, types = []) => {
	    if (!isFunction(fun)) {
	        throw new TypeError(typeErrorText(fun, 'function'));
	    }

	    if (!likeArray(types)) {
	        throw new TypeError(typeErrorText(types, 'array'));
	    }

	    for (let i = 0; i < types.length; i++) {
	        let typeFun = types[i];
	        if (typeFun) {
	            if (!isFunction(typeFun)) {
	                throw new TypeError(typeErrorText(typeFun, 'function'));
	            }
	        }
	    }

	    return function() {
	        // check type
	        for (let i = 0; i < types.length; i++) {
	            let typeFun = types[i];
	            let arg = arguments[i];
	            if (typeFun && !typeFun(arg)) {
	                throw new TypeError(`Argument type error. Arguments order ${i}. Argument is ${arg}.`);
	            }
	        }
	        // result
	        return fun.apply(this, arguments);
	    };
	};

	let and = (...args) => {
	    if (!any(args, isFunction)) {
	        throw new TypeError('The argument of and must be function.');
	    }
	    return (v) => {
	        for (let i = 0; i < args.length; i++) {
	            let typeFun = args[i];
	            if (!typeFun(v)) {
	                return false;
	            }
	        }
	        return true;
	    };
	};

	let or = (...args) => {
	    if (!any(args, isFunction)) {
	        throw new TypeError('The argument of and must be function.');
	    }

	    return (v) => {
	        for (let i = 0; i < args.length; i++) {
	            let typeFun = args[i];
	            if (typeFun(v)) {
	                return true;
	            }
	        }
	        return false;
	    };
	};

	let not = (type) => {
	    if (!isFunction(type)) {
	        throw new TypeError('The argument of and must be function.');
	    }
	    return (v) => !type(v);
	};

	let any = (list, type) => {
	    if (!likeArray(list)) {
	        throw new TypeError(typeErrorText(list, 'list'));
	    }
	    if (!isFunction(type)) {
	        throw new TypeError(typeErrorText(type, 'function'));
	    }

	    for (let i = 0; i < list.length; i++) {
	        if (!type(list[i])) {
	            return false;
	        }
	    }
	    return true;
	};

	let exist = (list, type) => {
	    if (!likeArray(list)) {
	        throw new TypeError(typeErrorText(list, 'array'));
	    }
	    if (!isFunction(type)) {
	        throw new TypeError(typeErrorText(type, 'function'));
	    }

	    for (let i = 0; i < list.length; i++) {
	        if (type(list[i])) {
	            return true;
	        }
	    }
	    return false;
	};

	let mapType = (map) => {
	    if (!isObject(map)) {
	        throw new TypeError(typeErrorText(map, 'obj'));
	    }

	    for (let name in map) {
	        let type = map[name];
	        if (!isFunction(type)) {
	            throw new TypeError(typeErrorText(type, 'function'));
	        }
	    }

	    return (v) => {
	        if (!isObject(v)) {
	            return false;
	        }

	        for (let name in map) {
	            let type = map[name];
	            let attr = v[name];
	            if (!type(attr)) {
	                return false;
	            }
	        }

	        return true;
	    };
	};

	let listType = (type) => {
	    if (!isFunction(type)) {
	        throw new TypeError(typeErrorText(type, 'function'));
	    }

	    return (list) => any(list, type);
	};

	let typeErrorText = (v, expect) => {
	    return `Expect ${expect} type, but got type ${typeof v}, and value is ${v}`;
	};

	module.exports = {
	    isArray,
	    likeArray,
	    isString,
	    isObject,
	    isFunction,
	    isNumber,
	    isBool,
	    isNode,
	    isPromise,
	    isNull,
	    isUndefined,
	    isFalsy,
	    isRegExp,
	    isReadableStream,
	    isWritableStream,

	    funType,
	    any,
	    exist,

	    and,
	    or,
	    not,
	    mapType,
	    listType
	};


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    isPromise, likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, isReadableStream, mapType
	} = __webpack_require__(23);

	/**
	 * @param opts
	 *      preidcate: chose items to iterate
	 *      limit: when to stop iteration
	 *      transfer: transfer item
	 *      output
	 *      def: default result
	 */
	let iterate = funType((domain, opts = {}) => {
	    domain = domain || [];
	    if (isPromise(domain)) {
	        return domain.then(list => {
	            return iterate(list, opts);
	        });
	    }
	    return iterateList(domain, opts);
	}, [
	    or(isPromise, isObject, isFunction, isFalsy),
	    or(isUndefined, mapType({
	        predicate: or(isFunction, isFalsy),
	        transfer: or(isFunction, isFalsy),
	        output: or(isFunction, isFalsy),
	        limit: or(isUndefined, isNumber, isFunction)
	    }))
	]);

	let iterateList = (domain, opts) => {
	    opts = initOpts(opts, domain);

	    let rets = opts.def;
	    let count = 0; // iteration times

	    if (isReadableStream(domain)) {
	        let index = -1;

	        return new Promise((resolve, reject) => {
	            domain.on('data', (chunk) => {
	                let itemRet = iterateItem(chunk, domain, ++index, count, rets, opts);
	                rets = itemRet.rets;
	                count = itemRet.count;
	                if (itemRet.stop) {
	                    resolve(rets);
	                }
	            });
	            domain.on('end', () => {
	                resolve(rets);
	            });
	            domain.on('error', (err) => {
	                reject(err);
	            });
	        });
	    } else if (likeArray(domain)) {
	        for (let i = 0; i < domain.length; i++) {
	            let item = domain[i];
	            let itemRet = iterateItem(item, domain, i, count, rets, opts);
	            rets = itemRet.rets;
	            count = itemRet.count;
	            if (itemRet.stop) return rets;
	        }
	    } else if (isObject(domain)) {
	        for (let name in domain) {
	            let item = domain[name];
	            let itemRet = iterateItem(item, domain, name, count, rets, opts);
	            rets = itemRet.rets;
	            count = itemRet.count;
	            if (itemRet.stop) return rets;
	        }
	    }

	    return rets;
	};

	let initOpts = (opts, domain) => {
	    let {
	        predicate, transfer, output, limit
	    } = opts;

	    opts.predicate = predicate || truthy;
	    opts.transfer = transfer || id;
	    opts.output = output || toList;
	    if (limit === undefined) limit = domain && domain.length;
	    limit = opts.limit = stopCondition(limit);
	    return opts;
	};

	let iterateItem = (item, domain, name, count, rets, {
	    predicate, transfer, output, limit
	}) => {
	    if (limit(rets, item, name, domain, count)) {
	        // stop
	        return {
	            stop: true,
	            count,
	            rets
	        };
	    }

	    if (predicate(item)) {
	        rets = output(rets, transfer(item, name, domain, rets), name, domain);
	        count++;
	    }
	    return {
	        stop: false,
	        count,
	        rets
	    };
	};

	let stopCondition = (limit) => {
	    if (isUndefined(limit)) {
	        return falsy;
	    } else if (isNumber(limit)) {
	        return (rets, item, name, domain, count) => count >= limit;
	    } else {
	        return limit;
	    }
	};

	let toList = (prev, v) => {
	    prev.push(v);
	    return prev;
	};

	let truthy = () => true;

	let falsy = () => false;

	let id = v => v;

	module.exports = {
	    iterate
	};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    iterate
	} = __webpack_require__(24);

	let defauls = {
	    eq: (v1, v2) => v1 === v2
	};

	let setDefault = (opts, defauls) => {
	    for (let name in defauls) {
	        opts[name] = opts[name] || defauls[name];
	    }
	};

	let forEach = (list, handler) => iterate(list, {
	    limit: (rets) => {
	        if (rets === true) return true;
	        return false;
	    },
	    transfer: handler,
	    output: (prev, cur) => cur,
	    def: false
	});

	let map = (list, handler, limit) => iterate(list, {
	    transfer: handler,
	    def: [],
	    limit
	});

	let reduce = (list, handler, def, limit) => iterate(list, {
	    output: handler,
	    def,
	    limit
	});

	let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
	    handler && handler(cur, index, list) && prev.push(cur);
	    return prev;
	}, [], limit);

	let find = (list, item, fopts) => {
	    let index = findIndex(list, item, fopts);
	    if (index === -1) return undefined;
	    return list[index];
	};

	let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
	    let curLogic = handler && handler(cur, index, list);
	    return prev && originLogic(curLogic);
	}, true, falsyIt);

	let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
	    let curLogic = handler && handler(cur, index, list);
	    return prev || originLogic(curLogic);
	}, false, originLogic);

	let findIndex = (list, item, fopts = {}) => {
	    setDefault(fopts, defauls);

	    let {
	        eq
	    } = fopts;
	    let predicate = (v) => eq(item, v);
	    let ret = iterate(list, {
	        transfer: indexTransfer,
	        limit: onlyOne,
	        predicate,
	        def: []
	    });
	    if (!ret.length) return -1;
	    return ret[0];
	};

	let compact = (list) => reduce(list, (prev, cur) => {
	    if (cur) prev.push(cur);
	    return prev;
	}, []);

	let indexTransfer = (item, index) => index;

	let onlyOne = (rets, item, name, domain, count) => count >= 1;

	let falsyIt = v => !v;

	let originLogic = v => !!v;

	module.exports = {
	    map,
	    forEach,
	    reduce,
	    find,
	    findIndex,
	    filter,
	    any,
	    exist,
	    compact
	};


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * page states plugins
	 *
	 * record page states at moments
	 */

	let PageStateRecorder = __webpack_require__(27);
	let Ajaxtamper = __webpack_require__(29).recordPlugin;

	let {
	    map
	} = __webpack_require__(37);

	module.exports = () => {
	    return map([
	        PageStateRecorder,
	        Ajaxtamper
	    ], (high) => high());
	};


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let getPageState = __webpack_require__(28);

	module.exports = () => {
	    return {
	        startRecording: ({
	            refreshId,
	            winId,
	            continueWinId
	        }, {
	            receiveState
	        }) => {
	            // TODO using observable
	            setInterval(() => {
	                receiveState({
	                    state: getPageState(),
	                    moment: 'regular',
	                    refreshId,
	                    winId,
	                    continueWinId
	                });
	            }, 100);
	        },

	        // at this moment, the event handlers still not triggered, but UI may changed (like scroll, user input)
	        beforeAddAction: ({
	            refreshId,
	            winId,
	            continueWinId
	        }, {
	            receiveState
	        }) => {
	            return receiveState({
	                state: getPageState(),
	                moment: 'beforeRecordAction',
	                refreshId,
	                winId,
	                continueWinId
	            });
	        },

	        stopRecording: ({
	            refreshId,
	            winId,
	            continueWinId
	        }, {
	            receiveState
	        }) => {
	            return receiveState({
	                state: getPageState(),
	                moment: 'closewindow',
	                refreshId,
	                winId,
	                continueWinId
	            });
	        }
	    };
	};


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    getDisplayText
	} = __webpack_require__(11);

	module.exports = () => {
	    return {
	        type: 'state',
	        url: window.location.href,
	        cookie: document.cookie,
	        pageText: getDisplayText(document.body),
	        title: document.title
	    };
	};


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(30);


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let playbackPlugin = __webpack_require__(31);
	let recordPlugin = __webpack_require__(44);

	module.exports = {
	    playbackPlugin,
	    recordPlugin
	};


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let ajaxproxy = __webpack_require__(32);

	let {
	    get
	} = __webpack_require__(41);

	let jsonTransfer = __webpack_require__(42);

	let {
	    proxyAjax
	} = ajaxproxy();

	let {
	    find
	} = __webpack_require__(37);

	// TODO expand state to same dom node state nearby
	// TODO scope logic
	module.exports = (opts, {
	    initState
	}) => {
	    let getLog = () => opts.log;

	    let stopFlag = false;

	    let state = initState;

	    let log = (info) => {
	        let passLog = getLog();
	        if (passLog) {
	            return passLog(info);
	        } else {
	            setTimeout(() => {
	                log(info);
	            }, 100);
	        }
	    };

	    proxyAjax({
	        xhr: {
	            proxyOptions: (options) => {
	                if (stopFlag) return options;

	                log(`[ajax start] options ${JSON.stringify(options)}`);
	                return Promise.resolve(state).then((curState) => {
	                    if (!curState) return options;
	                    let rule = findRuleFromState(curState, options);

	                    log(`[ajax rule] find rule ${JSON.stringify(rule)}`);
	                    options.rule = rule;
	                    return options;
	                });
	            },

	            proxySend: (options) => {
	                let rule = options.rule;
	                if (rule && rule.type === 'mock') {
	                    log(`[ajx mock] rule is ${JSON.stringify(rule)}`);
	                    let body = rule.mock;
	                    log(`[ajx mock] response body is ${body}`);
	                    return {
	                        status: 200,
	                        statusText: 'OK',
	                        bodyType: '',
	                        body,
	                        headers: {
	                            'Content-Type': 'application/json;charset=UTF-8'
	                        }
	                    };
	                }
	            },

	            proxyResponse: (response, options) => {
	                let rule = options.rule;
	                if (!rule || rule.type === 'mock') return response;

	                let oriBody = response.body;
	                let body = oriBody;
	                try {
	                    body = JSON.parse(oriBody);
	                } catch (err) {
	                    return response;
	                }
	                if (options.rule) {
	                    log(`[ajx tamper] rule is ${JSON.stringify(rule)}`);

	                    log(`[ajx tamper] response body is ${oriBody}`);
	                    body = jsonTransfer(body, rule.items);

	                    log(`[ajx tamper] result is ${JSON.stringify(body)}`);
	                }
	                response.body = JSON.stringify(body);
	                return response;
	            }
	        }
	    });

	    return {
	        afterPlay: () => {
	            stopFlag = true;
	        },

	        beforeRunAction: (action) => {
	            state = action.afterState;
	        }
	    };
	};

	let findRuleFromState = (curState, options) => {
	    let rules = get(curState, 'externals.ajaxTamper') || [];
	    return findRule(options, rules);
	};

	let findRule = (options, rules) => {
	    return find(rules, options, {
	        eq: matchRule
	    });
	};

	let matchRule = (options, rule) => {
	    let urlReg = new RegExp(rule.url);
	    if (!urlReg.test(options.url)) {
	        return false;
	    }

	    if (options.method !== rule.method) {
	        return false;
	    }

	    return true;
	};


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(33);


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let ProxyXhr = __webpack_require__(34);

	// TODO fetch

	/**
	 *  control aspect
	 *
	 *  (1) request data
	 *
	 *  http request
	 *
	 *  options = {
	 *      url
	 *      method,
	 *      headers: {
	 *      },
	 *      body
	 *  }
	 */
	module.exports = ({
	    env = window
	} = {}) => {
	    let OriginXMLHttpRequest = env.XMLHttpRequest;

	    let proxyXhr = ProxyXhr(env);

	    let proxyAjax = ({
	        xhr
	    } = {}) => {
	        proxyXhr(xhr);
	    };

	    let recovery = () => {
	        env.XMLHttpRequest = OriginXMLHttpRequest;
	    };

	    return {
	        proxyXhr,
	        proxyAjax,
	        recovery
	    };
	};


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    mirrorClass, cache, hide
	} = __webpack_require__(35);

	let {
	    isFunction
	} = __webpack_require__(17);

	let {
	    forEach, reduce, map
	} = __webpack_require__(37);

	let id = v => v;

	/**
	 *  control aspect
	 *
	 *  (1) request data
	 *
	 *  http request
	 *
	 *  options = {
	 *      url
	 *      method,
	 *      headers: {
	 *      },
	 *      body
	 *  }
	 */

	module.exports = (env = window) => {
	    let proxyXMLHttpRequest = (opts = {}) => {
	        let proxyGet = (proxy) => (v, obj, shadow) => proxy(v, obj, shadow, opts);

	        env.XMLHttpRequest =
	            mirrorClass(env.XMLHttpRequest, [
	                hide('send', {
	                    getHandle: proxyGet(proxySend)
	                }),

	                hide('open', {
	                    getHandle: proxyGet(proxyOpen)
	                }),

	                hide('setRequestHeader', {
	                    getHandle: proxyGet(proxySetRequestHeader)
	                }),

	                hide('getResponseHeader', {
	                    getHandle: proxyGet(proxyGetResponseHeader)
	                }),

	                hide('getAllResponseHeaders', {
	                    getHandle: proxyGet(proxyGetAllResponseHeaders)
	                }),

	                {
	                    name: 'onreadystatechange',
	                    setHandle: (v, obj) => {
	                        if (!isFunction(v)) return v;
	                        return function(e) {
	                            return Promise.resolve(
	                                obj.readyState === 4 ? proxyResponseReady(obj, opts) : null
	                            ).then(() => {
	                                // TODO event proxyer
	                                let newE = reduce(e, (prev, v, n) => {
	                                    prev[n] = v;
	                                    return prev;
	                                }, {});
	                                newE.isTrusted = true;
	                                newE.target = obj;
	                                newE.srcElement = obj;
	                                newE.currentTarget = obj;
	                                return v.apply(this, newE);
	                            });
	                        };
	                    }
	                },

	                // hide all read only properties
	                hide('readyState'),

	                hide('responseURL'),

	                hide('response'),

	                hide('responseText'),

	                hide('status'),

	                hide('statusText'),

	                hide('responseXML'),

	                hide('responseType')
	            ]);
	    };

	    return proxyXMLHttpRequest;
	};

	let proxyResponseReady = (obj, {
	    proxyResponse = id
	}) => {
	    // TODO response headers
	    let response = {
	        status: obj.status,
	        statusText: obj.statusText,
	        bodyType: obj.responseType,
	        body: obj.response,
	        headers: parseResponseHeaders(obj.getAllResponseHeaders())
	    };

	    let options = cache.fetchPropValue(obj, 'options', {
	        headers: {}
	    }, {
	        hide: true
	    });

	    return Promise.resolve(proxyResponse(response, options)).then((response) => {
	        cacheResponse(obj, response);
	    });
	};

	let cacheResponse = (obj, {
	    status, statusText, body, headers = {}
	}) => {
	    // apply add to cache
	    cache.cacheProp(obj, 'status', status);
	    cache.cacheProp(obj, 'statusText', statusText);
	    cache.cacheProp(obj, 'response', body);
	    cache.cacheProp(obj, 'responseText', body);
	    cache.cacheProp(obj, 'responseXML', body);
	    // TODO more response body
	    // response headers
	    cache.cacheProp(obj, 'responseHeaders', headers, {
	        hide: true
	    });
	};

	// setRequestHeader(header, value)
	let proxySetRequestHeader = (v, obj) => {
	    return function(...args) {
	        let [header, value] = args;
	        let options = cache.fetchPropValue(obj, 'options', {
	            headers: {}
	        }, {
	            hide: true
	        });
	        options.headers[header] = value;
	    };
	};

	// open(method, url, async, user, password)
	let proxyOpen = (v, obj) => {
	    return function(...args) {
	        let [method, url, asyn, user, password] = args;
	        if (asyn !== false) asyn = true;
	        cache.cacheProp(obj, 'options', {
	            method, url, user, password,
	            'async': asyn,
	            headers: {}
	        }, {
	            hide: true
	        });
	    };
	};

	let proxyGetResponseHeader = (v, obj, mirror) => {
	    return function(name = '') {
	        let headers = cache.fetchPropValue(obj, 'responseHeaders', {}, {
	            hide: true
	        });
	        name = map(name.split('-'), (item) => {
	            let first = item[0].toUpperCase();
	            return first + item.substring(1);
	        }).join('-');
	        if (headers[name]) return headers[name];
	        return v.apply(mirror, [name]);
	    };
	};

	let proxyGetAllResponseHeaders = (v, obj, mirror) => {
	    return function() {
	        let headers = cache.fetchPropValue(obj, 'responseHeaders', null, {
	            hide: true
	        });

	        if (headers) return headersToString(headers);
	        return v.apply(mirror, []);
	    };

	};

	// TODO sync
	let proxySend = (v, obj, mirror, {
	    proxyOptions = id, proxySend
	}) => {
	    return function(data) {
	        let options = cache.fetchPropValue(obj, 'options', {
	            headers: {}
	        }, {
	            hide: true
	        });

	        options.body = data;

	        return Promise.resolve(proxyOptions(options)).then((options) => {
	            mirror.open(options.method, options.url, options.async, options.user, options.password);

	            let headers = options.headers;
	            forEach(headers, (value, name) => {
	                mirror.setRequestHeader(name, value);
	            });

	            let send = () => v.apply(mirror, [options.body || null]);

	            if (proxySend) {
	                return Promise.resolve(proxySend(options)).then((response) => {
	                    if (response && options.async !== false) {
	                        return new Promise((resolve) => {
	                            setTimeout(() => {
	                                resolve(response);
	                            }, 0);
	                        });
	                    }
	                    return response;
	                }).then((response) => {
	                    if (!response) {
	                        return send();
	                    } else {
	                        cache.cacheProp(obj, 'readyState', 4);
	                        cache.cacheProp(obj, 'responseURL', options.url);
	                        cacheResponse(obj, response);
	                        // apply
	                        let e = new Event('readystatechange', {
	                            bubble: false,
	                            cancelBubble: false,
	                            cancelable: false,
	                            defaultPrevented: false,
	                            eventPhase: 0,
	                            isTrusted: true,
	                            path: [],
	                            returnValue: true
	                        });
	                        obj.dispatchEvent(e);
	                    }
	                });
	            } else {
	                // send request
	                return send();
	            }
	        });
	    };
	};

	/**
	 * XmlHttpRequest's getAllResponseHeaders() method returns a string of response
	 * headers according to the format described here:
	 * http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders-method
	 * This method parses that string into a user-friendly key/value pair object.
	 */
	function parseResponseHeaders(headerStr) {
	    var headers = {};
	    if (!headerStr) {
	        return headers;
	    }
	    var headerPairs = headerStr.split('\u000d\u000a');
	    for (var i = 0; i < headerPairs.length; i++) {
	        var headerPair = headerPairs[i];
	        // Can't use split() here because it does the wrong thing
	        // if the header value has the string ": " in it.
	        var index = headerPair.indexOf('\u003a\u0020');
	        if (index > 0) {
	            var key = headerPair.substring(0, index);
	            var val = headerPair.substring(index + 2);
	            headers[key] = val;
	        }
	    }
	    return headers;
	}

	let headersToString = (headers) => {
	    return reduce(headers, (prev, v, n) => {
	        prev += `${n}: ${v}\n`;
	        return prev;
	    }, '');
	};


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(36);


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 *
	 * mirror proxy for an object
	 *
	 * visit proxy object instead of visiting object directly
	 *
	 * (proxy, origin)
	 *
	 * proxy prop include get and set
	 */

	let {
	    isFunction
	} = __webpack_require__(17);

	let {
	    forEach, map
	} = __webpack_require__(37);

	let cache = __webpack_require__(40);

	let reflectMirrorContext = (v, obj, shadow) => {
	    if (isFunction(v)) {
	        return function(...args) {
	            let context = this;
	            if (context === obj) {
	                context = shadow;
	            }
	            return v.apply(context, args);
	        };
	    }
	    return v;
	};

	let hide = (name, {
	    cacheOpts,
	    getHandle = id
	} = {}) => {
	    return {
	        setHandle: (v, obj) => {
	            cache.cacheProp(obj, name, v);
	            return STOP_SETTING;
	        },

	        getHandle: (v, obj, shadow, name) => {
	            if (cache.fromCache(obj, name, cacheOpts)) {
	                return cache.fromCache(obj, name, cacheOpts).value;
	            }
	            return getHandle(v, obj, shadow, name);
	        },

	        name
	    };
	};

	let mirrorClass = (Origin, props = [], {
	    mirrorName = '__secret_mirror_instance'
	} = {}) => {
	    // mirror constructor
	    let ProxyClass = function(...args) {
	        let ctx = this;
	        let mirrorInst = ctx[mirrorName] = new Origin(...args);
	        let defProps = map(mirrorInst, (_, name) => {
	            return {
	                name,
	                getHandle: reflectMirrorContext
	            };
	        });
	        props = defProps.concat(props);

	        mirrorProps(ctx, mirrorInst, props);
	    };

	    // prototype
	    ProxyClass.prototype = Origin.prototype;

	    return ProxyClass;
	};

	/**
	 * props = [
	 *      {
	 *          name,
	 *          setHandle,  v => v
	 *          getHandle   v => v
	 *      }
	 * ]
	 */
	let mirrorProps = (obj, shadow, props = []) => {
	    let handleMap = {};
	    forEach(props, ({
	        name, setHandle = id, getHandle = id
	    }) => {
	        if (!handleMap[name]) {
	            Object.defineProperty(obj, name, {
	                set: (v) => {
	                    return handleMap[name].set(v);
	                },
	                get: () => {
	                    return handleMap[name].get();
	                }
	            });
	        }
	        handleMap[name] = {
	            set: (v) => {
	                v = setHandle(v, obj, shadow, name);
	                if (v !== STOP_SETTING) {
	                    // set to shadow
	                    shadow[name] = v;
	                }
	            },

	            get: () => {
	                // fetch from shadow
	                let v = shadow[name];
	                return getHandle(v, obj, shadow, name);
	            }
	        };
	    });
	};

	const STOP_SETTING = {};

	let id = v => v;

	module.exports = {
	    mirrorProps,
	    mirrorClass,
	    cache,
	    STOP_SETTING,
	    reflectMirrorContext,
	    hide
	};


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    isObject, funType, or, isString, isFalsy, likeArray
	} = __webpack_require__(17);

	let iterate = __webpack_require__(38);

	let {
	    map, reduce, find, findIndex, forEach, filter, any, exist, compact
	} = __webpack_require__(39);

	let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

	let difference = (list1, list2, fopts) => {
	    return reduce(list1, (prev, item) => {
	        if (!contain(list2, item, fopts) &&
	            !contain(prev, item, fopts)) {
	            prev.push(item);
	        }
	        return prev;
	    }, []);
	};

	let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

	let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

	let setValueKey = (obj, value, key) => {
	    obj[key] = value;
	    return obj;
	};

	let interset = (list1, list2, fopts) => {
	    return reduce(list1, (prev, cur) => {
	        if (contain(list2, cur, fopts)) {
	            prev.push(cur);
	        }
	        return prev;
	    }, []);
	};

	let deRepeat = (list, fopts, init = []) => {
	    return reduce(list, (prev, cur) => {
	        if (!contain(prev, cur, fopts)) {
	            prev.push(cur);
	        }
	        return prev;
	    }, init);
	};

	/**
	 * a.b.c
	 */
	let get = funType((sandbox, name = '') => {
	    name = name.trim();
	    let parts = !name ? [] : name.split('.');
	    return reduce(parts, getValue, sandbox, invertLogic);
	}, [
	    isObject,
	    or(isString, isFalsy)
	]);

	let getValue = (obj, key) => obj[key];

	let invertLogic = v => !v;

	let delay = (time) => new Promise((resolve) => {
	    setTimeout(resolve, time);
	});

	let flat = (list) => {
	    if (likeArray(list) && !isString(list)) {
	        return reduce(list, (prev, item) => {
	            prev = prev.concat(flat(item));
	            return prev;
	        }, []);
	    } else {
	        return [list];
	    }
	};

	module.exports = {
	    flat,
	    contain,
	    difference,
	    union,
	    interset,
	    map,
	    reduce,
	    iterate,
	    find,
	    findIndex,
	    deRepeat,
	    forEach,
	    filter,
	    any,
	    exist,
	    get,
	    delay,
	    mergeMap,
	    compact
	};


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, mapType
	} = __webpack_require__(17);

	/**
	 *
	 * preidcate: chose items to iterate
	 * limit: when to stop iteration
	 * transfer: transfer item
	 * output
	 */
	let iterate = funType((domain = [], opts = {}) => {
	    let {
	        predicate, transfer, output, limit, def
	    } = opts;

	    opts.predicate = predicate || truthy;
	    opts.transfer = transfer || id;
	    opts.output = output || toList;
	    if (limit === undefined) limit = domain && domain.length;
	    limit = opts.limit = stopCondition(limit);

	    let rets = def;
	    let count = 0;

	    if (likeArray(domain)) {
	        for (let i = 0; i < domain.length; i++) {
	            let itemRet = iterateItem(domain, i, count, rets, opts);
	            rets = itemRet.rets;
	            count = itemRet.count;
	            if (itemRet.stop) return rets;
	        }
	    } else if (isObject(domain)) {
	        for (let name in domain) {
	            let itemRet = iterateItem(domain, name, count, rets, opts);
	            rets = itemRet.rets;
	            count = itemRet.count;
	            if (itemRet.stop) return rets;
	        }
	    }

	    return rets;
	}, [
	    or(isObject, isFunction, isFalsy),
	    or(isUndefined, mapType({
	        predicate: or(isFunction, isFalsy),
	        transfer: or(isFunction, isFalsy),
	        output: or(isFunction, isFalsy),
	        limit: or(isUndefined, isNumber, isFunction)
	    }))
	]);

	let iterateItem = (domain, name, count, rets, {
	    predicate, transfer, output, limit
	}) => {
	    let item = domain[name];
	    if (limit(rets, item, name, domain, count)) {
	        // stop
	        return {
	            stop: true,
	            count,
	            rets
	        };
	    }

	    if (predicate(item)) {
	        rets = output(rets, transfer(item, name, domain, rets), name, domain);
	        count++;
	    }
	    return {
	        stop: false,
	        count,
	        rets
	    };
	};

	let stopCondition = (limit) => {
	    if (isUndefined(limit)) {
	        return falsy;
	    } else if (isNumber(limit)) {
	        return (rets, item, name, domain, count) => count >= limit;
	    } else {
	        return limit;
	    }
	};

	let toList = (prev, v) => {
	    prev.push(v);
	    return prev;
	};

	let truthy = () => true;

	let falsy = () => false;

	let id = v => v;

	module.exports = iterate;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let iterate = __webpack_require__(38);

	let defauls = {
	    eq: (v1, v2) => v1 === v2
	};

	let setDefault = (opts, defauls) => {
	    for (let name in defauls) {
	        opts[name] = opts[name] || defauls[name];
	    }
	};

	let forEach = (list, handler) => iterate(list, {
	    limit: (rets) => {
	        if (rets === true) return true;
	        return false;
	    },
	    transfer: handler,
	    output: (prev, cur) => cur,
	    def: false
	});

	let map = (list, handler, limit) => iterate(list, {
	    transfer: handler,
	    def: [],
	    limit
	});

	let reduce = (list, handler, def, limit) => iterate(list, {
	    output: handler,
	    def,
	    limit
	});

	let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
	    handler && handler(cur, index, list) && prev.push(cur);
	    return prev;
	}, [], limit);

	let find = (list, item, fopts) => {
	    let index = findIndex(list, item, fopts);
	    if (index === -1) return undefined;
	    return list[index];
	};

	let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
	    let curLogic = handler && handler(cur, index, list);
	    return prev && originLogic(curLogic);
	}, true, falsyIt);

	let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
	    let curLogic = handler && handler(cur, index, list);
	    return prev || originLogic(curLogic);
	}, false, originLogic);

	let findIndex = (list, item, fopts = {}) => {
	    setDefault(fopts, defauls);

	    let {
	        eq
	    } = fopts;
	    let predicate = (v) => eq(item, v);
	    let ret = iterate(list, {
	        transfer: indexTransfer,
	        limit: onlyOne,
	        predicate,
	        def: []
	    });
	    if (!ret.length) return -1;
	    return ret[0];
	};

	let compact = (list) => reduce(list, (prev, cur) => {
	    if (cur) prev.push(cur);
	    return prev;
	}, []);

	let indexTransfer = (item, index) => index;

	let onlyOne = (rets, item, name, domain, count) => count >= 1;

	let falsyIt = v => !v;

	let originLogic = v => !!v;

	module.exports = {
	    map,
	    forEach,
	    reduce,
	    find,
	    findIndex,
	    filter,
	    any,
	    exist,
	    compact
	};


/***/ },
/* 40 */
/***/ function(module, exports) {

	'use strict';

	const SECRET_KEY = '__cache__mirror__';

	let cacheProp = (obj, key, value, {
	    secretKey = SECRET_KEY, hide
	} = {}) => {
	    obj[secretKey] = obj[secretKey] || {};
	    obj[secretKey][key] = {
	        value, hide
	    };
	};

	let getProp = (obj, key, {
	    secretKey = SECRET_KEY
	} = {}) => {
	    obj[secretKey] = obj[secretKey] || {};
	    return obj[secretKey][key];
	};

	let fromCache = (obj, key, {
	    secretKey = SECRET_KEY
	} = {}) => {
	    obj[secretKey] = obj[secretKey] || {};
	    let v = obj[secretKey][key];
	    if (!v) return false;
	    if (v.hide) return false;
	    return v;
	};

	let removeCache = (obj, key, {
	    secretKey = SECRET_KEY
	} = {}) => {
	    obj[secretKey] = obj[secretKey] || {};
	    obj[secretKey][key] = undefined;
	};

	let fetchPropValue = (obj, name, def, opts) => {
	    let cached = getProp(obj, name, opts);
	    if (!cached) {
	        cacheProp(obj, name, def, opts);
	    }
	    return getProp(obj, name).value;
	};

	module.exports = {
	    cacheProp,
	    fromCache,
	    removeCache,
	    getProp,
	    fetchPropValue
	};


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    reduce
	} = __webpack_require__(37);
	let {
	    funType, isObject, or, isString, isFalsy
	} = __webpack_require__(17);

	let defineProperty = (obj, key, opts) => {
	    if (Object.defineProperty) {
	        Object.defineProperty(obj, key, opts);
	    } else {
	        obj[key] = opts.value;
	    }
	    return obj;
	};

	let hasOwnProperty = (obj, key) => {
	    if (obj.hasOwnProperty) {
	        return obj.hasOwnProperty(key);
	    }
	    for (var name in obj) {
	        if (name === key) return true;
	    }
	    return false;
	};

	let toArray = (v = []) => Array.prototype.slice.call(v);

	/**
	 * a.b.c
	 */
	let get = funType((sandbox, name = '') => {
	    name = name.trim();
	    let parts = !name ? [] : name.split('.');
	    return reduce(parts, getValue, sandbox, invertLogic);
	}, [
	    isObject,
	    or(isString, isFalsy)
	]);

	let getValue = (obj, key) => obj[key];

	let invertLogic = v => !v;

	let set = (sandbox, name = '', value) => {
	    name = name.trim();
	    let parts = !name ? [] : name.split('.');
	    let parent = sandbox;
	    if (!isObject(parent)) return;
	    if (!parts.length) return;
	    for (let i = 0; i < parts.length - 1; i++) {
	        let part = parts[i];
	        parent = parent[part];
	        // avoid exception
	        if (!isObject(parent)) return null;
	    }

	    parent[parts[parts.length - 1]] = value;
	    return true;
	};

	/**
	 * provide property:
	 *
	 * 1. read props freely
	 *
	 * 2. change props by provide token
	 */

	let authProp = (token) => {
	    let set = (obj, key, value) => {
	        let temp = null;

	        if (!hasOwnProperty(obj, key)) {
	            defineProperty(obj, key, {
	                enumerable: false,
	                configurable: false,
	                set: (value) => {
	                    if (isObject(value)) {
	                        if (value.token === token) {
	                            // save
	                            temp = value.value;
	                        }
	                    }
	                },
	                get: () => {
	                    return temp;
	                }
	            });
	        }

	        setProp(obj, key, value);
	    };

	    let setProp = (obj, key, value) => {
	        obj[key] = {
	            token,
	            value
	        };
	    };

	    return {
	        set
	    };
	};

	let evalCode = (code) => {
	    if (typeof code !== 'string') return code;
	    return eval(`(function(){
	    try {
	        ${code}
	    } catch(err) {
	        console.log('Error happened, when eval code.');
	        throw err;
	    }
	})()`);
	};

	let delay = (time) => new Promise((resolve) => {
	    setTimeout(resolve, time);
	});

	let runSequence = (list, params = [], context, stopV) => {
	    if (!list.length) {
	        return Promise.resolve();
	    }
	    let fun = list[0];
	    let v = fun && fun.apply(context, params);
	    if (stopV && v === stopV) {
	        return Promise.resolve(stopV);
	    }
	    return Promise.resolve(v).then(() => {
	        return runSequence(list.slice(1), params, context, stopV);
	    });
	};

	module.exports = {
	    defineProperty,
	    hasOwnProperty,
	    toArray,
	    get,
	    set,
	    authProp,
	    evalCode,
	    delay,
	    runSequence
	};


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(43);

/***/ },
/* 43 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * rules = [[jsonPath, value]]
	 * 
	 * jsonPath: 'a.b.c', 'a.0.k', '', 'a.*.d'
	 * 
	 * [['a.c', 0], ['a.b.d', 5]]
	 * 
	 * @return {json}
	 */

	let isString = str => typeof str === 'string';

	let isArray = arr => Array.isArray(arr);

	let isObject = obj => Object.prototype.toString.call(obj) === '[object Object]';

	let isObjorArr = val => isArray(val) || isObject(val);

	let compact = arr => arr.filter(item => item && item !== '');

	let setValue = (json, path, value) => {
	    let keys = compact(path.split('.'));
	    let cur = json;
	    let len = keys.length;
	    if(!keys.length){
	        json = value;
	    }
	    for (let idx = 0; idx < keys.length; idx++) {
	        let key = keys[idx];
	        if (key === '*') {
	            let all = Object.keys(cur);
	            all.forEach((item) => {
	                let newKeys = keys.slice(idx + 1);
	                newKeys.unshift(item);
	                setValue(cur, newKeys.join('.'), value);
	            });
	            return json;
	        }
	        if (idx === len - 1) {
	            if(isArray(cur) && isNaN(key)){
	                throw new Error(`should not set key ${key} to array:[${cur}]`);
	            }
	            cur[key] = value;
	            return json;
	        }
	        if (!cur[key] || !isObjorArr(cur[key]) ) {
	            cur[key] = {};
	        }
	        cur = cur[key];
	    }
	    return json;
	};

	let transfer = (json, pairs) => {
	    if (!isArray(pairs) || pairs.length !== 2) {
	        throw new TypeError(`${pairs} is not corret pairs`);
	    }
	    let path = pairs[0];
	    let value = pairs[1];
	    if (!isString(path)) {
	        throw new TypeError(`${path} is not string`);
	    }
	    json = setValue(json, path, value);
	    return json;
	};

	let run = (json = {}, rules = []) => {
	    if (!isObject(json)) {
	        throw new TypeError(`${json} is not json`);
	    }
	    let newJson = Object.assign({}, json);
	    if (!isArray(rules)) {
	        throw new TypeError(`rules: ${rules} is not array`);
	    }
	    let curJson = newJson;
	    rules.forEach((pairs) => {
	      curJson = transfer(curJson, pairs);
	    });
	    return curJson;
	};

	module.exports = run;

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let ajaxproxy = __webpack_require__(32);

	let messageQueue = __webpack_require__(45);

	let {
	    forEach
	} = __webpack_require__(37);

	let {
	    proxyAjax
	} = ajaxproxy();

	module.exports = () => {
	    let {
	        produce, consume
	    } = messageQueue();

	    let rootCache = [];

	    let captureCallback = null;

	    proxyAjax({
	        xhr: {
	            proxyOptions: (options) => {
	                let {
	                    result, data
	                } = produce({
	                    a: 1
	                });

	                options.id = data.id;

	                if (!captureCallback) {
	                    rootCache.push(result);
	                } else {
	                    captureCallback(result);
	                }

	                // send point
	                return options;
	            },

	            proxyResponse: (response, options) => {
	                consume({
	                    id: options.id,
	                    data: {
	                        options,
	                        response
	                    }
	                });
	                return response;
	            }
	        }
	    });

	    return {
	        startRecording: (options, {
	            receiveAjax
	        }) => {
	            captureCallback = (result) => {
	                // updateAjax
	                return result.then(receiveAjax);
	            };
	            forEach(rootCache, (result) => {
	                captureCallback(result);
	            });
	        },

	        stopRecording: () => {
	            captureCallback = null;
	        }
	    };
	};


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(46);


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let idgener = __webpack_require__(19);

	let messageQueue = () => {
	    let queue = {};

	    return {
	        produce: (source) => {
	            let id = idgener();

	            return {
	                data: {
	                    id, source,
	                    time: new Date().getTime()
	                },
	                result: new Promise((resolve, reject) => {
	                    queue[id] = {
	                        resolve,
	                        reject
	                    };
	                })
	            };
	        },

	        consume: ({
	            id,
	            error,
	            data
	        }) => {
	            let item = queue[id];
	            if (error) {
	                item && item.reject(error);
	            } else {
	                item && item.resolve(data);
	            }
	            delete queue[id];
	        }
	    };
	};

	module.exports = messageQueue;


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let idgener = __webpack_require__(19);

	let {
	    runSequence
	} = __webpack_require__(41);

	let {
	    map
	} = __webpack_require__(37);

	let completeActionInfo = (action, {
	    winId,
	    continueWinId,
	    refreshId
	}) => {
	    winId = continueWinId || winId;
	    // type
	    action.type = 'action';

	    // tag refreshId
	    action.refreshId = refreshId;

	    // tag winId
	    action.winId = winId;

	    return action;
	};


	/**
	 * record user's actions and manage recording results
	 */
	module.exports = (record, plugins) => {
	    /**
	     * @param options
	     * @param store
	     *      clearRecordData
	     *      getRecordData
	     *      receiveAction
	     *      receiveState
	     *      receiveAjax
	     *      ...
	     */
	    return (options, store) => {
	        // get current page's refreshId
	        options.refreshId = options.refreshId || idgener();
	        let {
	            passData
	        } = options;

	        let {
	            receiveAction
	        } = store;

	        let start = () => {
	            return record(passData.config.action, options, {
	                startRecording: () => {
	                    return runSequence(map(plugins, (plugin) => plugin.startRecording), [
	                        options, store
	                    ]);
	                },

	                beforeAddAction: () => {
	                    return runSequence(map(plugins, (plugin) => plugin.beforeAddAction), [
	                        options,
	                        store
	                    ]);
	                },

	                receiveAction: (action) => {
	                    receiveAction(completeActionInfo(action, options));
	                }
	            });
	        };

	        return {
	            start,
	            stop: () => {
	                return runSequence(map(plugins, (plugin) => plugin.stopRecording), [options, store]);
	            }
	        };
	    };
	};


/***/ }
/******/ ]);
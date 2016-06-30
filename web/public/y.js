var _Y_;

(function() {

    //effects
    function hide(el) {
        el.style.display = 'none';
    }

    function show(el) {
        el.style.display = '';
    }

    //elements
    function addClass(el, className) {
        var ac = function(tel, clstr) {
            if (tel.classList) {
                tel.classList.add(clstr);
            } else {
                tel.className += ' ' + clstr;
            }
        };
        if (className && typeof(className) === 'string') {
            ac(el, className);
        }
        if (className && Array.isArray(className)) {
            className.forEach(function(cls) {
                ac(el, cls);
            });
        }
    };

    function after(el, htmlString) {
        el.insertAdjacentHTML('afterend', htmlString);
    }

    function append(parent, el) {
        parent.appendChild(el);
    };

    function applyStyle(el, style) {
        Object.keys(style).forEach(function(key) {
            el.style[key] = style[key];
        });
    }

    function before(el, htmlString) {
        el.insertAdjacentHTML('beforebegin', htmlString);
    }

    function clone(el) {
        return el.cloneNode(true);
    }

    function create(type, classes, styles) {
        el = document.createElement(type);
        classes && addClass(el, classes);
        styles && applyStyle(el, styles);

        return el;
    }

    function contains(el, child) {
        return el !== child && el.contains(child);
    }

    function containsSelector(el, selector) {
        el.querySelector(selector) !== null;
    }

    function each(selector, fun) {
        var elements = document.querySelectorAll(selector);
        Array.prototype.forEach.call(elements, fun);
    }

    function empty(el) {
        el.innerHTML = '';
    }

    function filter(selector, filterFn) {
        return Array.prototype.filter.call(document.querySelectorAll(selector), filterFn);
    }

    function findChildren(el, selector) {
        return el.querySelectorAll(selector);
    }

    function findElements(selector) {
        return document.querySelectorAll(selector);
    }

    function getAttribute(el, attr) {
        return el.getAttribute(attr);
    }

    function getInnerHTML(el) {
        return el.innerHTML;
    }

    function getOuterHTML(el) {
        return el.outerHTML;
    }

    function getStyle(el, ruleName) {
        return getComputedStyle(el)[ruleName];
    }

    function getText(el) {
        return el.textContent;
    }

    function hasClass(el, className) {
        if (el.classList)
            return el.classList.contains(className);
        else
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }

    function matchs(el1, el2) {
        return el1 === el2;
    }

    function matchsSelector(el, selector) {
        return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
    }

    function next() {
        return el.nextElementSibling;
    }

    function offset(el) {
        var rect = el.getBoundingClientRect();

        return {
            top: rect.top + document.body.scrollTop,
            left: rect.left + document.body.scrollLeft
        };
    }

    function offsetParent(el) {
        return el.offsetParent || el;
    }

    function outerHeight(el) {
        return el.offsetHeight;
    }

    function outerHeightWithMargin(el) {
        var height = el.offsetHeight;
        var style = getComputedStyle(el);

        height += parseInt(style.marginTop) + parseInt(style.marginBottom);
        return height;
    }

    function outerWidth(el) {
        return el.offsetWidth;
    }

    function outerWidthWithMargin(el) {
        var width = el.offsetWidth;
        var style = getComputedStyle(el);

        width += parseInt(style.marginLeft) + parseInt(style.marginRight);
        return width;
    }

    function parent(el) {
        return el.parentNode;
    }

    function position(el) {
        return {
            left: el.offsetLeft,
            top: el.offsetTop
        };
    }

    function positionRelativeToViewPort(el) {
        return el.getBoundingClientRect();
    }

    function prepend(el, parent) {
        parent.insertBefore(el, parent.firstChild);
    }

    function prev(el) {
        return el.previousElementSibling;
    }

    function remove(el) {
        el.parentNode.removeChild(el);
    }

    function removeClass(el, className) {
        if (el.classList)
            el.classList.remove(className);
        else
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    function replaceWithHTML(el, string) {
        el.outerHTML = string;
    }

    function setAttr(el, attr, value) {
        el.setAttribute(attr, value);
    }

    function setHTML(el, htmlString) {
        el.innerHTML = htmlString;
    }

    function setText(el, text) {
        el.textContent = text;
    }

    function siblings(el) {
        return Array.prototype.filter.call(el.parentNode.children, function(child) {
            return child !== el;
        });
    }

    function toggleClass(el, className) {
        if (el.classList) {
            el.classList.toggle(className);
        } else {
            var classes = el.className.split(' ');
            var existingIndex = classes.indexOf(className);

            if (existingIndex >= 0)
                classes.splice(existingIndex, 1);
            else
                classes.push(className);

            el.className = classes.join(' ');
        }
    };

    //events
    function on(el, eventName, eventHandler) {
        el.addEventListener(eventName, eventHandler);
    }

    function off(el, eventName, eventHandler) {
        el.removeEventListener(eventName, eventHandler);
    }

    function ready(fn) {
        if (document.readyState != 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    function clearUserSelection() {
        if (window.getSelection) {
            if (window.getSelection().empty) { // Chrome
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) { // Firefox
                window.getSelection().removeAllRanges();
            }
        } else if (document.selection) { // IE?
            document.selection.empty();
        }
    }

    //http://honyovk.com/Colors/
    function rgb2hex(rgb) {
        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

        function hex(x) {
            return ('0' + parseInt(x).toString(16)).slice(-2);
        }
        return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    }

    function getContrastYIQ(hexcolor) {
        var r = parseInt(hexcolor.substr(0, 2), 16);
        var g = parseInt(hexcolor.substr(2, 2), 16);
        var b = parseInt(hexcolor.substr(4, 2), 16);
        var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? 'black' : 'white';
    }

    function clearUserSelection() {
        if (window.getSelection) {
            if (window.getSelection().empty) { // Chrome
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) { // Firefox
                window.getSelection().removeAllRanges();
            }
        } else if (document.selection) { // IE?
            document.selection.empty();
        }
    }

    function searchToObject() {
        var pairs = window.location.search.substring(1).split('&'),
            obj = {},
            pair,
            i;

        for (i in pairs) {
            if (pairs[i] === '') continue;

            pair = pairs[i].split('=');
            obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }

        return obj;
    }

    function queryToObject(query) {
        var pairs = query.split('&'),
            obj = {},
            pair,
            i;

        for (i in pairs) {
            if (pairs[i] === '') continue;

            pair = pairs[i].split('=');
            obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }

        return obj;
    }


    function objectToQuery(obj) {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
        var ret = str.join('&');
        return ret;
    }

    function navigateTo(url, newWindow) {
        if (newWindow) {
            window.open(url);
        } else {
            window.location.assign(url);
        }
    }

    function humanFileSize(bytes) {
        var thresh = 1024;
        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }
        var units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while (Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1) + ' ' + units[u];
    }

    var emptyDragImage = document.createElement('img');
    emptyDragImage.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';


    _Y_ = {
        hide,
        show,

        addClass,
        after,
        append,
        applyStyle,
        before,
        clone,
        contains,
        containsSelector,
        create,
        each,
        empty,
        filter,
        findChildren,
        findElements,
        getAttribute,
        getInnerHTML,
        getOuterHTML,
        getStyle,
        getText,
        hasClass,
        matchs,
        matchsSelector,
        next,
        offset,
        offsetParent,
        outerHeight,
        outerHeightWithMargin,
        outerWidth,
        outerWidthWithMargin,
        parent,
        position,
        positionRelativeToViewPort,
        prepend,
        prev,
        ready,
        remove,
        removeClass,
        replaceWithHTML,
        setAttr,
        setHTML,
        setText,
        siblings,
        toggleClass,

        on,
        off,

        rgb2hex,
        getContrastYIQ,
        clearUserSelection,
        emptyDragImage,

        objectToQuery,
        queryToObject,
        searchToObject,
        navigateTo,
        humanFileSize,
    };
}());

/**
 * 浏览器内核判断
 */
function getUserAgentInfoFoo() {
    var ua = {};
    var win = window;
    var nav = win.navigator;
    var doc = win.document;
    var ieAX = win.ActiveXObject;
    var ieMode = doc.documentMode;
    var REG_APPLE = /^Apple/;
    var ieVer = _getIeVersion() || ieMode || 0;
    var isIe = ieAX || ieMode;
    var regEdge = /Edge/i;
    var regChromeVersion = /(?:Chrome\/)(\d+)(?:\.)/i;
    var chromiumType = _getChromiumType();

    /**
     * 检测 external 是否包含该字段
     * @param reg 正则
     * @param type 检测类型，0为键，1为值
     * @returns {boolean}
     * @private
     */
    function _testExternal(reg, type) {
        var external = win.external || {};

        for (var i in external) {
            if (reg.test(type ? external[i] : i)) {
                return true;
            }
        }

        return false;
    }

    /**
     * 获取 Chromium 内核浏览器类型
     * @link http://www.adtchrome.com/js/help.js
     * @link https://ext.chrome.360.cn/webstore
     * @link https://ext.se.360.cn
     * @return {String}
     *         360ee 360极速浏览器
     *         360se 360安全浏览器
     *         sougou 搜狗浏览器
     *         liebao 猎豹浏览器
     *         chrome 谷歌浏览器
     *         ''    无法判断
     * @version 1.0
     * 2014年3月12日20:39:55
     */
    function _getChromiumType() {
        if (isIe || typeof win.scrollMaxX !== 'undefined' || REG_APPLE.test(nav.vendor || '')) {
            return '';
        }
        if (regEdge.test(navigator.userAgent)) {
            return 'Edge';
        }

        var _track = 'track' in document.createElement('track');//chrome下为true,ie下为false
        var webstoreKeysLength = win.chrome && win.chrome.webstore ? Object.keys(win.chrome.webstore).length : 0;
        var chromeAppKeysLength = win.chrome && win.chrome.app ? Object.keys(win.chrome.app).length : 0;//360se=6 360ee=5
        // 搜狗浏览器
        if (_testExternal(/^sogou/i, 0)) {
            return 'sogou';
        }

        // 猎豹浏览器
        if (_testExternal(/^liebao/i, 0)) {
            return 'liebao';
        }

        // chrome
        if (win.clientInformation && win.clientInformation.languages && win.clientInformation.languages.length > 2) {
            return 'chrome';
        }

        //注意此方法只能判断急速模式下的浏览器类型
        if (_track) {
            // 360极速浏览器|360安全浏览器
            // return webstoreKeysLength > 1 ? '360ee' : '360se';//截止20170405已经失效 此方法不能判断安全与急速
            // return chromeAppKeysLength > 5 ? '360ee' : '360se';//通过app下的keys个数判断
            return Object.keys(window.chrome.app).join().indexOf("getDetailsForFrame") > -1 ? '360ee' : '360se';//通过360se下有'getDetailsForFrame'特殊方法判断
        }

        return '';
    }

    // 获得ie浏览器版本
    function _getIeVersion() {
        var v = 3,
            p = document.createElement('p'),
            all = p.getElementsByTagName('i');

        while (
            p.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                all[0]);

        return v > 4 ? v : 0;
    }

    //获得chrome浏览器版本
    function _getChromeVersion() {
        var ua = navigator.userAgent;
        var v = regChromeVersion.exec(ua);
        return v[v.length - 1];
    }

    return {
        isIE: function () {
            return !!ieVer;
        },
        ieVersion: function () {
            return ieVer;
        },
        isEdge: function () {
            return chromiumType === 'Edge';
        },
        isChrome: function () {
            return chromiumType === 'chrome';
        },
        chromeVersion: function () {
            return _getChromeVersion();
        },
        is360se: function () {
            return chromiumType === '360se';
        },
        is360ee: function () {
            return chromiumType === '360ee';
        },
        isLiebao: function () {
            return chromiumType === 'liebao';
        },
        isSogou: function () {
            return chromiumType === 'sogou';
        },
        isQQ: function () {
            return chromiumType === 'qq';
        }
    }
}
function getUserAgentInfoToString() {
    var shell = getUserAgentInfoFoo();
    if (shell.isIE()) {
        return "IE:" + shell.ieVersion();
    } else if (shell.isEdge()) {
        return 'Edge'
    } else if (shell.isChrome()) {
        return 'chrome:' + shell.chromeVersion();
    } else if (shell.is360se()) {
        return '360se'
    } else if (shell.is360ee()) {
        return '360ee'
    } else if (shell.isLiebao()) {
        return 'liebao'
    } else if (shell.isSogou()) {
        return 'sogou'
    } else if (shell.isQQ()) {
        return 'qq'
    } else {
        return 'unknow'
    }
    return ''
}
var r = getUserAgentInfoToString();
document.getElementById("show-txt").innerHTML = r;

console.log(getUserAgentInfoToString())


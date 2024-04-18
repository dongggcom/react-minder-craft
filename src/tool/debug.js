/**
 * @fileOverview
 *
 * 支持各种调试后门
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define((require, exports, module) => {
    const format = require('./format');

    function noop() {}

    function stringHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash += str.charCodeAt(i);
        }
        return hash;
    }

    /* global console */
    function Debug(flag) {
        const debugMode = this.flaged = window.location.search.indexOf(flag) != -1;

        if (debugMode) {
            const h = stringHash(flag) % 360;

            const flagStyle = format(
                'background: hsl({0}, 50%, 80%); '
                + 'color: hsl({0}, 100%, 30%); '
                + 'padding: 2px 3px; '
                + 'margin: 1px 3px 0 0;'
                + 'border-radius: 2px;', h);

            const textStyle = 'background: none; color: black;';
            this.log = function () {
                const output = format.apply(null, arguments);
                console.log(output)
            };
        } else {
            this.log = noop;
        }
    }

    return module.exports = Debug;
});

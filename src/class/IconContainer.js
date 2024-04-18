/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
define((require, exports, module) => {
    const kity = window.kity;

    const utils = require('kityminder-core/src/core/utils');

    const IconContainer = kity.createClass('IconContainer', {
        mixins: [kity.ShapeContainer],
        base: kity.Shape,
        constructor(option = {}) {
            const {x, y} = option;
            this.callBase('svg');
            this.create({x, y});
            this.setId(utils.uuid('svg_container_'));
        },
        create({x, y}) {
            this.setViewBox(0, 0, 1024, 1024).setWidth(x || 20).setHeight(y || 20);
        },
        setWidth: function (width) {
            this.width = width;
            this.node.setAttribute('width', width);
            return this;
        },
        setHeight: function (height) {
            this.height = height;
            this.node.setAttribute('height', height);
            return this;
        },
        setViewBox: function (x, y, width, height) {
            this.node.setAttribute('viewBox', [x, y, width, height].join(' '));
            return this;
        },
    });

    return IconContainer;
});

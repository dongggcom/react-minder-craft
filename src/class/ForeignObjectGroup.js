/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
define(require => {
    const kity = window.kity;

    const utils = require('kityminder-core/src/core/utils');

    const DEFAULT_SHAPE_SIZE = {
        width: 100,
        height: 2,
    };


    const MAX_SHAPE_SIZE = {
        width: 500,
        height: Infinity,
    };

    const HTML_TAG = 'span';

    function getTextRectLong(text, container = document.body) {
        const span = document.createElement('span');
        span.innerText = text;

        // span.style.display = 'inline-block';
        // span.style.wordBreak = 'break-word';
        // span.style.minWidth = '100px';

        container.appendChild(span);
        const rect = span.getBoundingClientRect();
        container.removeChild(span);
        return {width: rect.width, height: rect.height};
    }

    const ForeignObjectGroup = kity.createClass('ForeignObjectGroup', {
        mixins: [kity.ShapeContainer],
        base: kity.Shape,
        constructor(option = {}) {
            const {width = DEFAULT_SHAPE_SIZE.width, height = DEFAULT_SHAPE_SIZE.height, x, y} = option;
            this.callBase('g');
            this.create({width, height, x, y});
            this.setId(utils.uuid('foreign_object_'));

            this.isForeignObjectGroup = true;
        },

        create({width, height, x, y}) {
            const foreignShape = new kity.Shape('foreignObject');

            this.node.appendChild(foreignShape.node);

            this.foreignObjectElement = foreignShape.node;

            this.creactTextContainer();

            this.setWidth(width);
            this.setHeight(height);
            this.setX(x);
            this.setY(y);
        },

        setX(x) {
            this.foreignObjectElement.setAttribute('x', x ?? 0);
        },

        setY(y) {
            this.foreignObjectElement.setAttribute('y', y ?? 0);
        },

        setWidth(width) {
            this.foreignObjectElement.setAttribute('width', width ?? DEFAULT_SHAPE_SIZE.width);

            // +2 是因为 span 存在换行，导致外部容器会遮挡内容
            // 同步更改文本容器尺寸
            this.getTextContainer().style.width = width + 2 + 'px';
        },
        setHeight(height) {
            this.foreignObjectElement.setAttribute('height', height ?? DEFAULT_SHAPE_SIZE.height);
        },

        setText(text, option) {
            const textContainer = this.getTextContainer();
            // 防止重复渲染
            if (textContainer.innerText === text) {
                return;
            }
            textContainer.innerText = text;

            // 丈量下纯文本尺寸
            const {width: textWidth, height: textHeight} = getTextRectLong(text);

            const width = Math.min(textWidth, MAX_SHAPE_SIZE.width, option?.width ?? Infinity);
            const height = Math.max(textHeight, this.getSize().height, option?.height ?? 0);

            // 更新下尺寸
            this.setSize({width, height});
        },

        setTextStyle(style = {}) {
            const textContainer = this.getTextContainer();

            for (const key in style) {
                if ({}.hasOwnProperty.call(style, key)) {
                    textContainer.style[key] = style[key];
                }
            }
        },

        // 用来方便寻址
        setTargetNode(targetNode) {
            this.targetNode = targetNode;
        },

        getSize() {
            const textContainer = this.getTextContainer();

            // inline
            const width = Math.round(textContainer.getBoundingClientRect().width + 4);
            const height = Math.round(textContainer.getBoundingClientRect().height);

            // block
            // const width = Math.round(textContainer.clientWidth);
            // const height = Math.round(textContainer.clientHeight);

            return {width, height};
        },

        setSize(size = {}) {
            const {width = DEFAULT_SHAPE_SIZE.width, height = DEFAULT_SHAPE_SIZE.height} = size;

            this.setWidth(width);
            this.setHeight(height);
        },

        creactTextContainer() {
            const elem = document.createElement(HTML_TAG);

            elem.style.display = 'inline-block';
            elem.style.wordBreak = 'break-all';

            this.foreignObjectElement.appendChild(elem);

            return elem;
        },

        getTextContainer() {
            if (!this.foreignObjectElement.querySelector(HTML_TAG)) {
                return this.creactTextContainer();
            }
            return this.foreignObjectElement.querySelector(HTML_TAG);
        },
    });

    return ForeignObjectGroup;
});

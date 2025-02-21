/* eslint-disable no-underscore-dangle */
/**
 * @file 节点的文本处理
 */
/* eslint-disable max-statements */
/* eslint-disable complexity */


// eslint-disable-next-line no-undef
define((require, _, module) => {
    const kity = window.kity;
    const utils = require('kityminder-core/src/core/utils');

    const Command = require('kityminder-core/src/core/command');
    const MinderNode = require('kityminder-core/src/core/node');
    const Module = window.kityminder.Module;
    const Renderer = require('kityminder-core/src/core/render');

    const ForeignObjectGroup = require('../class/ForeignObjectGroup');
    const {isIllegalNode} = require('../tool/modelType');
    const {getRealNodeText} = require('../tool/nodeType');

    const DEFAULT_IMAGE_WIDTH = 200;
    const DEFAULT_IMAGE_HEIGHT = 200;

    const imageSizeCache = new Map();
    const getImageShapeSize = shape => imageSizeCache.get(shape.node.id)
            || {width: DEFAULT_IMAGE_WIDTH, height: DEFAULT_IMAGE_HEIGHT};
    const setImageShapeSize = (shape, size) => imageSizeCache.set(shape.node.id, size);
    const hasImageShapeSize = shape => imageSizeCache.has(shape.node.id);

    const hasImageSize = key => imageSizeCache.has(key);

    const getImageSize = key => imageSizeCache.get(key);

    // const setImageSize = (key, size) => imageSizeCache.set(key, size);


    /**
     * 针对不同系统、不同浏览器、不同字体做居中兼容性处理
     * 暂时未增加Linux的处理
     */
    const FONT_ADJUST = {
        'safari': {
            '微软雅黑,Microsoft YaHei': -0.17,
            '楷体,楷体_GB2312,SimKai': -0.1,
            '隶书, SimLi': -0.1,
            'comic sans ms': -0.23,
            'impact,chicago': -0.15,
            'times new roman': -0.1,
            'arial black,avant garde': -0.17,
            'default': 0,
        },
        'ie': {
            10: {
                '微软雅黑,Microsoft YaHei': -0.17,
                'comic sans ms': -0.17,
                'impact,chicago': -0.08,
                'times new roman': 0.04,
                'arial black,avant garde': -0.17,
                'default': -0.15,
            },
            11: {
                '微软雅黑,Microsoft YaHei': -0.17,
                'arial,helvetica,sans-serif': -0.17,
                'comic sans ms': -0.17,
                'impact,chicago': -0.08,
                'times new roman': 0.04,
                'sans-serif': -0.16,
                'arial black,avant garde': -0.17,
                'default': -0.15,
            },
        },
        'edge': {
            '微软雅黑,Microsoft YaHei': -0.15,
            'arial,helvetica,sans-serif': -0.17,
            'comic sans ms': -0.17,
            'impact,chicago': -0.08,
            'sans-serif': -0.16,
            'arial black,avant garde': -0.17,
            'default': -0.15,
        },
        'sg': {
            '微软雅黑,Microsoft YaHei': -0.15,
            'arial,helvetica,sans-serif': -0.05,
            'comic sans ms': -0.22,
            'impact,chicago': -0.16,
            'times new roman': -0.03,
            'arial black,avant garde': -0.22,
            'default': -0.15,
        },
        'chrome': {
            'Mac': {
                'andale mono': -0.05,
                'comic sans ms': -0.3,
                'impact,chicago': -0.13,
                'times new roman': -0.1,
                'arial black,avant garde': -0.17,
                'default': 0,
            },
            'Win': {
                '微软雅黑,Microsoft YaHei': -0.15,
                'arial,helvetica,sans-serif': -0.02,
                'arial black,avant garde': -0.2,
                'comic sans ms': -0.2,
                'impact,chicago': -0.12,
                'times new roman': -0.02,
                'default': -0.15,
            },
            'Lux': {
                'andale mono': -0.05,
                'comic sans ms': -0.3,
                'impact,chicago': -0.13,
                'times new roman': -0.1,
                'arial black,avant garde': -0.17,
                'default': 0,
            },
        },
        'firefox': {
            'Mac': {
                '微软雅黑,Microsoft YaHei': -0.2,
                '宋体,SimSun': 0.05,
                'comic sans ms': -0.2,
                'impact,chicago': -0.15,
                'arial black,avant garde': -0.17,
                'times new roman': -0.1,
                'default': 0.05,
            },
            'Win': {
                '微软雅黑,Microsoft YaHei': -0.16,
                'andale mono': -0.17,
                'arial,helvetica,sans-serif': -0.17,
                'comic sans ms': -0.22,
                'impact,chicago': -0.23,
                'times new roman': -0.22,
                'sans-serif': -0.22,
                'arial black,avant garde': -0.17,
                'default': -0.16,
            },
            'Lux': {
                '宋体,SimSun': -0.2,
                '微软雅黑,Microsoft YaHei': -0.2,
                '黑体, SimHei': -0.2,
                '隶书, SimLi': -0.2,
                '楷体,楷体_GB2312,SimKai': -0.2,
                'andale mono': -0.2,
                'arial,helvetica,sans-serif': -0.2,
                'comic sans ms': -0.2,
                'impact,chicago': -0.2,
                'times new roman': -0.2,
                'sans-serif': -0.2,
                'arial black,avant garde': -0.2,
                'default': -0.16,
            },
        },
    };

    function fitImageSize(width, height, maxWidth, maxHeight) {
        const ratio = width / height;
        const fitRatio = maxWidth / maxHeight;

        // 宽高比大于最大尺寸的宽高比，以宽度为标准适应
        if (width > maxWidth && ratio > fitRatio) {
            width = maxWidth;
            height = width / ratio;
        } else if (height > maxHeight) {
            height = maxHeight;
            width = height * ratio;
        }

        return {
            width: width | 0,
            height: height | 0,
        };
    }

    function loadSize(url, callback) {
        if (hasImageSize(url)) {
            const size = getImageSize(url);
            callback(size.width, size.height);
        }
        else {
            const img = document.createElement('img');
            img.src = url;
            img.onload = () => {
                const {width, height} = fitImageSize(img.width, img.height, DEFAULT_IMAGE_WIDTH, DEFAULT_IMAGE_HEIGHT);
                callback(width, height);
            };
        }
    }

    function isImageText(text) {
        if (!text) {
            return false;
        }
        const pattern = /\[img([^\]]+)\]/g;
        return pattern.test(text);
    }

    function isImageShape(shape) {
        return shape instanceof window.kity.Image;
    }

    function createTextShape() {
        const textShape = new kity.Text().setAttr('text-rendering', 'inherit');
        if (kity.Browser.ie || kity.Browser.edge) {
            textShape.setVerticalAlign('top');
        } else {
            textShape.setAttr('dominant-baseline', 'text-before-edge');
        }
        return textShape;
    }

    function calcGroupImageShapeCount(group) {
        let count = 0;
        group.eachItem((i, textShape) => {
            if (isImageShape(textShape)) {
                count++;
            }
        });
        return count;
    }


    function updateBox(group) {
        const {width, height} = group.getSize();

        let rBox = new kity.Box();
        const r = Math.round;

        // -height / 2 使文本垂直居中
        rBox = rBox.merge(new kity.Box(0, -height / 2, width, height));

        // group 向上移动一半的距离
        group.setY(-height / 2 + 1);

        const nBox = new kity.Box(r(rBox.x), r(rBox.y), r(rBox.width), r(rBox.height));

        return nBox;
    }

    function updateTextGroupBox(textGroup, node) {
        let rBox = new kity.Box();
        const r = Math.round;
        function getDataOrStyle(name) {
            return node.getData(name) || node.getStyle(name);
        }

        const nodeText = node.getText();
        const textArr = nodeText ? nodeText.split('\n') : [' '];

        const lineHeight = node.getStyle('line-height');
        const fontSize = getDataOrStyle('font-size');
        const fontHeight = lineHeight * fontSize;

        const imageTotal = calcGroupImageShapeCount(textGroup);
        const textLineTotalHeight = fontHeight * (textArr.length - imageTotal);
        let imageTotalHeight = 0;

        textGroup.eachItem((i, textShape) => {
            if (isImageShape(textShape)) {
                imageTotalHeight += getImageShapeSize(textShape).height;
            }
        });
        const height = textLineTotalHeight + imageTotalHeight - (lineHeight - 1) * fontSize;
        const yStart = -height / 2;
        let imageItemHeightTotal = 0;
        textGroup.eachItem((i, shape) => {
            const lastTextShape = textGroup.getItem(i - 1);
            if (isImageShape(lastTextShape)) {
                imageItemHeightTotal += getImageShapeSize(lastTextShape).height - 12;
            }
            const y = yStart + i * fontHeight + imageItemHeightTotal;

            shape.setY(y);

            const bbox = shape.getBoundaryBox();
            rBox = rBox.merge(new kity.Box(0, y, bbox.height && bbox.width || 1, bbox.height || fontSize));
        });
        const nBox = new kity.Box(r(rBox.x), r(rBox.y), r(rBox.width), r(rBox.height));
        node._currentTextGroupBox = nBox;
        return nBox;
    }

    function listenImageShapeClick(imageShape, minder) {
        if (minder.extend.imageClick) {
            imageShape.node.onclick = e => {
                minder.extend.imageClick(imageShape, minder, e);
            };
        }
    }

    function updateImageShapeNodeAttribute(imageShape, minder) {
        const imageAttributes = minder.context.get('imageAttributes');
        if (imageAttributes && Object.keys(imageAttributes) !== 0) {
            const keys = Object.keys(imageAttributes);
            keys.forEach(key => {
                if (key) {
                    imageShape.node.setAttribute(key, imageAttributes[key]);
                }
            });
        }
    }

    function updateRendererShapeBox(renderer, node, group, minder) {
        if (renderer.shouldRender(node)) {
            updateTextGroupBox(group, node);
            node.render();
            minder.layout();
        }
    }

    function setImageShape(text, imageShape, group, node, renderer, minder) {
        if (hasImageShapeSize(imageShape)) {
            const {width, height} = getImageShapeSize(imageShape);
            imageShape.setWidth(width | 0).setHeight(height | 0);
        } else {
            const url = text.match(/src=["'](\S+)["']/)?.[1];
            imageShape.setUrl(url);
            setImageShapeSize(imageShape, {width: DEFAULT_IMAGE_WIDTH, height: DEFAULT_IMAGE_HEIGHT});
            loadSize(url, (width, height) => {
                imageShape.setWidth(width | 0).setHeight(height | 0);
                setImageShapeSize(imageShape, {width, height});
                updateRendererShapeBox(renderer, node, group, minder);
                listenImageShapeClick(imageShape, minder);
                updateImageShapeNodeAttribute(imageShape, minder);
            });
        }
    }

    // function updateImageSizeOnLoad(text, group, successFn) {
    //     const imgPattern = /\[img([^\]]+)\]/g;

    //     let width = 0;
    //     let height = 0;

    //     let match = [];
    //     while ((match = imgPattern.exec(text)) !== null) {
    //         const url = match[1].match(/src=["'](\S+)["']/)?.[1];

    //         loadSize(url, (curWidth, curHeight) => {
    //             width = curWidth;
    //             height += curHeight;

    //             console.log(url, 'curWidth', curWidth, 'curHeight', curHeight, 'width', width, 'height', height);
    //             group.setSize(group.getSize());

    //             if (successFn) {
    //                 successFn();
    //             }
    //         });
    //     }
    // }

    // function getImageTextHTML(text) {
    //     const imgPattern = /\[img([^\]]+)\]/g;

    //     let html = text;
    //     let match = [];
    //     while ((match = imgPattern.exec(text)) !== null) {
    //         html = html.replace(match[0], `<img${match[1]}/>`);
    //     }

    //     return html;
    // }

    const TextRenderer = kity.createClass('TextRenderer', {
        base: Renderer,

        create() {
            // FIXME: 如果是 imageText 会创造一个空节点
            return new ForeignObjectGroup();
        },

        update(group, node) {
            group.setTargetNode(node);

            this.setTextStyle(node, group);

            function getDataOrStyle(name) {
                return node.getData(name) || node.getStyle(name);
            }

            const fontSize = getDataOrStyle('font-size');
            const fontFamily = getDataOrStyle('font-family') || 'default';

            const Browser = kity.Browser;
            let adjust = 0;

            if (Browser.chrome || Browser.opera || Browser.bd || Browser.lb === 'chrome') {
                adjust = FONT_ADJUST.chrome[Browser.platform][fontFamily];
            } else if (Browser.gecko) {
                adjust = FONT_ADJUST.firefox[Browser.platform][fontFamily];
            } else if (Browser.sg) {
                adjust = FONT_ADJUST.sg[fontFamily];
            } else if (Browser.safari) {
                adjust = FONT_ADJUST.safari[fontFamily];
            } else if (Browser.ie) {
                adjust = FONT_ADJUST.ie[Browser.version][fontFamily];
            } else if (Browser.edge) {
                adjust = FONT_ADJUST.edge[fontFamily];
            } else if (Browser.lb) {
                // 猎豹浏览器的ie内核兼容性模式下
                adjust = 0.9;
            }

            group.setTranslate(0, adjust * fontSize);

            const nodeText = node.getText();

            // 支持富文本
            if (isImageText(nodeText)) {
                // 沿用老的方案
                this.updateTextGroup(group, node);
            }
            else {
                group.setText(nodeText);
            }

            const textHash = node.getText() + node.getData('_hash')
                    + ['font-size', 'font-name', 'font-weight', 'font-style'].map(getDataOrStyle).join('/');

            if (node._currentTextHash === textHash && node._currentTextGroupBox) {
                return node._currentTextGroupBox;
            }

            node._currentTextHash = textHash;

            return () => {
                const box = isImageText(nodeText) ? updateTextGroupBox(group, node) : updateBox(group, node);
                node._currentTextGroupBox = box;
                return box;
            };
        },

        setTextStyle(node, text) {
            const hooks = TextRenderer._styleHooks;

            hooks.forEach(hook => {
                hook(node, text);
            });
        },

        updateTextGroup(textGroup, node) {
            const minder = TextRenderer.getMinder();

            const nodeText = node.getText();
            const textArr = nodeText ? nodeText.split('\n') : [' '];

            this.setTextStyle(node, textGroup);

            const textLength = textArr.length;

            const textGroupLength = textGroup.getItems().length;

            let i;
            let ci;

            // 初始化
            if (textLength > textGroupLength && textGroupLength === 0) {
                textArr.forEach((text, index) => {
                    const shape = isImageText(text) ? new kity.Image() : createTextShape();
                    textGroup.arrangeShape(shape, index);
                });
            } else {
                // 更新时
                textArr.forEach((text, index) => {
                    if (
                        (isImageText(text) && textGroup.getItem(index) instanceof kity.Image)
                        || (!isImageText(text) && textGroup.getItem(index) instanceof kity.Text)
                    ) {
                        return;
                    }
                    const shape = isImageText(text) ? new kity.Image() : createTextShape();
                    textGroup.arrangeShape(shape, index);
                });
                if (textLength < textGroupLength) {
                    // eslint-disable-next-line no-cond-assign
                    for (i = textLength, ci; ci = textGroup.getItem(i);) {
                        textGroup.removeItem(i);
                    }
                }
            }

            for (let i = 0, text, shape; (text = textArr[i], shape = textGroup.getItem(i)); i++) {
                if (isImageText(text)) { //  && isImageShape(shape)
                    setImageShape(text, shape, textGroup, node, this, minder);
                } else {
                    shape.setContent(text);
                }
                if (kity.Browser.ie || kity.Browser.edge) {
                    shape.fixPosition();
                }
            }

            this.setTextStyle(node, textGroup);
        },
    });

    const TextCommand = kity.createClass({
        base: Command,
        execute(minder, text) {
            const node = minder.getSelectedNode();
            if (node) {
                node.setText(text);
                node.render();
                minder.layout();
            }
        },
        queryState(minder) {
            const node = minder.getSelectedNode();
            if (isIllegalNode(node)) {
                return -1;
            }
            return minder.getSelectedNodes().length === 1 ? 0 : -1;
        },
        queryValue(minder) {
            const node = minder.getSelectedNode();

            return node ? getRealNodeText(minder) : null;
        },
    });

    utils.extend(TextRenderer, {
        _styleHooks: [],

        registerStyleHook(fn) {
            TextRenderer._styleHooks.push(fn);
        },
    });

    kity.extendClass(MinderNode, {
        getTextGroup() {
            return this.getRenderer('TextRenderer').getRenderShape();
        },
    });

    Module.register('text', function text() {
        const minder = this;

        utils.extend(TextRenderer, {
            getMinder: () => minder,
        });

        return {
            'commands': {
                'text': TextCommand,
            },
            'renderers': {
                center: TextRenderer,
            },
        };
    });

    module.exports = TextRenderer;
});

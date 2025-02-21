/**
 * @file 节点 text 的字体
 */
// eslint-disable-next-line no-undef
define(require => {
    const kity = window.kity;

    const Command = require('kityminder-core/src/core/command');
    const Module = window.kityminder.Module;

    const TextRenderer = require('./reactiveText');

    function getNodeDataOrStyle(node, name) {
        return node.getData(name) || node.getStyle(name);
    }

    function isTextShape(shape) {
        return shape instanceof window.kity.Text;
    }

    // 这个只对 text 节点有效
    TextRenderer.registerStyleHook((node, textGroup) => {
        const dataColor = node.getData('color');
        const selectedColor = node.getStyle('selected-color');
        const styleColor = node.getStyle('color');

        const foreColor = dataColor || (node.isSelected() && selectedColor ? selectedColor : styleColor);
        const fontFamily = getNodeDataOrStyle(node, 'font-family');
        const fontSize = getNodeDataOrStyle(node, 'font-size');

        if (textGroup.isForeignObjectGroup) {
            textGroup.setTextStyle({
                color: foreColor,
                'family': fontFamily,
                'size': fontSize,
            });
        }
        else {
            textGroup.fill(foreColor);

            textGroup.eachItem((index, item) => {
                // 为富文本做处理
                if (isTextShape(item.node.shape)) {
                    item.setFont({
                        'family': fontFamily,
                        'size': fontSize,
                    });
                }
            });
        }
    });


    Module.register('fontmodule', {
        'commands': {
            /**
             * @command ForeColor
             * @description 设置选中节点的字体颜色
             * @param {string} color 表示颜色的字符串
             * @state
             *   0: 当前有选中的节点
             *  -1: 当前没有选中的节点
             * @return 如果只有一个节点选中，返回已选中节点的字体颜色；否则返回 'mixed'。
             */
            'forecolor': kity.createClass('fontcolorCommand', {
                base: Command,
                execute(km, color) {
                    const nodes = km.getSelectedNodes();
                    nodes.forEach(n => {
                        n.setData('color', color);
                        n.render();
                    });
                },
                queryState(km) {
                    return km.getSelectedNodes().length === 0 ? -1 : 0;
                },
                queryValue(km) {
                    if (km.getSelectedNodes().length === 1) {
                        return km.getSelectedNodes()[0].getData('color');
                    }
                    return 'mixed';
                },
            }),

            /**
             * @command Background
             * @description 设置选中节点的背景颜色
             * @param {string} color 表示颜色的字符串
             * @state
             *   0: 当前有选中的节点
             *  -1: 当前没有选中的节点
             * @return 如果只有一个节点选中，返回已选中节点的背景颜色；否则返回 'mixed'。
             */
            'background': kity.createClass('backgroudCommand', {
                base: Command,

                execute(km, color) {
                    const nodes = km.getSelectedNodes();
                    nodes.forEach(n => {
                        n.setData('background', color);
                        n.render();
                    });
                },
                queryState(km) {
                    return km.getSelectedNodes().length === 0 ? -1 : 0;
                },
                queryValue(km) {
                    if (km.getSelectedNodes().length === 1) {
                        return km.getSelectedNodes()[0].getData('background');
                    }
                    return 'mixed';
                },
            }),


            /**
             * @command FontFamily
             * @description 设置选中节点的字体
             * @param {string} family 表示字体的字符串
             * @state
             *   0: 当前有选中的节点
             *  -1: 当前没有选中的节点
             * @return 返回首个选中节点的字体
             */
            'fontfamily': kity.createClass('fontfamilyCommand', {
                base: Command,

                execute(km, family) {
                    const nodes = km.getSelectedNodes();
                    nodes.forEach(n => {
                        n.setData('font-family', family);
                        n.render();
                        km.layout();
                    });
                },
                queryState(km) {
                    return km.getSelectedNodes().length === 0 ? -1 : 0;
                },
                queryValue(km) {
                    const node = km.getSelectedNode();
                    if (node) {
                        return node.getData('font-family');
                    }
                    return null;
                },
            }),

            /**
             * @command FontSize
             * @description 设置选中节点的字体大小
             * @param {number} size 字体大小（px）
             * @state
             *   0: 当前有选中的节点
             *  -1: 当前没有选中的节点
             * @return 返回首个选中节点的字体大小
             */
            'fontsize': kity.createClass('fontsizeCommand', {
                base: Command,

                execute(km, size) {
                    const nodes = km.getSelectedNodes();
                    nodes.forEach(n => {
                        n.setData('font-size', size);
                        n.render();
                        km.layout(300);
                    });
                },
                queryState(km) {
                    return km.getSelectedNodes().length === 0 ? -1 : 0;
                },
                queryValue(km) {
                    const node = km.getSelectedNode();
                    if (node) {
                        return node.getData('font-size');
                    }
                    return null;
                },
            }),
        },
    });
});

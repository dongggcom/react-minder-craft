/**
 * @file 标识2节点下的子节点数量提醒
 */

// eslint-disable-next-line no-undef
define(require => {
    const kity = window.kity;
    const Module = window.kityminder.Module;

    const utils = require('kityminder-core/src/core/utils');
    const Command = require('kityminder-core/src/core/command');
    const Renderer = require('kityminder-core/src/core/render');
    const {isModelTwo} = require('../tool/modelType');
    const {memoize} = require('lodash');

    function getDataOrStyle(node, name) {
        return node.getData(name) || node.getStyle(name);
    }


    Module.register('ChildSizeAlertModule', function ChildSizeAlertModule() {
        const DATA = 'childSize';

        function shouldRenderAlert(node) {
            return isModelTwo(node)
            && node.getData('hasChild') && node.getChildren().length
            && node.getData(DATA) > node.getChildren().length;
        }

        function getNodeId(node) {
            return node.getData('model')?.id || '';
        }

        const memoizedShouldRenderAlert = memoize(shouldRenderAlert, getNodeId);

        const ChildSizeAlertIcon = kity.createClass('ChildSizeAlertGroup', {
            base: kity.Group,

            constructor() {
                this.callBase();
                this.setId(utils.uuid('child_size'));
            },
            setState(value, node) {
                this.value = value;
                if (this.getShapes().length) {
                    this.clear();
                }
                if (typeof value === 'number') {
                    const textShape = new kity.Text()
                        .setAttr('text-rendering', 'inherit')
                        .setAttr('dominant-baseline', 'text-before-edge')
                        .setFontSize(12)
                        .fill('#999');
                    textShape.setContent(`未显示子节点: ${value - node.getChildren().length} 个`);
                    this.addShape(textShape);
                }

            },
            clear() {
                while (this.getShapes().length) {
                    this.removeShape(0);
                }
            },
        });

        const ChildSizeAlertRender = kity.createClass('ChildSizeAlertRender', {
            base: Renderer,

            create(node) {
                this.group = new ChildSizeAlertIcon(node);
                return this.group;
            },

            shouldRender(node) {
                return memoizedShouldRenderAlert(node);
            },

            update(group, node, box) {
                const state = node.getData(DATA);
                group.setState(state, node);
                const lineHeight = node.getStyle('line-height');
                const fontSize = getDataOrStyle(node, 'font-size');
                const fontHeight = lineHeight * fontSize;

                const x = box.left;
                const y = box.cy + fontHeight;

                this.group.setTranslate(x, y);
            },
        });

        const ChildSizeAlertCommand = kity.createClass('ChildSizeAlertCommand', {
            base: Command,
            execute(km, value) {
                const nodes = km.getSelectedNodes();
                for (let i = 0; i < nodes.length; i++) {
                    const node = nodes[i];
                    if (isModelTwo(node)) {
                        node.setData(DATA, value || null, node).render();
                    }
                }
                km.layout();
            },
            queryValue(km) {
                const nodes = km.getSelectedNodes();
                let val = null;
                for (let i = 0; i < nodes.length; i++) {
                    val = nodes[i].getData(DATA);
                    if (val) {
                        break;
                    }
                }
                return val || null;
            },
            queryState(km) {
                const nodes = km.getSelectedNodes();
                if (nodes.length > 1) {
                    return 0;
                }
                return -1;
            },
        });

        return {
            'commands': {
                'ChildSizeAlert': ChildSizeAlertCommand,
            },
            'renderers': {
                outside: ChildSizeAlertRender,
            },
        };
    });
});

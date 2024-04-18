/**
 * @file 区分节点类型
 * @type 标识1 | 标识2 | 评审 | 版本
 */
// eslint-disable-next-line no-undef
define(require => {
    const kity = window.kity;
    const Module = window.kityminder.Module;
    const utils = require('kityminder-core/src/core/utils');
    const Command = require('kityminder-core/src/core/command');
    const Renderer = require('kityminder-core/src/core/render');

    Module.register('ModelTypeModule', function ModelTypeModule() {
        const MAP = {
            'one': {text: '标识1', color: '#ff6f3c'}, // 标识1
            'two': {text: '标识2', color: '#11d3bc'}, // 标识2
        };

        const NODE_KEY = 'modelType';

        // 节点类型图标的图形
        const ModelTypeIcon = kity.createClass('ModelTypeIcon', {
            base: kity.Group,

            constructor() {
                this.callBase();
                this.create();
                // 单选
                this.setId(utils.uuid('node_type'));
            },

            create() {
                this.rect = new kity.Rect().setRadius(4);
                this.text = new kity.Text().setFontSize(12).setVerticalAlign('middle');
                this.addShapes([this.rect, this.text]);
            },

            setValue(value, color) {
                const paddingX = 2;
                const paddingY = 1;
                const borderRadius = 2;

                const text = this.text;
                text.setContent(value);

                const box = text.getBoundaryBox();
                text.setX(paddingX).setY(Math.ceil(paddingY + box.height / 2)).fill('#ffffff');

                const rect = this.rect;

                this.width = Math.round(box.width + paddingX * 2);
                this.height = Math.round(box.height + paddingY * 2);
                rect.setSize(this.width, this.height);
                rect.setRadius(borderRadius);
                rect.setStyle('cursor', 'pointer');

                rect.fill(color);
            },
        });

        const ModelTypeRender = kity.createClass('ModelTypeRender', {
            base: Renderer,

            create() {
                return new ModelTypeIcon();
            },

            shouldRender(node) {
                return node.getData(NODE_KEY);
            },

            updateToTop(icon, node, box) {
                const data = node.getData(NODE_KEY);
                const {text, color} = MAP[data] || {};

                if (!text) {
                    return;
                }

                icon.setValue(text, color);

                const spaceTop = node.getStyle('space-top');
                const x = box.left;
                const y = box.y - icon.height - spaceTop;

                icon.setTranslate(x, y);

                return new kity.Box({
                    x: x,
                    y: y,
                    width: icon.width,
                    height: icon.height,
                });
            },

            updateToLeft(icon, node, box) {
                const data = node.getData(NODE_KEY);
                const {text, color} = MAP[data] || {};

                if (!text) {
                    return;
                }

                icon.setValue(text, color);

                const spaceLeft = node.getStyle('space-left');
                const x = box.left - icon.width - spaceLeft;
                const y = -icon.height / 2;

                icon.setTranslate(x, y);

                return new kity.Box({
                    x: x,
                    y: y,
                    width: icon.width,
                    height: icon.height,
                });
            },

            update(icon, node, box) {
                return this.updateToLeft(icon, node, box);
            },
        });

        /**
         * @command ModelType Command
         * @description 设置节点的节点类型
         * @param {string} value 要设置的节点类型（添加一个节点类型小图标）
         * @state
         *    0: 当前有选中的节点
         *   -1: 当前没有选中的节点
         */
        const ModelTypeCommand = kity.createClass('ModelTypeCommand', {
            base: Command,
            execute(minder, value) {
                const nodes = minder.getSelectedNodes();
                nodes.forEach(node => {
                    node.setData(NODE_KEY, value || null).render();
                });

                minder.layout();
            },
            queryValue(km) {
                const nodes = km.getSelectedNodes();
                let val = null;
                for (let i = 0; i < nodes.length; i++) {
                    val = nodes[i].getData(NODE_KEY);
                    if (val) {
                        break;
                    }
                }
                return val || null;
            },

            queryState(km) {
                return km.getSelectedNodes().length ? 0 : -1;
            },
        });
        return {
            'commands': {
                'ModelType': ModelTypeCommand,
            },
            'renderers': {
                left: ModelTypeRender,
            },
        };
    });
});

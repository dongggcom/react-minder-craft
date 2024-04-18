/**
 * @file 节点标题
 */
// eslint-disable-next-line no-undef
define(require => {
    const kity = window.kity;
    const Module = window.kityminder.Module;
    const utils = require('kityminder-core/src/core/utils');
    const Command = require('kityminder-core/src/core/command');
    const Renderer = require('kityminder-core/src/core/render');

    Module.register('TitleModule', function TitleModule() {
        const NODE_KEY = 'title';

        // 标题
        const TitleIcon = kity.createClass('TitleIcon', {
            base: kity.Group,

            constructor() {
                this.callBase();
                this.setSize(24, 28);
                this.create();
                this.setId(utils.uuid('node_title_'));
            },

            create() {
                const text = new kity.Text()
                    .setX(this.width).setY(this.height)
                    .setFontSize(12)
                    .setFontBold('bold')
                    .setTextAnchor('middle')
                    .setVerticalAlign('top');


                this.addShapes([text]);
                this.text = text;
            },

            setSize(width, height) {
                this.width = width;
                this.height = height;
            },

            setValue(value) {
                const text = this.text;
                text.setContent(value);
            },
        });

        /**
         * @command Title Command
         * @description 设置节点的标题
         * @param {number} value 要设置的标题
         * @state
         *    0: 当前有选中的节点
         *   -1: 当前没有选中的节点
         */
        const TitleCommand = kity.createClass('SetTitleCommand', {
            base: Command,
            execute(km, value) {
                const nodes = km.getSelectedNodes();
                for (let i = 0; i < nodes.length; i++) {
                    const node = nodes[i];
                    node.setData(NODE_KEY, value || null).render();
                }
                km.layout();
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
                const nodes = km.getSelectedNodes();
                if (nodes.length > 1) {
                    return 0;
                }
                return -1;
            },
        });

        const TitleRender = kity.createClass('TitleRender', {
            base: Renderer,

            create() {
                return new TitleIcon();
            },

            shouldRender(node) {
                return node.getData(NODE_KEY);
            },

            update(icon, node, box) {
                const data = node.getData(NODE_KEY);
                const spaceTop = node.getStyle('space-top');
                const x = icon.width;
                const y = box.y - icon.height / 2 - spaceTop;

                icon.setValue(data);
                icon.text.setX(x | 0).setY(y | 0);

                return new kity.Box({
                    x: x,
                    y: y,
                    width: icon.width,
                    height: icon.height,
                });
            },
        });
        return {
            'commands': {
                'Title': TitleCommand,
            },
            'renderers': {
                top: TitleRender,
            },
        };
    });
});

/**
 * @file 长文本节点
 */
// eslint-disable-next-line no-undef
define(require => {
    const kity = window.kity;
    const Module = window.kityminder.Module;
    const utils = require('kityminder-core/src/core/utils');
    const Command = require('kityminder-core/src/core/command');
    const Renderer = require('kityminder-core/src/core/render');

    const TEXT_LENGTH = 20;
    // const ROW_LENGTH = 3;

    // function splitNodeText(text, textLength = 20) {
    //     const result = text.match(new RegExp(`(.{${textLength}})`, 'g'));
    //     // text 按照 20 个字符长度填入 \n
    //     return result ?? [text];
    // }

    Module.register('LongTextModule', function LongTextModule() {
        const NODE_KEY = 'longText';
        const minder = this;

        const EXPAND_KEY = 'expand';

        // 节点类型图标的图形
        const LongTextIcon = kity.createClass('LongTextIcon', {
            base: kity.Group,

            constructor() {
                this.callBase();
                this.create();
                // 单选
                this.setId(utils.uuid('long_text_icon'));
            },

            create() {
                this.rect = new kity.Rect().setRadius(4);
                this.text = new kity.Text().setFontSize(12).setVerticalAlign('middle');
                this.addShapes([this.rect, this.text]);

                this.getNode().shape.on('click', e => {
                    minder.fire('long-text-onclick', e);
                });
            },

            setValue(expand) {
                // getType root/main/sub
                const paddingX = 4;
                const paddingY = 2;
                const borderRadius = 2;

                const text = this.text;
                text.setContent(expand === EXPAND_KEY ? '▲' : '...');

                const box = text.getBoundaryBox();
                text.setX(paddingX).setY(Math.ceil(box.height / 2)).fill(kity.Color.createHSL(220, 100, 60));
                text.setStyle('cursor', 'pointer');

                const rect = this.rect;

                this.width = Math.round(box.width + paddingX * 2);
                this.height = Math.round(box.height + paddingY);
                rect.setSize(this.width, this.height);
                rect.setRadius(borderRadius);
                rect.setStyle('cursor', 'pointer');

                rect.fill(kity.Color.createHSL(220, 100, 89));
            },
        });

        const LongTextRender = kity.createClass('LongTextRender', {
            base: Renderer,

            create() {
                return new LongTextIcon();
            },

            shouldRender(node) {
                return node.getData(NODE_KEY);
            },

            update(icon, node, box) {
                const data = node.getData(NODE_KEY);

                icon.setValue(data);

                const spaceTop = node.getStyle('space-top');
                const x = box.width / 2 - icon.width / 2 + box.left;
                const y = box.height / 2 - icon.height / 2 + spaceTop;

                icon.setTranslate(x, y);

                return new kity.Box({
                    x: x,
                    y: y,
                    width: icon.width,
                    height: icon.height,
                });
            },
        });

        /**
         * @command LongText Command
         * @description 设置节点是否问长文本节点
         * @param {string} value 要设置的节点类型
         * @state
         *    0: 当前有选中的节点
         *   -1: 当前没有选中的节点
         */
        const LongTextCommand = kity.createClass('LongTextCommand', {
            base: Command,
            execute(minder, value) {
                const nodes = minder.getSelectedNodes();
                const {maxTextLength = TEXT_LENGTH} = minder.extend.context;
                nodes.forEach(node => {
                    if (value === EXPAND_KEY) {
                        node.setText(node.getData(NODE_KEY));
                    } else {
                        node.setText(`${node.getText().slice(0, maxTextLength)}...`);
                    }
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
                'LongText': LongTextCommand,
            },
            'renderers': {
                outside: LongTextRender,
            },
        };
    });
});

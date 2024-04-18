/**
 * @file 节点上的评论数
 */
// eslint-disable-next-line no-undef
define(require => {
    const kity = window.kity;
    const Module = window.kityminder.Module;
    const utils = require('kityminder-core/src/core/utils');
    const Command = require('kityminder-core/src/core/command');
    const Renderer = require('kityminder-core/src/core/render');

    Module.register('CommentCountModule', function CommentCountModule() {
        const minder = this;
        let commentCountCondition = () => true;
        setTimeout(() => {
            commentCountCondition = minder.extend.commentCountCondition || (() => true);
        });
        const NODE_KEY = 'commentCounts';

        const getColor = () => '#317ff5';

        // 测试类型图标的图形
        const CommentCountIcon = kity.createClass('CommentCountIcon', {
            base: kity.Group,

            constructor() {
                this.callBase();
                this.setSize(20);
                this.create();
                this.setId(utils.uuid('node_comment_count'));
            },

            create() {
                const back = new kity.Circle(10, 10, 10);

                const text = new kity.Text()
                    .setX(this.width / 2).setY(this.height / 2)
                    .setTextAnchor('middle')
                    .setVerticalAlign('middle')
                    .setFontSize(12)
                    .fill('white');

                this.addShapes([back, text]);
                this.back = back;
                this.text = text;
            },

            setSize(size) {
                this.width = size;
                this.height = size;
            },

            setValue(value) {
                const back = this.back;
                const text = this.text;

                const color = getColor(value);

                if (color) {
                    back.fill(color);
                }
                // 3位数展示不全
                if (value > 99) {
                    text.setContent('99+');
                } else {
                    text.setContent(value);
                }
            },
        });

        /**
         * @command CommentCount Command
         * @description 设置节点的评论数
         * @param {number} value 要设置的评论数（添加一个评论数图标）
         * @state
         *    0: 当前有选中的节点
         *   -1: 当前没有选中的节点
         */
        const CommentCountCommand = kity.createClass('SetCommentCountCommand', {
            base: Command,
            execute(km, value) {
                const nodes = km.getSelectedNodes();
                for (let i = 0; i < nodes.length; i++) {
                    const node = nodes[i];
                    if (!commentCountCondition(node)) {
                        continue;
                    }
                    node.setData(NODE_KEY, value || null).render();
                    minder.fire('onchange-comment-count', {value: value || null, node: node});
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
                } else if (nodes.length === 1) {
                    return (commentCountCondition(nodes[0]) ? 0 : -1);
                }
                return -1;
            },
        });

        const CommentCountRender = kity.createClass('CommentCountRender', {
            base: Renderer,

            create() {
                return new CommentCountIcon();
            },

            shouldRender(node) {
                return node.getData(NODE_KEY);
            },

            updateToRight(icon, node, box) {
                const data = node.getData(NODE_KEY);

                icon.setValue(data);

                const spaceRight = node.getStyle('space-right');
                const x = box.right + spaceRight;
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
                return this.updateToRight(icon, node, box);
            },
        });

        return {
            'commands': {
                'CommentCount': CommentCountCommand,
            },
            'renderers': {
                right: CommentCountRender,
            },
        };
    });
});

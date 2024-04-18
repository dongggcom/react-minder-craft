/**
 * @file 节点上的评论
 */

const {cloneDeep} = require('lodash');

// eslint-disable-next-line no-undef
define(require => {
    const kity = window.kity;
    const Module = window.kityminder.Module;

    const utils = require('kityminder-core/src/core/utils');
    const Command = require('kityminder-core/src/core/command');
    const Renderer = require('kityminder-core/src/core/render');

    function getDataOrStyle(node, name) {
        return node.getData(name) || node.getStyle(name);
    }

    Module.register('CommentModule', function CommentModule() {
        const minder = this;
        const COMMENT_DATA = 'comment';

        let commentCondition = () => false;
        setTimeout(() => {
            commentCondition = minder.extend.commentCondition || (() => true);
        });

        function arrangeText(textGroup, node) {
            const lineHeight = node.getStyle('line-height');
            const fontSize = getDataOrStyle(node, 'font-size');
            const fontHeight = lineHeight * fontSize;

            const yStart = 0;
            let textGroupHeight = 0;
            textGroup.eachItem((i, textShape) => {
                const y = yStart + i * fontHeight;

                textShape.setY(y);
                textGroupHeight += fontHeight; // 19
            });
            const offset = node.getLayoutOffset();
            if (textGroupHeight === 0) {
                offset.y = -15;
            } else {
                // 这块的代码参考的是 module dragTree
                offset.y = Math.min(offset.y, -textGroupHeight);
            }
            node.setLayoutOffset(offset);
            minder.applyLayoutResult(minder.getRoot(), minder.getOption('layoutAnimationDuration'));
        }

        const CommentGroup = kity.createClass('CommentGroup', {
            base: kity.Group,

            constructor() {
                this.callBase();
                this.setId(utils.uuid('comment'));
            },
            // value 指必须按照 [{content, creator, date}] 的格式
            setState(value) {
                if (this.getShapes().length) {
                    this.clear();
                }
                if (value) {
                    this.value = value;
                    // TODO: 暂时未添加 text 浏览器兼容性逻辑
                    value.forEach(v => {
                        const textShape = new kity.Text()
                            .setAttr('text-rendering', 'inherit')
                            .setAttr('dominant-baseline', 'text-before-edge');
                        textShape.setContent(`${v.creator || 'Someone'}: ${v.content || 'Unknown'} ${v.date || ''}`);
                        this.addShape(textShape);
                    });
                } else {
                    this.clear();
                }
            },

            clear() {
                while (this.getShapes().length) {
                    this.removeShape(0);
                }
            },
        });

        // 强制更新
        function forceShowShape(renderer) {
            return ({node}) => {
                if (node.getData(COMMENT_DATA) && renderer.getRenderShape()) {
                    renderer.getRenderShape().setVisible(true);
                }
            };
        }

        const CommentRender = kity.createClass('CommentRender', {
            base: Renderer,

            create(node) {
                if (node.isRoot()) {
                    return;
                }
                this.group = new CommentGroup(node);
                return this.group;
            },

            shouldRender(node) {
                // 不知道为啥会有根节点
                if (node.isRoot()) {
                    return false;
                }
                return this.watchChange(node.getData(COMMENT_DATA));
            },

            watchChange(data) {
                let changed = true;

                if (this.watchingData === undefined && data !== undefined) {
                    changed = true;
                } else if (this.watchingData === data) {
                    changed = false;
                }
                if (changed) {
                    this.watchingData = cloneDeep(data);
                    // 由于 kityminder-core 判断如果有图形，那么 shouldRender 如果为 false ，会隐藏已有的图形
                    // 此处在事件结束后强制展示
                    minder.on('noderender', forceShowShape(this));
                }
                return changed;
            },
            // 第一个参数是通过 create 生成的
            update(group, node, box) {
                const state = node.getData(COMMENT_DATA);

                group.setState(state);

                const lineHeight = node.getStyle('line-height');
                const fontSize = getDataOrStyle(node, 'font-size');
                const fontHeight = lineHeight * fontSize;

                const x = box.left;
                const y = box.cy + fontHeight;

                this.group.setTranslate(x, y);
                arrangeText(group, node, box);
            },
            destroy() {
                this.watchingData = undefined;
            },
        });

        const CommentCommand = kity.createClass('CommentCommand', {
            base: Command,
            /**
             * 命令
             * @param {*} value [{content, creator, date}]
             */
            execute(km, value) {
                const nodes = km.getSelectedNodes();
                for (let i = 0; i < nodes.length; i++) {
                    const node = nodes[i];
                    if (!commentCondition(node)) {
                        continue;
                    }
                    node.setData(COMMENT_DATA, value || null, node).render();
                    minder.fire('on-comment', {value: value || null, node: node});
                }
                km.layout();
            },
            queryValue(km) {
                const nodes = km.getSelectedNodes();
                let val = null;
                for (let i = 0; i < nodes.length; i++) {
                    val = nodes[i].getData(COMMENT_DATA);
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
                    return (commentCondition(nodes[0]) ? 0 : -1);
                }
                return -1;
            },
        });

        return {
            'commands': {
                'Comment': CommentCommand,
            },
            'renderers': {
                outside: CommentRender,
            },
            'destroy': () => {
                CommentRender.prototype.destroy();
            },
        };
    });
});

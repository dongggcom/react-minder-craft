/**
 * @file 展开子节点
 */
// eslint-disable-next-line no-undef
define(require => {
    const kity = window.kity;
    const Module = window.kityminder.Module;
    const MinderNode = window.kityminder.Node;
    const utils = require('kityminder-core/src/core/utils');
    const Command = require('kityminder-core/src/core/command');
    const Renderer = require('kityminder-core/src/core/render');
    const keymap = require('kityminder-core/src/core/keymap');
    const compatibility = require('kityminder-core/src/core/compatibility');

    Module.register('Expand', function Expand() {
        const minder = this;
        const EXPAND_STATE_DATA = 'expandState';
        const STATE_EXPAND = 'expand';
        const STATE_COLLAPSE = 'collapse';

        function isHasChildDataWithoutChildren(node) {
            return node.getData('hasChild') && !node.getChildren().length;
        }

        let getNodeChildren = () => Promise.resolve({error: 'not implemented'});
        setTimeout(() => {
            getNodeChildren = minder.extend.getNodeChildren || (() => Promise.resolve({}));
        });

        // 将展开的操作和状态读取接口拓展到 MinderNode 上
        kity.extendClass(MinderNode, {

            /**
             * 展开节点
             * @param  {Policy} policy 展开的策略，默认为 KEEP_STATE
             */
            expand() {
                this.setData(EXPAND_STATE_DATA, STATE_EXPAND);
                return this;
            },

            /**
             * 收起节点
             */
            collapse() {
                this.setData(EXPAND_STATE_DATA, STATE_COLLAPSE);
                return this;
            },

            /**
             * 异步获取回填子节点
             */
            async expandAsyncImport() {
                const data = await this.getAsyncChildren();
                if (!data.data || !data.children.length) {
                    return;
                }
                const json = compatibility({'root': data});
                minder.importNode(this, json.root);
                this.expand();
            },

            /**
             * 判断节点当前的状态是否为展开
             */
            isExpanded() {
                const expanded = this.getData(EXPAND_STATE_DATA) !== STATE_COLLAPSE;
                return expanded && (this.isRoot() || this.parent.isExpanded());
            },

            /**
             * 判断节点当前的状态是否为收起
             */
            isCollapsed() {
                return !this.isExpanded();
            },

            /**
             * 异步查询子节点
             */
            getAsyncChildren() {
                const node = this;
                node.disable();
                return getNodeChildren(node).then(r => {
                    node.enable();
                    return r;
                }).catch(() => node.enable());
            },

            /**
             * 禁止交互
             */
            disable() {
                const g = this.rc.node;
                g.style.opacity = 0.5;
                g.style.pointerEvents = 'none';
            },

            /**
             * 恢复交互
             */
            enable() {
                const g = this.rc.node;
                g.style.opacity = 1;
                g.style.pointerEvents = 'auto';
            },
        });

        /**
         * @command Expand
         * @description 展开当前选中的节点，保证其可见
         * @param {bool} justParents 是否只展开到父亲
         *     * `false` - （默认）保证选中的节点以及其子树可见
         *     * `true` - 只保证选中的节点可见，不展开其子树
         * @state
         *   0: 当前有选中的节点
         *  -1: 当前没有选中的节点
         */
        const ExpandCommand = kity.createClass('ExpandCommand', {
            base: Command,

            execute(km, justParents) {
                let node = km.getSelectedNode();
                if (!node) {
                    return;
                }
                if (justParents) {
                    node = node.parent;
                }
                while (node.parent) {
                    node.expand();
                    node = node.parent;
                }
                node.renderTree();
                km.layout(100);
            },

            queryState(km) {
                const node = km.getSelectedNode();
                return node && !node.isRoot() && !node.isExpanded() ? 0 : -1;
            },
        });

        /**
         * @command ExpandToLevel
         * @description 展开脑图到指定的层级
         * @param {number} level 指定展开到的层级，最少值为 1。
         * @state
         *   0: 一直可用
         */
        const ExpandToLevelCommand = kity.createClass('ExpandToLevelCommand', {
            base: Command,
            execute(km, level) {
                km.getRoot().traverse(node => {
                    if (node.getLevel() < level) {
                        node.expand();
                    }
                    if (node.getLevel() === level && !node.isLeaf()) {
                        node.collapse();
                    }
                });
                km.refresh(100);
            },
            enableReadOnly: true,
        });

        /**
         * @command Collapse
         * @description 收起当前节点的子树
         * @state
         *   0: 当前有选中的节点
         *  -1: 当前没有选中的节点
         */
        const CollapseCommand = kity.createClass('CollapseCommand', {
            base: Command,

            execute(km) {
                const node = km.getSelectedNode();
                if (!node) {
                    return;
                }

                node.collapse();
                node.renderTree();
                km.layout();
            },

            queryState(km) {
                const node = km.getSelectedNode();
                return node && !node.isRoot() && node.isExpanded() ? 0 : -1;
            },
        });

        const Expander = kity.createClass('Expander', {
            base: kity.Group,

            constructor(node) {
                this.callBase();
                this.radius = 6;
                this.outline = new kity.Circle(this.radius).stroke('gray').fill('white');
                this.sign = new kity.Path().stroke('gray');
                this.addShapes([this.outline, this.sign]);
                this.initEvent(node);
                this.setId(utils.uuid('node_expander'));
                this.setStyle('cursor', 'pointer');
            },

            initEvent(node) {
                this.on('mousedown', async e => {
                    minder.select([node], true);
                    // 增加事件
                    if (isHasChildDataWithoutChildren(node)) {
                        await node.expandAsyncImport();
                    } else if (node.isExpanded()) {
                        node.collapse();
                    } else {
                        node.expand();
                    }
                    node.renderTree().getMinder().layout(100);
                    node.getMinder().fire('contentchange');
                    e.stopPropagation();
                    e.preventDefault();
                });
                this.on('dblclick click mouseup', e => {
                    e.stopPropagation();
                    e.preventDefault();
                });
            },

            setState(state) {
                if (state === 'hide') {
                    this.setVisible(false);
                    return;
                }
                this.setVisible(true);
                const pathData = ['M', 1.5 - this.radius, 0, 'L', this.radius - 1.5, 0];
                if (state === STATE_COLLAPSE) {
                    pathData.push(['M', 0, 1.5 - this.radius, 'L', 0, this.radius - 1.5]);
                }
                this.sign.setPathData(pathData);
            },
        });

        const ExpanderRenderer = kity.createClass('ExpanderRenderer', {
            base: Renderer,

            create(node) {
                if (node.isRoot()) {
                    return;
                }
                this.expander = new Expander(node);
                node.getRenderContainer().prependShape(this.expander);
                node.expanderRenderer = this;
                this.node = node;
                return this.expander;
            },

            shouldRender(node) {
                return !node.isRoot();
            },

            update(expander, node) {
                if (!node.parent) {
                    return;
                }

                const visible = node.parent.isExpanded();
                const hasChild = node.getData('hasChild');

                const visibleState = visible && (node.children.length || hasChild);
                const nodeExpandState = isHasChildDataWithoutChildren(node)
                    ? STATE_COLLAPSE : node.getData(EXPAND_STATE_DATA);

                // 因为主动将 hasChild 类型设置为收起，因此此处状态要明确标记
                if (isHasChildDataWithoutChildren(node)) {
                    node.setData(EXPAND_STATE_DATA, STATE_COLLAPSE);
                }

                expander.setState(
                    visibleState ? nodeExpandState : 'hide'
                );

                const vector = node.getLayoutVectorIn().normalize(expander.radius + node.getStyle('stroke-width'));
                const position = node.getVertexIn().offset(vector.reverse());

                this.expander.setTranslate(position);
            },
        });

        return {
            commands: {
                'expand': ExpandCommand,
                'expandtolevel': ExpandToLevelCommand,
                'collapse': CollapseCommand,
            },
            events: {
                'layoutapply'(e) {
                    const r = e.node.getRenderer('ExpanderRenderer');
                    if (r.getRenderShape()) {
                        r.update(r.getRenderShape(), e.node);
                    }
                },
                'beforerender'(e) {
                    const node = e.node;
                    const visible = !node.parent || node.parent.isExpanded();

                    node.getRenderContainer().setVisible(visible);
                    if (!visible) {
                        e.stopPropagation();
                    }
                },
                'normal.keydown'(e) {
                    if (this.getStatus() === 'textedit') {
                        return;
                    }
                    if (e.originEvent.keyCode === keymap['/']) {
                        const node = this.getSelectedNode();
                        if (!node || node === this.getRoot()) {
                            return;
                        }
                        const expanded = node.isExpanded();
                        this.getSelectedNodes().forEach(node => {
                            if (expanded) {
                                node.collapse();
                            }
                            else {node.expand();}
                            node.renderTree();
                        });
                        this.layout(100);
                        this.fire('contentchange');
                        e.preventDefault();
                        e.stopPropagationImmediately();
                    }
                    if (e.isShortcutKey('Alt+`')) {
                        this.execCommand('expandtolevel', 9999);
                    }
                    for (let i = 1; i < 6; i++) {
                        if (e.isShortcutKey('Alt+' + i)) {
                            this.execCommand('expandtolevel', i);
                        }
                    }
                },
            },
            renderers: {
                outside: ExpanderRenderer,
            },
            contextmenu: [{
                command: 'expandtoleaf',
                query() {
                    return !minder.getSelectedNode();
                },
                fn(minder) {
                    minder.execCommand('expandtolevel', 9999);
                },
            }, {
                command: 'expandtolevel1',
                query() {
                    return !minder.getSelectedNode();
                },
                fn(minder) {
                    minder.execCommand('expandtolevel', 1);
                },
            }, {
                command: 'expandtolevel2',
                query() {
                    return !minder.getSelectedNode();
                },
                fn(minder) {
                    minder.execCommand('expandtolevel', 2);
                },
            }, {
                command: 'expandtolevel3',
                query() {
                    return !minder.getSelectedNode();
                },
                fn(minder) {
                    minder.execCommand('expandtolevel', 3);
                },
            }, {
                divider: true,
            }],
        };
    });
});

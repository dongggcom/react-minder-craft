/**
 * @file 节点控制
 * @action 删除 | 新增兄弟节点 | 新增子节点 | 新增 subNodeDesc 节点
 */
// eslint-disable-next-line no-undef
define(require => {
    const kity = window.kity;
    const Module = window.kityminder.Module;
    const MinderNode = window.kityminder.Node;
    const Command = require('kityminder-core/src/core/command');
    const {
        isModelOne,
        isModelTwo,
        isIllegalNode,
        isRootNode,
        isUnknownNode,
    } = require('../tool/modelType');

    Module.register('NodeModule', function NodeModule() {
        const minder = this;

        /**
         * @command AppendChildNode
         * @description 添加子节点到选中的节点中
         * @param {string|object} textOrData 要插入的节点的文本或数据
         * @state
         *    0: 当前有选中的节点
         *   -1: 当前没有选中的节点
         */
        const AppendChildCommand = kity.createClass('AppendChildCommand', {
            base: Command,
            execute(km, text) {
                const parent = km.getSelectedNode();
                if (!parent) {
                    return null;
                }
                const node = km.createNode(text, parent);
                this.value = text;
                km.select(node, true);
                if (parent.isExpanded()) {
                    node.render();
                }
                else {
                    parent.expand();
                    parent.renderTree();
                }
                km.layout(600);
            },
            queryState(km) {
                const selectedNode = km.getSelectedNode();
                // hard-code
                if (selectedNode?.isRoot()
                    || isModelTwo(selectedNode)
                    || isUnknownNode(selectedNode)
                ) {
                    return 0;
                }
                return -1;
            },
        });

        /**
         * @command AppendSiblingNode
         * @description 添加选中的节点的兄弟节点
         * @param {string|object} textOrData 要添加的节点的文本或数据
         * @state
         *    0: 当前有选中的节点
         *   -1: 当前没有选中的节点
         */
        const AppendSiblingCommand = kity.createClass('AppendSiblingCommand', {
            base: Command,
            execute(km, text) {
                const sibling = km.getSelectedNode();
                const parent = sibling.parent;
                if (!parent) {
                    return km.execCommand('AppendChildNode', text);
                }
                this.value = text;
                const node = km.createNode(text, parent, sibling.getIndex() + 1);
                node.setGlobalLayoutTransform(sibling.getGlobalLayoutTransform());
                km.select(node, true);
                node.render();
                km.layout(600);
            },
            queryState(km) {
                const selectedNode = km.getSelectedNode();
                if (isRootNode(selectedNode)) {
                    return -1;
                }
                // hard-code
                if (isModelOne(selectedNode) || isModelTwo(selectedNode) || isUnknownNode(selectedNode)) {
                    return 0;
                }
                return -1;
            },
        });

        /**
         * @command AppendCaseTestNode
         * @description 添加标识1节点到选中的节点中
         * @param {string|object} textOrData 要插入的节点的文本或数据
         * @state
         *    0: 当前有选中的节点
         *   -1: 当前没有选中的节点
         */
        const AppendCaseTestCommand = kity.createClass('AppendCaseTestCommand', {
            base: Command,
            execute(km, key) {
                const parent = km.getSelectedNode();
                // hard-code
                if (!parent || !isModelOne(parent)) {
                    return null;
                }
                const subNodeDescMap = minder.extend.context.subNodeDescMap;
                const text = `请输入${subNodeDescMap[key]}内容`;
                const node = km.createNode(text, parent);

                node.setData('title', subNodeDescMap[key]);
                node.setData('key', key);

                // 增加 modelType 允许唤起编辑框
                node.setData('modelType', 'subNodeDesc');

                this.value = key;
                km.select(node, true);
                if (parent.isExpanded()) {
                    node.render();
                }
                else {
                    parent.expand();
                    parent.renderTree();
                }
                km.layout(600);
            },
            queryState(km) {
                const selectedNode = km.getSelectedNode();
                // hard-code
                if (isModelOne(selectedNode)) {
                    return 0;
                }
                return -1;
            },
        });

        /**
         * @command RemoveNode
         * @description 移除选中的节点
         * @state
         *    0: 当前有选中的节点
         *   -1: 当前没有选中的节点
         */
        const RemoveNodeCommand = kity.createClass('RemoverNodeCommand', {
            base: Command,
            execute(km) {
                const nodes = km.getSelectedNodes();
                const ancestor = MinderNode.getCommonAncestor.apply(null, nodes);
                const index = nodes[0].getIndex();

                nodes.forEach(node => {
                    if (!node.isRoot()) {
                        km.removeNode(node);
                    }
                });
                if (nodes.length === 1) {
                    const selectBack = ancestor.children[index - 1] || ancestor.children[index];
                    km.select(selectBack || ancestor || km.getRoot(), true);
                } else {
                    km.select(ancestor || km.getRoot(), true);
                }
                km.layout(600);
            },
            queryState(km) {
                const selectedNode = km.getSelectedNode();
                // hard-code
                return selectedNode && !selectedNode.isRoot() && !isIllegalNode(selectedNode) ? 0 : -1;
            },
        });

        return {
            commands: {
                'AppendChildNode': AppendChildCommand,
                'AppendSiblingNode': AppendSiblingCommand,
                'AppendCaseTest': AppendCaseTestCommand,
                'RemoveNode': RemoveNodeCommand,
            },

            'commandShortcutKeys': {
                'AppendSiblingNode': 'normal::Enter',
                'AppendChildNode': 'normal::Insert|Tab',
                'RemoveNode': 'normal::Del|Backspace',
            },
        };
    });
});

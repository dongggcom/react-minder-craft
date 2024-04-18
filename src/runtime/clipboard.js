/**
 * @Desc: 处理editor的clipboard事件，只在支持ClipboardEvent并且不是FF的情况下工作
 * @Editor: Naixor
 * @Date: 2015.9.21
 */
define((require, exports, module) => {
    const {isModelTwo} = require('../tool/modelType');

    function childrenHasSameName(name, nodes) {
        if (nodes.length) {
            return nodes.some(node => node.data.text === name);
        }
        return false;
    }

    // 标记需要删除
    const tagNeedRemove = node => {
        node.setData('_delete_after_paste', true);
    };

    // 选中节点为 hasChild 节点且、收起状态并且无子节点
    const isCollapsedHasChildGroupNode = node => {
        if (isModelTwo(node) && node.getData('hasChild') && node.getData('expandState') === 'collapse') {
            return true;
        }
        return false;
    };

    function resetNodeName(pastedNode, node) {
        const children = node.getChildren().filter(child => pastedNode.data.modelType === child.data.modelType);
        if (childrenHasSameName(pastedNode.data.text, children)) {
            pastedNode.data.text += '的副本';
        }
        if (childrenHasSameName(pastedNode.data.text, children)) {
            // 添加副本后任然重名时，从2开始计算
            let c = 2;
            let text = pastedNode.data.text;
            while (childrenHasSameName(text + c, children)) {
                c++;
            }
            if (c > 1) {
                pastedNode.data.text += c;
            }
        }
    }

    function ClipboardRuntime() {
        const minder = this.minder;
        const Data = window.kityminder.data;
        const container = this.container;

        if (!minder.supportClipboardEvent || kity.Browser.gecko) {
            return;
        }
        const defaultCondition = () => true;
        let beforeCopyCondition = defaultCondition;
        let beforePasteCondition = defaultCondition;
        let beforeCutCondition = defaultCondition;
        setTimeout(() => {
            beforeCopyCondition = minder.extend.beforeCopyCondition || (defaultCondition);
            beforePasteCondition = minder.extend.beforePasteCondition || (defaultCondition);
            beforeCutCondition = minder.extend.beforeCutCondition || (defaultCondition);
        });
        const fsm = this.fsm;
        const receiver = this.receiver;
        const MimeType = this.MimeType;
        const editor = this;

        const kmencode = MimeType.getMimeTypeProtocol('application/km');
        const decode = Data.getRegisterProtocol('json').decode;
        let _selectedNodes = [];

        /*
         * 增加对多节点赋值粘贴的处理
         */
        function encode(nodes) {
            const _nodes = [];
            for (let i = 0, l = nodes.length; i < l; i++) {
                _nodes.push(minder.exportNode(nodes[i]));
            }
            return kmencode(Data.getRegisterProtocol('json').encode(_nodes));
        }

        const beforeCopy = function (e) {
            if (document.activeElement == receiver.element) {
                const clipBoardEvent = e;
                const state = fsm.state();


                switch (state) {
                    case 'input': {
                        break;
                    }
                    case 'normal': {
                        // 仅阻塞非编辑状态
                        if (beforeCopyCondition(editor, e) === false) {
                            return;
                        }
                        const nodes = minder.getSelectedNodes();
                        if (nodes.length) {
                            // 这里由于被粘贴复制的节点的id信息也都一样，故做此算法
                            // 这里有个疑问，使用node.getParent()或者node.parent会离奇导致出现非选中节点被渲染成选中节点，因此使用isAncestorOf，而没有使用自行回溯的方式
                            if (nodes.length > 1) {
                                let targetLevel;
                                nodes.sort((a, b) => {
                                    return a.getLevel() - b.getLevel();
                                });
                                targetLevel = nodes[0].getLevel();
                                if (targetLevel !== nodes[nodes.length - 1].getLevel()) {
                                    let plevel; let pnode;
                                    let idx = 0; const l = nodes.length; let
                                        pidx = l - 1;

                                    pnode = nodes[pidx];

                                    while (pnode.getLevel() !== targetLevel) {
                                        idx = 0;
                                        while (idx < l && nodes[idx].getLevel() === targetLevel) {
                                            if (nodes[idx].isAncestorOf(pnode)) {
                                                nodes.splice(pidx, 1);
                                                break;
                                            }
                                            idx++;
                                        }
                                        pidx--;
                                        pnode = nodes[pidx];
                                    }
                                }
                            }
                            const str = encode(nodes);
                            clipBoardEvent.clipboardData.setData('text/plain', str);
                        }
                        e.preventDefault();
                        break;
                    }
                }
            }
        };

        const beforeCut = function (e) {
            if (document.activeElement == receiver.element) {
                if (minder.getStatus() !== 'normal') {
                    e.preventDefault();
                    return;
                }

                const clipBoardEvent = e;
                const state = fsm.state();

                switch (state) {
                    case 'input': {
                        break;
                    }
                    case 'normal': {
                        // 仅阻塞非编辑状态
                        if (beforeCutCondition(editor, e) === false) {
                            return;
                        }
                        const nodes = minder.getSelectedNodes();
                        if (nodes.length) {
                            clipBoardEvent.clipboardData.setData('text/plain', encode(nodes));
                            minder.execCommand('RemoveNode');
                        }
                        e.preventDefault();
                        break;
                    }
                }
            }
        };

        const beforePaste = function (e) {
            if (document.activeElement == receiver.element) {
                if (minder.getStatus() !== 'normal') {
                    e.preventDefault();
                    return;
                }

                const clipBoardEvent = e;
                const state = fsm.state();
                const textData = clipBoardEvent.clipboardData.getData('text/plain');

                switch (state) {
                    case 'input': {
                        // input状态下如果格式为application/km则不进行paste操作
                        if (!MimeType.isPureText(textData)) {
                            e.preventDefault();

                        }
                        break;
                    }
                    case 'normal': {
                        // 仅阻塞非编辑状态
                        if (beforePasteCondition(editor, e) === false) {
                            return;
                        }

                        /*
                         * 针对normal状态下通过对选中节点粘贴导入子节点文本进行单独处理
                         */
                        const sNodes = minder.getSelectedNodes();

                        if (MimeType.whichMimeType(textData) === 'application/km') {
                            // 支持选择多个节点
                            const nodes = decode(MimeType.getPureText(textData));
                            let _node;

                            // 触发事件
                            minder.fire('on-paste', {nodes: nodes, editor, minder});

                            sNodes.forEach(node => {
                                // 由于粘贴逻辑中为了排除子节点重新排序导致逆序，因此复制的时候倒过来
                                for (let i = nodes.length - 1; i >= 0; i--) {
                                    // 当存在同一节点下重名的节点时，重命名
                                    resetNodeName(nodes[i], node);
                                    _node = minder.createNode(null, node);
                                    minder.importNode(_node, nodes[i]);
                                    _selectedNodes.push(_node);
                                    node.appendChild(_node);
                                }
                            });

                            minder.select(_selectedNodes, true);

                            // 将未展开、带有异步加载的节点，起被粘贴节点增加待删除标识
                            if (sNodes.every(isCollapsedHasChildGroupNode)) {
                                _selectedNodes.forEach(n => tagNeedRemove(n));
                            }

                            _selectedNodes = [];

                            minder.refresh();

                        }
                        else if (clipBoardEvent.clipboardData && clipBoardEvent.clipboardData.items[0].type.indexOf('image') > -1) {
                            const imageFile = clipBoardEvent.clipboardData.items[0].getAsFile();
                            const serverService = angular.element(document.body).injector().get('server');

                            return serverService.uploadImage(imageFile).then(json => {
                                const resp = json.data;
                                if (resp.errno === 0) {
                                    minder.execCommand('image', resp.data.url);
                                }
                            });
                        }
                        // 文本信息不需要粘贴
                        // else {
                        //     sNodes.forEach(node => {
                        //         minder.Text2Children(node, textData);
                        //     });
                        // }
                        e.preventDefault();
                        break;
                    }
                }
            }
        };
        /**
         * 由editor的receiver统一处理全部事件，包括clipboard事件
         * @Editor: Naixor
         * @Date: 2015.9.24
         */
        document.addEventListener('copy', beforeCopy);
        document.addEventListener('cut', beforeCut);
        container.addEventListener('paste', beforePaste);
    }

    return module.exports = ClipboardRuntime;
});

import React, {useRef, useEffect} from 'react';
import ReactDom from 'react-dom';
import '../src/less/index.less';
import '../src/less/vender.less';
import ReactKityMinder from '../src';
import getContext from './lib/getContext';
import imageClick from './lib/imageClick';
import registerMinderEvent from './lib/registerMinderEvent';
import fsmSubscribe from './lib/fsmSubscribe';
import toggleNodeVisible from './lib/toggleNodeVisible';
import showComment from './lib/showComment';
import appendNode, {appendNodeConditionProps} from './lib/appendNode';
import getAsyncGetNodesProps from './lib/getAsyncGetNodesProps';
import getUndoButtonProps from './lib/getUndoButtonProps';
import useDefaultUsed from './hooks/useDefaultUsed';
import useLoadData from './hooks/useLoadData';
import useQuickClickMenu, {getNodeOperateQuickClickMenuOption} from './hooks/useQuickClickMenu';

const isModelOne = node => node?.data.modelType === 'one';

// eslint-disable-next-line no-console
const log = (...args) => console.log(...args);

// 禁止粘贴标识2
// eslint-disable-next-line no-unused-vars
const beforeCopyCondition = editor => {
    // const nodes = editor.minder.getSelectedNodes();

    // if (nodes.some(node => isModelTwo(node))) {
    //     return false;
    // }
    return true;
};

// eslint-disable-next-line no-unused-vars
const nodeModelTypeCondition = (node, type) => {
    if (!node) {
        return false;
    }
    if (node.data.modelType === 'one') {
        return true;
    }
    return false;
};

const resourceCondition = nodeModelTypeCondition;
const priorityCondition = nodeModelTypeCondition;

// 按照分级展开
const expandLevel = level => {
    log('expand level: ', level);
};

// 节点的边界探测，可以触发某些事件
const dropHinterCondition = (target, minder) => {
    const from = minder.getSelectedNode();
    log('target', target.getText(), 'from', from.getText());
    if (isModelOne(target)) {
        return false;
    }
    return true;
};

const Demo = () => {
    const [data] = useLoadData();
    const [defaultUsed] = useDefaultUsed();
    const refs = useRef(null);

    useQuickClickMenu(
        refs.current?.getEditor(),
        getNodeOperateQuickClickMenuOption(
            [
                '子节点:Tab:AppendChildNode:one',
                '兄弟:Enter:AppendSiblingNode:bro',
                '删除:Delete|Backspace:RemoveNode',
            ],
            refs.current?.getEditor()
        )
    );

    useEffect(() => {
        const editor = refs.current?.getEditor();
        if (!editor) {
            return;
        }

        log('editor', editor);

        // 禁止执行命令
        // editor.minder.disableCommands(['appendchildnode', 'AppendSiblingNode']);
        // editor.minder.disable();

        // 粘贴
        // document.addEventListener('paste', () => {
        //     const minder = editor.minder;
        //     log('paste', editor.fsm.state(), minder.getSelectedNodes());
        // });
        // 显示评论
        showComment(editor);
        // 添加节点
        appendNode(editor);
        // 隐藏或显示节点
        toggleNodeVisible(editor);
        // 订阅编辑器状态机
        fsmSubscribe(editor);
        // 注册事件
        registerMinderEvent(editor);
    }, [data]
    );

    return (
        <ReactKityMinder
            dataSource={data}
            ref={refs}
            priorityCondition={priorityCondition}
            resourceCondition={resourceCondition}
            beforeCopyCondition={beforeCopyCondition}
            dropHinterCondition={dropHinterCondition}
            expandLevel={expandLevel}
            imageClick={imageClick}
            {...appendNodeConditionProps}
            {...getAsyncGetNodesProps()}
            {...getUndoButtonProps()}
            context={getContext()}
            defaultUsed={defaultUsed}
        />
    );
};

ReactDom.render(<Demo />, document.getElementById('root'));

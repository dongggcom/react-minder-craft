/**
 * 注册事件
 * km = editor.minder
 */

// eslint-disable-next-line no-console
const log = (...args) => console.log(...args);

const hasNotEditTag = node => {
    if (node.getData('edit') === NOT_EDITOR) {
        return true;
    }
    return false;
};

function registerMinderEvent(editor) {
    const km = editor.minder;
    // 拖拽
    km.on('movetoparent', e => {
        // log('drag to parent');
    });

    // 进入点击状态时，例如双击
    km.on('contentchange', e => {
        if (editor.fsm.state() === 'drag') {
            log('content change by drag');
        }
        // 一个新增，一个减少
    });

    // 当选择的节点发生变化时
    km.on('selectionchange', e => {
        const node = e.minder.getSelectedNode();
        if (!node) {
            return;
        }
        log('selectionchange', node);
        //             // 更新带图片的text
        //             const text = `[img src="https://12761cf50d31b50d45ad4eedd206f7" style="width: 460px;"]
        // 123123
        // 3333
        // [img src="https://50d45ad4eedd206f7" style="width: 460px;"]`;
        //             e.minder.getSelectedNode().setText(text);

        // 清空评论
        // if (e.minder.getSelectedNode()) {
        //     editor.minder.execCommand('comment', undefined);
        // }

        // 自动添加评论
        // if (e.minder.getSelectedNode()) {
        //     const comments = e.minder.getSelectedNode().getData('comment') || [];
        //     comments.push({content: '添加评论', creator: 'zs', date: '2022-07-28 19:36:10'});
        //     editor.minder.execCommand('comment', comments);
        // }
    });


    // 点击详情按钮图标
    km.on('detail-onclick', e => {
        // log('detail-onclick', e);
        e.minder.execCommand('Status', null);
        e.minder.execCommand('detail', 'edit');
    });
    // km.on('detail-mouseover', e => {
    //     log('detail-mouseover', e);
    // });

    // 复制与drag前
    // km.on('beforeCopy', e => log('before Copy', e));
    // km.on('beforeCut', e => log('before Cut', e));

    // [x] 保存：blur(onchange), enter -> listen: input-cancel -> recover, input-commit -> upload
    // [x] loading: node disable enable -> mask node by id? node.rc.node
    // [x] async update node -> cache, setDate(node, data)
    // FIXME: Node create quickly that would create a virtual node, but this is not happen so much
    // km.on('input-commit', e => {
    //     const minder = e.minder;
    //     // THIS IS TARGET NODE
    //     const node = minder.getSelectedNode();
    //     // log('input-commit', node);
    //     if (!node || !hasNotEditTag(node)) {
    //         return;
    //     }
    //     inputCommit(node, minder);
    // });

    // 取消编辑事件
    km.on('input-cancel', e => {
        const minder = e.minder;
        const node = minder.getSelectedNode();
        // log('input-cancel', node);
        if (node && hasNotEditTag(node)) {
            // log('not edit: undo');
            editor.history.undo();
        }
    });

    // km.on('add-resource', e => {
    //     log('add-resource', e);
    // });

    // 长文本省略号
    km.on('long-text-onclick', e => {
        const node = e.minder.getSelectedNode();
        const text = node.getText();

        km.execCommand('LongText', node.getData('longText') === 'expand' ? text : 'expand');
    });
}

export default registerMinderEvent;

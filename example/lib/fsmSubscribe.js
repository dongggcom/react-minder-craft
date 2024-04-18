/**
 * 监听编辑器状态机
 * 补充原编辑器状态机能力，包括进入编辑器、拖拽等
 */

const isIllegalNode = node => node === null || node.data.modelType === undefined;

function fsmSubscribe(editor) {

    // -------- 监听面板状态器 --------
    // 这块可以用于埋点面板是否点击过
    // editor.panelFsm.when('normal -> panel', (exit, enter, reason) => {
    //     log('panel listen');
    // });
    // editor.panelFsm.when('panel -> normal', (exit, enter, reason) => {
    //     log('panel listen end');
    // });

    // -------- 判断是否允许进入编辑器 --------
    // 当返回是 true 时，不允许进入编辑器
    editor.fsm.when('normal - input', function handler(oldState, newState, reason) {
        // log('input before', handler.condition, oldState, newState, reason);
        const node = editor.minder.getSelectedNode();
        if (isIllegalNode(node)) {
            return true;
        }
        //
    });

    // -------- 阻止回填空内容 --------
    // 针对某些特殊场景，例如阻止空文本提交
    let nodeText = '';
    editor.fsm.when('* -> input', (exit, enter, reason) => {
        nodeText = editor.receiver.element.innerText;
    });
    // 需要注册在 input setFsm 之前
    editor.fsm.when('input -> *', (exit, enter, reason) => {
        // 提交非空文本
        if (reason === 'input-commit' && nodeText !== '') {
            const commitText = editor.minder.queryCommandValue('text');
            if (/^\s*$/.test(commitText) || commitText === null) {
                const node = editor.minder.getSelectedNode();
                node.setText(nodeText);
                nodeText = '';
            }
        }
    });

    // -------- 拖拽存储节点 --------
    // drag1 - cache drag1 - drag2 - drag3 - drag1-resp-success - cache drag2 - wait drag2 - drag2-resp-fail
    // - wait drag3 - drag3-resp-success ? - drag2 recover
    // 多次拖拽更新此处
    const lastSnap = editor.minder.exportJson();
    editor.fsm.when('normal -> drag', function handler(oldState, newState, reason) {
        // log('start drag', oldState, newState, reason);
    });

    editor.fsm.when('drag -> normal', function handler(notify) {
        // log('drag finish', handler.condition, notify, editor.minder.getSelectedNodes());

        // recover after 1s
        // const revertSnap = editor.minder.exportJson();
        // setTimeout(() => {
        //     log('drag recover');
        //     editor.minder.applyPatches(jsonDiff(revertSnap, lastSnap));
        // }, 1000);
    });
}

export default fsmSubscribe;

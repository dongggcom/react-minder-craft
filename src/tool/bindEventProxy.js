// ////////////////////////////////////////////
// / 控制面板
// / 判断的标准是：按下后，通过事件捕获，找到了 onclick 事件
// ////////////////////////////////////////////
const FSM = require('../runtime/fsm');

// 事件捕获的过程中，找到了 onclick 事件
function bindEventProxy(container) {
    FSM.call(bindEventProxy);

    const fsm = bindEventProxy.fsm;
    const MOUSE_LB = 0; // 左键

    let realOnClickDom = null;

    container.addEventListener('mousedown', e => {
        if (fsm.state() == 'normal' && e.button == MOUSE_LB) {
            // FIXME: 像 resource 通过事件代理完成的绑定，此事的事件捕获就不准确，需要特殊处理
            e.path?.some(dom => {
                if (dom === container) {
                    return true;
                }
                if (dom.onclick) {
                    realOnClickDom = dom;
                    return true;
                }
            });
        }
    }, false);

    container.addEventListener('mouseup', e => {
        if (fsm.state() != 'normal' || e.button != MOUSE_LB || !realOnClickDom) {
            return;
        }
        fsm.jump('panel', 'panel-menu');
    }, false);

    function reset() {
        realOnClickDom = null;
        fsm.jump('normal', 'panel-menu');
    }

    fsm.when('normal -> panel', (exit, enter, reason) => {
        reset();
    });
    return fsm;
}

export default bindEventProxy;

import {useEffect} from 'react';
import QuickClickMenu from 'quick-click-menu';

function appendAction(minder, command, modelType) {
    minder.execCommand(command, modelType || '新节点');
    minder.fire('append-node', {command});
}

function createRenderElement(label, key) {
    const div = document.createElement('div');
    const span = document.createElement('span');
    span.style.color = '#ccc';
    span.style.fontSize = '12px';
    span.innerText = Array.isArray(key) ? key.join(' | ') : key;

    div.innerText = label + ' ';
    div.appendChild(span);
    return div;
}

export function getNodeOperateQuickClickMenuOption(
    buttons,
    editor
) {
    const options = {
        items: buttons.map(button => {
            const parts = button.split(':');
            const label = parts.shift() ?? '能力';
            const key = parts.shift()?.split('|') ?? [];
            const command = parts.shift();
            const modelType = parts.shift() || '';

            return {
                label: label,
                click: () => {
                    const lastNode = editor.minder.getSelectedNode();
                    if (!lastNode) {
                        return;
                    }
                    if (command === 'AppendSiblingNode') {
                        const lastNodeModelType = lastNode.getData('modelType');
                        lastNode.setData('modelType', lastNodeModelType);
                        appendAction(editor.minder, command, lastNodeModelType);
                    }
                    else if (command && command.startsWith('Append')) {
                        appendAction(editor.minder, command, modelType);
                    }
                    else if (command === 'RemoveNode') {
                        editor.minder.execCommand('RemoveNode');
                    }
                    else {
                        editor.minder.execCommand(command);
                        editor.fsm.jump('normal', 'command-executed');
                    }
                },
                disabled: () => {
                    const lastNode = editor.minder.getSelectedNode();
                    if (command === 'AppendSiblingNode' && lastNode && lastNode.isRoot()) {
                        return true;
                    }
                    return editor.minder.queryCommandState(command) === -1;
                },
                key,
                render: createRenderElement(label, key),
            };
        }),
    };

    return options;
}

function useQuickClickMenu(editor, options) {
    useEffect(
        () => {
            if (!editor || !options) {
                return;
            }

            const minder = editor.minder;
            const qrm = new QuickClickMenu(options, editor.container);

            // 菜单不受滚动影响
            qrm.render.layout.addEventListener('mousewheel', e => {
                e.stopPropagation();
            }, false);

            // 右键编辑框出现
            editor.fsm.when('normal -> hotbox', () => {
                const node = minder.getSelectedNode();
                if (node) {
                    const box = node.getRenderBox();
                    const position = {
                        x: box.cx,
                        y: box.cy,
                    };
                    qrm.located(position);
                }
            });

            // window resize
            window.addEventListener('resize', () => {
                qrm.render.hide();
            });

            // 唤起编辑框，QRM 消失
            editor.fsm.when('* -> input', () => {
                qrm.render.hide();
            });

            // 多个 QRM 消失判断
            editor.fsm.when('* -> normal', (
                oldState,
                newState,
                reason,
                e
            ) => {
                if (
                    reason === 'mousemove-blur' // 滚动及消失
                    || reason === 'blur' // 空白区域消失
                ) {
                    qrm.render.hide();
                }
                // 由于 editor runtime receiver 重写了 onpress 事件，因此 bindKey 会失效，这里要重新绑定
                else if (reason === 'shortcut-handle') {
                    if (e instanceof KeyboardEvent) {
                        const hasDispatched = qrm.dispatch(e);
                        if (hasDispatched) {
                            e.preventDefault();
                        }
                        else {
                            // minder.dispatchKeyEvent(e);
                        }
                    }
                    else {
                        // minder.dispatchKeyEvent(e);
                    }
                }
            });

            // FIXME: 删除后，再点击快捷键不生效 -> 原来就有这个问题
        },
        // 会导致 when 监听的事件重复绑定
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [editor]
    );
}

export default useQuickClickMenu;

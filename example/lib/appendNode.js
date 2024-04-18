/**
 * 添加子节点
 * 需要监听事件，同时配合 node module 实现
 */

// eslint-disable-next-line no-console
const log = (...args) => console.log(...args);

const fnAfter = (fn, after) => {
    return (...args) => {
        const result = fn(...args);
        after(...args, result);
        return result;
    };
};

// 脑图上的事件仅监听一次
const once = (minder, eventName, callback) => {
    const afterFunction = fnAfter(callback, () => minder.off(eventName, afterFunction));
    minder.on(eventName, afterFunction);
};

// 模拟请求
const mockReq = (timeout = 1000) => new Promise((resolve, reject) => {
    setTimeout(() => {
        const id = parseInt(Math.random() * 1000, 10);
        if (id < 10) {
            reject(new Error(`id: ${id}`));
        } else {
            resolve({
                code: 200,
                message: 'success',
                data: parseInt(Math.random() * 10000, 10),
            });
        }
    }, timeout);
});

const NOT_EDITOR = 'NOT_EDITOR';
const NOT_EDITOR_TEXT = '未编辑';

const hasNotEditTag = node => {
    if (node.getData('edit') === NOT_EDITOR) {
        return true;
    }
    return false;
};

// 标记节点为"未编辑"
const tagNotEdit = node => {
    node.setData('edit', NOT_EDITOR);
    node.setData('text', NOT_EDITOR_TEXT);
};

// 设置节点为已编辑
const tagEdited = (node, text) => {
    if (!hasNotEditTag(node)) {
        return;
    }
    node.setData('edit', undefined);
    node.setData('text', text);
    node.render();
};

// 设置节点不可用
const setNodeDisable = node => {
    if (!node) {
        return;
    }
    const g = node.rc.node;
    g.style.opacity = 0.5;
    g.style.pointerEvents = 'none';
};

// 恢复节点可用
const setNodeEnable = node => {
    if (!node) {
        return;
    }
    const g = node.rc.node;
    g.style.opacity = 1;
    g.style.pointerEvents = 'all';
};

// 获得选中节点
const getSelectNode = editor => editor?.minder.getSelectedNode();

const isModelOne = node => node?.data.modelType === 'one';
const isModelTwo = node => node?.data.modelType === 'two';
const isRootNode = node => node.type === 'root';

// 标识2插入逻辑判断
const appendNodeCondition = (command, arg, editor) => {
    const selectNode = getSelectNode(editor);
    if (!selectNode || !arg) {
        return false;
    }
    if (isRootNode(selectNode) && command === 'appendchildnodev2') {
        return false;
    }
    if (isModelTwo(selectNode)) {
        return true;
    }
    if (isModelOne(selectNode) && command === 'appendchildnodev2') {
        // 判断合法性: 标识1下面不能创建子节点；
        alert('创建失败！标识1下面不能创建子节点。');
        return false;
    } else if (isModelOne(selectNode)) {
        return true;
    }
    if (arg === '标识1' && command === 'appendchildnodev2') {
        alert('创建失败！"版本"下面不能创建"标识1"。');
        return false;
    }
    return false;
};

// 判断是否能够添加子节点，并设置初始化新节点
const appendNodeConditionWithCallback = fnAfter(appendNodeCondition, (...args) => {
    const [, , editor, conditionResult] = args;
    // const {minder} = editor;
    // const selectNode = getSelectNode(editor); // 点击的 不是 append 的
    // 此时执行是放到 editor 之后
    if (conditionResult) {
        const callback = e => {
            // create node
            const node = e.minder.getSelectedNode();
            if (!node) {
                return;
            }
            // model TYPE 就是通过 text 传递，后面会更改
            node.setData('modelType', node.data.text);
            if (isModelOne(node)) {
                node.setData('detail', 'edit');
                node.setData('priority', 'P0');

                // setTimeout(() => {
                //     createCaseSubNode(editor.minder, node);
                // });
            }
            tagNotEdit(node);
        };
        once(editor.minder, 'selectionchange', callback);
    }
});


// 通过请求回填节点
const addNode = (node, minder) => {
    const cache = node;
    setNodeDisable(cache);
    // log('not-edit: set disable');
    return mockReq().then(({data}) => {
        // log('req finish', data, cache);
        setTimeout(() => {
            tagEdited(cache, `id: ${data}`);
            setNodeEnable(cache);
            minder.layout(300);
        }, 3000);
    }).catch(e => {
        log(e);
        minder.removeNode(cache);
    });
};

export const appendNodeConditionProps = {
    appendNodeCondition: appendNodeConditionWithCallback,
};

export default function appendNode(editor) {
    const km = editor.minder;

    km.on('append-node', ({command}) => {
        const node = km.getSelectedNode();
        log('append-node', command, node.getText());
        addNode(node, km);
        function afterAppend() {
            editor.editText();
            km.off('layoutallfinish', afterAppend);
        }
        km.on('layoutallfinish', afterAppend);
    });
}

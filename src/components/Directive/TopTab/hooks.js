import {useEffect} from 'react';
import {isModelOne} from '../../../tool/modelType';
import memory from '../../../services/memory';

export function setNodeDisplayContext(minder) {
    const nodeDisplayMap = minder.extend.context.nodeDisplayMap;
    const options = Object.keys(nodeDisplayMap).map(c => ({value: c, label: nodeDisplayMap[c]}));
    const recover = array => options.map(option => ({
        ...option,
        selected: array.includes(option.value),
    }));
    const nodeDisplay = recover(memory.get('nodeDisplay') ?? []);
    minder.context.set('nodeDisplay', nodeDisplay);
}

export function setCaseTestContext(minder) {
    const subNodeDescMap = minder.extend.context.subNodeDescMap;
    const options = Object.keys(subNodeDescMap).map(c => ({value: c, label: subNodeDescMap[c]}));
    const recover = array => options.map(option => ({
        ...option,
        selected: array.includes(option.value),
    }));
    const subNodeDesc = recover(memory.get('subNodeDesc') ?? Object.keys(subNodeDescMap));
    minder.context.set('subNodeDesc', subNodeDesc);
}

export function setCommentContext(minder) {
    const flag = memory.get('commentFlag') || false;
    minder.context.set('commentFlag', flag);
}

export function setImageShapeAttribute(minder) {
    minder.context.set('imageAttributes', {'style': 'cursor: zoom-in'});
}

export function useMinderContext({minder}) {
    useEffect(
        () => {
            setCaseTestContext(minder);
            setCommentContext(minder);
            setImageShapeAttribute(minder);
            setNodeDisplayContext(minder);
        },
        [minder]
    );
}

const nodeRenderVisible = (key, minder, visible = true) => {
    minder.getRoot().traverse(node => {
        if (isModelOne(node)) {
            const oldValue = node.getData(`${key}OldValue`);
            const newValue = node.getData(key);

            node.setData(`${key}OldValue`, oldValue ?? newValue ?? null);
            if (visible) {
                node.setData(key, oldValue ?? newValue ?? null);
            } else {
                node.setData(key, null);
            }
        }
    });
};

export const useNodeDisplay = editor => {
    useEffect(
        () => {
            if (editor) {
                editor.minder.on('onchange-node-display', ({selected, minder}) => {
                    selected.forEach(item => {
                        nodeRenderVisible(item.value, minder, item.selected);
                    });

                    minder.refresh(100);
                });
            }
        },
        [editor]
    );
};

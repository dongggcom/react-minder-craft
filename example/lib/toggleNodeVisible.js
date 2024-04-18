/**
 * 用来隐藏和显示节点
 * 这里用了标识1属性演示
 */
import {findIndex, flow} from 'lodash';
import getContext from './getContext';

const {subNodeDescMap} = getContext();
const subNodeDescKeys = Object.keys(subNodeDescMap);

// 去除富文本字符，并将block默认替换成 \n，不能显示图片，超链接
function appendNewLineFlag(string) {
    const pattern = /<\/[div|p|li|ol]>/g;
    return string.replace(pattern, '\n');
}

function escapeImgHTMLTag(string) {
    const pattern = /<img([^>]+)>/g;
    return string.replace(pattern, '[img$1]');
}

function removeHTMLTag(string) {
    const pattern = /<[^>]+>/g;
    return string.replace(pattern, '');
}

function concatBreakLine(string) {
    const pattern = /\n{2,}/g;
    return string.replace(pattern, '\n');
}

function removeLastLineBreakLine(string) {
    return string.replace(/\n$/, '');
}

// 富文本梳理
const richTranslate2Text = flow(
    appendNewLineFlag,
    escapeImgHTMLTag,
    removeHTMLTag,
    concatBreakLine,
    removeLastLineBreakLine
);

// 是不是标识1节点
const isModelOne = node => node?.data.modelType === 'one';

// 删除节点
const removeChild = (minder, parent, index) => {
    if (!parent) {
        return;
    }
    minder.removeNode(parent.getChildren()[index]);
};

// 新增节点
function createNode(title, context, key, parent, minder) {
    const node = minder.createNode(richTranslate2Text(context), parent);
    node.setData('title', title);
    node.setData('key', key);
    node.render();
}

// 更新标识1属性（subNode）：通过节点上的字段，来移出或新增节点
const updateCaseSubNode = (minder, parent, selected) => {
    const children = parent.getChildren();
    const model = parent.getData('model');
    if (!isModelOne(parent) || !model || !model.labels) {
        return;
    }

    const selectedCheckbox = [];
    const unselectedCheckbox = [];
    selected.forEach(item => {
        if (item.selected) {
            selectedCheckbox.push(item);
        } else {
            unselectedCheckbox.push(item);
        }
    });

    // remove child because of not selected
    children.forEach((child, index) => {
        const key = child.getData('key');
        if (findIndex(unselectedCheckbox, {value: key}) !== -1) {
            removeChild(minder, parent, index);
        }
    });

    selectedCheckbox.forEach(({label, value: key}) => {
        const childIndex = findIndex(children, child => child.getData('key') === key);
        const labelIndex = findIndex(model.labels, {key});
        // children not have && label have
        if (childIndex === -1 && labelIndex !== -1 && subNodeDescKeys.includes(key)) {
            const content = model.labels[labelIndex].value;
            createNode(label, content, key, parent, minder);
        }
    });
};

export default function toggleNodeVisible(editor) {
    const km = editor.minder;
    // 隐藏节点与恢复节点
    km.on('onchange-one-model', e => {
        const minder = e.minder;
        const selected = minder.context.get('subNodeDesc', Object.keys(minder.extend.context.subNodeDescMap ?? {}));
        // log('onchange-one-model', selected);
        minder.getRoot().traverse(node => updateCaseSubNode(minder, node, selected));
        minder.refresh(100);
    });
}
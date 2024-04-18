/**
 * 加载数据
 */
import flow from 'lodash/flow';
import {useState, useEffect} from 'react';
import getContext from '../lib/getContext';
import fakeData from '../data';

// 遍历脑图节点
const traverseMinder = (data, callback) => {
    const children = data.children;
    if (children && children.length) {
        children.forEach((n, index) => (children[index] = traverseMinder(n, callback)));
    }
    if (callback) {
        data.data = callback(data.data, data);
    }
    return data;
};

// 对数据进行组装
const composeDataMakeup = (data, ...fn) => {
    if (!data.data || !fn || fn.length === 0) {
        return data;
    }
    data.data.isRoot = true;
    return traverseMinder(data, flow(fn));
};

// 计算有多少个节点
const countNode = data => {
    if (!data.data || !data.children || data.children.length === 0) {
        return 0;
    }
    let count = 0;
    traverseMinder(data, n => {
        count += 1;
        return n;
    });

    return count;
};


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

// 节点伪装：选中的节点回填的字段特殊处理
const makeupCaseTestBySelected = selected => (n, node) => {
    if (!n || n.modelType !== 'one' || !selected || !selected.length) {
        return n;
    }
    const children = (n.model?.labels || []).reduce((acc, l) => {
        if (l.key.startsWith('description')) {
            const key = l.key;
            if (selected.includes(key)) {
                acc.push({
                    data: {
                        title: getContext().subNodeDescMap[key],
                        key,
                        text: richTranslate2Text(l.value),
                    },
                });
            }
        }
        return acc;
    }, []);

    node.children = children;
    return n;
};

// 与 expand module 保持一致
const EXPAND_STATE_DATA = 'expandState';
const STATE_COLLAPSE = 'collapse';

// 节点伪装：针对特殊节点判断折叠
const makeupCollapse = n => {
    if (n.isRoot) {
        return n;
    }
    if (n.modelType === 'two') {
        return {
            ...n,
            [EXPAND_STATE_DATA]: STATE_COLLAPSE,
        };
    }
    return n;
};

// 节点伪装：针对特殊节点判断是否特殊展示，此处包含了优先级、测试类型、执行方式
const makeupCaseData = n => {

    return {
        ...n,
        detail: n.modelType === 'one',
    };
};

// 节点伪装：针对特殊节点判断是否特殊展示，此处包含了标签
const makeupResource = n => {
    const node = ({
        ...n,
        resource: (n.model?.labels || []).reduce((acc, l) => {
            // 自定义标签
            if (l.key === 'tag') {
                acc.push(l.value);
            }
            return acc;
        }, []),
    });
    return node;
};

export default function useLoadData() {
    const [data, setData] = useState({});

    useEffect(
        () => {
            const count = countNode(fakeData);
            const isBigCount = count > 200;
            // 模拟异步数据
            setTimeout(() => {
                setData({
                    'root': composeDataMakeup(fakeData,
                        makeupCaseTestBySelected(
                            Object.keys(getContext().subNodeDescMap)
                        ), isBigCount ? makeupCollapse : v => v, makeupCaseData, makeupResource
                    ),
                });
            }, 1000);
        },
        []
    );

    return [data];
}

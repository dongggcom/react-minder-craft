/**
 * 为脑图注入上下文
 * 这些上下文已经被提前定义到脑图中，在 KMEditor 中，通过 extend.context 获得
 */

const SUB_NODE_DESC_MAPPING = {
    'description1': '描述1',
    'description2': '描述2',
};

function getContext() {
    return {
        subNodeDescMap: SUB_NODE_DESC_MAPPING,
        nodeDisplayMap: {
            'resource': '标签',
            'priority': '优先级',
        },
    };
};

export default getContext;

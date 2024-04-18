/**
 * 异步展开子节点
 */

const fakeNodeDataIncludeRootNode = {
    'data': {
        'text': '异步加载后的根节点',
        'modelType': 'two',
        'model': {
            'id': 34436,
            'name': '异步加载后的根节点',
        },
        'childSize': 1,
        'hasChild': true,
        'progress': null,
        'priority': null,
        'note': null,
        'background': null,
    },
    'children': [
        {
            'data': {
                'text': '异步加载后的节点',
                'modelType': 'two',
                'status': 'fail',
                'childSize': 1,
                'model': {
                    'id': 34680,
                    'name': '异步加载后的节点',
                },
                'progress': null,
                'priority': null,
                'note': null,
                'hasChild': true,
                'background': null,
            },
            'children': [],
        },
    ],
};

const getNodeChildren = node => new Promise(resolve => {
    setTimeout(() => resolve(fakeNodeDataIncludeRootNode), 800);
});

function getAsyncGetNodesProps() {
    return {
        getNodeChildren
    };
}

export default getAsyncGetNodesProps;

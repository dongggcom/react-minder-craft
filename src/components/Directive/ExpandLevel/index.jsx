import React, {useCallback} from 'react';
import {Menu} from 'antd';
import {MenuUnfoldOutlined} from '@ant-design/icons';
import IconButton from '../../Standard/IconButton';
import {isModelTwo, isRootNode} from '../../../tool/modelType';

const levels = ['1', '2', '3', '4', '5'];

function isHasChildDataWithoutChildren(node) {
    return node.getData('hasChild') && !node.getChildren().length;
}

const ExpandLevel = ({editor}) => {
    const {minder} = editor;
    const {expandAll, expandLevel} = minder.extend;

    const expandToSuite = useCallback(
        () => {
            const nodes = minder.getAllNode();
            if (nodes.length) {
                nodes.forEach(node => {
                    if (isRootNode(node)) {
                        return;
                    }
                    if (isModelTwo(node)) {
                        node.collapse();
                    }
                    node.renderTree().getMinder().layout(100);
                });
            }
        },
        [minder]
    );

    const expandNode = useCallback(
        () => {
            minder.getSelectedNodes().forEach(node => {
                if (node && !node.isRoot()) {
                    if (isHasChildDataWithoutChildren(node)) {
                        node.expandAsyncImport();
                    } else if (node.isExpanded()) {
                        node.collapse();
                    } else {
                        node.expand();
                    }
                }
            });
        },
        [minder]
    );

    const onClick = useCallback(
        ({key}) => {
            if (key === 'toSuite') {
                expandToSuite();
            } else if (key === 'toAll' && expandAll) {
                expandAll();
            } else if (levels.includes(key) && expandLevel) {
                const node = minder.getSelectedNode();
                expandLevel(node, key);
            } else if (key === 'auto') {
                expandNode();
            }
        },
        [expandAll, expandLevel, expandNode, expandToSuite, minder]
    );

    return (
        <IconButton
            icon={<MenuUnfoldOutlined />}
            // 用作标识 给外部调提供 api
            className="expand"
            menu={
                <Menu onClick={onClick}>
                    <Menu.Item key={'auto'}>展开/收起</Menu.Item>
                    {levels.map(level => (
                        <Menu.Item key={level}>{`展开 ${level} 层`}</Menu.Item>
                    ))}
                </Menu>
            }
            text={'展开层级'}
        />
    );
};

export default ExpandLevel;

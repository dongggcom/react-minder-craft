import React, {useCallback, useState, useEffect} from 'react';
import {Menu} from 'antd';
import {EllipsisOutlined} from '@ant-design/icons';
import IconButton from '../../Standard/IconButton';
import {delay} from '../../../tool/afterMinderEventLifeCycle';

function MoreOperation({editor}) {
    const {extend: {removeNodeCondition = () => true}, minder} = editor;
    const [deleteDisabled, setDeleteDisabled] = useState(true);
    const [editDisabled, setEditDisabled] = useState(true);

    const editNodeHandler = () => {
        const receiverElement = editor.receiver.element;
        const fsm = editor.fsm;
        const receiver = editor.receiver;

        receiverElement.innerText = editor.minder.queryCommandValue('text');
        fsm.jump('input', 'input-request');
        receiver.selectAll();
    };

    const removeNodeHandler = useCallback(
        () => {
            if (removeNodeCondition(editor.minder.getSelectedNode(), editor)) {
                editor.minder.execCommand('RemoveNode');
            }
        },
        [editor, removeNodeCondition]
    );

    const resetLayoutHandler = useCallback(
        () => minder.execCommand('Resetlayout'),
        [minder]
    );

    useEffect(
        () => {
            minder.on('selectionchange', () => {
                delay(() => {
                    setDeleteDisabled(minder.queryCommandState('RemoveNode') === -1);
                    setEditDisabled(!minder.getSelectedNode());
                });
            });
        },
        [minder]
    );

    return (
        <IconButton
            text={'更多'}
            icon={<EllipsisOutlined />}
            // 用作标识 给外部调提供 api
            className="more-operation"
            menu={
                <Menu>
                    <Menu.Item
                        // 用作标识 给外部调提供 api
                        className="operation-group"
                        key={'edit'}
                        disabled={editDisabled}
                        onClick={editNodeHandler}
                    >编辑
                    </Menu.Item>
                    <Menu.Item
                        // 用作标识 给外部调提供 api
                        className="operation-group"
                        key={'remove'}
                        disabled={deleteDisabled}
                        onClick={removeNodeHandler}
                    >删除
                    </Menu.Item>
                    <Menu.Item
                        key={'layout'}
                        onClick={resetLayoutHandler}
                    >整理
                    </Menu.Item>
                </Menu>
            }
        />
    );
}

export default MoreOperation;

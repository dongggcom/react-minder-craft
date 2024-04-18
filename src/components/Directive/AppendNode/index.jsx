import React, {useCallback, useState, useEffect} from 'react';
import {SubnodeOutlined} from '@ant-design/icons';
import {Menu} from 'antd';
import IconButton from '../../Standard/IconButton';
import {delay} from '../../../tool/afterMinderEventLifeCycle';

const AppendNode = ({editor}) => {
    // let AppendLock = 0;
    const {minder, extend: {appendNodeCondition = () => true}} = editor;
    const [disabled, setDisable] = useState();
    const [siblingDisabled, setSiblingDisabled] = useState(false);
    const [childDisabled, setChildDisabled] = useState(false);
    const exec = useCallback(
        (command, args) => {
            if (appendNodeCondition(command.toLocaleLowerCase(), args, editor)) {
                editor.minder.execCommand(command, args);
                minder.fire('append-node', {command});
            }
        },
        [editor, minder, appendNodeCondition]
    );
    const appendChildModuleHandler = useCallback(
        () => exec('AppendChildNode', 'two'),
        [exec]
    );
    const appendChildCaseHandler = useCallback(
        () => exec('AppendChildNode', 'one'),
        [exec]
    );
    const appendSiblingModuleHandler = useCallback(
        () => exec('AppendSiblingNode', 'two'),
        [exec]
    );
    const appendSiblingCaseHandler = useCallback(
        () => exec('AppendSiblingNode', 'one'),
        [exec]
    );
    useEffect(
        () => {
            const {minder} = editor;

            // 进入编辑框时
            editor.fsm.when('normal - input', function handler() {
                setSiblingDisabled(true);
                setChildDisabled(true);
            });

            // 切换节点时
            minder.on('selectionchange', () => {
                delay(() => {
                    setSiblingDisabled(minder.queryCommandState('AppendSiblingNode') === -1);
                    setChildDisabled(minder.queryCommandState('AppendChildNode') === -1);
                    setDisable(
                        minder.queryCommandState('AppendChildNode') === -1
                        && minder.queryCommandState('AppendSiblingNode') === -1
                    );
                });
            });
        },
        [editor]
    );

    return (
        <IconButton
            icon={<SubnodeOutlined />}
            // 用作标识 给外部调提供 api
            className="append-group"
            disabled={disabled}
            menu={
                <Menu>
                    <Menu.Item
                        key="child-two"
                        onClick={appendChildModuleHandler}
                        disabled={childDisabled}
                    >子标识2
                    </Menu.Item>
                    <Menu.Item
                        key="child-one"
                        onClick={appendChildCaseHandler}
                        disabled={childDisabled}
                    >
                        子标识1
                    </Menu.Item>
                    <Menu.Item
                        key="sibling-two"
                        onClick={appendSiblingModuleHandler}
                        disabled={siblingDisabled}
                    >兄标识2
                    </Menu.Item>
                    <Menu.Item
                        key="sibling-one"
                        onClick={appendSiblingCaseHandler}
                        disabled={siblingDisabled}
                    >兄标识1
                    </Menu.Item>
                </Menu>
            }
            text={'插入节点'}
        />
    );
};

export default AppendNode;

import React, {useMemo, useEffect, useState, useCallback} from 'react';
import {Menu} from 'antd';
import findIndex from 'lodash/findIndex';
import {ClusterOutlined} from '@ant-design/icons';
import IconButton from '../../Standard/IconButton';
import {delay} from '../../../tool/afterMinderEventLifeCycle';

let AppendLock = 0;

function hasChecked(target, subNodeDesc) {
    const index = findIndex(subNodeDesc, ({value}) => value === target);
    return index !== -1;
}

const AppendCaseTestNode = ({editor}) => {
    const [disabled, setDisable] = useState();
    const [itemDisable, setItemDisable] = useState([false, false, false]);

    const subNodeDescMap = useMemo(
        () => editor.minder.extend.context.subNodeDescMap,
        [editor]
    );

    const menu = useMemo(
        () => Object.keys(subNodeDescMap),
        [subNodeDescMap]
    );

    const exec = useCallback(
        (command, args) => {
            AppendLock++;
            editor.minder.execCommand(command, args);
            function afterAppend() {
                if (!--AppendLock) {
                    editor.editText();
                }
                editor.minder.off('layoutallfinish', afterAppend);
            }
            editor.minder.on('layoutallfinish', afterAppend);
        },
        [editor]
    );

    const onClick = useCallback(
        ({key}) => {
            exec('AppendCaseTest', key);
        },
        [exec]
    );

    const getItemDisabled = useCallback(
        value => {
            const subNodeDesc = editor.minder.context.get('subNodeDesc', []).filter(({selected}) => selected);

            // 不可重复插入
            let duplicate = false;
            const node = editor.minder.getSelectedNode();
            const disabledFlag = node?.getData(`disabledAppendCaseTest.${value}`) ?? false;
            if (node) {
                node.getChildren().forEach(child => {
                    if (value === child.getData('key')) {
                        duplicate = true;
                    }
                });
            }
            return !hasChecked(value, subNodeDesc) || duplicate || disabledFlag;
        },
        [editor.minder]
    );

    useEffect(
        () => {
            const {minder} = editor;

            // 进入编辑框时
            editor.fsm.when('normal - input', function handler() {
                setDisable(true);
            });

            // 切换节点时
            minder.on('selectionchange', () => {
                delay(() => {
                    setDisable(minder.queryCommandState('AppendCaseTest') === -1);
                    setItemDisable(menu.map(item => getItemDisabled(item)));
                });
            });
        },
        [editor, getItemDisabled, menu]
    );

    return (
        <IconButton
            disabled={disabled}
            icon={<ClusterOutlined />}
            // 用作标识 给外部调提供 api
            className="append-one-test-group"
            menu={
                <Menu
                    onClick={onClick}
                    items={menu.map((key, index) => ({
                        key,
                        label: `插入${subNodeDescMap[key]}`,
                        disabled: itemDisable[index],
                    }))}
                />
            }
            text={'补充描述'}
        />
    );
};

export default AppendCaseTestNode;

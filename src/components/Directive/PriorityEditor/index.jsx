import React, {useCallback, useState, useEffect} from 'react';
import {Menu} from 'antd';
import {FlagOutlined} from '@ant-design/icons';
import IconButton from '../../Standard/IconButton';
import {delay} from '../../../tool/afterMinderEventLifeCycle';

const priority = Array.from({length: 5}, (_, i) => i);

const PriorityEditor = ({editor}) => {
    const [disabled, setDisabled] = useState(true);
    const {minder} = editor;

    const onClick = useCallback(
        ({key}) => {
            minder.execCommand('Priority', key === 0 ? '' : `P${key}`);
        },
        [minder]
    );

    useEffect(
        () => {
            minder.on('selectionchange', () => {
                delay(() => {
                    setDisabled(minder.queryCommandState('Priority') === -1);
                });
            });
        },
        [minder]
    );

    return (
        <IconButton
            disabled={disabled}
            text={'优先级'}
            // 用作标识 给外部调提供 api
            className="km-priority"
            icon={<FlagOutlined />}
            menu={
                <Menu onClick={onClick}>
                    {priority.map(cur => (
                        <Menu.Item key={cur}>
                            P{cur}
                        </Menu.Item>
                    ))}
                </Menu>
            }
        />
    );
};

export default PriorityEditor;

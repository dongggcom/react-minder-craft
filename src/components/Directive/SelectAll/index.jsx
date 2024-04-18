import React from 'react';
import {Menu} from 'antd';
import {GatewayOutlined} from '@ant-design/icons';
import IconButton from '../../Standard/IconButton';
import L from '../../../services/lang';
import {createSelectAction} from './utils';

const items = ['revert', 'siblings', 'level', 'path', 'tree'];

const SelectAll = ({editor, language}) => {
    const {ui} = L[language];
    const {minder} = editor;
    const select = action => createSelectAction(minder)[action];

    return (
        <IconButton
            icon={<GatewayOutlined />}
            menu={
                <Menu>
                    {items.map(item => (
                        <Menu.Item key={item} onClick={select(item)}>
                            {ui[`select${item}`]}
                        </Menu.Item>
                    ))}
                </Menu>
            }
            text={'快速选择'}
        />
    );
};

export default SelectAll;

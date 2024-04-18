import React, {useState, useCallback} from 'react';
import {Menu} from 'antd';
import memory from '../../../services/memory';

const templateList = Object.entries(window.kityminder.Minder.getTemplateList());

const MenuItem = ({editor: {minder}, onChange}) => {
    const [template, setTemplate] = useState(memory.get('template') ?? 'default');

    const selectTemplate = useCallback(
        key => {
            setTemplate(key);
            minder.execCommand('Template', key);
            onChange?.(key);
            memory.set('template', key);
        },
        [minder, onChange]
    );

    const onClick = useCallback(
        ({key}) => selectTemplate(key),
        [selectTemplate]
    );

    return (
        <Menu onClick={onClick}>
            {templateList.map(([key]) => (
                <Menu.Item
                    key={key}
                    className={template === key ? 'temp-item-selected' : ''}
                    title={key}
                >
                    <span className={`temp-item ${key}`} />
                </Menu.Item>
            ))}
        </Menu>
    );
};

export default MenuItem;

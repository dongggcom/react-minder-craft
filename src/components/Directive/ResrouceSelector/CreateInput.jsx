import React, {useState, useCallback} from 'react';
import {Divider, Space, Input, Typography} from 'antd';
import {PlusOutlined} from '@ant-design/icons';

function CreateInput({onSubmit}) {
    const [value, setValue] = useState('');

    const inputValue = useCallback(
        e => setValue(e.target.value),
        []
    );

    const onClick = useCallback(
        () => {
            onSubmit(value);
        },
        [onSubmit, value]
    );

    return (
        <>
            <Divider style={{margin: '8px 0'}} />
            <Space align="center" style={{padding: '0 8px 4px'}}>
                <Input size="small" placeholder="请输入标签" onBlur={inputValue} />
                <Typography.Link onClick={onClick} style={{whiteSpace: 'nowrap'}}>
                    <PlusOutlined /> 新增
                </Typography.Link>
            </Space>
        </>
    );
}

export default CreateInput;

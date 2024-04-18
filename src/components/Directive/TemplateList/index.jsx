import React from 'react';
import {PartitionOutlined} from '@ant-design/icons';
import IconButton from '../../Standard/IconButton';
import MenuItem from './MenuItem';

const TemplateList = ({editor}) => {
    return (
        <IconButton
            text={'结构'}
            // 用作标识 给外部调提供 api
            className="temp-panel"
            icon={<PartitionOutlined />}
            overlay={<MenuItem editor={editor} />}
        />
    );
};

export default TemplateList;

import React, {useState} from 'react';
import {CompressOutlined} from '@ant-design/icons';
import memory from '../../../services/memory';

const Compress = ({editor: {minder}}) => {
    const [isCompress, setIsCompress] = useState((memory.get('theme') || '').includes('compat'));

    const toggleCompress = () => {
        const currentCompress = !isCompress;
        const theme = minder.getTheme();
        const newTheme = theme.includes('compat') ? theme.replace('-compat', '') : `${theme}-compat`;
        setIsCompress(currentCompress);
        memory.set('theme', newTheme);
        minder.execCommand('Theme', newTheme);
    };

    return (
        <div
            onClick={toggleCompress}
            className={`nav-btn ${isCompress ? 'active' : ''}`}
            title={'紧凑'}
        >
            <CompressOutlined />
        </div>
    );
};

export default Compress;

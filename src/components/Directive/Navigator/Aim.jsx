import React from 'react';
import {AimOutlined} from '@ant-design/icons';
import L from '../../../services/lang';

const Aim = ({editor: {minder}, language}) => {
    const camera = () => minder.execCommand('camera', minder.getRoot(), 600);
    const {ui} = L[language];
    return (
        <div onClick={camera} className="nav-btn camera" title={ui.camera}>
            <AimOutlined />
        </div>
    );
};

export default Aim;

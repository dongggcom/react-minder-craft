import React, {useState} from 'react';
import {FullscreenExitOutlined, FullscreenOutlined} from '@ant-design/icons';

const Fullscreen = () => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
        const container = document.querySelector('#react-minder-craft');
        if (isFullscreen) {
            container.style.position = '';
            container.style.zIndex = 0;
        } else {
            container.style.position = 'fixed';
            container.style.zIndex = 1000;
        }
    };
    return (
        <div
            onClick={toggleFullscreen}
            className={`nav-btn ${isFullscreen ? 'active' : ''}`}
            title={isFullscreen ? '退出全屏' : '全屏'}
        >
            {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
        </div>
    );
};

export default Fullscreen;

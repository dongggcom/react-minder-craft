import React from 'react';
import {BuildOutlined} from '@ant-design/icons';
import L from '../../../services/lang';

// TODO: 待删除
const Layout = ({editor, language}) => {
    const {ui} = L[language];
    const {minder} = editor;
    const resetLayout = () => minder.execCommand('Resetlayout');
    return (
        <div className="btn-group-vertical readjust-layout">
            <div className="btn-wrap" onClick={resetLayout}>
                {/* <span className="btn-icon reset-layout-icon"></span> */}
                <BuildOutlined style={{fontSize: 20, color: '#666', height: 28}} className="btn-icon" />
                <span className="btn-label">{ui.command.resetlayout}</span>
            </div>
        </div>
    );
};

export default Layout;

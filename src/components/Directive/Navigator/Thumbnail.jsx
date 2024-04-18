import React, {useState} from 'react';
import {EyeOutlined} from '@ant-design/icons';
import memory from '../../../services/memory';
import L from '../../../services/lang';

const Thumbnail = ({language, onChange}) => {
    const {ui} = L[language];
    const [hidden, setHidden] = useState(memory.get('navigator-hidden') ?? true);
    const toggleNavOpen = () => {
        const currentHidden = !hidden;
        setHidden(currentHidden);
        onChange(currentHidden);
        memory.set('navigator-hidden', currentHidden);
        // if (isNavOpen) {
        //     bind();
        //     updateContentView();
        //     updateVisibleView();
        // } else {
        //     unbind();
        // }
    };

    return (
        <div
            onClick={toggleNavOpen}
            className={`nav-btn nav-trigger ${hidden ? '' : 'active'}`}
            title={ui.navigator}
        >
            <EyeOutlined />
        </div>
    );
};

export default Thumbnail;

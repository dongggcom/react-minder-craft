import React, {useState, useCallback} from 'react';
import {DragOutlined} from '@ant-design/icons';
import L from '../../../services/lang';

const DragHandle = ({editor: {minder}, language}) => {
    const {ui} = L[language];
    const [isOnHand, setIsOnHand] = useState(false);
    const hand = useCallback(() => {
        setIsOnHand(!isOnHand);
        minder.execCommand('hand');
    }, [isOnHand, minder]
    );
    return (
        <div
            onClick={hand}
            className={`nav-btn hand ${isOnHand ? 'active' : ''}`}
            title={ui.hand}
        >
            <DragOutlined />
        </div>
    );
};

export default DragHandle;

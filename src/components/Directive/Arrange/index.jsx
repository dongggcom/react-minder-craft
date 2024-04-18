import React from 'react';
import L from '../../../services/lang';

const Arrange = ({editor, language}) => {
    const {ui} = L[language];

    const arrangeUpHandler = () => editor.minder.execCommand('ArrangeUp');
    const arrangeDownHandler = () => editor.minder.execCommand('ArrangeDown');

    return (
        <div className="km-btn-group arrange-group">
            <div
                className="km-btn-item arrange-up"
                title={ui.command.arrangeup}
                onClick={arrangeUpHandler}
            >
                <i className="km-btn-icon"></i>
                <span className="km-btn-caption">{ui.command.arrangeup}</span>
            </div>
            <div
                className="km-btn-item arrange-down"
                title={ui.command.arrangedown}
                onClick={arrangeDownHandler}
            >
                <i className="km-btn-icon"></i>
                <span className="km-btn-caption">{ui.command.arrangedown}</span>
            </div>
        </div>
    );
};

export default Arrange;

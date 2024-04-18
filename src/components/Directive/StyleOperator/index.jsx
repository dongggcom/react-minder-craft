import React from 'react';
import L from '../../../services/lang';


const StyleOperator = ({editor: {minder}, language}) => {
    const {ui} = L[language];
    const clearStyle = () => minder.execCommand('ClearStyle');
    const copyStyle = () => minder.execCommand('CopyStyle');
    const pasteStyle = () => minder.execCommand('PasteStyle');
    return (
        <div className="style-operator">
            <a className="btn-wrap clear-style" onClick={clearStyle}>
                <span className="btn-icon clear-style-icon"></span>
                <span className="btn-label">{ui.clearstyle}</span>
            </a>
            <div className="s-btn-group-vertical">
                <a className="s-btn-wrap" onClick={copyStyle}>
                    <span className="s-btn-icon copy-style-icon"></span>
                    <span className="s-btn-label">{ui.copystyle}</span>
                </a>

                <a className="s-btn-wrap paste-style-wrap" onClick={pasteStyle}>
                    <span className="s-btn-icon paste-style-icon"></span>
                    <span className="s-btn-label">{ui.pastestyle}</span>
                </a>
            </div>
        </div>
    );
};

export default StyleOperator;

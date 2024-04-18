import React from 'react';
import L from '../../../services/lang';


const UndoRedo = ({editor, language}) => {
    const {ui} = L[language];

    const undoHandler = () => editor.history.undo();
    const redoHandler = () => editor.history.redo();

    return (
        <div className="km-btn-group do-group">
            <div
                className="km-btn-item undo"
                title={ui.undo}
                onClick={undoHandler}
            >
                <i className="km-btn-icon"></i>
            </div>
            <div
                className="km-btn-item redo"
                title={ui.redo}
                onClick={redoHandler}
            >
                <i className="km-btn-icon"></i>
            </div>
        </div>
    );
};

export default UndoRedo;

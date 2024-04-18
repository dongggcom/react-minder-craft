import React, {useCallback, useState, useEffect} from 'react';
import L from '../../../services/lang';
import {delay} from '../../../tool/afterMinderEventLifeCycle';

// TODO: 待删除
const Operation = ({editor, language}) => {
    const {ui} = L[language];
    const {extend: {removeNodeCondition = () => true}, minder} = editor;
    const [deleteDisabled, setDeleteDisabled] = useState(true);
    const [editDisabled, setEditDisabled] = useState(true);
    const editNodeHandler = () => {
        const receiverElement = editor.receiver.element;
        const fsm = editor.fsm;
        const receiver = editor.receiver;

        receiverElement.innerText = editor.minder.queryCommandValue('text');
        fsm.jump('input', 'input-request');
        receiver.selectAll();
    };
    const removeNodeHandler = useCallback(() => {
        if (removeNodeCondition(editor.minder.getSelectedNode(), editor)) {
            editor.minder.execCommand('RemoveNode');
        }
    }, [editor, removeNodeCondition]
    );
    useEffect(() => {
        minder.on('selectionchange', () => {
            delay(() => {
                setDeleteDisabled(minder.queryCommandState('RemoveNode') === -1);
                setEditDisabled(!minder.getSelectedNode());
            });
        });
    }, [minder]
    );
    return (
        <div className="km-btn-group operation-group">
            <div
                className="km-btn-item edit-node"
                title={ui.command.editnode}
                onClick={editNodeHandler}
                disabled={editDisabled}
            >
                <i className="km-btn-icon"></i>
                <span className="km-btn-caption">{ui.command.editnode}</span>
            </div>
            <div
                className="km-btn-item remove-node"
                title={ui.command.removenode}
                onClick={removeNodeHandler}
                disabled={deleteDisabled}
            >
                <i className="km-btn-icon"></i>
                <span className="km-btn-caption">{ui.command.removenode}</span>
            </div>
        </div>
    );
};

export default Operation;

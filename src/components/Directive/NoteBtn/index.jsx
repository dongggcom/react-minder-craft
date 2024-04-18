import React, {useState, useEffect} from 'react';
import {Menu, Dropdown} from 'antd';
import NoteEditor from '../NoteEditor';
import L from '../../../services/lang';

const NoteBtn = ({editor, language}) => {
    const [visible, toggleVisible] = useState(false);
    const [content, setContent] = useState('');
    const {ui} = L[language];
    const {minder} = editor;

    const showAddNote = () => toggleVisible(true);
    const hiddenAddNote = () => toggleVisible(false);
    const onSubmit = value => minder.execCommand('Note', value);
    const removeHandler = () => minder.execCommand('Note', null);
    const onClose = values => {
        onSubmit(values);
        hiddenAddNote();
    };

    useEffect(
        () => {
            minder.on('interactchange', () => {
                const enabled = minder.queryCommandState('note') !== -1;
                const noteValue = minder.queryCommandValue('note') || '';
                if (enabled) {
                    setContent(noteValue);
                }
            });
        }, [minder]
    );

    return (
        <div className="btn-group-vertical note-btn-group">
            <button
                type="button"
                className="btn btn-default note-btn"
                title={ui.note}
                onClick={showAddNote}
            >
            </button>
            <Dropdown
                trigger={['click']}
                overlay={
                    <Menu>
                        <Menu.Item key="insertlink" onClick={showAddNote}>
                            {ui.insertnote}
                        </Menu.Item>
                        <Menu.Item key="removelink" onClick={removeHandler}>
                            {ui.removenote}
                        </Menu.Item>
                    </Menu>
                }
            >
                <button
                    type="button"
                    className="btn btn-default note-btn-caption dropdown-toggle"
                    title={ui.note}
                >
                    <span className="caption">{ui.note}</span>
                    <span className="caret"></span>
                    <span className="sr-only">{ui.note}</span>
                </button>
            </Dropdown>
            {visible && (
                <NoteEditor
                    minder={minder}
                    visible={visible}
                    onClose={onClose}
                    content={content}
                />
            )}
        </div>
    );
};

export default NoteBtn;

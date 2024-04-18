import React, {useState, useEffect, useRef} from 'react';
import {Drawer} from 'antd';
import codemirror from 'codemirror/lib/codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/addon/mode/overlay';
import 'codemirror/mode/gfm/gfm';

const NoteEditor = ({minder, visible, onClose, content}) => {
    const [cmEditor, setCMEditor] = useState(null);
    const cmEditorRef = useRef(null);

    useEffect(
        () => {
            if (visible && cmEditorRef?.current && cmEditor === null) {
                const cme = codemirror(cmEditorRef.current, {
                    // value: content,
                    gfm: true,
                    breaks: true,
                    lineWrapping: true,
                    mode: 'gfm',
                    dragDrop: false,
                    lineNumbers: true,
                });
                cme.setSize('100%', '100%');
                setCMEditor(cme);
            }
            if (visible === true && cmEditor) {
                cmEditor.getDoc().setValue(content);
                cmEditor.refresh();
                cmEditor.focus();
            }
        }, [visible, cmEditor, minder, content]
    );

    const reset = () => {
        onClose(cmEditor.getValue());
        cmEditor.refresh();
        cmEditor.clearHistory();
    };
    return (
        <Drawer
            placement="right"
            onClose={reset}
            visible={visible}
            width={400}
            bodyStyle={{padding: 0}}
            title={
                <div>
                    <span className="panel-title">备注</span>
                    <a
                        className="help"
                        href="https://www.zybuluo.com/techird/note/46064"
                        target="_blank"
                        rel="noreferrer"
                    >
                        支持 GFM 语法书写
                    </a>
                </div>
            }
        >
            <div ref={cmEditorRef} style={{width: '100%', height: '100%'}} />
        </Drawer>
    );
};

export default NoteEditor;

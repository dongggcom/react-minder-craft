import React, {useEffect, useState, useRef, useCallback, memo, useImperativeHandle} from 'react';
import {Spin} from 'antd';
import 'kity';
import 'kityminder-core';
import {useApp} from './hooks';
import TopTab from './components/Directive/TopTab';
import Navigator from './components/Directive/Navigator';
import Editor from './editor';
import memory from './services/memory';
import bindEventProxy from './tool/bindEventProxy';

const MemoedTopTab = memo(TopTab);
const LANGUAGE = 'zh-cn';

function getDefaultTheme() {
    const themeList = Object.keys(window.kityminder.Minder.getThemeList());
    if (themeList.includes(memory.get('theme'))) {
        return memory.get('theme');
    }
    return 'newfashion';
}

function getDefaultTemplate() {
    const templateList = Object.keys(window.kityminder.Minder.getTemplateList());
    if (templateList.includes(memory.get('template'))) {
        return memory.get('template');
    }
    return 'spider';
}

const App = (props, ref) => {
    const {
        customArea,
        beforePositionCustomArea,
        rightCustomArea,
        beforeRightPositionCustomArea,
        dataSource = {},
        context = {},
        style,
        className,
        loading,
        defaultUsed,
    } = props;

    const [editor, setEditor] = useState(null);
    const container = useRef(null);
    const top = useRef(null);
    const {
        globalContext,
        topTabProps,
        methods,
    } = useApp({
        props,
        context,
        defaultUsed,
        customArea,
        beforePositionCustomArea,
        rightCustomArea,
        beforeRightPositionCustomArea,
    });

    const [collapse, setCollapse] = useState(memory.get('minder-panel-collapse') ?? false);

    const toggleCollapse = useCallback(
        () => {
            setCollapse(!collapse);
            memory.set('minder-panel-collapse', !collapse);
        },
        [collapse]
    );

    useEffect(
        () => {
            if (container.current) {
                const editor = new Editor(container.current, {...methods, context: globalContext});
                setEditor(editor);
            }
        },
        // 会导致多次设置 editor
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );
    useEffect(
        () => {
            if (top.current) {
                const fsm = bindEventProxy(top.current);
                editor.panelFsm = fsm;
                setEditor(editor);
            }
        },
        [editor]
    );
    // just execution once on initial
    useEffect(() => {
        if (editor && dataSource.root) {
            editor.minder.importJson(dataSource);
        }
        if (editor) {
            editor.minder.useTheme(getDefaultTheme());
            editor.minder.useTemplate(getDefaultTemplate());
        }
    }, [dataSource, editor]
    );

    useImperativeHandle(ref, () => ({
        updateEditor: editor => setEditor(editor),
        getEditor: () => editor,
    }));

    return (
        <div id="react-minder-craft" style={style} className={className}>
            <Spin
                tip="Loading..."
                spinning={loading === undefined ? !dataSource.root : loading}
            >
                {editor && (
                    <React.Fragment>
                        <MemoedTopTab
                            editor={editor}
                            language={LANGUAGE}
                            {...topTabProps}
                            ref={top}
                            collapse={collapse}
                            toggleCollapse={toggleCollapse}
                        />
                        <Navigator editor={editor} language={LANGUAGE} />
                    </React.Fragment>
                )}
                <div className="minder-editor-container" style={{top: collapse ? 0 : 70}}>
                    <div className="minder-editor " ref={container} />
                </div>
            </Spin>
        </div>
    );
};

export default React.forwardRef(App);

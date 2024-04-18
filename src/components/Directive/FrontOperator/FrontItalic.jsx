import React, {useState, useEffect} from 'react';

const FrontItalic = ({editor}) => {
    const [fontItalic, setFontItalic] = useState(false);
    const {minder} = editor;

    const fontItalicHandler = () => {
        minder.execCommand('italic');
        setFontItalic(true);
    };
    useEffect(
        () => {
            minder.on('interactchange', () => {
                const fi = minder.queryCommandValue('italic');
                setFontItalic(fi);
            });
        }, [minder]
    );
    return (
        <span
            onClick={fontItalicHandler}
            className={`s-btn-icon font-italics ${
                fontItalic ? 'font-italics-selected' : ''
            }`}
        />
    );
};

export default FrontItalic;

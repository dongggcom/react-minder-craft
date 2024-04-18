import React, {useState, useEffect} from 'react';

const FrontBold = ({editor}) => {
    const [fontBold, setFontBold] = useState(false);
    const {minder} = editor;
    const fontBoldHandler = () => {
        minder.execCommand('bold');
        setFontBold(true);
    };

    useEffect(
        () => {
            minder.on('interactchange', () => {
                const fb = minder.queryCommandValue('bold');
                setFontBold(fb);
            });
        }, [minder]
    );
    return (
        <span
            onClick={fontBoldHandler}
            className={`s-btn-icon font-bold ${fontBold ? 'font-bold-selected' : ''}`}
        />
    );
};

export default FrontBold;

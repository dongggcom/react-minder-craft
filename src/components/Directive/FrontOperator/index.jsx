import React from 'react';
import ColorPanel from '../ColorPanel';
import FrontFamily from './FrontFamily';
import FrontSize from './FrontSize';
import FrontBold from './FrontBold';
import FrontItalic from './FrontItalic';
import FrontColor from './FrontColor';

const FrontOperator = ({editor, language}) => {
    const commonProps = {editor, language};

    return (
        <div className="font-operator">
            <FrontFamily {...commonProps} />
            <FrontSize {...commonProps} />
            <FrontBold editor={editor} />
            <FrontItalic editor={editor} />
            <FrontColor editor={editor} />
            <ColorPanel editor={editor} />
        </div>
    );
};

export default FrontOperator;

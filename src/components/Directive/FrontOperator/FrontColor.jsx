import React, {useEffect, useState, useCallback} from 'react';
import {SketchPicker} from 'react-color';
import hideByClickAnyWhere from '../../../tool/hideByClickAnyWhere';

const FrontColor = ({editor}) => {
    const {minder} = editor;
    const [visible, setVisible] = useState(false);
    const [color, setColor] = useState({});

    const showPicker = () => setVisible(true);
    const hidePicker = () => setVisible(false);
    const setMinderColor = useCallback(foreColor =>
        minder.execCommand('forecolor', foreColor), [minder]
    );
    const onClick = useCallback(
        () => setMinderColor(color.hex),
        [setMinderColor, color.hex]
    );
    const changeColor = pickColor => {
        setColor(pickColor);
        setMinderColor(pickColor.hex);
    };
    const stopPropagation = e => e.stopPropagation();
    useEffect(
        () => {
            hideByClickAnyWhere(visible, hidePicker);
        }, [visible]
    );

    return (
        <React.Fragment>
            <div className="font-color-wrap">
                <span
                    className="quick-font-color"
                    onClick={onClick}
                >
                    A
                </span>
                <span className="font-color" onClick={showPicker}>
                    <span className="caret"></span>
                </span>
                <span
                    className="font-color-preview"
                    style={{backgroundColor: color.hex}}
                >
                </span>
            </div>
            {visible && (
                <div onClick={stopPropagation} className="color-picker-wrap">
                    <SketchPicker color={color} onChange={changeColor} />
                </div>
            )}
        </React.Fragment>
    );
};

export default FrontColor;

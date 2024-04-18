import React, {useEffect, useState, useCallback} from 'react';
import {SketchPicker} from 'react-color';
import hideByClickAnyWhere from '../../../tool/hideByClickAnyWhere';

const ColorPanel = ({editor}) => {
    const {minder} = editor;
    const [visible, setVisible] = useState(false);
    const [color, setColor] = useState({});

    const showPicker = useCallback(
        () => setVisible(true),
        []
    );
    const hidePicker = useCallback(
        () => setVisible(false),
        []
    );
    const setMinderColor = useCallback(
        bgColor => minder.execCommand('background', bgColor),
        [minder]
    );
    const changeColor = useCallback(pickColor => {
        setColor(pickColor);
        setMinderColor(pickColor.hex);
    }, [setMinderColor]
    );
    const onClick = useCallback(
        () => setMinderColor(color.hex),
        [color.hex, setMinderColor]
    );
    const stopPropagation = e => e.stopPropagation();
    useEffect(
        () => {
            hideByClickAnyWhere(visible, hidePicker);
        }, [visible, hidePicker]
    );
    return (
        <React.Fragment>
            <div className="bg-color-wrap">
                <span className="quick-bg-color" onClick={onClick}></span>
                <span className="bg-color" onClick={showPicker}>
                    <span className="caret"></span>
                </span>
                <span className="bg-color-preview" style={{backgroundColor: color.hex}}></span>
            </div>
            {visible && (
                <div onClick={stopPropagation} className="color-picker-wrap">
                    <SketchPicker color={color} onChange={changeColor} />
                </div>
            )}
        </React.Fragment>
    );
};

export default ColorPanel;

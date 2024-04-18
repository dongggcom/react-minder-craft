import React, {useState, useEffect, useCallback} from 'react';
import {Menu, Dropdown} from 'antd';
import L from '../../../services/lang';


const fontSizeList = [10, 12, 16, 18, 24, 32, 48];

const FrontSize = ({editor, language}) => {
    const [fontSize, setFontSize] = useState();
    const {minder} = editor;
    const {ui} = L[language];
    const selectFontSize = useCallback(val => {
        minder.execCommand('FontSize', val);
        setFontSize(val);
    }, [minder]
    );
    const onClick = useCallback(
        ({key}) => selectFontSize(key),
        [selectFontSize]
    );
    useEffect(
        () => {
            minder.on('interactchange', () => {
                const f = minder.queryCommandValue('fontsize');
                setFontSize(f);
            });
        }, [minder]
    );
    return (
        <div className="dropdown font-size-list">
            <Dropdown
                trigger={['click']}
                overlay={
                    <Menu onClick={onClick}>
                        {fontSizeList.map(f => (
                            <Menu.Item key={f}>
                                <a
                                    className={`font-item ${fontSize === f ? 'font-item-selected' : ''}`}
                                    style={{fontSize: `${f}px`}}
                                >
                                    {f}
                                </a>
                            </Menu.Item>
                        ))}
                    </Menu>
                }
            >
                <div className="dropdown-toggle current-font-item">
                    <a
                        className="current-font-size"
                        title={ui.fontsize}
                    >
                        {fontSize || '字号'}
                    </a>
                    <span className="caret"></span>
                </div>
            </Dropdown>
        </div>
    );
};

export default FrontSize;

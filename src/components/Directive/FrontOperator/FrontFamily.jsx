import React, {useState, useEffect, useCallback} from 'react';
import {Menu, Dropdown} from 'antd';
import find from 'lodash/find';
import L from '../../../services/lang';
import fontFamilyList from './front';


const getFontfamilyName = val => find(fontFamilyList, ele => ele.val === val)?.name || '';

const FrontFamily = ({editor, language}) => {
    const [fontFamily, setFontFamily] = useState();
    const {minder} = editor;
    const {ui} = L[language];
    const selectFontFamily = useCallback(val => {
        minder.execCommand('FontFamily', val);
        setFontFamily(val);
    }, [minder]
    );
    const onClick = useCallback(
        ({key}) => selectFontFamily(key),
        [selectFontFamily]
    );
    useEffect(
        () => {
            minder.on('interactchange', () => {
                const f = minder.queryCommandValue('fontfamily');
                setFontFamily(f)();
            });
        }, [minder]
    );
    return (
        <div className="dropdown font-family-list">
            <Dropdown
                trigger={['click']}
                overlay={
                    <Menu onClick={onClick}>
                        {fontFamilyList.map(f => (
                            <Menu.Item key={f.val}>
                                <a
                                    className={`font-item ${fontFamily === f.val ? 'font-item-selected' : ''}`}
                                    style={{fontFamily: f.val}}
                                >
                                    {f.name}
                                </a>
                            </Menu.Item>
                        ))}
                    </Menu>
                }
            >
                <div className="dropdown-toggle current-font-item">
                    <a
                        className="current-font-family"
                        title={ui.fontfamily}
                    >
                        {getFontfamilyName(fontFamily) || '字体'}
                    </a>
                    <span className="caret"></span>
                </div>
            </Dropdown>
        </div>
    );
};

export default FrontFamily;

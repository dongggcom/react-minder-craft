import React, {useState, useCallback} from 'react';
import {Menu, Dropdown} from 'antd';
import L from '../../../services/lang';
import {getThemeThumbStyle, themeKeyList} from './utils';

const ThemeList = ({editor, language}) => {
    const [theme, setTheme] = useState('fresh-blue');
    const {theme: ui} = L[language];
    const {minder} = editor;
    const selectTheme = useCallback(key => {
        minder.execCommand('Theme', key);
        setTheme(key);
    }, [minder]
    );
    const onClick = useCallback(
        ({key}) => selectTheme(key),
        [selectTheme]
    );

    return (
        <div className="dropdown theme-panel">
            <Dropdown
                trigger={['click']}
                overlay={
                    <Menu style={{width: 188}} onClick={onClick}>
                        {themeKeyList.map(key => (
                            <Menu.Item
                                key={key}
                                style={{width: 94, height: 40, display: 'inline-block'}}
                            >
                                <a
                                    className={`theme-item ${key}`}
                                    style={getThemeThumbStyle(key)}
                                    title={ui[key]}
                                >
                                    {ui[key]}
                                </a>
                            </Menu.Item>
                        ))}
                    </Menu>
                }
            >
                <div className="dropdown-toggle theme-item-selected">
                    <a
                        className="theme-item"
                        style={getThemeThumbStyle(theme)}
                        title={ui[theme]}
                    >
                        {ui[theme]}
                    </a>
                    <span className="caret"></span>
                </div>
            </Dropdown>
        </div>
    );
};

export default ThemeList;

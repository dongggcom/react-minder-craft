import React from 'react';
import {Dropdown} from 'antd';
import {CaretDownOutlined} from '@ant-design/icons';

function IconButton(props) {
    const {icon, menu, text, disabled, className, ...restProps} = props;

    return (
        <div style={{display: 'inline-block'}} className={className}>
            <div className="km-icon-btn" disabled={disabled}>
                <div className="icon">
                    {icon}
                </div>
                <div className="btn">
                    <Dropdown
                        trigger={['click']}
                        overlay={menu}
                        {...restProps}
                    >
                        <a style={{color: 'inherit'}}>
                            {text}
                            <CaretDownOutlined />
                        </a>
                    </Dropdown>
                </div>
            </div>
        </div>
    );
}

function Selected({text, style}) {
    return (
        <div className="selected" style={style}>
            {text}
        </div>
    );
}

IconButton.Selected = Selected;

export default IconButton;

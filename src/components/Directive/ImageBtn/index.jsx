import React, {useState} from 'react';
import {Menu, Dropdown} from 'antd';
import ImageModal from '../../Dialog/Image';
import L from '../../../services/lang';

const ImageBtn = ({editor, language}) => {
    const [visible, toggleVisible] = useState(false);
    const {ui} = L[language];
    const {minder} = editor;

    const showAddImage = () => toggleVisible(true);
    const hiddenAddImage = () => toggleVisible(false);
    const onSubmit = value =>
        minder.execCommand('Image', value.url, value.title);
    const removeHandler = () => minder.execCommand('Image', '');

    return (
        <div className="btn-group-vertical">
            <button
                type="button"
                onClick={showAddImage}
                className="btn btn-default image-btn"
                title={ui.image}
            >
            </button>
            <Dropdown
                trigger={['click']}
                overlay={
                    <Menu>
                        <Menu.Item key="insertlink" onClick={showAddImage}>
                            {ui.insertimage}
                        </Menu.Item>
                        <Menu.Item key="removelink" onClick={removeHandler}>
                            {ui.removeimage}
                        </Menu.Item>
                    </Menu>
                }
            >
                <button
                    type="button"
                    className="btn btn-default image-btn-caption dropdown-toggle"
                    title={ui.image}
                >
                    <span className="caption">{ui.image}</span>
                    <span className="caret"></span>
                    <span className="sr-only">{ui.image}</span>
                </button>
            </Dropdown>
            <ImageModal
                visible={visible}
                onCancel={hiddenAddImage}
                onSubmit={onSubmit}
            />
        </div>
    );
};

export default ImageBtn;

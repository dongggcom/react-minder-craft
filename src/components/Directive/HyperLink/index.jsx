import React, {useState} from 'react';
import {Menu, Dropdown} from 'antd';
import HyperLinkDialog from '../../Dialog/HyperLink';
import L from '../../../services/lang';

const HyperLink = ({editor, language}) => {
    const [visible, toggleVisible] = useState(false);
    const {ui} = L[language];
    const {minder} = editor;

    const showAddHyperLink = () => toggleVisible(true);
    const hiddenAddHyperLink = () => toggleVisible(false);
    const onSubmit = value => minder.execCommand('HyperLink', value.url, value.title);
    const removeHandler = () => minder.execCommand('HyperLink', null);
    return (
        <div className="btn-group-vertical">
            <button
                type="button"
                className="btn btn-default hyperlink"
                title={ui.link}
                onClick={showAddHyperLink}
            >
            </button>
            <Dropdown
                trigger={['click']}
                overlay={
                    <Menu>
                        <Menu.Item key="insertlink" onClick={showAddHyperLink}>{ui.insertlink}</Menu.Item>
                        <Menu.Item key="removelink" onClick={removeHandler}>{ui.removelink}</Menu.Item>
                    </Menu>
                }
            >
                <button
                    type="button"
                    className="btn btn-default hyperlink-caption dropdown-toggle"
                    title={ui.link}
                >
                    <span className="caption">{ui.link}</span>
                    <span className="caret"></span>
                    <span className="sr-only">{ui.link}</span>
                </button>
            </Dropdown>
            <HyperLinkDialog visible={visible} onCancel={hiddenAddHyperLink} onSubmit={onSubmit} />
        </div>
    );
};

export default HyperLink;

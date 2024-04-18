import React, {useState, useCallback, useEffect} from 'react';
import {delay} from '../../../tool/afterMinderEventLifeCycle';
import ResourceNameInput from './ResourceNameInput';

const ResourceAdd = ({editor, used, setUsed, updateMinderResource}) => {
    const {minder} = editor;
    const [disabled, setDisabled] = useState(true);
    const [curResourceName, setCurResourceName] = useState('');
    const inputValue = useCallback(
        e => setCurResourceName(e.target.value),
        []
    );

    // 增加标签
    const addResource = useCallback(
        () => {
            const name = curResourceName;
            const origin = minder.queryCommandValue('resource');
            if (!name || !/\S/.test(name)) {
                return;
            }
            if (origin.indexOf(name) === -1) {
                used.push({
                    name,
                    selected: true,
                });
                setUsed(used);
                updateMinderResource();
                minder.fire('add-resource', {value: curResourceName});
            }
            setCurResourceName('');
        },
        [curResourceName, minder, setUsed, updateMinderResource, used]
    );

    useEffect(
        () => {
            minder.on('selectionchange', () => {
                delay(() => {
                    setDisabled(minder.queryCommandState('resource') === -1);
                });
            });
        },
        [minder]
    );

    return (
        <div className="input-group">
            <ResourceNameInput value={curResourceName} onChange={inputValue} disabled={disabled} />
            <span className="input-group-btn">
                <button className="btn btn-default" onClick={addResource} disabled={disabled}>
                    添加
                </button>
            </span>
        </div>
    );
};

export default ResourceAdd;

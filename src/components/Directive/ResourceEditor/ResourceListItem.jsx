import React, {useState, useEffect} from 'react';
import Checkbox from 'rc-checkbox/lib';
import {delay} from '../../../tool/afterMinderEventLifeCycle';

function ResourceListItem({minder, resource, resourceColor, selectResource}) {
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        minder.on('selectionchange', () => {
            delay(() => {
                setDisabled(minder.queryCommandState('Resource') === -1);
            });
        });
        // FIXME: 必须在后端同步完之后才允许
        // 增加一个监听者去完成
        // editor.listen('resource-directive')
        // editor.trigger('resource-directive')
    }, [minder]
    );
    return (
        <li
            style={{display: resource.hidden === true ? 'none' : undefined}}
        >
            <label style={{backgroundColor: resourceColor(resource.name)}}>
                <Checkbox
                    style={{marginRight: 3}}
                    checked={resource.selected}
                    onClick={selectResource(resource)}
                    disabled={disabled}
                />
                <span style={{position: 'relative', top: '-2px'}}>{resource.name}</span>
            </label>
        </li>
    );
}

export default ResourceListItem;

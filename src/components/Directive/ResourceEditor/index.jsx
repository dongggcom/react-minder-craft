import React, {useState, useEffect} from 'react';
import ResourceAdd from './ResourceAdd';
import ResourceList from './ResourceList';

const ResourceEditor = ({editor, defaultUsed}) => {
    const [used, setUsed] = useState(defaultUsed);
    const {minder} = editor;

    // 更新minder的标签数据
    const updateMinderResource = () => {
        if (used.length) {
            minder.execCommand(
                'resource',
                used.filter(({selected}) => selected).map(({name}) => name)
            );
        }
    };

    // 切换节点时回填标签
    useEffect(
        () => {
            minder.on('interactchange', () => {
                const enabled = minder.queryCommandState('resource') !== -1;
                const selected = enabled ? minder.queryCommandValue('resource') : [];
                const thisUsedArray = minder.getUsedResource().map(resourceName => {
                    return {
                        name: resourceName,
                        selected: selected.indexOf(resourceName) > -1,
                        hidden: defaultUsed.some(u => (u.name === resourceName && u.hidden)),
                    };
                });
                setUsed(thisUsedArray);
            });
        }, [minder, defaultUsed]
    );

    return (
        <div className="resource-editor">
            <ResourceAdd
                editor={editor}
                used={used}
                setUsed={setUsed}
                updateMinderResource={updateMinderResource}
            />
            <div className="resource-list">
                <ResourceList
                    editor={editor}
                    used={used}
                    updateMinderResource={updateMinderResource}
                    setUsed={setUsed}
                    withoutDropdown
                />
            </div>
        </div>
    );
};

export default ResourceEditor;

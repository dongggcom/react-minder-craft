import React, {useState, useEffect, useCallback} from 'react';
import findIndex from 'lodash/findIndex';
import hideByClickAnyWhere from '../../../tool/hideByClickAnyWhere';
import ResourceListItem from './ResourceListItem';

const ResourceList = ({editor, used, setUsed, updateMinderResource, withoutDropdown}) => {
    const {minder} = editor;
    const [openList, setOpenList] = useState(false);
    const resourceColor = useCallback(
        resource => minder.getResourceColor(resource).toHEX(),
        [minder]
    );
    const stopPropagation = e => e.stopPropagation();
    const hideOpenList = useCallback(
        () => setOpenList(false),
        [setOpenList]
    );
    const showOpenList = e => {
        stopPropagation(e);
        setOpenList(true);
    };
    // 选择标签
    const selectResource = useCallback(resource => () => {
        const index = findIndex(used, ({name}) => name === resource.name);
        if (index !== -1) {
            used[index].selected = !resource.selected;
            setUsed(used);
            updateMinderResource();
        }
    }, [setUsed, updateMinderResource, used]
    );

    // 下拉框隐藏
    useEffect(
        () => {
            hideByClickAnyWhere(openList, hideOpenList);
        }, [openList, hideOpenList]
    );
    return withoutDropdown ? (
        <ul
            className={'km-resource without-dropdown'}
            onClick={stopPropagation}
        >
            {used.map(resource => (
                <ResourceListItem
                    minder={minder}
                    key={resource.name}
                    resource={resource}
                    resourceColor={resourceColor}
                    selectResource={selectResource}
                />
            ))}
        </ul>
    ) : (
        <div
            className="resource-dropdown clearfix"
            style={{overflow: openList ? 'initial' : 'hidden'}}
            id="resource-dropdown"
        >
            <ul
                className={`km-resource${openList ? ' open' : ''}`}
                onClick={stopPropagation}
            >
                {used.map(resource => (
                    <ResourceListItem
                        minder={minder}
                        key={resource.name}
                        resource={resource}
                        resourceColor={resourceColor}
                        selectResource={selectResource}
                    />
                ))}
            </ul>
            <div className="resource-caret" onClick={showOpenList}>
                <span className="caret"></span>
            </div>
        </div>
    );
};

export default ResourceList;

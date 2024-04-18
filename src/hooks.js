import {useMemo} from 'react';
import {omit} from 'lodash';

export function useApp({
    props,
    context,
    customArea,
    beforePositionCustomArea,
    rightCustomArea,
    beforeRightPositionCustomArea,
    defaultUsed = [],
}) {
    const {
        subNodeDescMap = {},
        nodeDisplayMap = {},
    } = context;

    const methods = useMemo(
        () => omit(props, ['customArea', 'dataSource', 'context', 'style', 'className', 'loading']),
        [props]
    );

    const globalContext = useMemo(
        () => ({subNodeDescMap, nodeDisplayMap}),
        [subNodeDescMap, nodeDisplayMap]
    );

    const topTabProps = useMemo(
        () => ({
            defaultUsed, customArea, beforePositionCustomArea, rightCustomArea,
            beforeRightPositionCustomArea,
        }),
        [defaultUsed, customArea, beforePositionCustomArea, rightCustomArea, beforeRightPositionCustomArea]
    );

    return {
        globalContext,
        topTabProps,
        methods,
    };
}

import React, {forwardRef} from 'react';
import Layout from '../../Standard/Layout';
import AppendNode from '../AppendNode';
import AppendCaseTestNode from '../AppendCaseTestNode';
import PriorityEditor from '../PriorityEditor';
import ExpandLevel from '../ExpandLevel';
import SelectAll from '../SelectAll';
import TemplateList from '../TemplateList';
import CustomArea from '../CustomArea';
import DisplayList from '../DisplayList';
// import CommentSwitch from '../CommentSwitch';
import ResourceSelector from '../ResrouceSelector';
import DetailTooltip from '../DetailTooltip';
import MoreOperation from '../MoreOperation';
import {useMinderContext, useNodeDisplay} from './hooks';

const TopTab = ({
    editor,
    language,
    // collapse,
    // toggleCollapse,
    defaultUsed,
    customArea,
    beforePositionCustomArea,
    rightCustomArea,
    beforeRightPositionCustomArea,
}, ref) => {
    const props = {editor, language};

    useMinderContext({minder: editor.minder});

    useNodeDisplay(editor);

    return (
        <div ref={ref} className="minder-editor-panel">
            <Layout.Flex justify="space-between">
                <Layout.Flex gap={16} className="minder-editor-left-panel">
                    <CustomArea editor={editor}>{beforePositionCustomArea}</CustomArea>
                    <AppendNode {...props} />
                    <AppendCaseTestNode {...props} />
                    <PriorityEditor {...props} />
                    <ResourceSelector {...props} defaultUsed={defaultUsed} />
                    <MoreOperation {...props} />
                    <CustomArea {...props}>{customArea}</CustomArea>
                </Layout.Flex>
                <Layout.Flex gap={16} className="minder-editor-right-panel">
                    <CustomArea editor={editor}>{beforeRightPositionCustomArea}</CustomArea>
                    <TemplateList {...props} />
                    <ExpandLevel {...props} />
                    <SelectAll {...props} />
                    <DisplayList {...props} />
                    {/* <CommentSwitch {...props} /> */}
                    <CustomArea editor={editor}>{rightCustomArea}</CustomArea>
                </Layout.Flex>
            </Layout.Flex>
            <DetailTooltip {...props} />
        </div>
    );
};

export default forwardRef(TopTab);

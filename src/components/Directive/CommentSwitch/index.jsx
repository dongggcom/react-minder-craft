import React, {useState, useCallback} from 'react';
import {Switch} from 'antd';
import memory from '../../../services/memory';

const DEFAULT_STATE = false;

function CommentSwitch({editor}) {
    const {minder} = editor;
    const [flag, setFlag] = useState(memory.get('commentFlag') || DEFAULT_STATE);
    const onChange = useCallback(
        () => {
            const newFlag = !flag;
            setFlag(newFlag);
            memory.set('commentFlag', newFlag);
            minder.context.set('commentFlag', newFlag);
            minder.fire('onchange-comment');
        },
        [flag, minder]
    );

    // useEffect(
    //     () => {
    //         // 隐藏与恢复评论
    //         minder.on('onchange-comment', () => {
    //             const commentFlag = minder.context.get('commentFlag', DEFAULT_STATE);
    //             minder.getRoot().traverse(node => {
    //                 const comment = node.getData('comment') || node.getData('commentBackup');
    //                 node.setData('commentBackup', comment);
    //                 node.setData('comment', commentFlag ? comment : undefined).render();
    //             });
    //         });
    //     },
    //     [minder]
    // );

    return (
        <div className="km-btn-group comment-group" style={{fontSize: 12, padding: '0px 5px'}}>
            <div style={{fontWeight: 'bold', marginBottom: 10}}>评论查看：</div>
            <Switch checked={flag} onChange={onChange} size="small" />
        </div>
    );
}

export default CommentSwitch;



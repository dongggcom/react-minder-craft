/**
 * 撤销按钮
 * 通过 customArea 来设置自定义区域
 */
import React from 'react';
import {Button} from 'antd';

export default function getUndoButtonProps() {
    const onClick = (editor) => {
        const node = editor.minder.getSelectedNode();

        // 回退历史
        editor.history.undo();
    };

  return {
    customArea:
        editor => (
            <Button onClick={() => {
                onClick(editor);
            }}
            >撤销
            </Button>
        )
  };
}

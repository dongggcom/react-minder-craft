/**
 * 展示评论
 * 根据 commentFlag 配合 comment module 实现
 */

const isModelOne = node => node?.data.modelType === 'one';

export default function showComment(editor) {
    setTimeout(() => {
        if (!editor) {
            return;
        }
        const commentVisible = editor?.minder.context.get('commentFlag');
        editor.minder.getAllNode().some(node => {
            if (isModelOne(node) && node.getText() === '带评论的节点') {
                node.setData(commentVisible ? 'comment' : 'commentBackup', [
                    {content: '这是一段评论', creator: 'zs', date: '2022-07-28 19:36:10'},
                    {content: '这是另外一段一段评论', creator: 'zs', date: '2022-07-18 17:06:11'},
                    {content: '这是一段评论', creator: 'zs', date: '2022-07-28 19:36:10'},
                    {content: '评论123', creator: 'zs', date: '2022-07-28 19:36:10'},
                ]);
                setTimeout(() => {
                    node.render();
                }, 300);
                return true;
            }
            return false;
        });
    }, 1400);
}

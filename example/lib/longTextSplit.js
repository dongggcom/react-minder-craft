
function hasImageText(text) {
    if (!text) {
        return false;
    }
    const pattern = /\[img([^\]]+)\]/g;
    return pattern.test(text);
}

function longTextSplit(editor, textLength = 20) {
    editor.minder.getRoot().traverse(node => {
        const text = node.getText();
        // 判断文本长度是否大于20，如果大于则按照20字符长度换行且没有换行符
        if (text.length > textLength
            && !hasImageText(text)
            && !node.getData('longText') // 仅初始化一次
        ) {
            const result = text.match(new RegExp(`(.{${textLength}})`, 'g'));
            // 省略号
            node.setData('longText', Array.isArray(result) && result.length > 1 ? text : undefined);

            if (node.getData('longText')) {
                // text 按照 20 个字符长度填入 \n
                node.setText(`${text.slice(0, textLength)}...`);
            }
        }
    });
    editor.minder.getRoot().renderTree();
    editor.minder.layout();
}

export default longTextSplit;

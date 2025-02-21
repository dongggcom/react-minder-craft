
const LONG_TEXT_DATA_KEY = 'longText';
const LONG_TEXT_DATA_KEY_EXPAND = 'expand';
export const isLongTextNode = node => !!node.data[LONG_TEXT_DATA_KEY];

export const isLongTextNodeExpand = node => isLongTextNode(node) && node.data[LONG_TEXT_DATA_KEY] === LONG_TEXT_DATA_KEY_EXPAND;

export const isLastOfNodeLongTextExpand = minder => minder.queryCommandValue('LongText') === LONG_TEXT_DATA_KEY_EXPAND

export const getRealNodeText = minder => {
    const isLongTextExpand = isLastOfNodeLongTextExpand(minder);
    const node = minder.getSelectedNode();
    
    if (isLongTextNode(node))  {
        return isLongTextExpand ? node.getText():  minder.queryCommandValue('longText');
    }
    return node.getText();
}

export const getShownText = (minder, text = minder.getSelectedNode().getText()) => {
    if (isLongTextNode(minder.getSelectedNode())) {
        const {maxTextLength = 20} = minder.extend.context;
        const isLongTextExpand = isLastOfNodeLongTextExpand(minder);
        return isLongTextExpand ? text : `${text.slice(0, maxTextLength)}...`;
    }
    return text;
}
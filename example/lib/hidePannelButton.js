export const pannelClassName = {
    appendNode: 'append-group',
    appendDescNode: 'append-one-test-group',
}

function hidePannelButton(className) {
    const appendNode = document.querySelector(`.${className}`);
    if (appendNode) {
        appendNode.remove();
    }
}

export default hidePannelButton;

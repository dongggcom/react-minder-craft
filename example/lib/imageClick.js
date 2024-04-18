/**
 * 图片点击事件
 * 用于富文本内容的图片，此处用于 text module
 */

function createImgModalPanel() {
    const modal = document.createElement('div');
    modal.style.display = 'none';
    modal.style.cursor = 'default';
    modal.style.overflow = 'auto';
    modal.style.backgroundColor = 'rgba(0, 0, 0, .65)';
    modal.style.height = '100vh';
    modal.style.lineHeight = '100vh';
    modal.style.width = '100vw';
    modal.style.position = 'fixed';
    modal.style.top = 0;
    modal.style.right = 0;
    modal.style.textAlign = 'center';
    modal.style.zIndex = '1000';
    const img = document.createElement('img');
    img.style.height = 'auto';
    img.style.transform = 'scale(1)';
    img.style.transition = 'transform .3s ease';
    img.style.cursor = 'zoom-out';
    img.style.maxWidth = 'calc(100% - 72px)';
    img.style.verticalAlign = 'middle';
    img.style.margin = '36px';
    const closeImgModalPanel = () => {
        if (modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    };
    const showImgModalPanel = src => {
        img.src = src;

        if (modal.style.display === 'none') {
            modal.style.display = 'block';
        }
    };
    img.onclick = closeImgModalPanel;
    modal.appendChild(img);
    document.body.appendChild(modal);
    return {
        modal,
        closeImgModalPanel,
        showImgModalPanel,
    };
}

const {showImgModalPanel} = createImgModalPanel();
const imageClick = (imageShape, minder, e) => {
    showImgModalPanel(imageShape.url);
};

export default imageClick;

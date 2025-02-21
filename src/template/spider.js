// eslint-disable-next-line no-undef
define(() => {
    const Minder = window.kityminder.Minder;
    const templates = Minder.getTemplateList();

    templates.spider = {
        getLayout(node) {

            if (node.getData('layout')) {
                return node.getData('layout');
            }

            const level = node.getLevel();

            // 根节点
            if (level === 0) {
                return 'mind';
            }

            // 一级节点
            if (level === 1) {
                return node.getLayoutPointPreview().x > 0 ? 'right' : 'left';
            }

            return node.parent.getLayout();
        },

        getConnect() {
            // if (node.getLevel() == 1) return 'arc';
            return 'arc';
        },
    };
});

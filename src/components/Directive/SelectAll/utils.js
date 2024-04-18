export const createSelectAction = minder => ({
    all() {
        const selection = [];
        minder.getRoot().traverse(node => {
            selection.push(node);
        });
        minder.select(selection, true);
        minder.fire('receiverfocus');
    },
    revert() {
        const selected = minder.getSelectedNodes();
        const selection = [];
        minder.getRoot().traverse(node => {
            if (selected.indexOf(node) === -1) {
                selection.push(node);
            }
        });
        minder.select(selection, true);
        minder.fire('receiverfocus');
    },
    siblings() {
        const selected = minder.getSelectedNodes();
        const selection = [];
        selected.forEach(node => {
            if (!node.parent) {
                return;
            }
            node.parent.children.forEach(sibling => {
                if (selection.indexOf(sibling) === -1) {
                    selection.push(sibling);
                }
            });
        });
        minder.select(selection, true);
        minder.fire('receiverfocus');
    },
    level() {
        const selectedLevel = minder.getSelectedNodes().map(node => {
            return node.getLevel();
        });
        const selection = [];
        minder.getRoot().traverse(node => {
            if (selectedLevel.indexOf(node.getLevel()) !== -1) {
                selection.push(node);
            }
        });
        minder.select(selection, true);
        minder.fire('receiverfocus');
    },
    path() {
        const selected = minder.getSelectedNodes();
        const selection = [];
        selected.forEach(n => {
            let node = n;
            while (node && selection.indexOf(node) === -1) {
                selection.push(node);
                node = node.parent;
            }
        });
        minder.select(selection, true);
        minder.fire('receiverfocus');
    },
    tree() {
        const selected = minder.getSelectedNodes();
        const selection = [];
        selected.forEach(parent => {
            parent.traverse(node => {
                if (selection.indexOf(node) === -1) {
                    selection.push(node);
                }
            });
        });
        minder.select(selection, true);
        minder.fire('receiverfocus');
    },
});

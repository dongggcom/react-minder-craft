// ['$modal', 'minder.service']
export default ($modal, minderService) => {

    minderService.registerEvent(() => {

        // 触发导入节点或导出节点对话框
        const minder = window.minder;
        const editor = window.editor;
        const parentFSM = editor.hotbox.getParentFSM();


        minder.on('importNodeData', () => {
            parentFSM.jump('modal', 'import-text-modal');

            const importModal = $modal.open({
                animation: true,
                templateUrl: 'ui/dialog/imExportNode/imExportNode.tpl.html',
                controller: 'imExportNode.ctrl',
                size: 'md',
                resolve: {
                    title: function () {
                        return '导入节点';
                    },
                    defaultValue: function () {
                        return '';
                    },
                    type: function () {
                        return 'import';
                    },
                },
            });

            importModal.result.then(result => {
                try {
                    minder.Text2Children(minder.getSelectedNode(), result);
                } catch (e) {
                    alert(e);
                }
                parentFSM.jump('normal', 'import-text-finish');
                editor.receiver.selectAll();
            }, () => {
                parentFSM.jump('normal', 'import-text-finish');
                editor.receiver.selectAll();
            });
        });

        minder.on('exportNodeData', () => {
            parentFSM.jump('modal', 'export-text-modal');

            const exportModal = $modal.open({
                animation: true,
                templateUrl: 'ui/dialog/imExportNode/imExportNode.tpl.html',
                controller: 'imExportNode.ctrl',
                size: 'md',
                resolve: {
                    title: function () {
                        return '导出节点';
                    },
                    defaultValue: function () {
                        const selectedNode = minder.getSelectedNode();
                        const Node2Text = window.kityminder.data.getRegisterProtocol('text').Node2Text;

                        return Node2Text(selectedNode);
                    },
                    type: function () {
                        return 'export';
                    },
                },
            });

            exportModal.result.then(result => {
                parentFSM.jump('normal', 'export-text-finish');
                editor.receiver.selectAll();
            }, () => {
                parentFSM.jump('normal', 'export-text-finish');
                editor.receiver.selectAll();
            });
        });

    });

    return {};
};

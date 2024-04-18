/**
 * @fileOverview
 *
 * 历史管理
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */


define((require, exports, module) => {
    const jsonDiff = require('../tool/jsondiff').default;
    function HistoryRuntime() {
        const minder = this.minder;
        const hotbox = this.hotbox;

        const MAX_HISTORY = 100;

        let lastSnap;
        let patchLock;
        let undoDiffs;
        let redoDiffs;

        function reset() {
            undoDiffs = [];
            redoDiffs = [];
            lastSnap = minder.exportJson();
        }

        function makeUndoDiff() {
            const headSnap = minder.exportJson();
            const diff = jsonDiff(headSnap, lastSnap);
            if (diff.length) {
                undoDiffs.push(diff);
                while (undoDiffs.length > MAX_HISTORY) {
                    undoDiffs.shift();
                }
                lastSnap = headSnap;
                return true;
            }
        }

        function makeRedoDiff() {
            const revertSnap = minder.exportJson();
            redoDiffs.push(jsonDiff(revertSnap, lastSnap));
            lastSnap = revertSnap;
        }

        function undo() {
            patchLock = true;
            const undoDiff = undoDiffs.pop();
            if (undoDiff) {
                minder.applyPatches(undoDiff);
                makeRedoDiff();
            }
            patchLock = false;
        }

        function redo() {
            patchLock = true;
            const redoDiff = redoDiffs.pop();
            if (redoDiff) {
                minder.applyPatches(redoDiff);
                makeUndoDiff();
            }
            patchLock = false;
        }

        function changed() {
            if (patchLock) {return;}
            if (makeUndoDiff()) {redoDiffs = [];}
        }

        function hasUndo() {
            return !!undoDiffs.length;
        }

        function hasRedo() {
            return !!redoDiffs.length;
        }

        function updateSelection(e) {
            if (!patchLock) {return;}
            const patch = e.patch;
            switch (patch.express) {
                case 'node.add':
                    minder.select(patch.node.getChild(patch.index), true);
                    break;
                case 'node.remove':
                case 'data.replace':
                case 'data.remove':
                case 'data.add':
                    minder.select(patch.node, true);
                    break;
            }
        }

        this.history = {
            reset: reset,
            undo: undo,
            redo: redo,
            hasUndo: hasUndo,
            hasRedo: hasRedo,
        };
        reset();
        minder.on('contentchange', changed);
        minder.on('import', reset);
        minder.on('patch', updateSelection);
    }

    window.diff = jsonDiff;

    return module.exports = HistoryRuntime;
});

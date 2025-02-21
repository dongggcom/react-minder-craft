define((require, exports, module) => {
    /**
     * 加载 module
     */
    require('./module');
    /**
     * 加载主题
     */
    require('./theme/newfashion');
    /**
     * 加载模板
     */
    require('./template/spider');
    /**
     * 运行时
     */
    const runtimes = [];

    function assemble(runtime) {
        runtimes.push(runtime);
    }

    function KMEditor(selector, extend) {
        this.selector = selector;
        this.extend = extend || {};
        for (let i = 0; i < runtimes.length; i++) {
            if (typeof runtimes[i] === 'function') {
                runtimes[i].call(this, this);
            }
        }
    }
    KMEditor.assemble = assemble;
    assemble(require('./runtime/container'));
    assemble(require('./runtime/fsm'));
    assemble(require('./runtime/minder'));
    assemble(require('./runtime/receiver'));
    assemble(require('./runtime/input'));
    assemble(require('./runtime/clipboard-mimetype'));
    assemble(require('./runtime/clipboard'));
    assemble(require('./runtime/drag'));
    assemble(require('./runtime/history'));
    assemble(require('./runtime/jumping'));
    assemble(require('./runtime/context'));
    return module.exports = KMEditor;
});

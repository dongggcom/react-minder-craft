define((require, exports, module) => {
    const Minder = window.kityminder.Minder;
    const kity = window.kity;
    kity.extendClass(Minder, {
        clearSelect() {
            this.removeAllSelectedNodes();
        },
    });
    return module.exports = window.kityminder.Minder;
});

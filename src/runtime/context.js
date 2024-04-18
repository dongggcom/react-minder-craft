/*
 * 增加上下文
 */
define((require, exports, module) => {
    function context() {
        const minder = this.minder;
        const ctx = {
            store: {},
            set(key, value) {
                this.store[key] = value;
            },
            get(key, defaultValue) {
                if (this.store.hasOwnProperty(key)) {
                    return this.store[key];
                }
                return defaultValue;
            }
        };
        minder.context = ctx;
    }

    return module.exports = context;
});
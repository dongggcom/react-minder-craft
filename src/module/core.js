/**
 * @file 命令启用与禁用
 */
/* eslint-disable no-useless-call */
/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line no-undef
define(() => {
    const kity = window.kity;
    const Minder = window.kityminder.Minder;

    kity.extendClass(Minder, {
        // 禁用指定命令
        disableCommands(commands) {
            const me = this;
            me._disableCommandNames = commands.map(name => name.toLowerCase());
            if (!me.bkQueryCommandState) {
                me.bkQueryCommandState = me.queryCommandState;
            }
            if (!me.bkQueryCommandValue) {
                me.bkQueryCommandValue = me.queryCommandValue;
            }
            me.queryCommandState = function queryCommandState(commandName, ...args) {
                const commandClass = this._getCommand(commandName);

                if (commandClass && commandClass.enableReadOnly) {
                    return me.bkQueryCommandState.apply(me, [commandName, ...args]);
                }
                if (me._disableCommandNames.includes(commandName.toLowerCase())) {
                    return -1;
                }
                return me.bkQueryCommandState.apply(me, [commandName, ...args]);
            };
            me.queryCommandValue = function queryCommandValue(commandName, ...args) {
                const commandClass = this._getCommand(commandName);
                if (commandClass && commandClass.enableReadOnly) {
                    return me.bkQueryCommandValue.apply(me, [commandName, ...args]);
                }
                if (me._disableCommandNames.includes(commandName.toLowerCase())) {
                    return null;
                }
                return me.bkQueryCommandValue.apply(me, [commandName, ...args]);
            };
            // this.setStatus('readonly');
            me._interactChange();
        },
        // 恢复禁用的指定命令
        enableCommands() {
            const me = this;

            if (me.bkQueryCommandState) {
                me.queryCommandState = me.bkQueryCommandState;
                delete me.bkQueryCommandState;
            }
            if (me.bkQueryCommandValue) {
                me.queryCommandValue = me.bkQueryCommandValue;
                delete me.bkQueryCommandValue;
            }
            if (me._disableCommandNames) {
                delete me._disableCommandNames;
            }

            // this.setStatus('normal');

            me._interactChange();
        },
    });
});

export default {
    bind(minder, command, scope) {
        minder.on('interactchange', () => {
            scope.commandDisabled = minder.queryCommandState(command) === -1;
            scope.commandValue = minder.queryCommandValue(command);
            scope.$apply();
        });
    },
};

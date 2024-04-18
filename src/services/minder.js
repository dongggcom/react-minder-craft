const callbackQueue = [];

function registerEvent(callback) {
    callbackQueue.push(callback);
}

function executeCallback() {
    callbackQueue.forEach(function (ele) {
        ele.apply(this, arguments);
    });
}

export default {
    registerEvent: registerEvent,
    executeCallback: executeCallback,
};

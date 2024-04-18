const _objectKeys = (function () {
    if (Object.keys)
    {return Object.keys;}

    return function (o) {
        const keys = [];
        for (const i in o) {
            if (o.hasOwnProperty(i)) {
                keys.push(i);
            }
        }
        return keys;
    };
})();
function escapePathComponent(str) {
    if (str.indexOf('/') === -1 && str.indexOf('~') === -1)
    {return str;}
    return str.replace(/~/g, '~0').replace(/\//g, '~1');
}
function deepClone(obj) {
    if (typeof obj === 'object') {
        return JSON.parse(JSON.stringify(obj));
    } else {
        return obj;
    }
}

// Dirty check if obj is different from mirror, generate patches and update mirror
function _generate(mirror, obj, patches, path) {
    const newKeys = _objectKeys(obj);
    const oldKeys = _objectKeys(mirror);
    let changed = false;
    let deleted = false;

    for (var t = oldKeys.length - 1; t >= 0; t--) {
        var key = oldKeys[t];
        const oldVal = mirror[key];
        if (obj.hasOwnProperty(key)) {
            const newVal = obj[key];
            if (typeof oldVal === 'object' && oldVal != null && typeof newVal === 'object' && newVal != null) {
                _generate(oldVal, newVal, patches, path + '/' + escapePathComponent(key));
            } else if (oldVal != newVal) {
                changed = true;
                patches.push({op: 'replace', path: path + '/' + escapePathComponent(key), value: deepClone(newVal)});
            }
        } else {
            patches.push({op: 'remove', path: path + '/' + escapePathComponent(key)});
            deleted = true; // property has been deleted
        }
    }

    if (!deleted && newKeys.length == oldKeys.length) {
        return;
    }

    for (var t = 0; t < newKeys.length; t++) {
        var key = newKeys[t];
        if (!mirror.hasOwnProperty(key)) {
            patches.push({op: 'add', path: path + '/' + escapePathComponent(key), value: deepClone(obj[key])});
        }
    }
}

function compare(tree1, tree2) {
    const patches = [];
    _generate(tree1, tree2, patches, '');
    return patches;
}

export default compare;

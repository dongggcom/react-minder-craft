import 'kityminder-core';

const themeList = window.kityminder.Minder.getThemeList();

export const getThemeThumbStyle = theme => {
    const themeObj = themeList[theme];
    if (!themeObj) {
        return;
    }
    const style = {
        color: themeObj['root-color'],
        borderRadius: themeObj['root-radius'] ? themeObj['root-radius'] / 2 : undefined,
    };

    if (themeObj['root-background']) {
        style.background = themeObj['root-background'].toString();
    }

    return style;
};

export const themeKeyList = [
    'classic',
    'classic-compact',
    'fresh-blue',
    'fresh-blue-compat',
    'fresh-green',
    'fresh-green-compat',
    'fresh-pink',
    'fresh-pink-compat',
    'fresh-purple',
    'fresh-purple-compat',
    'fresh-red',
    'fresh-red-compat',
    'fresh-soil',
    'fresh-soil-compat',
    'snow',
    'snow-compact',
    'tianpan',
    'tianpan-compact',
    'fish',
    'wire',
];

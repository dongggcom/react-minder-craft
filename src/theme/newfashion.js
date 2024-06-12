/* eslint-disable no-undef */
define(() => {
    const kity = window.kity;
    const theme = window.kityminder.Theme;

    function hsl(h, s, l) {
        return kity.Color.createHSL(h, s, l);
    }

    function generate(compat) {
        const mainStrockColor = '#91caff'; // hsl(209, 100, 78)
        const mainTextColor = '#108ee9'; // hsl(217, 92, 44)
        const mainBgColor = '#EAF1FF'; // hsl(206, 100, 95)

        const h = 204;

        return {
            'background': '#fbfbfb',

            'root-color': 'white',
            'root-background': mainTextColor,
            'root-stroke': mainStrockColor,
            'root-font-size': 16,
            'root-padding': compat ? [6, 12] : [12, 24],
            'root-margin': compat ? 10 : [30, 100],
            'root-radius': 5,
            'root-space': 10,

            'main-color': 'black',
            'main-background': mainBgColor,
            'main-stroke': mainStrockColor,
            'main-stroke-width': 1,
            'main-font-size': 14,
            'main-padding': [6, 20],
            'main-margin': compat ? 8 : 20,
            'main-radius': 3,
            'main-space': 5,

            'sub-color': 'black',
            'sub-background': 'transparent',
            'sub-stroke': 'none',
            'sub-font-size': 12,
            'sub-padding': compat ? [3, 5] : [5, 10],
            'sub-margin': compat ? [4, 8] : [15, 20],
            'sub-radius': 5,
            'sub-space': 5,

            'connect-color': mainStrockColor,
            'connect-width': 1,
            'connect-radius': 5,

            'selected-stroke': hsl(h, 26, 30),
            'selected-stroke-width': '3',
            'blur-selected-stroke': hsl(h, 10, 60),

            'marquee-background': hsl(h, 100, 80).set('a', 0.1),
            'marquee-stroke': mainStrockColor,

            'drop-hint-color': hsl(h, 26, 35),
            'drop-hint-width': 5,

            'order-hint-area-color': mainBgColor,
            'order-hint-path-color': mainStrockColor,
            'order-hint-path-width': 3,

            'text-selection-color': hsl(h, 100, 20),
            'line-height': 1.5,
        };
    }

    theme.register('newfashion', generate());
    theme.register('newfashion-compat', generate(true));
});

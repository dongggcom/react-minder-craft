// eslint-disable-next-line no-undef
define(() => {
    const kity = window.kity;
    const Minder = window.kityminder.Minder;

    function hsl(h, s, l) {
        return kity.Color.createHSL(h, s, l);
    }

    function generate(h, compat) {
        const mainDeepColor = hsl(h, 100, 60);
        const mainColor = hsl(h, 100, 75);
        const mainLightColor = hsl(h, 100, 96);
        const borderColor = hsl(h, 100, 89);
        const selectedColor = hsl(h, 100, 30);
        return {
            'background': '#fbfbfb',

            'root-color': 'white',
            'root-background': mainDeepColor,
            'root-stroke': mainDeepColor,
            'root-font-size': 16,
            'root-padding': compat ? [6, 12] : [12, 24],
            'root-margin': compat ? 10 : [30, 100],
            'root-radius': 5,
            'root-space': 10,

            'main-color': 'black',
            'main-background': mainLightColor,
            'main-stroke': borderColor,
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

            'connect-color': borderColor,
            'connect-width': 1,
            'connect-radius': 5,

            'selected-stroke': selectedColor,
            'selected-stroke-width': '2',
            'blur-selected-stroke': hsl(h, 10, 60),

            'marquee-background': hsl(h, 100, 80).set('a', 0.1),
            'marquee-stroke': mainDeepColor,

            'drop-hint-color': borderColor,
            'drop-hint-width': 5,

            'order-hint-area-color': mainColor.set('a', 0.5),
            'order-hint-path-color': mainColor,
            'order-hint-path-width': 3,

            'text-selection-color': hsl(h, 100, 20),
            'line-height': 1.5,
        };
    }

    const plans = {
        blue: 220,
    };

    const themes = Minder.getThemeList();
    themes.newfashion = generate(plans.blue);
    themes['newfashion-compat'] = generate(plans.blue, true);
});

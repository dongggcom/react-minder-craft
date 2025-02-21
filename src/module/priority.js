/**
 * @file 节点的优先级
 */
// eslint-disable-next-line no-undef
define(require => {
    const kity = window.kity;
    const Module = window.kityminder.Module;
    const utils = require('kityminder-core/src/core/utils');
    const Command = require('kityminder-core/src/core/command');
    const Renderer = require('kityminder-core/src/core/render');

    Module.register('PriorityModule', function PriorityModule() {
        const minder = this;
        let priorityCondition = () => false;
        setTimeout(() => {
            priorityCondition = minder.extend.priorityCondition || (() => true);
        });

        const PRIORITY_COLORS = {
            '': null,
            'P0': ['#FF1200', '#840023'], // red,
            'P1': ['#FF962E', '#B25000'], // orange
            'P2': ['#0074FF', '#01467F'], // blue
            'P3': ['#A3A3A3', '#515151'], // gray
            'P4': ['#A3A3A3', '#515151'], // gray
            'P5': ['#A3A3A3', '#515151'], // gray
            'P6': ['#A3A3A3', '#515151'], // gray
        };

        // jscs:disable maximumLineLength
        // const BACK_PATH = 'M0,13c0,3.866,3.134,7,7,7h6c3.866,0,7-3.134,7-7V7H0V13z';
        // const MASK_PATH =
        //     'M20,10c0,3.866-3.134,7-7,7H7c-3.866,0-7-3.134-7-7V7c0-3.866,3.134-7,7-7h6c3.866,0,7,3.134,7,7V10z';

        const PRIORITY_DATA = 'priority';

        // 优先级图标的图形
        const PriorityIcon = kity.createClass('PriorityIcon', {
            base: kity.Group,

            constructor() {
                this.callBase();
                this.setSize(20);
                this.create();
                this.setId(utils.uuid('node_priority'));
            },

            setSize(size) {
                this.width = this.height = size;
            },

            create() {
                // const back = new kity.Path().setPathData(BACK_PATH).setTranslate(0.5, 0.5);
                // const mask = new kity.Path().setPathData(MASK_PATH).setOpacity(0.8).setTranslate(0.5, 0.5);
                const back = new kity.Rect(20, 20, 0, 0, 4);

                const number = new kity.Text()
                    .setX(this.width / 2 - 0.5).setY(this.height / 2)
                    .setTextAnchor('middle')
                    .setVerticalAlign('middle')
                    .setFontItalic(true)
                    .setFontSize(12)
                    .fill('white');

                this.addShapes([back, number]);
                // this.mask = mask;
                this.back = back;
                this.number = number;
            },

            setValue(value) {
                const back = this.back;
                // const mask = this.mask;
                const number = this.number;
                const content = value.toString().toUpperCase();
                const color = PRIORITY_COLORS[content];

                if (color) {
                    back.fill(color[0]);
                    // mask.fill(color[0]);
                }

                number.setContent(content);
            },
        });

        /**
         * @command Priority
         * @description 设置节点的优先级信息
         * @param {number} value 要设置的优先级（添加一个优先级小图标）
         *     取值为 0 移除优先级信息；
         *     取值为 1 - 6 设置优先级，超过 6 的优先级不渲染
         * @state
         *    0: 当前有选中的节点
         *   -1: 当前没有选中的节点
         */
        const PriorityCommand = kity.createClass('SetPriorityCommand', {
            base: Command,
            execute(km, value) {
                const nodes = km.getSelectedNodes();
                for (let i = 0; i < nodes.length; i++) {
                    const node = nodes[i];
                    if (!priorityCondition(node)) {
                        continue;
                    }
                    node.setData(PRIORITY_DATA, value.toString().toUpperCase() || null).render();
                    minder.fire('onpriority', {value: value || null, node: node});
                }
                km.layout();
            },
            queryValue(km) {
                const nodes = km.getSelectedNodes();
                let val = null;
                for (let i = 0; i < nodes.length; i++) {
                    val = nodes[i].getData(PRIORITY_DATA);
                    if (val) {
                        break;
                    }
                }
                return val || null;
            },

            queryState(km) {
                const nodes = km.getSelectedNodes();
                if (nodes.length > 1) {
                    return 0;
                } else if (nodes.length === 1) {
                    return (priorityCondition(nodes[0]) ? 0 : -1);
                }
                return -1;
            },
        });
        return {
            'commands': {
                'Priority': PriorityCommand,
            },
            'renderers': {
                left: kity.createClass('PriorityRenderer', {
                    base: Renderer,

                    create() {
                        return new PriorityIcon();
                    },

                    shouldRender(node) {
                        return node.getData(PRIORITY_DATA);
                    },
                    update(icon, node, box) {
                        const data = node.getData(PRIORITY_DATA);
                        const spaceLeft = node.getStyle('space-left');

                        icon.setValue(data);
                        const x = box.left - icon.width - spaceLeft;
                        const y = -icon.height / 2;

                        icon.setTranslate(x, y);

                        return new kity.Box({
                            x: x,
                            y: y,
                            width: icon.width,
                            height: icon.height,
                        });
                    },
                }),
            },
        };
    });
});

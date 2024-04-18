/**
 * @file 节点标识
 * @type success | fail | block
 * @description 常用来标记标识1节点，不赋予具体含义，可以根据字段来显示不同图标
 */
// eslint-disable-next-line no-undef
define(require => {
    const kity = window.kity;
    const Module = window.kityminder.Module;
    const utils = require('kityminder-core/src/core/utils');
    const Command = require('kityminder-core/src/core/command');
    const Renderer = require('kityminder-core/src/core/render');
    const Container = require('../class/IconContainer');

    Module.register('StatusModule', function StatusModule() {
        const minder = this;
        const STATUS_KEY_DATA = 'status';

        let statusCondition = () => false;
        setTimeout(() => {
            statusCondition = minder.extend.statusCondition || (() => true);
        });

        const getIcon = (type = 'success') => {
            const container = new Container();
            let path = 'M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm19'
            + '3.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.'
            + '9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z';
            let color = '#40b333';

            if (type === 'fail') {
                path = 'M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 61'
                + '8.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a'
                + '8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 '
                + '3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z';
                color = '#e64552';
            } else if (type === 'block') {
                path = 'M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm192 472c'
                + '0 4.4-3.6 8-8 8H328c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h368c4.4 0 8 3.6 8 8v48z';
                color = '#f38900';
            }
            const circle = new kity.Circle(500).fill('white').setTranslate(500, 500);
            const lineShape = new kity.Path().setPathData(path).fill(color);
            container.addShapes([circle, lineShape]);
            return container;
        };

        const StatusIcon = kity.createClass('StatusIcon', {
            base: kity.Group,

            constructor() {
                this.callBase();
                this.scale = 20;
                this.setId(utils.uuid('test_result'));
            },
            // TODO: 可能会重复渲染
            setState(state) {
                if (state === 'success' || state === 'fail' || state === 'block') {
                    this.icon = getIcon(state);
                    this.addShapes([this.icon]);
                } else {
                    this.clear();
                }
            },

            clear() {
                this.addShapes([]);
            },
        });

        const StatusRender = kity.createClass('StatusRender', {
            base: Renderer,

            create(node) {
                if (node.isRoot()) {
                    return;
                }
                this.icon = new StatusIcon(node);
                return this.icon;
            },

            shouldRender(node) {
                return node.getData(STATUS_KEY_DATA);
            },

            update(icon, node, box) {
                const state = node.getData(STATUS_KEY_DATA);

                icon.setState(state);

                // 太短会遮住折叠按钮
                const paddingX = 12;

                const x = box.left + box.width + paddingX;
                const y = box.cy - icon.scale / 2;

                this.icon.setTranslate(x, y);
            },
        });

        const StatusCommand = kity.createClass('StatusCommand', {
            base: Command,
            execute(km, value) {
                const nodes = km.getSelectedNodes();
                for (let i = 0; i < nodes.length; i++) {
                    const node = nodes[i];
                    if (!statusCondition(node)) {
                        continue;
                    }
                    node.setData(STATUS_KEY_DATA, (value && value.toString().toLowerCase()) || null).render();
                    minder.fire('on-test-result', {value: value || null, node: node});
                }
                km.layout();
            },
            queryValue(km) {
                const nodes = km.getSelectedNodes();
                let val = null;
                for (let i = 0; i < nodes.length; i++) {
                    val = nodes[i].getData(STATUS_KEY_DATA);
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
                    return (statusCondition(nodes[0]) ? 0 : -1);
                }
                return -1;
            },
        });

        return {
            'commands': {
                'Status': StatusCommand,
            },
            'renderers': {
                outside: StatusRender,
            },
        };
    });
});

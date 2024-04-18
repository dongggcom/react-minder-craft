/**
 * @file 节点上的详情
 */
// eslint-disable-next-line no-undef
define(require => {
    const kity = window.kity;
    const Module = window.kityminder.Module;

    const utils = require('kityminder-core/src/core/utils');
    const Command = require('kityminder-core/src/core/command');
    const Renderer = require('kityminder-core/src/core/render');
    const Container = require('../class/IconContainer');

    const mouseoverSVG = (svg, minder, icon, node) => () => {
        svg.setStyle('opacity', '0.6');
        minder.fire('detail-mouseover', {node, icon});
    };

    const mouseoutSVG = (svg, minder, icon, node) => () => {
        svg.setStyle('opacity', '1');
        minder.fire('detail-mouseout', {node, icon});
    };

    const clickSVG = minder => () => {
        const node = minder.getSelectedNode();
        minder.fire('detail-onclick', {node});
    };

    function bindAction(svg, minder, icon, node) {
        svg.on('mouseover', mouseoverSVG(svg, minder, icon, node))
            .on('mouseout', mouseoutSVG(svg, minder, icon, node));
        svg.on('click', clickSVG(minder));
    }
    const lineShapePath = 'M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 '
        + '32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z';
    const contentShapePath = 'M184 840h656V184H184v656zm300-496c0-4.4 3.6-8 8-8h184c4.4 0 8 3.6 8 8v48c0 4.4-3.6 8-8 '
        + '8H492c-4.4 0-8-3.6-8-8v-48zm0 144c0-4.4 3.6-8 8-8h184c4.4 0 8 3.6 8 8v48c0 4.4-3.6 8-8 '
        + '8H492c-4.4 0-8-3.6-8-8v-48zm0 144c0-4.4 3.6-8 8-8h184c4.4 0 8 3.6 8 8v48c0 4.4-3.6 8-8 8H492c-4.4 '
        + '0-8-3.6-8-8v-48zM380 328c22.1 0 40 17.9 40 40s-17.9 40-40 40-40-17.9-40-40 17.9-40 40-40zm0 144c22.1 0 40 '
        + '17.9 40 40s-17.9 40-40 40-40-17.9-40-40 17.9-40 40-40zm0 144c22.1 0 40 17.9 40 40s-17.9 40-40 '
        + '40-40-17.9-40-40 17.9-40 40-40z';
    const pencilBgShapePath = 'M800 64H224c-35.3 0-64 28.7-64 64v768c0 35.3 28.7 64 64 64h576c35.3 0 64-28.7 64-64V128'
        + 'c0-35.3-28.7-64-64-64zM512 824c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40z';
    const dotShapePath = 'M340 656a40 40 0 1080 0 40 40 0 10-80 0zm0-144a40 40 0 1080 0 40 40 0 10-80 0zm0-144a40 40 '
        + '0 1080 0 40 40 0 10-80 0zm152 320h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H492c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 '
        + '8 8 8zm0-144h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H492c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8zm0-144h184c4.4 '
        + '0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H492c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z';
    const pencilShapePath = 'M355.9 534.9L354 653.8c-.1 8.9 7.1 16.2 16 16.2h.4l118-2.9c2-.1 4-.9 5.4-2.3l415.9-415c3.1'
        + '-3.1 3.1-8.2 0-11.3L785.4 114.3c-1.6-1.6-3.6-2.3-5.7-2.3s-4.1.8-5.7 2.3l-415.8 415a8.3 8.3 0 00-2.3 5.6zm63.'
        + '5 23.6L779.7 199l45.2 45.1-360.5 359.7-45.7 1.1.7-46.4z';
    const pencilLineShapePath = 'M904 512h-56c-4.4 0-8 3.6-8 8v320H184V184h320c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H144c'
        + '-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V520c0-4.4-3.6-8-8-8z';
    Module.register('DetailModule', function DetailModule() {
        const minder = this;
        let detailCondition = () => true;
        setTimeout(() => {
            detailCondition = minder.extend.detailCondition || (() => true);
        });

        const NODE_KEY = 'detail';

        const DetailIcon = kity.createClass('DetailIcon', {

            base: kity.Group,

            constructor(node) {
                this.callBase();
                this.create(node);
                this.setId(utils.uuid('g_container_'));
                this.setAttr('class', 'detail-icon-container');
            },

            create(node) {
                const data = node.getData(NODE_KEY);
                const container = new Container();

                const lineShape = new kity.Path()
                    .setPathData(lineShapePath).fill('#1890ff')
                    .setStyle('cursor', 'pointer');
                const contentShape = new kity.Path()
                    .setPathData(contentShapePath).fill('#e6f7ff')
                    .setStyle('cursor', 'pointer');
                const dotShape = new kity.Path()
                    .setPathData(dotShapePath).fill('#1890ff')
                    .setStyle('cursor', 'pointer');
                const pencilBgShape = new kity.Path()
                    .setPathData(pencilBgShapePath).fill('#e6f7ff')
                    .setStyle('cursor', 'pointer');
                const pencilShape = new kity.Path()
                    .setPathData(pencilShapePath).fill('#1890ff')
                    .setStyle('cursor', 'pointer');
                const pencilLineShape = new kity.Path()
                    .setPathData(pencilLineShapePath).fill('#1890ff')
                    .setStyle('cursor', 'pointer');
                // 替换图标
                if (data === 'edit') {
                    container.addShapes([pencilBgShape, pencilLineShape, pencilShape]);
                } else {
                    container.addShapes([lineShape, contentShape, dotShape]);
                }

                this.addShapes([container]);
                this.children = [container];

                bindAction(container, minder, this, node);
            },

            setSize() {
                this.width = this.children[0].width;
                this.height = this.children[0].height;
            },
        });

        const DetailCommand = kity.createClass('DetailCommand', {
            base: Command,
            execute(minder, detail) {
                const nodes = minder.getSelectedNodes();
                nodes.forEach(node => {
                    node.setData(NODE_KEY, detail || true).render();
                });

                minder.layout();
            },
            queryValue(minder) {
                const nodes = minder.getSelectedNodes();
                let val = null;
                for (let i = 0; i < nodes.length; i++) {
                    val = nodes[i].getData(NODE_KEY);
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
                    return (detailCondition(nodes[0]) ? 0 : -1);
                }
                return -1;
            },
        });

        /**
         * @class 资源渲染器
         */
        const DetailIconRender = kity.createClass('DetailIconRender', {
            base: Renderer,

            create(node) {
                return new DetailIcon(node);
            },

            shouldRender(node) {
                return node.getData(NODE_KEY);
            },
            updateToLeft(icon, node, box) {
                icon.setSize();

                const spaceLeft = node.getStyle('space-left');
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

            update(icon, node, box) {
                return this.updateToLeft(icon, node, box);
            },
        });

        return {
            commands: {
                'detail': DetailCommand,
            },
            renderers: {
                left: DetailIconRender,
            },
        };
    });

});

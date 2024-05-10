/**
 * @file 标签
 */
/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line no-undef
define(require => {
    const kity = window.kity;
    const Module = window.kityminder.Module;
    const Minder = window.kityminder.Minder;

    const Command = require('kityminder-core/src/core/command');
    const Renderer = require('kityminder-core/src/core/render');
    const blake32 = require('../tool/blake32.min').default;


    Module.register('Resource', function ResourceModule() {
        const minder = this;
        let resourceCondition = () => false;
        setTimeout(() => {
            resourceCondition = minder.extend.resourceCondition || (() => true);
        });

        const NODE_KEY = 'resource';
        /**
         * 自动使用的颜色序列
         */
        const RESOURCE_COLOR_SERIES = [51, 303, 75, 200, 157, 0, 26, 254].map(h => {
            return kity.Color.createHSL(h, 100, 85);
        });

        /**
         * 在 Minder 上拓展一些关于资源的支持接口
         */
        kity.extendClass(Minder, {

            /**
             * 获取字符串的哈希值
             *
             * @param {String} str
             * @return {Number} hashCode
             */
            getHashCode(string) {
                const str = blake32(string);
                let hash = 1315423911;
                let ch = '';
                for (let i = str.length - 1; i >= 0; i--) {
                    ch = str.charCodeAt(i);
                    hash ^= ((hash << 5) + ch + (hash >> 2));
                }
                return (hash & 0x7FFFFFFF);
            },

            /**
             * 获取脑图中某个资源对应的颜色
             *
             * 如果存在同名资源，则返回已经分配给该资源的颜色，否则分配给该资源一个颜色，并且返回
             *
             * 如果资源数超过颜色序列数量，返回哈希颜色
             *
             * @param {String} resource 资源名称
             * @return {Color}
             */
            getResourceColor(resource) {
                const colorMapping = this._getResourceColorIndexMapping();
                let nextIndex = null;

                if (!Object.prototype.hasOwnProperty.call(colorMapping, resource)) {
                    // 找不到找下个可用索引
                    nextIndex = this._getNextResourceColorIndex();
                    colorMapping[resource] = nextIndex;
                }

                // 资源过多，找不到可用索引颜色，统一返回哈希函数得到的颜色
                return RESOURCE_COLOR_SERIES[colorMapping[resource]]
                || kity.Color.createHSL(Math.floor(this.getHashCode(resource) / 0x7FFFFFFF * 359), 100, 85);
            },

            /**
             * 获得已使用的资源的列表
             *
             * @return {Array}
             */
            getUsedResource() {
                const mapping = this._getResourceColorIndexMapping();
                const used = [];
                let resource = null;

                for (resource in mapping) {
                    if (Object.prototype.hasOwnProperty.call(mapping, resource)) {
                        used.push(resource);
                    }
                }

                return used;
            },

            /**
             * 获取脑图下一个可用的资源颜色索引
             *
             * @return {int}
             */
            _getNextResourceColorIndex() {
                // 获取现有颜色映射
                //     resource => color_index
                const colorMapping = this._getResourceColorIndexMapping();

                let resource = null;
                const used = [];

                // 抽取已经使用的值到 used 数组
                for (resource in colorMapping) {
                    if (Object.prototype.hasOwnProperty.call(colorMapping, resource)) {
                        used.push(colorMapping[resource]);
                    }
                }

                // 枚举所有的可用值，如果还没被使用，返回
                for (let i = 0; i < RESOURCE_COLOR_SERIES.length; i++) {
                    if (!~used.indexOf(i)) {
                        return i;
                    }
                }

                // 没有可用的颜色了
                return -1;
            },

            // 获取现有颜色映射
            //     resource => color_index
            _getResourceColorIndexMapping() {
                return this._resourceColorMapping || (this._resourceColorMapping = {});
            },

        });


        /**
         * @class 设置资源的命令
         *
         * @example
         *
         * // 设置选中节点资源为 "张三"
         * minder.execCommand('resource', ['张三']);
         *
         * // 添加资源 "李四" 到选中节点
         * var resource = minder.queryCommandValue();
         * resource.push('李四');
         * minder.execCommand('resource', resource);
         *
         * // 清除选中节点的资源
         * minder.execCommand('resource', null);
         */
        const ResourceCommand = kity.createClass('ResourceCommand', {

            base: Command,

            execute(minder, resource) {
                const nodes = minder.getSelectedNodes();

                if (typeof (resource) === 'string') {
                    resource = [resource];
                }

                nodes.forEach(node => {
                    if (!resourceCondition(node)) {
                        return;
                    }
                    node.setData(NODE_KEY, resource).render();
                    minder.fire('onresource', {value: resource || null, node: node});
                });

                minder.layout(200);
            },

            queryValue(minder) {
                const nodes = minder.getSelectedNodes();
                const resource = [];

                nodes.forEach(node => {
                    const nodeResource = node.getData(NODE_KEY);

                    if (!nodeResource) {
                        return;
                    }

                    nodeResource.forEach(name => {
                        if (!~resource.indexOf(name)) {
                            resource.push(name);
                        }
                    });
                });

                return resource;
            },

            queryState(km) {
                const nodes = km.getSelectedNodes();
                if (nodes.length > 1) {
                    return 0;
                } else if (nodes.length === 1) {
                    return (resourceCondition(nodes[0]) ? 0 : -1);
                }
                return -1;
            },
        });

        /**
         * @class 资源的覆盖图形
         *
         * 该类为一个资源以指定的颜色渲染一个动态的覆盖图形
         */
        const ResourceOverlay = kity.createClass('ResourceOverlay', {
            base: kity.Group,

            constructor() {
                this.callBase();

                this.rect = new kity.Rect().setRadius(4);
                this.text = new kity.Text()
                    .setFontSize(12)
                    .setVerticalAlign('middle');
                const rect = this.rect;
                const text = this.text;

                this.addShapes([rect, text]);
            },

            setValue(resourceName, color) {
                const paddingX = 8;
                const paddingY = 4;
                const text = this.text;
                const rect = this.rect;

                let box;

                if (resourceName === this.lastResourceName) {

                    box = this.lastBox;

                } else {

                    text.setContent(resourceName);

                    box = text.getBoundaryBox();
                    this.lastResourceName = resourceName;
                    this.lastBox = box;

                }

                text.setX(paddingX).fill(color.dec('l', 40));

                rect.setPosition(0, box.y - paddingY);
                this.width = Math.round(box.width + paddingX * 2);
                this.height = Math.round(box.height + paddingY * 2);
                rect.setSize(this.width, this.height);
                rect.fill(color);
                rect.setRadius(4);
                rect.stroke(color.dec('l', 10), 1);
            },
        });

        /**
         * @class 资源渲染器
         */
        const ResourceRenderer = kity.createClass('ResourceRenderer', {
            base: Renderer,

            create() {
                this.overlays = [];
                return new kity.Group();
            },

            shouldRender(node) {
                return node.getData(NODE_KEY) && node.getData(NODE_KEY).length;
            },

            update(container, node, box) {
                const spaceRight = node.getStyle('space-right');

                const overlays = this.overlays;

                /*  修复 resource 数组中出现 null 的 bug
                 *  @Author zhangbobell
                 *  @date 2016-01-15
                 */
                const resource = node.getData(NODE_KEY).filter(ele => {
                    return ele !== null && ele !== undefined;
                });
                if (resource.length === 0) {
                    return;
                }
                const minder = node.getMinder();
                let i;
                let overlay;
                let x;

                x = 0;
                for (i = 0; i < resource.length; i++) {

                    x += spaceRight;

                    overlay = overlays[i];
                    if (!overlay) {
                        overlay = new ResourceOverlay();
                        overlays.push(overlay);
                        container.addShape(overlay);
                    }
                    overlay.setVisible(true);
                    overlay.setValue(resource[i], minder.getResourceColor(resource[i]));
                    overlay.setTranslate(x, -1);

                    x += overlay.width;
                }

                while ((overlay = overlays[i++])) {
                    overlay.setVisible(false);
                }

                container.setTranslate(box.right, 0);

                return new kity.Box({
                    x: box.right,
                    y: Math.round(-overlays[0].height / 2),
                    width: x,
                    height: overlays[0].height,
                });
            },
        });

        return {
            commands: {
                'resource': ResourceCommand,
            },

            renderers: {
                right: ResourceRenderer,
            },
        };
    });
});

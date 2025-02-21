/**
 * @file 节点选择
 */
// eslint-disable-next-line no-undef
define(() => {
    const kity = window.kity;
    const Module = window.kityminder.Module;

    Module.register('Select', function SelectModule() {
        const minder = this;
        const rc = minder.getRenderContainer();

        // 在实例上渲染框选矩形、计算框选范围的对象
        const marqueeActivator = (function activator() {

            // 记录选区的开始位置（mousedown的位置）
            let startPosition = null;

            // 选区的图形
            const marqueeShape = new kity.Path();

            // 标记是否已经启动框选状态
            //    并不是 mousedown 发生之后就启动框选状态，而是检测到移动了一定的距离（MARQUEE_MODE_THRESHOLD）之后
            let marqueeMode = false;
            const MARQUEE_MODE_THRESHOLD = 10;

            return {
                selectStart(e) {
                    // 只接受左键
                    if (e.originEvent.button || e.originEvent.altKey) {
                        return;
                    }

                    // 清理不正确状态
                    if (startPosition) {
                        return this.selectEnd();
                    }

                    startPosition = e.getPosition(rc).round();
                },
                selectMove(e) {
                    if (minder.getStatus() === 'textedit') {
                        return;
                    }
                    if (!startPosition) {
                        return;
                    }

                    const p1 = startPosition;
                    const p2 = e.getPosition(rc);

                    // 检测是否要进入选区模式
                    if (!marqueeMode) {
                        // 距离没达到阈值，退出
                        if (kity.Vector.fromPoints(p1, p2).length() < MARQUEE_MODE_THRESHOLD) {
                            return;
                        }
                        // 已经达到阈值，记录下来并且重置选区形状
                        marqueeMode = true;
                        rc.addShape(marqueeShape);
                        marqueeShape
                            .fill(minder.getStyle('marquee-background'))
                            .stroke(minder.getStyle('marquee-stroke')).setOpacity(0.8).getDrawer().clear();
                    }

                    const marquee = new kity.Box(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
                    const selectedNodes = [];

                    // 使其犀利
                    marquee.left = Math.round(marquee.left);
                    marquee.top = Math.round(marquee.top);
                    marquee.right = Math.round(marquee.right);
                    marquee.bottom = Math.round(marquee.bottom);

                    // 选区形状更新
                    marqueeShape.getDrawer().pipe(function drawer() {
                        this.clear();
                        this.moveTo(marquee.left, marquee.top);
                        this.lineTo(marquee.right, marquee.top);
                        this.lineTo(marquee.right, marquee.bottom);
                        this.lineTo(marquee.left, marquee.bottom);
                        this.close();
                    });

                    // 计算选中范围
                    minder.getRoot().traverse(node => {
                        const renderBox = node.getLayoutBox();
                        if (!renderBox.intersect(marquee).isEmpty()) {
                            selectedNodes.push(node);
                        }
                    });

                    // 应用选中范围
                    minder.select(selectedNodes, true);

                    // 清除多余的东西
                    window.getSelection().removeAllRanges();
                },
                selectEnd() {
                    if (startPosition) {
                        startPosition = null;
                    }
                    if (marqueeMode) {
                        marqueeShape.fadeOut(200, 'ease', 0, () => {
                            if (marqueeShape.remove) {
                                marqueeShape.remove();
                            }
                        });
                        marqueeMode = false;
                    }
                },
            };
        })();

        let lastDownNode = null;
        let lastDownPosition = null;
        return {
            'init'() {
                window.addEventListener('mouseup', () => {
                    marqueeActivator.selectEnd();
                });
            },
            'events': {
                'mousedown'(e) {

                    let downNode = null;

                    // 针对 foreignObject 节点，需要额外处理一下
                    if (e.originEvent.target instanceof HTMLElement) {
                        const target = e.originEvent.target.closest('g');
                        downNode = target.shape.targetNode ?? null;
                    } else {
                        downNode = e.getTargetNode();
                    }

                    // 没有点中节点：
                    //     清除选中状态，并且标记选区开始位置
                    if (!downNode) {
                        this.removeAllSelectedNodes();
                        marqueeActivator.selectStart(e);

                        this.setStatus('normal');
                    }

                    // 点中了节点，并且按了 shift 键：
                    //     被点中的节点切换选中状态
                    else if (e.isShortcutKey('Ctrl')) {
                        this.toggleSelect(downNode);
                    }

                    // 点中的节点没有被选择：
                    //     单选点中的节点
                    else if (!downNode.isSelected()) {
                        this.select(downNode, true);
                    }

                    // 点中的节点被选中了，并且不是单选：
                    //     完成整个点击之后需要使其变为单选。
                    //     不能马上变为单选，因为可能是需要拖动选中的多个节点
                    else if (!this.isSingleSelect()) {
                        lastDownNode = downNode;
                        lastDownPosition = e.getPosition();
                    }
                },
                'mousemove': marqueeActivator.selectMove,
                'mouseup'(e) {
                    let upNode = null;

                    // 针对 foreignObject 节点，需要额外处理一下
                    if (e.originEvent.target instanceof HTMLElement) {
                        const target = e.originEvent.target.closest('g');
                        upNode = target.shape.targetNode ?? null;
                    } else {
                        upNode = e.getTargetNode();
                    }

                    // 如果 mouseup 发生在 lastDownNode 外，是无需理会的
                    if (upNode && upNode === lastDownNode) {
                        const upPosition = e.getPosition();
                        const movement = kity.Vector.fromPoints(lastDownPosition, upPosition);
                        if (movement.length() < 1) {
                            this.select(lastDownNode, true);
                        }
                        lastDownNode = null;
                    }

                    // 清理一下选择状态
                    marqueeActivator.selectEnd(e);
                },
                // 全选操作
                'normal.keydown'(e) {

                    if (e.isShortcutKey('ctrl+a')) {
                        const selectedNodes = [];

                        this.getRoot().traverse(node => {
                            selectedNodes.push(node);
                        });
                        this.select(selectedNodes, true);
                        e.preventDefault();
                    }
                },
            },
        };
    });
});

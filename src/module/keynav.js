/**
 * @file 键盘方向建
 */
/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line no-undef
define(() => {
    const Module = window.kityminder.Module;

    Module.register('KeyboardModule', () => {
        const min = Math.min;
        const max = Math.max;
        const sqrt = Math.sqrt;

        // 这是金泉的点子，赞！
        // 求两个不相交矩形的最近距离
        function getCoefedDistance(box1, box2) {
            let dist = null;

            const xMin = min(box1.left, box2.left);
            const xMax = max(box1.right, box2.right);
            const yMin = min(box1.top, box2.top);
            const yMax = max(box1.bottom, box2.bottom);

            const xDist = xMax - xMin - box1.width - box2.width;
            const yDist = yMax - yMin - box1.height - box2.height;

            if (xDist < 0) {
                dist = yDist;
            }
            else if (yDist < 0) {
                dist = xDist;
            }
            else {dist = sqrt(xDist * xDist + yDist * yDist);}

            const node1 = box1.node;
            const node2 = box2.node;

            // sibling
            if (node1.parent === node2.parent) {
                dist /= 10;
            }
            // parent
            if (node2.parent === node1) {
                dist /= 5;
            }

            return dist;
        }


        // eslint-disable-next-line complexity
        function findClosestPointsFor(pointIndexes, iFind) {
            const find = pointIndexes[iFind];
            const most = {};

            for (let i = 0; i < pointIndexes.length; i++) {

                if (i === iFind) {
                    continue;
                }
                const current = pointIndexes[i];
                const dist = getCoefedDistance(current, find);

                // left check
                if (current.right < find.left) {
                    if (!most.left || dist < most.left.dist) {
                        most.left = {
                            dist: dist,
                            node: current.node,
                        };
                    }
                }

                // right check
                if (current.left > find.right) {
                    if (!most.right || dist < most.right.dist) {
                        most.right = {
                            dist: dist,
                            node: current.node,
                        };
                    }
                }

                // top check
                if (current.bottom < find.top) {
                    if (!most.top || dist < most.top.dist) {
                        most.top = {
                            dist: dist,
                            node: current.node,
                        };
                    }
                }

                // bottom check
                if (current.top > find.bottom) {
                    if (!most.down || dist < most.down.dist) {
                        most.down = {
                            dist: dist,
                            node: current.node,
                        };
                    }
                }
            }
            find.node._nearestNodes = {
                right: most.right && most.right.node || null,
                top: most.top && most.top.node || null,
                left: most.left && most.left.node || null,
                down: most.down && most.down.node || null,
            };
        }

        function buildPositionNetwork(root) {
            const pointIndexes = [];
            let p;
            root.traverse(node => {
                p = node.getLayoutBox();

                // bugfix: 不应导航到收起的节点（判断其尺寸是否存在）
                if (p.width && p.height) {
                    pointIndexes.push({
                        left: p.x,
                        top: p.y,
                        right: p.x + p.width,
                        bottom: p.y + p.height,
                        width: p.width,
                        height: p.height,
                        node: node,
                    });
                }
            });
            for (let i = 0; i < pointIndexes.length; i++) {
                findClosestPointsFor(pointIndexes, i);
            }
        }

        function navigateTo(km, direction) {
            const referNode = km.getSelectedNode();
            if (!referNode) {
                km.select(km.getRoot());
                buildPositionNetwork(km.getRoot());
                return;
            }
            if (!referNode._nearestNodes) {
                buildPositionNetwork(km.getRoot());
            }
            const nextNode = referNode._nearestNodes[direction];
            if (nextNode) {
                km.select(nextNode, true);
                km.fire('key-nav', {direction, node: nextNode});
            }
        }

        // 稀释用
        return {
            'events': {
                'layoutallfinish'() {
                    const root = this.getRoot();
                    buildPositionNetwork(root);
                },
                'normal.keydown readonly.keydown'(e) {
                    const minder = this;
                    ['left', 'right', 'up', 'down'].forEach(key => {
                        if (e.isShortcutKey(key)) {
                            navigateTo(minder, key === 'up' ? 'top' : key);
                            e.preventDefault();
                        }
                    });
                },
            },
        };
    });
});

import React, {useState, useEffect, useCallback} from 'react';
import $ from 'jquery';
import 'kity';
import memory from '../../../services/memory';
import Fullscreen from './Fullscreen';
import Thumbnail from './Thumbnail';
import Aim from './Aim';
import Compress from './Compress';
import DragHandle from './DragHandle';
import Zoom from './Zoom';

const kity = window.kity;

const Navigator = props => {
    const {editor} = props;
    const [hidden, setHidden] = useState(memory.get('navigator-hidden') ?? true);
    const {minder} = editor;
    const changeHidden = useCallback(
        flag => setHidden(flag),
        []
    );

    useEffect(() => {
        const getPathHandler = theme => {
            switch (theme) {
                case 'tianpan':
                case 'tianpan-compact':
                    return (nodePathData, x, y, width) => {
                        const r = width >> 1;
                        nodePathData.push('M', x, y + r,
                            'a', r, r, 0, 1, 1, 0, 0.01,
                            'z');
                    };
                default: {
                    return (nodePathData, x, y, width, height) => {
                        nodePathData.push('M', x, y,
                            'h', width, 'v', height,
                            'h', -width, 'z');
                    };
                }
            }
        };

        function navigate() {
            function moveView(center, duration) {
                let box = visibleView;
                center.x = -center.x;
                center.y = -center.y;

                const viewMatrix = minder.getPaper().getViewPortMatrix();
                box = viewMatrix.transformBox(box);

                const targetPosition = center.offset(box.width / 2, box.height / 2);

                minder.getViewDragger().moveTo(targetPosition, duration);
            }

            let dragging = false;

            paper.on('mousedown', e => {
                dragging = true;
                moveView(e.getPosition('top'), 200);
                $previewNavigator.addClass('grab');
            });

            paper.on('mousemove', e => {
                if (dragging) {
                    moveView(e.getPosition('top'));
                }
            });

            $(window).on('mouseup', () => {
                dragging = false;
                $previewNavigator.removeClass('grab');
            });
        }

        // 以下部分是缩略图导航器
        const $previewNavigator = $('.nav-previewer');
        // 画布，渲染缩略图
        const paper = new kity.Paper($previewNavigator[0]);
        // 用两个路径来挥之节点和连线的缩略图
        const nodeThumb = paper.put(new kity.Path());
        const connectionThumb = paper.put(new kity.Path());
        // 表示可视区域的矩形
        const visibleRect = paper.put(new kity.Rect(100, 100).stroke('red', '1%'));

        let contentView = new kity.Box();
        let visibleView = new kity.Box();

        // 增加一个对天盘图情况缩略图的处理
        let pathHandler = getPathHandler(minder.getTheme());

        navigate();

        const updateVisibleView = () => {

            visibleView = minder.getViewDragger().getView();
            visibleRect.setBox(visibleView.intersect(contentView));
        };

        const updateContentView = () => {
            const view = minder.getRenderContainer().getBoundaryBox();

            contentView = view;

            const padding = 30;

            paper.setViewBox(
                view.x - padding - 0.5,
                view.y - padding - 0.5,
                view.width + padding * 2 + 1,
                view.height + padding * 2 + 1);

            const nodePathData = [];
            const connectionThumbData = [];

            minder.getRoot().traverse(node => {
                const box = node.getLayoutBox();
                pathHandler(nodePathData, box.x, box.y, box.width, box.height);
                if (node.getConnection() && node.parent && node.parent.isExpanded()) {
                    connectionThumbData.push(node.getConnection().getPathData());
                }
            });

            paper.setStyle('background', minder.getStyle('background'));

            if (nodePathData.length) {
                nodeThumb
                    .fill(minder.getStyle('root-background'))
                    .setPathData(nodePathData);
            } else {
                nodeThumb.setPathData(null);
            }

            if (connectionThumbData.length) {
                connectionThumb
                    .stroke(minder.getStyle('connect-color'), '0.5%')
                    .setPathData(connectionThumbData);
            } else {
                connectionThumb.setPathData(null);
            }

            updateVisibleView();
        };

        const bind = () => {
            minder.on('layout layoutallfinish', updateContentView);
            minder.on('viewchange', updateVisibleView);
        };

        const unbind = () => {
            minder.off('layout layoutallfinish', updateContentView);
            minder.off('viewchange', updateVisibleView);
        };

        // 主题切换事件
        minder.on('themechange', e => {
            pathHandler = getPathHandler(e.theme);
        });

        if (open) {
            bind();
            updateContentView();
            updateVisibleView();
        } else {
            unbind();
        }
    }, [minder, hidden]
    );

    return (
        <div>
            <div className="nav-bar">
                <Zoom {...props} />
                <DragHandle {...props} />
                <Compress {...props} />
                <Aim {...props} />
                <Thumbnail {...props} onChange={changeHidden} />
                <Fullscreen {...props} />
            </div>
            {!hidden && <div className="nav-previewer"></div>}
        </div>
    );
};

export default Navigator;

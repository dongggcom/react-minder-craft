import React, {useState, useRef, useEffect} from 'react';
import $ from 'jquery';
import {preview} from './utils';


const DetailTooltip = ({editor}) => {
    const [visible, setVisible] = useState(false);
    const [posStyle, setPosStyle] = useState({});
    const [arrowPosStyle, setArrowPosStyle] = useState({});
    const tooltipRef = useRef(null);
    const {minder} = editor;
    const setPreview = (e, $previewer, $container) => preview(
        e.icon,
        e.node?.getData('detail') === 'edit' ? '编辑详情' : '查看详情',
        $previewer,
        $container,
        text => {
            $($previewer[0]).text(text);
        }, (x, y, ax, ay, aStyle) => {
            setPosStyle({
                'left': Math.round(x) + 'px',
                'top': Math.round(y) + 'px',
            });
            setArrowPosStyle({
                'left': Math.round(ax) + 'px',
                'top': Math.round(ay) + 'px',
                ...aStyle,
            });
        });

    useEffect(
        () => {
            if (tooltipRef?.current) {
                const element = $(tooltipRef.current);
                const $container = element.parent();
                const $previewer = element.children();
                let previewTimer = null;
                let previewLive = false;
                minder.on('detail-mouseover', e => {
                    previewTimer = setTimeout(() => {
                        previewLive = setPreview(e, $previewer, $container);
                        setVisible(true);
                    }, 300);
                });
                minder.on('detail-mouseout', () => {
                    clearTimeout(previewTimer);
                    setVisible(false);
                });

                $(document).on('mousedown mousewheel DOMMouseScroll', () => {
                    if (!previewLive) {
                        return;
                    }
                    setVisible(false);
                });

                element.on('mousedown mousewheel DOMMouseScroll', e => {
                    e.stopPropagation();
                });
            }
        }, [minder]
    );
    return (
        <div ref={tooltipRef} style={{position: 'relative'}}>
            <div className="detail-previewer-content" style={{...posStyle, display: visible ? 'block' : 'none'}} />
            <div className="detail-previewer-arrow" style={{...arrowPosStyle, display: visible ? 'block' : 'none'}}>
                <div className="detail-previewer-arrow-content" />
            </div>
        </div>
    );
};

export default DetailTooltip;

import React, {useState, useRef, useEffect} from 'react';
import $ from 'jquery';
import {preview} from './utils';


const NotePreviewer = ({editor}) => {
    const [visible, setVisible] = useState(false);
    const [posStyle, setPosStyle] = useState({});
    const previewerRef = useRef(null);
    const {minder} = editor;
    const setPreview = (e, $previewer, $container) => preview(e.node, e.keyword, $previewer, $container, html => {
        // minder.execCommand('Note', html);
        $previewer.html(html);
    }, (x, y) => {
        setPosStyle({
            'left': Math.round(x) + 'px',
            'top': Math.round(y) + 'px',
        });
    });

    useEffect(
        () => {
            if (previewerRef?.current) {
                const element = $(previewerRef.current);
                const $container = element.parent();
                const $previewer = element.children();

                let previewTimer = null;
                let previewLive = false;
                minder.on('shownoterequest', e => {
                    previewTimer = setTimeout(() => {
                        previewLive = setPreview(e, $previewer, $container);
                        setVisible(true);
                    }, 300);
                });
                minder.on('hidenoterequest', () => {
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
        <div className="note-previewer" ref={previewerRef}>
            <div id="previewer-content" style={{...posStyle, display: visible ? 'block' : 'none'}} />
        </div>
    );
};

export default NotePreviewer;

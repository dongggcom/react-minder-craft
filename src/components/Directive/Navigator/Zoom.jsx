import React, {useState, useCallback, useEffect} from 'react';
import {PlusCircleOutlined, MinusCircleOutlined} from '@ant-design/icons';
import L from '../../../services/lang';
import config from '../../../services/config';

const Zoom = ({editor: {minder}, language}) => {
    const {ui} = L[language];
    const [zoom, setZoom] = useState(100);

    const zoomIn = () => minder.execCommand('zoomIn');
    const zoomOut = () => minder.execCommand('zoomOut');
    // const zoomHandler = () => minder.execCommand('zoom', 100);

    const getZoomRadio = useCallback(value => {
        const zoomStack = minder.getOption('zoom');
        const minValue = zoomStack[0];
        const maxValue = zoomStack[zoomStack.length - 1];
        const valueRange = maxValue - minValue;
        return (1 - (value - minValue) / valueRange);
    }, [minder]
    );

    // const getHeight = useCallback(
    //     value => getZoomRadio(value) * 70,
    //     [getZoomRadio]
    // );

    useEffect(() => {
        minder.setDefaultOptions({zoom: config.get('zoom')});

        minder.on('zoom', e => {
            setZoom(e.zoom);
        });
    }, [minder]
    );

    return (
        <>
            <div
                onClick={zoomIn}
                className={`nav-btn zoom-in ${getZoomRadio(zoom) === 0 ? 'active' : ''}`}
                title={ui['zoom-in']}
            >
                <PlusCircleOutlined />
            </div>
            <div style={{lineHeight: '25px'}}>{zoom}%</div>
            {/* <div className="zoom-pan">
                <div
                    onClick={zoomHandler}
                    className="origin"
                    style={{
                        'transform': 'translate(0, ' + getHeight(100) + 'px)',
                    }}
                >
                </div>
                <div
                    className="indicator"
                    style={{
                        'transform': 'translate(0, ' + getHeight(zoom) + 'px)',
                        'transition': 'transform 200ms',
                    }}
                >
                </div>
            </div> */}
            <div
                onClick={zoomOut}
                className={`nav-btn zoom-out ${getZoomRadio(zoom) === 1 ? 'active' : ''}`}
                title={ui['zoom-out']}
            >
                <MinusCircleOutlined />
            </div>
        </>
    );
};

export default Zoom;

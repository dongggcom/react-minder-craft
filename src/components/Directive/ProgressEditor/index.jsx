import React, {useCallback} from 'react';

const progress = Array.from({length: 10}, (_, i) => i);
const getProgressTitle = p => {
    switch (p) {
        case 0:
            return '移除进度';
        case 1:
            return '未开始';
        case 9:
            return '全部完成';
        default:
            return '完成' + (p - 1) + '/8';
    }
};

const ProgressEditor = ({editor}) => {
    const {minder} = editor;
    const onClick = useCallback(
        e => {
            const cur = e.target.dataset.index;
            minder.execCommand('Progress', cur);
        },
        [minder]
    );
    return (
        <ul
            className="km-progress tool-group"
            onClick={onClick}
        >
            {progress.map(cur => (
                <li
                    key={cur}
                    className="km-progress-item tool-group-item"
                    title={getProgressTitle(cur)}
                >
                    <div data-index={cur} className={`km-progress-icon tool-group-icon progress-${cur}`} />
                </li>
            ))}
        </ul>
    );
};

export default ProgressEditor;

import React from 'react';
import L from '../../../services/lang';

const SearchBtn = ({language, showSearchBox}) => {
    const {ui} = L[language];

    return (
        <div className="btn-group-vertical">
            <button
                type="button"
                className="btn btn-default search"
                title={ui.search}
                onClick={showSearchBox}
            >
            </button>
            <button
                type="button"
                className="btn btn-default search-caption dropdown-toggle"
                title={ui.search}
                onClick={showSearchBox}
            >
                <span className="caption">{ui.search}</span>
                <span className="sr-only">{ui.search}</span>
            </button>
        </div>
    );
};

export default SearchBtn;

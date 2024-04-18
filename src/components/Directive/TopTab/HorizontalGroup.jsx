import React from 'react';


const HorizontalGroup = ({children}) => {
    return (
        <div className="km-group-horizontal">
            {children.map(item => <div className="km-group-item " key={item.key}>{item}</div>)}
        </div>
    );
};

export default HorizontalGroup;

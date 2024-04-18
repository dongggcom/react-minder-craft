import React from 'react';


const VerticalGroup = ({children}) => {
    return (
        <div className="km-group-vertical">
            {children.length
                ? children.map(item => <div className="km-group-item " key={item.key}>{item}</div>)
                : <div className="km-group-item ">{children}</div>
            }
        </div>
    );
};

export default VerticalGroup;

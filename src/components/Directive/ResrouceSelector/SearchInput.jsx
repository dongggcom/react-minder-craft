import React, {useCallback} from 'react';
import {Divider, Input} from 'antd';

function SearchInput({onSearch}) {
    const handleSearch = useCallback(
        value => {
            onSearch(value);
        },
        [onSearch]
    );

    return (
        <>
            <div style={{padding: '5px 8px 0px'}}>
                <Input.Search size="small" placeholder="搜索标签" onSearch={handleSearch} />
            </div>
            <Divider style={{margin: '8px 0'}} />
        </>
    );
}

export default SearchInput;

import React from 'react';
import Layout from '../../Standard/Layout';

function CustomArea(props) {
    return (
        <Layout>
            {typeof props.children === 'function'
                ? props.children(props.editor) : props.children}
        </Layout>
    );
}

export default CustomArea;

import React from 'react';

function Layout({children, ...props}) {
    return <div {...props}>{children}</div>;
}

function Flex({children, direction, justify, align, gap, ...props}) {
    return (
        <Layout
            style={{
                display: 'flex',
                flexDirection: direction ?? 'row',
                justifyContent: justify,
                alignItems: align,
                gap: gap,
            }}
            {...props}
        >
            {children}
        </Layout>
    );
}

Layout.Flex = Flex;

export default Layout;

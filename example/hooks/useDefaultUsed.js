/**
 * 默认标签
 * 设置面板上默认具有的标签，通过面板中的复选框可以增加或删除节点的标签
 * 另外，标签也可以通过 minder.getUsedResource() 获取
 */

import {useState, useEffect} from 'react';

export default function useDefaultUsed() {
    const [defaultUsed, setDefaultUsed] = useState([]);

    useEffect(
        () => {
            setTimeout(() => {
                // FIXME: 当设置默认标签后，在节点中第一次添加默认标签时，会清空原来的标签
                setDefaultUsed([
                    {name: '标识1', selected: false, hidden: true},
                    {name: '标识2', hidden: true},
                    {name: '版本', hidden: true},
                    {name: '标签1'},
                    {name: '标签2'},
                    {name: '标签3'},
                ]);
            }, 500);
        },
        []
    );

    return [defaultUsed, setDefaultUsed];
}
